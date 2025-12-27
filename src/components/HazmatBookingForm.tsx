import { useState } from "react";
import { format } from "date-fns";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { DateTimePicker, FormField, TextareaField } from "@/components/shared";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  Loader2, 
  Paintbrush, 
  Battery, 
  Lightbulb, 
  Fuel,
  Tv,
  Flame,
  Wind,
  FlaskConical,
  Plus,
  Minus
} from "lucide-react";

// Validation schema for hazmat booking form
const hazmatFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address must be less than 500 characters"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

const HAZMAT_ITEMS = [
  { id: "paint_gallon", label: "Paint (gallon cans)", icon: Paintbrush, unit: "cans" },
  { id: "paint_bucket", label: "Paint (5-gallon buckets)", icon: Paintbrush, unit: "buckets" },
  { id: "batteries", label: "Batteries (all types)", icon: Battery, unit: "lbs approx" },
  { id: "fluorescent", label: "Fluorescent tubes / CFLs", icon: Lightbulb, unit: "bulbs" },
  { id: "motor_oil", label: "Motor oil / Antifreeze", icon: Fuel, unit: "containers" },
  { id: "chemicals", label: "Household chemicals", icon: FlaskConical, unit: "containers" },
  { id: "ewaste", label: "Electronics / E-waste", icon: Tv, unit: "items" },
  { id: "propane", label: "Propane tanks", icon: Flame, unit: "tanks" },
  { id: "aerosol", label: "Aerosol cans", icon: Wind, unit: "cans" },
];

interface HazmatItem {
  id: string;
  selected: boolean;
  quantity: number;
}

export function HazmatBookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();
  const [preferredTime, setPreferredTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [hazmatItems, setHazmatItems] = useState<HazmatItem[]>(
    HAZMAT_ITEMS.map(item => ({ id: item.id, selected: false, quantity: 1 }))
  );
  const { toast } = useToast();

  const handleItemToggle = (itemId: string) => {
    setHazmatItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, selected: !item.selected, quantity: item.selected ? 1 : item.quantity }
          : item
      )
    );
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setHazmatItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const getSelectedItemsSummary = () => {
    return hazmatItems
      .filter(item => item.selected)
      .map(item => {
        const itemDef = HAZMAT_ITEMS.find(h => h.id === item.id);
        return `${itemDef?.label}: ${item.quantity} ${itemDef?.unit}`;
      })
      .join(", ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedItems = hazmatItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast({
        title: "Please select at least one item",
        description: "Check the materials you need picked up.",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = hazmatFormSchema.safeParse(formData);
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
      const appointmentInfo = preferredDate 
        ? `${format(preferredDate, "EEEE, MMMM d, yyyy")}${preferredTime ? ` at ${preferredTime}` : ""}`
        : null;

      const itemsSummary = getSelectedItemsSummary();
      const message = `HAZMAT PICKUP REQUEST\n\nPickup Address: ${validation.data.address}\n\nMaterials:\n${itemsSummary}\n\nAdditional Notes: ${validation.data.notes || "None"}`;

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message,
          preferredAppointment: appointmentInfo,
          isHazmatRequest: true,
        },
      });

      if (error) throw error;

      toast({
        title: "Hazmat pickup request received!",
        description: "We'll contact you shortly to confirm your pickup.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", address: "", notes: "" });
      setPreferredDate(undefined);
      setPreferredTime("");
      setHazmatItems(HAZMAT_ITEMS.map(item => ({ id: item.id, selected: false, quantity: 1 })));
    } catch (error) {
      console.error("Error sending hazmat request:", error);
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


  const selectedCount = hazmatItems.filter(item => item.selected).length;

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Schedule Hazmat Pickup</h3>
          <p className="text-sm text-muted-foreground">Tell us what you've got and we'll handle the rest</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Checklist */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            What materials do you have? *
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HAZMAT_ITEMS.map((item) => {
              const hazmatItem = hazmatItems.find(h => h.id === item.id);
              const isSelected = hazmatItem?.selected || false;
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all cursor-pointer",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  )}
                  onClick={() => handleItemToggle(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleItemToggle(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground text-sm">{item.label}</span>
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center text-sm font-medium">
                            {hazmatItem?.quantity || 1}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-muted-foreground">{item.unit}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedCount > 0 && (
            <p className="text-sm text-primary mt-3 font-medium">
              {selectedCount} item type{selectedCount > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="hazmat-name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
          <FormField
            id="hazmat-phone"
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
          id="hazmat-email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
        />

        <FormField
          id="hazmat-address"
          name="address"
          label="Pickup Address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, Mount Vernon, WA"
          required
        />

        {/* Date & Time Picker */}
        <DateTimePicker
          date={preferredDate}
          time={preferredTime}
          onDateChange={setPreferredDate}
          onTimeChange={setPreferredTime}
          label="Preferred Pickup Date (Optional)"
        />

        <TextareaField
          id="hazmat-notes"
          name="notes"
          label="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Anything else we should know? (e.g., items are in garage, need help carrying, etc.)"
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
              <AlertTriangle className="mr-2 h-4 w-4" />
              Request Hazmat Pickup
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          We'll confirm your pickup within 24 hours. For urgent requests, call us at{" "}
          <a href="tel:+13606109233" className="text-primary hover:underline">(360) 610-9233</a>
        </p>
      </form>
    </div>
  );
}
