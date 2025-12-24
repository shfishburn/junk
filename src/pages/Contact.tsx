import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, Clock, MapPin, Loader2, Sparkles, Camera, CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();
  const [preferredTime, setPreferredTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const appointmentInfo = preferredDate 
        ? `${format(preferredDate, "EEEE, MMMM d, yyyy")}${preferredTime ? ` at ${preferredTime}` : ""}`
        : null;

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          ...formData,
          preferredAppointment: appointmentInfo,
        },
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
      setPreferredDate(undefined);
      setPreferredTime("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Something went wrong",
        description: "Please try calling us directly at (360) 610-9233.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  // Disable past dates and Sundays
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  return (
    <Layout>
      <SEO
        title="Contact Us"
        description="Get a free junk removal quote in Mount Vernon, WA. Call (360) 610-9233 or fill out our contact form. We respond fast!"
        keywords="junk removal quote, contact junky gurus, Mount Vernon junk removal, free estimate"
        url="/contact"
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Let's Chat About Your Clutter
            </h1>
            <p className="text-lg text-muted-foreground">
              We promise we won't judge. We've seen way worse. Tell us what's haunting you and we'll make it disappear.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              {/* AI Quote Card */}
              <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">Skip the Typing</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Snap a photo and let our AI do the heavy lifting (pun intended).
                    </p>
                    <Button asChild className="w-full sm:w-auto">
                      <Link to="/ai-estimator">
                        <Camera className="mr-2 h-4 w-4" />
                        Get AI Quote
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-6">
                Reach Out (We're Friendly, Promise)
              </h2>
              <p className="text-muted-foreground mb-8">
                The fastest way to get a quote is to give us a call. We love hearing about people's junk — it's kind of our thing.
              </p>

              <div className="space-y-6">
                <a
                  href="tel:+13606109233"
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Call Us</h3>
                    <p className="text-primary font-medium">(360) 610-9233</p>
                  </div>
                </a>

                <a
                  href="mailto:info@junkygurus.com"
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Email</h3>
                    <p className="text-primary font-medium">info@junkygurus.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Saturday: 8am - 6pm</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Location</h3>
                    <p className="text-muted-foreground">Based in Mount Vernon, WA</p>
                    <p className="text-muted-foreground text-sm">Serving Skagit, Whatcom, Snohomish & King Counties</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="p-6 md:p-8 rounded-lg bg-card border border-border">
                <h2 className="text-2xl font-bold text-charcoal mb-2">
                  Spill the Beans About Your Junk
                </h2>
                <p className="text-muted-foreground mb-6">
                  The more details, the better. We're weirdly excited to hear about your pile of stuff.
                </p>

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

                  {/* Date & Time Picker */}
                  <div className="space-y-3">
                    <Label>Preferred Appointment (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !preferredDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {preferredDate ? format(preferredDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={preferredDate}
                          onSelect={(date) => {
                            setPreferredDate(date);
                            setPreferredTime("");
                          }}
                          disabled={disabledDays}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    {preferredDate && (
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">
                          Select a time slot
                        </Label>
                        <div className="grid grid-cols-5 gap-2">
                          {TIME_SLOTS.map((slot) => (
                            <Button
                              key={slot}
                              type="button"
                              variant={preferredTime === slot ? "default" : "outline"}
                              size="sm"
                              className="text-xs"
                              onClick={() => setPreferredTime(slot)}
                            >
                              {slot.replace(":00 ", "")}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">What's haunting you? *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about the items you need removed, the location, and any other details..."
                      className="mt-1 min-h-[120px]"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Contact;
