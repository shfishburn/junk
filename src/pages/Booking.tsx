import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, isBefore, startOfDay } from "date-fns";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, ChevronLeft, ChevronRight, Loader2, Check, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { JunkRouletteModal } from "@/components/JunkRouletteModal";

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Booking = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: 0 });
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [submittedCustomer, setSubmittedCustomer] = useState({ name: "", email: "" });
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
      const startDate = format(currentWeekStart, "yyyy-MM-dd");
      const endDate = format(addDays(currentWeekStart, 13), "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_date, booking_time")
        .gte("booking_date", startDate)
        .lte("booking_date", endDate)
        .in("status", ["pending", "confirmed"]);

      if (!error && data) {
        setBookedSlots(data.map(b => ({ date: b.booking_date, time: b.booking_time })));
      }
    };

    fetchBookings();
  }, [currentWeekStart]);

  const handlePrevWeek = () => {
    const newStart = addDays(currentWeekStart, -7);
    const today = startOfDay(new Date());
    if (!isBefore(newStart, startOfWeek(today, { weekStartsOn: 0 }))) {
      setCurrentWeekStart(newStart);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || date.getDay() === 0; // Sunday is closed
  };

  const isSlotBooked = (date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return bookedSlots.some(slot => slot.date === dateStr && slot.time === time);
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date);
      setSelectedTime("");
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate && !isSlotBooked(selectedDate, time)) {
      setSelectedTime(time);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    setIsSubmitting(true);

    try {
      // Save booking to database
      const { error: dbError } = await supabase.from("bookings").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        booking_time: selectedTime,
      });

      if (dbError) throw dbError;

      // Send confirmation email
      const appointmentInfo = `${format(selectedDate, "EEEE, MMMM d, yyyy")} at ${selectedTime}`;
      
      await supabase.functions.invoke("send-contact-email", {
        body: {
          ...formData,
          message: formData.message || "Booking request submitted via calendar",
          preferredAppointment: appointmentInfo,
        },
      });

      setSubmittedCustomer({ name: formData.name, email: formData.email });
      setShowRoulette(true);

      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedDate(null);
      setSelectedTime("");
      
      // Refresh booked slots
      const startDate = format(currentWeekStart, "yyyy-MM-dd");
      const endDate = format(addDays(currentWeekStart, 13), "yyyy-MM-dd");
      
      const { data } = await supabase
        .from("bookings")
        .select("booking_date, booking_time")
        .gte("booking_date", startDate)
        .lte("booking_date", endDate)
        .in("status", ["pending", "confirmed"]);

      if (data) {
        setBookedSlots(data.map(b => ({ date: b.booking_date, time: b.booking_time })));
      }

    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Something went wrong",
        description: "Please try calling us directly at (360) 610-9233.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate 2 weeks of dates
  const weekDates = Array.from({ length: 14 }, (_, i) => addDays(currentWeekStart, i));

  return (
    <Layout>
      <SEO
        title="Book an Appointment"
        description="Schedule your junk removal appointment online. Pick a date and time that works for you. Fast, easy booking in Mount Vernon, WA."
        keywords="book junk removal, schedule pickup, appointment booking, Mount Vernon junk removal"
        url="/booking"
      />

      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Book Your Junk Removal
            </h1>
            <p className="text-lg text-muted-foreground">
              Pick a date and time, and we'll make your junk disappear. It's that simple.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Select a Date & Time
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevWeek}
                        disabled={isBefore(addDays(currentWeekStart, -7), startOfWeek(new Date(), { weekStartsOn: 0 }))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Week Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Date Grid - Week 1 */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekDates.slice(0, 7).map((date) => {
                      const isDisabled = isDateDisabled(date);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, new Date());

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleDateSelect(date)}
                          disabled={isDisabled}
                          className={cn(
                            "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all",
                            isDisabled && "opacity-40 cursor-not-allowed bg-muted",
                            !isDisabled && !isSelected && "hover:bg-primary/10 cursor-pointer",
                            isSelected && "bg-primary text-primary-foreground",
                            isToday && !isSelected && "ring-2 ring-primary ring-offset-2"
                          )}
                        >
                          <span className="text-xs text-muted-foreground mb-1">
                            {format(date, "MMM")}
                          </span>
                          <span className="font-semibold">{format(date, "d")}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Date Grid - Week 2 */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {weekDates.slice(7, 14).map((date) => {
                      const isDisabled = isDateDisabled(date);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, new Date());

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleDateSelect(date)}
                          disabled={isDisabled}
                          className={cn(
                            "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all",
                            isDisabled && "opacity-40 cursor-not-allowed bg-muted",
                            !isDisabled && !isSelected && "hover:bg-primary/10 cursor-pointer",
                            isSelected && "bg-primary text-primary-foreground",
                            isToday && !isSelected && "ring-2 ring-primary ring-offset-2"
                          )}
                        >
                          <span className="text-xs text-muted-foreground mb-1">
                            {format(date, "MMM")}
                          </span>
                          <span className="font-semibold">{format(date, "d")}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-charcoal mb-4">
                        Available times for {format(selectedDate, "EEEE, MMMM d")}
                      </h3>
                      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((time) => {
                          const isBooked = isSlotBooked(selectedDate, time);
                          const isSelected = selectedTime === time;

                          return (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              disabled={isBooked}
                              className={cn(
                                "py-3 px-2 rounded-lg text-sm font-medium transition-all",
                                isBooked && "bg-muted text-muted-foreground line-through cursor-not-allowed",
                                !isBooked && !isSelected && "bg-card border border-border hover:border-primary hover:bg-primary/5",
                                isSelected && "bg-primary text-primary-foreground"
                              )}
                            >
                              {time.replace(":00 ", " ")}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate && selectedTime ? (
                    <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Check className="h-5 w-5" />
                        <span>Selected Appointment</span>
                      </div>
                      <p className="mt-2 text-sm text-charcoal">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        <br />
                        at {selectedTime}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 rounded-lg bg-muted border border-border">
                      <p className="text-sm text-muted-foreground">
                        Select a date and time from the calendar to continue.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(360) 555-0000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">What needs to go?</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Brief description of items..."
                        className="mt-1 min-h-[80px]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg" 
                      disabled={isSubmitting || !selectedDate || !selectedTime}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      Prefer to talk to a human?
                    </p>
                    <div className="space-y-2">
                      <a
                        href="tel:+13606109233"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        (360) 610-9233
                      </a>
                      <a
                        href="mailto:Junkygurus@gmail.com"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        Junkygurus@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Junk Roulette Modal */}
      <JunkRouletteModal
        open={showRoulette}
        onOpenChange={setShowRoulette}
        customerName={submittedCustomer.name}
        customerEmail={submittedCustomer.email}
      />
    </Layout>
  );
};

export default Booking;
