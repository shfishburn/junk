import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, Clock, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Something went wrong",
        description: "Please try calling us directly at (360) 555-1234.",
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

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to get rid of your junk? Give us a call or fill out the form below for a free, no-obligation quote.
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
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                The fastest way to get a quote is to give us a call. We can usually give you a ballpark estimate over the phone and schedule a time that works for you.
              </p>

              <div className="space-y-6">
                <a
                  href="tel:+13605551234"
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">Phone</h3>
                    <p className="text-primary font-medium">(360) 555-1234</p>
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
                  Request a Free Quote
                </h2>
                <p className="text-muted-foreground mb-6">
                  Tell us about your junk removal needs and we'll get back to you right away.
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

                  <div>
                    <Label htmlFor="message">What do you need hauled? *</Label>
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
