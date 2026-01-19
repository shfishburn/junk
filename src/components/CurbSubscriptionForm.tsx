import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks";
import { FormField, TextareaField } from "@/components/shared";
import { supabase } from "@/integrations/supabase/client";
import { cn, trackContactFormSubmit } from "@/lib";
import { 
  Trash2, 
  Loader2, 
  Calendar,
  Check
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schema for subscription form
const subscriptionFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address must be less than 500 characters"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

const PLAN_OPTIONS = [
  { 
    id: "weekly", 
    label: "Weekly Service", 
    price: "$40/month", 
    description: "4 pickups per month",
    popular: true
  },
  { 
    id: "biweekly", 
    label: "Bi-Weekly Service", 
    price: "$25/month", 
    description: "2 pickups per month",
    popular: false
  },
  { 
    id: "onetime", 
    label: "One-Time Service", 
    price: "$15", 
    description: "Single pickup",
    popular: false
  },
];

const TRASH_DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
];

export function CurbSubscriptionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("weekly");
  const [trashDay, setTrashDay] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  // Honeypot field - invisible to users, but bots will fill it
  const [honeypot, setHoneypot] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, silently reject (bots fill hidden fields)
    if (honeypot) {
      toast({
        title: "Subscription request received!",
        description: "We'll contact you shortly to get you started.",
      });
      return;
    }
    
    if (!trashDay) {
      toast({
        title: "Please select your trash day",
        description: "We need to know when to take your bins out.",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = subscriptionFormSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Invalid input",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPlanInfo = PLAN_OPTIONS.find(p => p.id === selectedPlan);
      
      const message = `TRASH CAN TO CURB SUBSCRIPTION REQUEST\n\n` +
        `Plan: ${selectedPlanInfo?.label} - ${selectedPlanInfo?.price}\n` +
        `Trash Day: ${TRASH_DAYS.find(d => d.value === trashDay)?.label}\n\n` +
        `Service Address: ${validation.data.address}\n\n` +
        `Additional Notes: ${validation.data.notes || "None"}`;

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message,
          isCurbSubscription: true,
        },
      });

      if (error) throw error;

      // Track form submission
      trackContactFormSubmit(`curb_${selectedPlan}`);

      toast({
        title: "Subscription request received!",
        description: "We'll contact you within 24 hours to get you started.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", address: "", notes: "" });
      setSelectedPlan("weekly");
      setTrashDay("");
    } catch (error) {
      console.error("Error sending subscription request:", error);
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

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Trash2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Sign Up for Curb Service</h3>
          <p className="text-sm text-muted-foreground">Never worry about trash day again</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - hidden from users, bots will fill it */}
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
        
        {/* Plan Selection */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Choose Your Plan *
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {PLAN_OPTIONS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all cursor-pointer relative",
                  selectedPlan === plan.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/30"
                )}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <span className="absolute -top-2 right-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    BEST VALUE
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      selectedPlan === plan.id 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    )}>
                      {selectedPlan === plan.id && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{plan.label}</span>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary">{plan.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trash Day Selection */}
        <div>
          <Label htmlFor="trash-day" className="text-base font-semibold mb-2 block">
            Your Trash Day *
          </Label>
          <Select value={trashDay} onValueChange={setTrashDay}>
            <SelectTrigger id="trash-day" className="w-full">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select your trash collection day" />
            </SelectTrigger>
            <SelectContent>
              {TRASH_DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="curb-name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
          <FormField
            id="curb-phone"
            name="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(360) 555-0000"
            required
          />
        </div>

        <FormField
          id="curb-email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
        />

        <FormField
          id="curb-address"
          name="address"
          label="Service Address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, Mount Vernon, WA"
          required
        />

        <TextareaField
          id="curb-notes"
          name="notes"
          label="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any special instructions? (e.g., bins are in the side yard, garage code for returns, etc.)"
          rows={3}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Sign Up Now
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          No contracts — cancel anytime. We'll confirm your service within 24 hours. Questions? Call{" "}
          <a href="tel:+13606109233" className="text-primary hover:underline">(360) 610-9233</a>
        </p>
      </form>
    </div>
  );
}
