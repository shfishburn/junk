import { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingSlotPicker } from '@/components/BookingSlotPicker';
import { Plus, Phone, MessageSquare, UserPlus } from 'lucide-react';

interface CreateBookingDialogProps {
  onBookingCreated?: () => void;
  trigger?: React.ReactNode;
}

type BookingSource = 'phone' | 'text' | 'walkin';

export default function CreateBookingDialog({ onBookingCreated, trigger }: CreateBookingDialogProps) {
  const [open, setOpen] = useState(false);
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
  const [source, setSource] = useState<BookingSource>('phone');
  const [status, setStatus] = useState<string>('confirmed');
  const [sendConfirmation, setSendConfirmation] = useState(false);
  const [isSeniorVeteran, setIsSeniorVeteran] = useState(false);

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setMessage('');
    setSource('phone');
    setStatus('confirmed');
    setSendConfirmation(false);
    setIsSeniorVeteran(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Build message with discount info if applicable
      let fullMessage = message.trim();
      if (isSeniorVeteran) {
        fullMessage = fullMessage 
          ? `${fullMessage}\n\n[Senior/Veteran Discount Applied]`
          : '[Senior/Veteran Discount Applied]';
      }
      fullMessage = `[Created by Admin via ${source === 'phone' ? 'Phone Call' : source === 'text' ? 'Text Message' : 'Walk-in'}]\n\n${fullMessage}`;

      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          booking_date: bookingDate,
          booking_time: selectedTime,
          message: fullMessage || null,
          status,
          source,
        });

      if (insertError) throw insertError;

      // Optionally send confirmation email
      if (sendConfirmation && email) {
        try {
          await supabase.functions.invoke('send-contact-email', {
            body: {
              type: 'booking',
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim() || '',
              message: message.trim() || 'Booking created by staff.',
              bookingDate,
              bookingTime: selectedTime,
            },
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the booking creation if email fails
        }
      }

      toast({
        title: "Booking created",
        description: `Booking for ${name} on ${format(selectedDate, 'MMM d, yyyy')} at ${selectedTime} has been created.`,
      });

      resetForm();
      setOpen(false);
      onBookingCreated?.();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSourceIcon = (s: BookingSource) => {
    switch (s) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'text': return <MessageSquare className="h-4 w-4" />;
      case 'walkin': return <UserPlus className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Booking
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Booking</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Selection */}
          <div className="flex gap-2">
            {(['phone', 'text', 'walkin'] as BookingSource[]).map((s) => (
              <Button
                key={s}
                type="button"
                variant={source === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSource(s)}
                className="flex-1"
              >
                {getSourceIcon(s)}
                <span className="ml-2 capitalize">
                  {s === 'walkin' ? 'Walk-in' : s === 'phone' ? 'Phone' : 'Text'}
                </span>
              </Button>
            ))}
          </div>

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
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(360) 555-1234"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Mount Vernon, WA"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Notes</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Details about the pickup, items to remove, special instructions..."
              rows={3}
            />
          </div>

          {/* Status & Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Initial Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="senior"
                checked={isSeniorVeteran}
                onCheckedChange={(checked) => setIsSeniorVeteran(checked === true)}
              />
              <Label htmlFor="senior" className="text-sm font-normal cursor-pointer">
                Apply Senior/Veteran Discount (10% off)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={sendConfirmation}
                onCheckedChange={(checked) => setSendConfirmation(checked === true)}
              />
              <Label htmlFor="sendEmail" className="text-sm font-normal cursor-pointer">
                Send confirmation email to customer
              </Label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
