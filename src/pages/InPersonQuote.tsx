import { useState } from "react";
import { format } from "date-fns";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast, useBookingSlots } from "@/hooks";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout";
import { SEO, Breadcrumbs, FormField, TextareaField, BookingSlotPicker } from "@/components/shared";
import { AddressInput, getEmptyAddress, formatAddressForStorage, type AddressData } from "@/components/AddressInput";
import { User, CheckCircle2, Loader2, Heart, Handshake, Clock, DollarSign, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required so we can confirm your visit")
    .max(20, "Phone must be less than 20 characters")
    .regex(/^[\d\s\-\(\)\+]*$/, "Please enter a valid phone number"),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional().or(z.literal("")),
});

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const SERVICE_TYPES = [
  "Residential Junk Removal",
  "Appliance Removal",
  "Yard Waste & Debris",
  "Garage or Estate Cleanout",
  "Construction Debris",
  "Commercial Cleanouts",
  "Light Demolition",
  "Not sure yet — take a look",
];

const perks = [
  {
    icon: DollarSign,
    title: "Free & No Obligation",
    description: "We walk the job, hand you a firm price, and you decide. No pressure, no fees for looking.",
  },
  {
    icon: Clock,
    title: "Usually 15 Minutes",
    description: "Quick walkthrough of the pile, driveway, or project. We're not there to sell you a timeshare.",
  },
  {
    icon: Handshake,
    title: "Haul It Same Visit",
    description: "Like the number? We can often load it right then and there — no second appointment.",
  },
];

const InPersonQuote = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [address, setAddress] = useState<AddressData>(getEmptyAddress());
  const [isSenior, setIsSenior] = useState(false);
  const [isVeteran, setIsVeteran] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const { toast } = useToast();
  const { refetchBookings } = useBookingSlots();

  const validateForm = (): boolean => {
    const result = quoteSchema.safeParse(formData);
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (field) errors[field] = err.message;
      });
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      setConfirmed(true);
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({ title: "Please pick a date and time for your estimate", variant: "destructive" });
      return;
    }

    if (!validateForm()) {
      toast({ title: "Please fix the form errors", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const validated = quoteSchema.parse(formData);
      const formattedAddress = formatAddressForStorage(address);

      const discountInfo: string[] = [];
      if (isSenior) discountInfo.push("Senior (65+)");
      if (isVeteran) discountInfo.push("Veteran/Active Military");

      const details = [
        "[IN-PERSON ESTIMATE REQUEST]",
        serviceType ? `Service: ${serviceType}` : null,
        validated.message ? `Details: ${validated.message}` : null,
        discountInfo.length > 0 ? `[10% DISCOUNT ELIGIBLE: ${discountInfo.join(", ")}]` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const { error: bookingError } = await supabase.from("bookings").insert({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        address: formattedAddress || null,
        message: details,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        booking_time: selectedTime,
        status: "pending",
      });

      if (bookingError) {
        if (bookingError.code === "23505") {
          toast({
            title: "Time slot no longer available",
            description: "Someone just grabbed this slot. Please pick another time.",
            variant: "destructive",
          });
          refetchBookings();
          setSelectedTime("");
          return;
        }
        throw bookingError;
      }

      await supabase.functions.invoke("send-contact-email", {
        body: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          message: details,
          isBooking: true,
          bookingDate: format(selectedDate, "EEEE, MMMM d, yyyy"),
          bookingTime: selectedTime,
          address: formattedAddress || undefined,
        },
      });

      setConfirmed(true);
      toast({
        title: "Estimate scheduled!",
        description: "Check your email for the details.",
      });
    } catch (error: any) {
      console.error("In-person quote error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or give us a call.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <Layout>
        <SEO
          title="Estimate Scheduled | Junky Gurus"
          description="Your free in-person estimate is scheduled. We'll see you soon."
        />
        <div className="container py-16 md:py-24">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Your Estimate Is Scheduled!</h1>
              <p className="text-muted-foreground mb-6">
                We'll stop by on{" "}
                <strong className="text-foreground">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                </strong>{" "}
                to take a look and give you a firm price.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Confirmation sent to <strong>{formData.email}</strong>
              </p>
              <Button onClick={() => (window.location.href = "/")}>Back to Home</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Free In-Person Estimate | Junky Gurus"
        description="Book a free on-site junk removal estimate in Mount Vernon and the Puget Sound Region. We come out, look at the job, and give you a firm price."
        keywords="free on-site estimate, in-person junk removal quote, free junk removal estimate Mount Vernon"
        url="/free-estimate"
        pageType="booking"
        pagePurpose="Schedule a free in-person, on-site junk removal estimate. Pick a date and time and we come out to quote the job."
      />

      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Free In-Person Estimate" }]} />
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 sm:mb-6">
              <Handshake className="h-4 w-4" />
              Free On-Site Estimates
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              We'll Come Look at It — Free
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Pick a time that works, and a real human shows up, sizes up the job, and hands you a firm price. No guessing, no
              hidden fees, no obligation to say yes.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3 max-w-4xl mx-auto mt-8 md:mt-12">
            {perks.map((perk) => (
              <div key={perk.title} className="p-5 sm:p-6 rounded-xl bg-card border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <perk.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-semibold text-foreground mb-2">{perk.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <BookingSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />

          {selectedDate && selectedTime && (
            <Card className="max-w-xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Where Should We Meet You?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <FormField
                    id="name"
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="Your full name"
                    required
                    maxLength={100}
                    error={formErrors.name}
                  />
                  <FormField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    placeholder="your@email.com"
                    required
                    maxLength={255}
                    error={formErrors.email}
                  />
                  <FormField
                    id="phone"
                    name="phone"
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    placeholder="(555) 123-4567"
                    required
                    maxLength={20}
                    error={formErrors.phone}
                  />

                  <div className="pt-2">
                    <AddressInput value={address} onChange={setAddress} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-type">What's the job?</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger id="service-type">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <TextareaField
                    id="message"
                    name="message"
                    label="Anything we should know?"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                    }}
                    placeholder="Gate codes, stairs, parking, what's in the pile..."
                    rows={3}
                    maxLength={1000}
                    error={formErrors.message}
                  />

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">10% Senior & Veteran Discount</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Check if applicable — no proof required, we trust you.</p>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="senior" checked={isSenior} onCheckedChange={(c) => setIsSenior(c === true)} />
                        <label htmlFor="senior" className="text-sm text-muted-foreground cursor-pointer">
                          I am a senior citizen (65+)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="veteran" checked={isVeteran} onCheckedChange={(c) => setIsVeteran(c === true)} />
                        <label htmlFor="veteran" className="text-sm text-muted-foreground cursor-pointer">
                          I am a veteran or active military
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium">Your Estimate Visit</p>
                    <p className="text-primary font-semibold">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      "Schedule My Free Estimate"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Already Know What You Need Gone?</h2>
            <p className="text-muted-foreground mb-6">
              Skip the estimate visit and book the pickup directly — or call and we'll talk it through.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
              <Button asChild size="lg" className="min-h-[48px]">
                <Link to="/book">Book a Pickup</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-[48px]">
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 610-9233
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InPersonQuote;