import { useState, useCallback, useEffect } from "react";
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
  Hammer, 
  Clock, 
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
  Users,
  Wrench,
  AlertTriangle
} from "lucide-react";
import { JunkRouletteModal } from "./JunkRouletteModal";

interface DemolitionStructure {
  name: string;
  material: string;
  condition: "good" | "weathered" | "damaged" | "rotted";
  estimatedSize: string;
}

interface DemolitionResult {
  projectType: string;
  structures: DemolitionStructure[];
  scopeOfWork: {
    complexity: "simple" | "moderate" | "complex";
    estimatedHours: number;
    crewSize: number;
    equipmentNeeded: string[];
  };
  debrisEstimate: {
    volume: number;
    weight: number;
    truckLoads: number;
    disposalNotes: string;
  };
  priceEstimate: {
    laborMin: number;
    laborMax: number;
    disposalMin: number;
    disposalMax: number;
    totalMin: number;
    totalMax: number;
    currency: "USD";
  };
  confidence: "low" | "medium" | "high";
  notes: string;
  safetyConsiderations: string[];
  recommendations: string[];
}

const loadingMessages = [
  "Sizing up the demolition zone...",
  "Calculating destruction levels...",
  "Consulting the teardown experts...",
  "Measuring the mayhem...",
  "Estimating the rubble...",
];

interface DemolitionAnalyzerProps {
  variant?: "inline" | "compact";
  onAnalysisComplete?: () => void;
}

