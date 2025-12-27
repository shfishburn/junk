import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { SEO, Breadcrumbs, DateTimePicker, FormField, TextareaField, ContactInfoCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { JunkRouletteModal } from "@/components/JunkRouletteModal";

const SERVICE_TYPES = [
  { value: "residential", label: "Residential Junk Removal" },
  { value: "appliances", label: "Appliance Removal" },
  { value: "construction", label: "Construction Debris" },
  { value: "yard", label: "Yard Waste" },
  { value: "commercial", label: "Commercial/Office" },
  { value: "cleanout", label: "Estate/Garage Cleanout" },
  { value: "hazmat", label: "Hazmat Materials" },
  { value: "other", label: "Other" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone number is too long").optional(),
  serviceType: z.string().optional(),
  message: z.string().trim().min(1, "Please tell us about your junk").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();
  const [preferredTime, setPreferredTime] = useState<string>("");
  const [showRoulette, setShowRoulette] = useState(false);
  const [submittedCustomer, setSubmittedCustomer] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentInfo = preferredDate 
        ? `${format(preferredDate, "EEEE, MMMM d, yyyy")}${preferredTime ? ` at ${preferredTime}` : ""}`
        : null;

      const serviceLabel = SERVICE_TYPES.find(s => s.value === formData.serviceType)?.label;

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          ...formData,
          serviceType: serviceLabel || formData.serviceType,
          preferredAppointment: appointmentInfo,
        },
      });

      if (error) throw error;

      // Save customer info before clearing form
      setSubmittedCustomer({ name: formData.name, email: formData.email });
      
      // Show the roulette wheel!
      setShowRoulette(true);

      setFormData({ name: "", email: "", phone: "", serviceType: "", message: "" });
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };


  return (
    <Layout>
      <SEO
        title="Contact Us"
        description="Get a free junk removal quote in Mount Vernon, WA. Call (360) 610-9233 or fill out our contact form. We respond fast!"
        keywords="junk removal quote, contact junky gurus, Mount Vernon junk removal, free estimate"
        url="/contact"
        pageType="contact"
        pagePurpose="Contact form for quotes and inquiries. Phone: (360) 610-9233. Email: Junkygurus@gmail.com. Also available via text."
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <Breadcrumbs items={[{ label: "Contact" }]} />
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

              <ContactInfoCard />
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
                  <FormField
                    id="name"
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    error={errors.name}
                  />

                  <FormField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    error={errors.email}
                  />

                  <FormField
                    id="phone"
                    name="phone"
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(360) 555-0000"
                  />

                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceType: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="What type of junk?" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date & Time Picker */}
                  <DateTimePicker
                    date={preferredDate}
                    time={preferredTime}
                    onDateChange={setPreferredDate}
                    onTimeChange={setPreferredTime}
                  />

                  <TextareaField
                    id="message"
                    name="message"
                    label="What's haunting you?"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the items you need removed, the location, and any other details..."
                    required
                    error={errors.message}
                    rows={4}
                  />

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

export default Contact;
