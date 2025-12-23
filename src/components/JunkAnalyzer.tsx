import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
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
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Reset state
    setError(null);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      
      // Start analysis
      setIsAnalyzing(true);
      
      // Cycle through loading messages
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 2000);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("analyze-junk", {
          body: { imageBase64: base64 },
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
    };
    reader.readAsDataURL(file);
  }, [toast, onAnalysisComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
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
        {/* Image preview */}
        {imagePreview && (
          <div className="relative rounded-lg overflow-hidden max-h-48">
            <img src={imagePreview} alt="Your junk" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2">
              <Button variant="secondary" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                New Photo
              </Button>
            </div>
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

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="flex-1">
            <Link to="/contact">Schedule Pickup</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <a href="tel:+13606109233">
              <Phone className="mr-2 h-4 w-4" />
              Call for Exact Quote
            </a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * This is an AI estimate. Final price determined on-site by our team.
        </p>
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
        {imagePreview && (
          <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden mb-4">
            <img src={imagePreview} alt="Analyzing" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/20 animate-pulse" />
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
              Drop a photo here or tap to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Take a pic of your junk pile and we'll estimate the cost
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>Powered by AI · Usually takes 5-10 seconds</span>
      </div>
    </div>
  );
}