export function DemolitionAnalyzer({ variant = "inline", onAnalysisComplete }: DemolitionAnalyzerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [result, setResult] = useState<DemolitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const { toast } = useToast();

  // Restore saved estimate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('demolition-estimate');
    if (saved) {
      try {
        const { result: savedResult, imagePreviews: savedPreviews, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setResult(savedResult);
          setImagePreviews(savedPreviews || []);
        } else {
          localStorage.removeItem('demolition-estimate');
        }
      } catch (e) {
        localStorage.removeItem('demolition-estimate');
      }
    }
  }, []);

  // Save estimate to localStorage when result changes
  useEffect(() => {
    if (result && imagePreviews.length > 0) {
      localStorage.setItem('demolition-estimate', JSON.stringify({
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

    setError(null);
    setResult(null);

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
    setIsAnalyzing(true);
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2000);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-demolition", {
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

  const reset = () => {
    localStorage.removeItem('demolition-estimate');
    setImagePreviews([]);
    setResult(null);
    setError(null);
    setRequestSubmitted(false);
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
    setIsSubmittingRequest(true);

    try {
      const estimateDetails = result ? `
DEMOLITION ESTIMATE REQUEST

Project Type: ${result.projectType}

AI Estimate Details:
- Total Price Range: $${result.priceEstimate.totalMin} - $${result.priceEstimate.totalMax}
- Labor: $${result.priceEstimate.laborMin} - $${result.priceEstimate.laborMax}
- Disposal: $${result.priceEstimate.disposalMin} - $${result.priceEstimate.disposalMax}
- Estimated Hours: ${result.scopeOfWork.estimatedHours} hours
- Crew Size: ${result.scopeOfWork.crewSize} people
- Complexity: ${result.scopeOfWork.complexity}
- Debris: ~${result.debrisEstimate.volume} cubic yards, ${result.debrisEstimate.truckLoads} truck load(s)
- Confidence: ${result.confidence}

Structures:
${result.structures.map(s => `- ${s.name} (${s.material}, ${s.condition}): ${s.estimatedSize}`).join("\n")}

Customer Notes: ${formData.notes || "None"}` : formData.notes;

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: estimateDetails,
        },
      });

      if (error) throw error;

      setRequestSubmitted(true);
      toast({
        title: "Request sent!",
        description: "We'll be in touch soon to schedule your demolition estimate.",
      });
      
      setShowRoulette(true);
    } catch (error) {
      console.error("Error sending request:", error);
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

  const complexityColors = {
    simple: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    complex: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const conditionLabels = {
    good: "Good",
    weathered: "Weathered",
    damaged: "Damaged",
    rotted: "Rotted",
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
                  <img src={preview} alt={`Demolition ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={reset} className="absolute top-0 right-0">
              <RotateCcw className="h-4 w-4 mr-1" />
              New Photos
            </Button>
          </div>
        )}

        {/* Project type badge */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Hammer className="h-4 w-4" />
            {result.projectType}
          </span>
        </div>

        {/* Price estimate - hero display */}
        <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Estimated Total</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold text-primary">
            ${result.priceEstimate.totalMin.toLocaleString()} - ${result.priceEstimate.totalMax.toLocaleString()}
          </div>
          <p className={`text-sm mt-2 ${confidenceColors[result.confidence]}`}>
            {result.confidence === "high" ? "High confidence estimate" : 
             result.confidence === "medium" ? "Medium confidence — final price may vary" :
             "Rough estimate — call for accurate quote"}
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Labor: ${result.priceEstimate.laborMin}-${result.priceEstimate.laborMax}</span>
            <span>•</span>
            <span>Disposal: ${result.priceEstimate.disposalMin}-${result.priceEstimate.disposalMax}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.scopeOfWork.estimatedHours}</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.scopeOfWork.crewSize}</div>
            <div className="text-xs text-muted-foreground">Crew</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Truck className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.debrisEstimate.truckLoads}</div>
            <div className="text-xs text-muted-foreground">Truck Loads</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Hammer className="h-5 w-5 mx-auto mb-2 text-primary" />
            <span className={`text-xs px-2 py-1 rounded-full ${complexityColors[result.scopeOfWork.complexity]}`}>
              {result.scopeOfWork.complexity.charAt(0).toUpperCase() + result.scopeOfWork.complexity.slice(1)}
            </span>
            <div className="text-xs text-muted-foreground mt-1">Complexity</div>
          </div>
        </div>

        {/* Structures list */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Structures Identified
          </h4>
          <div className="space-y-2">
            {result.structures.map((structure, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <span className="font-medium text-charcoal">{structure.name}</span>
                <span className="text-sm text-muted-foreground">({structure.material})</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {conditionLabels[structure.condition]}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{structure.estimatedSize}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment needed */}
        {result.scopeOfWork.equipmentNeeded.length > 0 && (
          <div className="p-4 rounded-lg bg-card border border-border">
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              Equipment Needed
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.scopeOfWork.equipmentNeeded.map((equipment, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                  {equipment}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Safety considerations */}
        {result.safetyConsiderations.length > 0 && (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Safety Considerations
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 dark:text-amber-300">
              {result.safetyConsiderations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {result.notes && (
          <div className="p-4 rounded-lg bg-section-alt border border-border">
            <p className="text-charcoal-light italic">"{result.notes}"</p>
          </div>
        )}

        {/* Service Request Form */}
        {!requestSubmitted ? (
          <div className="p-6 rounded-xl bg-card border-2 border-primary/20">
            <h3 className="font-semibold text-charcoal text-lg mb-4 flex items-center gap-2">
              <Hammer className="h-5 w-5 text-primary" />
              Request Demolition Quote
            </h3>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
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
              <div>
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
              <div>
                <Label htmlFor="notes">Anything else we should know?</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Address, accessibility, timeline, etc."
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isSubmittingRequest}>
                {isSubmittingRequest ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Request Quote
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold text-charcoal text-lg mb-2">Request Sent!</h3>
            <p className="text-muted-foreground">
              We'll reach out shortly to schedule your on-site estimate. Thanks for choosing Junky Gurus!
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
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <a href="tel:+13606109233">
              <Phone className="mr-2 h-4 w-4" />
              Prefer to Call? (360) 610-9233
            </a>
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
            <strong>Heads up!</strong> Our AI is smart, but demolition projects can be tricky! This estimate is for planning purposes only. 
            Actual pricing depends on hidden factors like rotten wood, concrete footings, or surprise wasps' nests. 
            We'll give you the real deal with an on-site quote. No surprises, pinky promise.
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
        <h3 className="font-semibold text-charcoal text-lg">Oops! Something went wrong</h3>
        <p className="text-muted-foreground">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <a href="tel:+13606109233">
              <Phone className="mr-2 h-4 w-4" />
              Call for Quote
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
        <div className="relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Hammer className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <Loader2 className="h-24 w-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-primary/30" />
        </div>
        <p className="text-muted-foreground animate-pulse">{loadingMessage}</p>
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 justify-center mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="w-16 h-16 rounded-lg overflow-hidden opacity-50">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Upload state
  return (
    <div className="space-y-4">
      <div
        className={`
          relative p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("demolition-upload")?.click()}
      >
        <input
          type="file"
          id="demolition-upload"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleInputChange}
        />
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            {isDragging ? (
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            ) : (
              <Hammer className="h-8 w-8 text-primary" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-charcoal mb-1">
              {isDragging ? "Drop your photos here!" : "Upload Demolition Photos"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload photos of decks, sheds, fences, etc.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Camera className="h-4 w-4" />
            <span>JPG, PNG, or HEIC • Max 10MB per image</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Our AI will analyze your demolition project and provide an instant estimate. 
        Perfect for decks, sheds, fences, and more!
      </p>
    </div>
  );
}
