import { useState, useEffect } from "react";
import { format, isBefore, startOfDay, isSunday } from "date-fns";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { CalendarDays, Clock, User, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

// Zod schema for booking form validation
const bookingSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .regex(/^[\d\s\-\(\)\+]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  message: z.string()
    .trim()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Booking {
  booking_date: string;
  booking_time: string;
  status: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Book() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();

  // Fetch existing bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("booking_date, booking_time, status")
          .in("status", ["pending", "confirmed"]);

        if (error) throw error;
        setExistingBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Check if a specific time slot is booked
  const isTimeBooked = (date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return existingBookings.some(
      (booking) => booking.booking_date === dateStr && booking.booking_time === time
    );
  };

  // Get available time slots for a date
  const getAvailableSlots = (date: Date) => {
    return TIME_SLOTS.filter((time) => !isTimeBooked(date, time));
  };

  // Check if a date is fully booked
  const isDateFullyBooked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const bookedSlots = existingBookings.filter(
      (booking) => booking.booking_date === dateStr
    );
    return bookedSlots.length >= TIME_SLOTS.length;
  };

  // Disable dates that are past, Sunday, or fully booked
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || isSunday(date) || isDateFullyBooked(date);
  };

  const validateForm = (): boolean => {
    const result = bookingSchema.safeParse(formData);
    
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (field) {
          errors[field] = err.message;
        }
      });
      setFormErrors(errors);
      return false;
    }
    
    setFormErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Please fix the form errors",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse and sanitize form data
      const validatedData = bookingSchema.parse(formData);
      
      // Insert booking into database
      const { error: bookingError } = await supabase.from("bookings").insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message || null,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        booking_time: selectedTime,
        status: "pending",
      });

      if (bookingError) {
        // Handle unique constraint violation (double booking)
        if (bookingError.code === "23505") {
          toast({
            title: "Time slot no longer available",
            description: "Someone just booked this slot. Please select another time.",
            variant: "destructive",
          });
          // Refresh bookings to show updated availability
          const { data } = await supabase
            .from("bookings")
            .select("booking_date, booking_time, status")
            .in("status", ["pending", "confirmed"]);
          if (data) setExistingBookings(data);
          setSelectedTime("");
          return;
        }
        throw bookingError;
      }

      // Send booking confirmation email
      await supabase.functions.invoke("send-contact-email", {
        body: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || "",
          message: validatedData.message || "",
          isBooking: true,
          bookingDate: format(selectedDate, "EEEE, MMMM d, yyyy"),
          bookingTime: selectedTime,
        },
      });

      setBookingConfirmed(true);
      toast({
        title: "Booking confirmed!",
        description: "Check your email for confirmation details.",
      });
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: error.message || "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <Layout>
        <SEO
          title="Booking Confirmed | Junky Gurus"
          description="Your booking has been confirmed. We'll see you soon!"
        />
        <div className="container py-16 md:py-24">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-6">
                Your appointment has been scheduled for{" "}
                <strong className="text-foreground">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                </strong>
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                We've sent a confirmation email to <strong>{formData.email}</strong>
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Book an Appointment | Junky Gurus"
        description="Schedule your junk removal appointment online. Select a convenient date and time, and we'll take care of the rest."
      />
      
      <div className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select an available date and time that works best for you. We're open Monday through Saturday, 8 AM to 6 PM.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Calendar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Select a Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                  disabled={isDateDisabled}
                  className="rounded-md border w-full"
                  modifiers={{
                    fullyBooked: (date) => isDateFullyBooked(date),
                  }}
                  modifiersStyles={{
                    fullyBooked: { 
                      color: "hsl(var(--muted-foreground))",
                      textDecoration: "line-through",
                    },
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted border"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Slots & Form Section */}
            <div className="space-y-6">
              {/* Time Slots */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Select a Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const isBooked = isTimeBooked(selectedDate, time);
                        return (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "w-full",
                              isBooked && "opacity-50 line-through"
                            )}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Please select a date first
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Booking Form */}
              {selectedDate && selectedTime && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Your Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                          }}
                          placeholder="Your full name"
                          maxLength={100}
                          className={formErrors.name ? "border-destructive" : ""}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                          }}
                          placeholder="your@email.com"
                          maxLength={255}
                          className={formErrors.email ? "border-destructive" : ""}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                          }}
                          placeholder="(555) 123-4567"
                          maxLength={20}
                          className={formErrors.phone ? "border-destructive" : ""}
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-destructive mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="message">What do you need removed?</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                          }}
                          placeholder="Briefly describe the items or project..."
                          rows={3}
                          maxLength={1000}
                          className={formErrors.message ? "border-destructive" : ""}
                        />
                        {formErrors.message && (
                          <p className="text-sm text-destructive mt-1">{formErrors.message}</p>
                        )}
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">Your Appointment</p>
                        <p className="text-primary font-semibold">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}