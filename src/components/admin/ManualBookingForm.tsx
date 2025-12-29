import { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import { Phone, MessageSquare, UserPlus } from 'lucide-react';
import { AddressInput, getEmptyAddress, formatAddressForStorage, type AddressData } from '@/components/AddressInput';

interface ManualBookingFormProps {
  onBookingCreated?: () => void;
}

type BookingSource = 'phone' | 'text' | 'walkin';

export default function ManualBookingForm({ onBookingCreated }: ManualBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState<AddressData>(getEmptyAddress());
  const [message, setMessage] = useState('');
  const [source, setSource] = useState<BookingSource>('phone');
  const [status, setStatus] = useState<string>('confirmed');
  const [sendConfirmation, setSendConfirmation] = useState(true);
  const [isSeniorVeteran, setIsSeniorVeteran] = useState(false);

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setName('');
    setEmail('');
    setPhone('');
    setAddress(getEmptyAddress());
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
      
      // Build message with discount info
      let fullMessage = message.trim();
      
      // Add discount info
      if (isSeniorVeteran) {
        fullMessage += fullMessage ? '\n\n[Senior/Veteran Discount Applied]' : '[Senior/Veteran Discount Applied]';
      }
      
      // Add source prefix
      fullMessage = `[Created by Admin via ${source === 'phone' ? 'Phone Call' : source === 'text' ? 'Text Message' : 'Walk-in'}]\n\n${fullMessage}`;

      const formattedAddress = formatAddressForStorage(address);
      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          address: formattedAddress || null,
          booking_date: bookingDate,
          booking_time: selectedTime,
          message: fullMessage || null,
          status,
          source,
        });

      if (insertError) throw insertError;

      // Send confirmation email if requested
      let emailSent = false;
      let emailError: string | null = null;
      
      if (sendConfirmation && email) {
        try {
          const { error: invokeError } = await supabase.functions.invoke('send-contact-email', {
            body: {
              isBooking: true,
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim() || '',
              message: message.trim() || 'Booking created by staff.',
              bookingDate: format(selectedDate, 'EEEE, MMMM d, yyyy'),
              bookingTime: selectedTime,
              skipAdminNotification: true,
            },
          });
          
          if (invokeError) {
            console.error('Email error:', invokeError);
            emailError = invokeError.message || 'Failed to send email';
          } else {
            emailSent = true;
          }
        } catch (err: any) {
          console.error('Email send error:', err);
          emailError = err.message || 'Failed to send email';
        }
      }

      // Show consolidated toast based on outcome
      if (sendConfirmation) {
        if (emailSent) {
          toast({
            title: "Booking created + email sent",
            description: `${name} on ${format(selectedDate, 'MMM d')} at ${selectedTime}. Confirmation sent to ${email.trim().toLowerCase()}.`,
          });
        } else {
          toast({
            title: "Booking created, but email failed",
            description: emailError || "Confirmation email could not be sent.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Booking created",
          description: `${name} on ${format(selectedDate, 'MMM d')} at ${selectedTime}. No email sent.`,
        });
      }

      resetForm();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source Selection */}
      <div>
        <Label className="mb-3 block">Booking Source</Label>
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
      </div>

      {/* Date/Time Selection */}
      <div className="space-y-2">
        <Label>Date & Time *</Label>
        <div className="border rounded-lg p-4 bg-muted/30">
          <BookingSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            compact
          />
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manual-name">Customer Name *</Label>
          <Input
            id="manual-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manual-email">Email *</Label>
          <Input
            id="manual-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manual-phone">Phone</Label>
          <Input
            id="manual-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(360) 555-1234"
          />
        </div>
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

      {/* Address */}
      <div className="space-y-2">
        <Label className="mb-2 block">Pickup Address</Label>
        <AddressInput
          value={address}
          onChange={setAddress}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="manual-message">Notes</Label>
        <Textarea
          id="manual-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Details about the pickup, items to remove, special instructions..."
          rows={3}
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="manual-senior"
            checked={isSeniorVeteran}
            onCheckedChange={(checked) => setIsSeniorVeteran(checked === true)}
          />
          <Label htmlFor="manual-senior" className="text-sm font-normal cursor-pointer">
            Apply Senior/Veteran Discount (10% off)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="manual-sendEmail"
            checked={sendConfirmation}
            onCheckedChange={(checked) => setSendConfirmation(checked === true)}
          />
          <Label htmlFor="manual-sendEmail" className="text-sm font-normal cursor-pointer">
            Email confirmation to customer (recommended)
          </Label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={resetForm}>
          Clear Form
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Booking'}
        </Button>
      </div>
    </form>
  );
}
