import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingSlotPicker } from '@/components/BookingSlotPicker';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  message: string | null;
  source?: string;
}

interface EditBookingDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingUpdated?: () => void;
}

export default function EditBookingDialog({ 
  booking, 
  open, 
  onOpenChange, 
  onBookingUpdated 
}: EditBookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string>('pending');

  // Populate form when booking changes
  useEffect(() => {
    if (booking) {
      setSelectedDate(parseISO(booking.booking_date));
      setSelectedTime(booking.booking_time);
      setName(booking.name);
      setEmail(booking.email);
      setPhone(booking.phone || '');
      setAddress(booking.address || '');
      setMessage(booking.message || '');
      setStatus(booking.status);
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking) return;

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for the booking.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter the customer's name and email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingDate = format(selectedDate, 'yyyy-MM-dd');

      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          booking_date: bookingDate,
          booking_time: selectedTime,
          message: message.trim() || null,
          status,
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      toast({
        title: "Booking updated",
        description: `Booking for ${name} has been updated.`,
      });

      onOpenChange(false);
      onBookingUpdated?.();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date/Time Selection */}
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <BookingSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
            />
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Customer Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(360) 555-1234"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Pickup Address</Label>
              <Input
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Mount Vernon, WA"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="edit-message">Notes</Label>
            <Textarea
              id="edit-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Details about the pickup, items to remove, special instructions..."
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
