import { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  Camera, 
  Loader2, 
  Package, 
  Scale, 
  Truck, 
  DollarSign,
  Phone,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Send,
  CalendarDays
} from "lucide-react";
import { JunkRouletteModal } from "./JunkRouletteModal";
import { BookingSlotPicker } from "./BookingSlotPicker";
import { useBookingSlots } from "@/hooks/use-booking-slots";

interface JunkItem {
  name: string;
  quantity: number;
  condition: "good" | "fair" | "poor" | "broken";
}

interface AnalysisResult {
  items: JunkItem[];
  estimatedVolume: {
    value: number;
    unit: "cubic_yards";
    truckPercentage: number;
  };
  estimatedWeight: {
    value: number;
    unit: "lbs";
    category: "light" | "medium" | "heavy";
  };
  priceEstimate: {
    min: number;
    max: number;
    currency: "USD";
  };
  confidence: "low" | "medium" | "high";
  notes: string;
  recommendations: string[];
}

const loadingMessages = [
  "Consulting the junk spirits...",
  "Squinting at your stuff...",
  "Calculating clutter quotient...",
  "Channeling our inner Marie Kondo...",
  "Measuring chaos levels...",
];

interface JunkAnalyzerProps {
  variant?: "inline" | "compact";
  onAnalysisComplete?: () => void;
}

export function JunkAnalyzer({ variant = "inline", onAnalysisComplete }: JunkAnalyzerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const { toast } = useToast();
  const { refetchBookings } = useBookingSlots();

  // Restore saved estimate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('junk-estimate');
    if (saved) {
      try {
        const { result: savedResult, imagePreviews: savedPreviews, timestamp } = JSON.parse(saved);
        // Check if not expired (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setResult(savedResult);
          setImagePreviews(savedPreviews || []);
        } else {
          localStorage.removeItem('junk-estimate');
        }
      } catch (e) {
        localStorage.removeItem('junk-estimate');
      }
    }
  }, []);

  // Save estimate to localStorage when result changes
  useEffect(() => {
    if (result && imagePreviews.length > 0) {
      localStorage.setItem('junk-estimate', JSON.stringify({
        result,
        imagePreviews,
        timestamp: Date.now()
      }));
    }
  }, [result, imagePreviews]);

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Reset state
    setError(null);
    setResult(null);

    // Create previews for all valid files
    const newPreviews: string[] = [];
    const base64Images: string[] = [];

    for (const file of validFiles) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      newPreviews.push(base64);
      base64Images.push(base64);
    }

    setImagePreviews(newPreviews);
    
    // Start analysis with first image (or combined context)
    setIsAnalyzing(true);
    
    // Cycle through loading messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2000);

    try {
      // Analyze all images - we'll send each and combine results
      // For now, analyze the first image but mention multiple images in the prompt
      const { data, error: fnError } = await supabase.functions.invoke("analyze-junk", {
        body: { 
          imageBase64: base64Images[0],
          totalImages: base64Images.length 
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setResult(data);
      onAnalysisComplete?.();
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image");
      toast({
        title: "Analysis failed",
        description: "Don't worry — just give us a call for a quote!",
        variant: "destructive",
      });
    } finally {
      clearInterval(messageInterval);
      setIsAnalyzing(false);
    }
  }, [toast, onAnalysisComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    localStorage.removeItem('junk-estimate');
    setImagePreviews([]);
    setResult(null);
    setError(null);
    setRequestSubmitted(false);
    setSelectedDate(undefined);
    setSelectedTime("");
    setFormData({ name: "", email: "", phone: "", notes: "" });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        description: "Choose when you'd like us to come pick up your junk.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingRequest(true);

    try {
      // Build message with AI estimate details
      const estimateDetails = result ? `
AI JUNK REMOVAL ESTIMATE

Price Range: $${result.priceEstimate.min} - $${result.priceEstimate.max}
Items: ${result.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
Volume: ${result.estimatedVolume.truckPercentage}% truck (~${result.estimatedVolume.value} cubic yards)
Weight: ~${result.estimatedWeight.value} lbs (${result.estimatedWeight.category})
Confidence: ${result.confidence}

Customer Notes: ${formData.notes || "None"}` : formData.notes;

      // Create booking record in database
      const { error: bookingError } = await supabase.from("bookings").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: estimateDetails,
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
          refetchBookings();
          setSelectedTime("");
          return;
        }
        throw bookingError;
      }

      // Send booking confirmation email
      await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          message: estimateDetails,
          isBooking: true,
          bookingDate: format(selectedDate, "EEEE, MMMM d, yyyy"),
          bookingTime: selectedTime,
        },
      });

      setRequestSubmitted(true);
      toast({
        title: "Booking confirmed!",
        description: "Check your email for confirmation details.",
      });
      
      // Show the roulette wheel!
      setShowRoulette(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Something went wrong",
        description: "Please try calling us directly at (360) 610-9233.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const confidenceColors = {
    low: "text-amber-600",
    medium: "text-primary",
    high: "text-green-600",
  };

  const conditionLabels = {
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    broken: "Broken",
  };

  // Results view
  if (result) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                  <img src={preview} alt={`Junk ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={reset} className="absolute top-0 right-0">
              <RotateCcw className="h-4 w-4 mr-1" />
              New Photos
            </Button>
          </div>
        )}

        {/* Price estimate - hero display */}
        <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Estimated Price</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold text-primary">
            ${result.priceEstimate.min} - ${result.priceEstimate.max}
          </div>
          <p className={`text-sm mt-2 ${confidenceColors[result.confidence]}`}>
            {result.confidence === "high" ? "High confidence estimate" : 
             result.confidence === "medium" ? "Medium confidence — final price may vary" :
             "Rough estimate — call for accurate quote"}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Package className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.items.length}</div>
            <div className="text-xs text-muted-foreground">Items</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Truck className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.estimatedVolume.truckPercentage}%</div>
            <div className="text-xs text-muted-foreground">Truck</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Scale className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.estimatedWeight.value}</div>
            <div className="text-xs text-muted-foreground">lbs</div>
          </div>
        </div>

        {/* Items list */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Items Identified
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.items.map((item, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
              >
                {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.name}
                <span className="text-muted-foreground ml-1">({conditionLabels[item.condition]})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {result.notes && (
          <div className="p-4 rounded-lg bg-section-alt border border-border">
            <p className="text-charcoal-light italic">"{result.notes}"</p>
          </div>
        )}

        {/* Service Request Form with Booking */}
        {!requestSubmitted ? (
          <div className="p-6 rounded-xl bg-card border-2 border-primary/20">
            <h3 className="font-semibold text-charcoal text-lg mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Book Your Pickup
            </h3>
            <form onSubmit={handleRequestSubmit} className="space-y-6">
              {/* Booking Slot Picker */}
              <BookingSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
                compact
              />
              
              {/* Contact Details */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-charcoal mb-3">Your Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Your name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="(360) 555-0000"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor="notes">Anything else we should know?</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="Address, access info, etc."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={isSubmittingRequest || !selectedDate || !selectedTime}
              >
                {isSubmittingRequest ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold text-charcoal text-lg mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground">
              Your pickup is scheduled for{" "}
              <strong className="text-foreground">
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Check your email for confirmation details.
            </p>
          </div>
        )}

        {/* Junk Roulette Modal */}
        <JunkRouletteModal
          open={showRoulette}
          onOpenChange={setShowRoulette}
          customerName={formData.name}
          customerEmail={formData.email}
        />

        {/* Quick call option */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild variant="outline" size="lg">
            <a href="tel:+13606109233">
              <Phone className="mr-2 h-4 w-4" />
              (360) 610-9233
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="tel:+13604222428">
              <Phone className="mr-2 h-4 w-4" />
              (360) 422-2428
            </a>
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
            <strong>Heads up!</strong> Our AI is smart, but it's not psychic. This estimate is for entertainment and planning purposes only. 
            The actual price depends on what we find when we show up — sometimes there's more junk hiding behind other junk. 
            We'll give you the real deal on-site before we lift a finger. No surprises, pinky promise.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center p-6 space-y-4">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
        <div>
          <h3 className="font-semibold text-charcoal mb-1">Oops! Something went wrong</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button asChild variant="outline">
            <a href="tel:+13606109233">
              <Phone className="mr-2 h-4 w-4" />
              Just Call Us
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="text-center p-8 space-y-4">
        {imagePreviews.length > 0 && (
          <div className="flex justify-center gap-2 mb-4">
            {imagePreviews.slice(0, 3).map((preview, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                <img src={preview} alt={`Analyzing ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
              </div>
            ))}
            {imagePreviews.length > 3 && (
              <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">+{imagePreviews.length - 3}</span>
              </div>
            )}
          </div>
        )}
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
        <p className="text-charcoal font-medium">{loadingMessage}</p>
        <p className="text-muted-foreground text-sm">This usually takes 5-10 seconds</p>
      </div>
    );
  }

  // Upload state
  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-section-alt"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div>
            <p className="font-semibold text-charcoal">
              Drop photos here or tap to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Take pics of your junk pile — you can upload multiple images!
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>Powered by AI · Upload multiple photos for better estimates</span>
      </div>
    </div>
  );
}
