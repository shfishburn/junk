import { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast, useBookingSlots } from "@/hooks";
import { supabase } from "@/integrations/supabase/client";
import { wasBingoShownForEstimate, markBingoShown, resetBingoShown, trackAIEstimatorUse, trackAIEstimatorBooking, trackBookingSubmit, compressImagesForStorage } from "@/lib";
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
import { JunkBingoModal } from "./JunkBingoModal";
import { BookingSlotPicker } from "@/components/shared";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { AddressInput, getEmptyAddress, formatAddressForStorage, type AddressData } from "./AddressInput";

const translations = {
  en: {
    invalidFileType: "Invalid file type",
    notAnImage: "is not an image file",
    fileTooLarge: "File too large",
    largerThan10MB: "is larger than 10MB",
    analysisFailed: "Analysis failed",
    dontWorryCall: "Don't worry — just give us a call for a quote!",
    selectDateTime: "Please select a date and time",
    chooseWhen: "Choose when you'd like us to come pick up your junk.",
    invalidInput: "Invalid input",
    timeSlotUnavailable: "Time slot no longer available",
    someoneJustBooked: "Someone just booked this slot. Please select another time.",
    bookingConfirmed: "Booking confirmed!",
    checkEmail: "Check your email for confirmation details.",
    somethingWentWrong: "Something went wrong",
    tryCallingUs: "Please try calling us directly at (360) 610-9233.",
    estimatedPrice: "Estimated Price",
    highConfidence: "High confidence estimate",
    mediumConfidence: "Medium confidence — final price may vary",
    roughEstimate: "Rough estimate — call for accurate quote",
    items: "Items",
    truck: "Truck",
    lbs: "lbs",
    itemsIdentified: "Items Identified",
    editItems: "Edit Items",
    addItem: "Add item",
    removeItem: "Remove",
    itemsEdited: "Items updated! Your estimate may vary based on actual items.",
    recalculate: "Recalculate Estimate",
    recalculating: "Recalculating...",
    bookYourPickup: "Book Your Pickup",
    yourDetails: "Your Details",
    name: "Name *",
    yourName: "Your name",
    phone: "Phone *",
    email: "Email *",
    anythingElse: "Anything else we should know?",
    addressPlaceholder: "Address, access info, etc.",
    booking: "Booking...",
    confirmBooking: "Confirm Booking",
    bookingConfirmedTitle: "Booking Confirmed!",
    pickupScheduled: "Your pickup is scheduled for",
    at: "at",
    newPhotos: "New Photos",
    headsUp: "Heads up!",
    disclaimer: "Our AI is smart, but it's not psychic. This estimate is for entertainment and planning purposes only. The actual price depends on what we find when we show up — sometimes there's more junk hiding behind other junk. We'll give you the real deal on-site before we lift a finger. No surprises, pinky promise.",
    oops: "Oops! Something went wrong",
    tryAgain: "Try Again",
    justCallUs: "Just Call Us",
    analyzing: "Analyzing",
    usuallyTakes: "This usually takes 5-10 seconds",
    dropPhotos: "Drop photos here or tap to upload",
    takePics: "Take pics of your junk pile — you can upload multiple images!",
    poweredByAI: "Powered by AI · Upload multiple photos for better estimates",
    conditionGood: "Good",
    conditionFair: "Fair",
    conditionPoor: "Poor",
    conditionBroken: "Broken",
    loadingMessages: [
      "Consulting the junk spirits...",
      "Squinting at your stuff...",
      "Calculating clutter quotient...",
      "Channeling our inner Marie Kondo...",
      "Measuring chaos levels...",
    ],
  },
  es: {
    invalidFileType: "Tipo de archivo inválido",
    notAnImage: "no es un archivo de imagen",
    fileTooLarge: "Archivo muy grande",
    largerThan10MB: "es mayor a 10MB",
    analysisFailed: "Análisis falló",
    dontWorryCall: "No te preocupes — ¡llámanos para una cotización!",
    selectDateTime: "Por favor selecciona fecha y hora",
    chooseWhen: "Elige cuándo te gustaría que recojamos tu basura.",
    invalidInput: "Entrada inválida",
    timeSlotUnavailable: "Horario ya no disponible",
    someoneJustBooked: "Alguien acaba de reservar este horario. Por favor selecciona otro.",
    bookingConfirmed: "¡Reserva confirmada!",
    checkEmail: "Revisa tu correo para los detalles de confirmación.",
    somethingWentWrong: "Algo salió mal",
    tryCallingUs: "Por favor intenta llamarnos directamente al (360) 610-9233.",
    estimatedPrice: "Precio Estimado",
    highConfidence: "Estimado de alta confianza",
    mediumConfidence: "Confianza media — el precio final puede variar",
    roughEstimate: "Estimado aproximado — llama para cotización exacta",
    items: "Artículos",
    truck: "Camión",
    lbs: "lbs",
    itemsIdentified: "Artículos Identificados",
    editItems: "Editar Artículos",
    addItem: "Agregar artículo",
    removeItem: "Quitar",
    itemsEdited: "¡Artículos actualizados! Tu estimado puede variar según los artículos reales.",
    recalculate: "Recalcular Estimado",
    recalculating: "Recalculando...",
    bookYourPickup: "Reserva Tu Recolección",
    yourDetails: "Tus Datos",
    name: "Nombre *",
    yourName: "Tu nombre",
    phone: "Teléfono *",
    email: "Correo *",
    anythingElse: "¿Algo más que debamos saber?",
    addressPlaceholder: "Dirección, información de acceso, etc.",
    booking: "Reservando...",
    confirmBooking: "Confirmar Reserva",
    bookingConfirmedTitle: "¡Reserva Confirmada!",
    pickupScheduled: "Tu recolección está programada para",
    at: "a las",
    newPhotos: "Nuevas Fotos",
    headsUp: "¡Atención!",
    disclaimer: "Nuestra IA es inteligente, pero no es psíquica. Este estimado es solo para planificación. El precio real depende de lo que encontremos cuando lleguemos — a veces hay más basura escondida. Te daremos el precio real en sitio antes de empezar. Sin sorpresas, lo prometemos.",
    oops: "¡Ups! Algo salió mal",
    tryAgain: "Intentar de Nuevo",
    justCallUs: "Llámanos",
    analyzing: "Analizando",
    usuallyTakes: "Esto usualmente toma 5-10 segundos",
    dropPhotos: "Arrastra fotos aquí o toca para subir",
    takePics: "Toma fotos de tu basura — ¡puedes subir múltiples imágenes!",
    poweredByAI: "Impulsado por IA · Sube múltiples fotos para mejores estimados",
    conditionGood: "Bueno",
    conditionFair: "Regular",
    conditionPoor: "Malo",
    conditionBroken: "Roto",
    loadingMessages: [
      "Consultando los espíritus de la basura...",
      "Examinando tus cosas...",
      "Calculando el nivel de desorden...",
      "Canalizando a Marie Kondo...",
      "Midiendo niveles de caos...",
    ],
  },
};

// Validation schema for booking form
const bookingFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

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

interface JunkAnalyzerProps {
  variant?: "inline" | "compact";
  onAnalysisComplete?: () => void;
  isSpanish?: boolean;
}

export function JunkAnalyzer({ variant = "inline", onAnalysisComplete, isSpanish = false }: JunkAnalyzerProps) {
  const t = isSpanish ? translations.es : translations.en;
  const loadingMessages = t.loadingMessages;
  
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isRestoredFromStorage, setIsRestoredFromStorage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showBingo, setShowBingo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingPhotoUrls, setBookingPhotoUrls] = useState<string[]>([]);
  const [addressData, setAddressData] = useState<AddressData>(getEmptyAddress());
  const [editedItems, setEditedItems] = useState<JunkItem[] | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const { toast } = useToast();
  const { refetchBookings } = useBookingSlots();

  const conditionLabels = {
    good: t.conditionGood,
    fair: t.conditionFair,
    poor: t.conditionPoor,
    broken: t.conditionBroken,
  };

  // Restore saved estimate and images from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('junk-estimate');
    if (saved) {
      try {
        const { result: savedResult, images: savedImages, timestamp } = JSON.parse(saved);
        // Check if not expired (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          if (savedResult) {
            setResult(savedResult);
          }
          if (savedImages && Array.isArray(savedImages) && savedImages.length > 0) {
            setImagePreviews(savedImages);
          }
        } else {
          localStorage.removeItem('junk-estimate');
        }
      } catch (e) {
        localStorage.removeItem('junk-estimate');
      }
    }
    // Mark restoration as complete so save effect can run
    setIsRestoredFromStorage(true);
  }, []);

  // Save estimate and images to localStorage when they change
  // Only run after restoration is complete to avoid overwriting saved data
  useEffect(() => {
    if (!isRestoredFromStorage) return;
    
    // Save if we have either a result or images
    if (result || imagePreviews.length > 0) {
      const saveToStorage = async () => {
        try {
          // Compress images before storing to avoid quota issues
          const compressedImages = imagePreviews.length > 0 
            ? await compressImagesForStorage(imagePreviews) 
            : [];
          
          localStorage.setItem('junk-estimate', JSON.stringify({
            result: result,
            images: compressedImages,
            timestamp: Date.now()
          }));
        } catch (e) {
          // If storage fails (quota exceeded), try saving without images
          console.warn('Could not save with images, trying without:', e);
          try {
            localStorage.setItem('junk-estimate', JSON.stringify({
              result,
              images: [],
              timestamp: Date.now()
            }));
          } catch (e2) {
            console.warn('Could not save estimate to localStorage:', e2);
          }
        }
      };
      saveToStorage();
    }
  }, [result, imagePreviews, isRestoredFromStorage]);

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith("image/")) {
        toast({
          title: t.invalidFileType,
          description: `${file.name} ${t.notAnImage}`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t.fileTooLarge,
          description: `${file.name} ${t.largerThan10MB}`,
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
      
      // Track AI estimator usage in GA
      trackAIEstimatorUse();
      
      // Show confetti celebration!
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show Bingo modal after successful analysis (only once per session)
      if (!wasBingoShownForEstimate()) {
        setTimeout(() => {
          setShowBingo(true);
          markBingoShown();
        }, 1000);
      }
      
      onAnalysisComplete?.();
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image");
      toast({
        title: t.analysisFailed,
        description: t.dontWorryCall,
        variant: "destructive",
      });
    } finally {
      clearInterval(messageInterval);
      setIsAnalyzing(false);
    }
  }, [toast, onAnalysisComplete, loadingMessages, t]);

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

  // Add more photos to existing set (for revising estimate)
  const addMorePhotos = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) continue;
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Add new previews to existing ones
    for (const file of validFiles) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      setImagePreviews(prev => [...prev, base64]);
    }
  }, []);

  // Re-analyze with current photos
  const reanalyze = useCallback(async () => {
    if (imagePreviews.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2000);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-junk", {
        body: { 
          imageBase64: imagePreviews[0],
          totalImages: imagePreviews.length 
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setResult(data);
      trackAIEstimatorUse();
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image");
      toast({
        title: t.analysisFailed,
        description: t.dontWorryCall,
        variant: "destructive",
      });
    } finally {
      clearInterval(messageInterval);
      setIsAnalyzing(false);
    }
  }, [imagePreviews, loadingMessages, t, toast]);

  const reset = () => {
    localStorage.removeItem('junk-estimate');
    resetBingoShown();
    setImagePreviews([]);
    setResult(null);
    setError(null);
    setRequestSubmitted(false);
    setSelectedDate(undefined);
    setSelectedTime("");
    setBookingPhotoUrls([]);
    setAddressData(getEmptyAddress());
    setEditedItems(null);
    setIsEditingItems(false);
  };

  // Recalculate estimate with edited items
  const recalculateEstimate = useCallback(async () => {
    if (!editedItems || editedItems.length === 0) return;
    
    setIsRecalculating(true);
    setIsEditingItems(false);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-junk", {
        body: { recalculateItems: editedItems },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      // Update result with recalculated estimate, keeping edited items
      setResult(data);
      setEditedItems(data.items);
      
      toast({
        title: "Estimate Updated",
        description: "Your estimate has been recalculated based on the updated items.",
      });
    } catch (err) {
      console.error("Recalculation error:", err);
      toast({
        title: t.somethingWentWrong,
        description: t.tryCallingUs,
        variant: "destructive",
      });
    } finally {
      setIsRecalculating(false);
    }
  }, [editedItems, toast, t]);

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
        title: t.selectDateTime,
        description: t.chooseWhen,
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = bookingFormSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: t.invalidInput,
        description: firstError.message,
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
      const formattedAddress = formatAddressForStorage(addressData);
      const { error: bookingError } = await supabase.from("bookings").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: formattedAddress || null,
        message: estimateDetails,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        booking_time: selectedTime,
        status: "pending",
      });

      if (bookingError) {
        // Handle unique constraint violation (double booking)
        if (bookingError.code === "23505") {
          toast({
            title: t.timeSlotUnavailable,
            description: t.someoneJustBooked,
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
          address: formattedAddress || undefined,
          message: estimateDetails,
          isBooking: true,
          bookingDate: format(selectedDate, "EEEE, MMMM d, yyyy", { locale: isSpanish ? es : undefined }),
          bookingTime: selectedTime,
          photoUrls: bookingPhotoUrls.length > 0 ? bookingPhotoUrls : undefined,
        },
      });

      setRequestSubmitted(true);
      
      // Track successful AI estimator booking in GA
      const priceRange = result ? `$${result.priceEstimate.min}-$${result.priceEstimate.max}` : 'unknown';
      trackAIEstimatorBooking(priceRange);
      trackBookingSubmit(format(selectedDate, "yyyy-MM-dd"), selectedTime);
      
      toast({
        title: t.bookingConfirmed,
        description: t.checkEmail,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: t.somethingWentWrong,
        description: t.tryCallingUs,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const confidenceColors = {
    low: "text-warning",
    medium: "text-primary",
    high: "text-success",
  };

  // Results view
  if (result) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 relative">
        {/* Confetti celebration */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-[confetti_3s_ease-out_forwards]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"][Math.floor(Math.random() * 6)],
                  width: `${8 + Math.random() * 10}px`,
                  height: `${8 + Math.random() * 10}px`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "0",
                }}
              />
            ))}
          </div>
        )}
        {/* Image previews with add/remove capability */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-charcoal text-sm">Your Photos ({imagePreviews.length})</h4>
            <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4 mr-1" />
              Start Over
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden group">
                <img src={preview} alt={`Junk ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {/* Add more photos button */}
            <label className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    addMorePhotos(e.target.files);
                  }
                }}
                className="sr-only"
              />
              <Plus className="h-5 w-5 text-muted-foreground" />
            </label>
          </div>
          {imagePreviews.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reanalyze} 
              disabled={isAnalyzing}
              className="mt-3 w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Re-analyze Photos
                </>
              )}
            </Button>
          )}
        </div>

        {/* Price estimate - hero display */}
        <div className="p-6 rounded-xl bg-primary/10 border-2 border-primary/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t.estimatedPrice}</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold text-primary">
            ${result.priceEstimate.min} - ${result.priceEstimate.max}
          </div>
          <p className={`text-sm mt-2 ${confidenceColors[result.confidence]}`}>
            {result.confidence === "high" ? t.highConfidence : 
             result.confidence === "medium" ? t.mediumConfidence :
             t.roughEstimate}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Package className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.items.length}</div>
            <div className="text-xs text-muted-foreground">{t.items}</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Truck className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.estimatedVolume.truckPercentage}%</div>
            <div className="text-xs text-muted-foreground">{t.truck}</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Scale className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.estimatedWeight.value}</div>
            <div className="text-xs text-muted-foreground">{t.lbs}</div>
          </div>
        </div>

        {/* Items list - Editable */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-charcoal flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t.itemsIdentified}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!isEditingItems) {
                  setEditedItems(editedItems || [...result.items]);
                }
                setIsEditingItems(!isEditingItems);
              }}
              className="text-xs text-primary hover:text-primary/80"
            >
              {isEditingItems ? <CheckCircle2 className="h-3 w-3 mr-1" /> : null}
              {isEditingItems ? "Done" : t.editItems}
            </Button>
          </div>
          
          {isEditingItems && editedItems ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {editedItems.map((item, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm flex items-center gap-2 group"
                  >
                    {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.name}
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = editedItems.filter((_, index) => index !== i);
                        setEditedItems(newItems);
                      }}
                      className="text-destructive hover:text-destructive/80 opacity-70 group-hover:opacity-100 transition-opacity"
                      aria-label={t.removeItem}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Add new item */}
              <div className="flex gap-2 mt-3">
                <Input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={t.addItem}
                  className="flex-1 h-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newItemName.trim()) {
                      e.preventDefault();
                      setEditedItems([...editedItems, { name: newItemName.trim(), quantity: 1, condition: "fair" }]);
                      setNewItemName("");
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (newItemName.trim()) {
                      setEditedItems([...editedItems, { name: newItemName.trim(), quantity: 1, condition: "fair" }]);
                      setNewItemName("");
                    }
                  }}
                  disabled={!newItemName.trim()}
                  className="h-9"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Recalculate button and message */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  size="sm"
                  onClick={recalculateEstimate}
                  disabled={isRecalculating || editedItems.length === 0}
                  className="min-h-[44px] px-4"
                >
                  {isRecalculating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t.recalculating}
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t.recalculate}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground italic">
                  {t.itemsEdited}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(editedItems || result.items).map((item, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                >
                  {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.name}
                  <span className="text-muted-foreground ml-1">({conditionLabels[item.condition]})</span>
                </span>
              ))}
            </div>
          )}
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
              {t.bookYourPickup}
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
                <h4 className="font-medium text-charcoal mb-3">{t.yourDetails}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t.name}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder={t.yourName}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.phone}</Label>
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
                  <Label htmlFor="email">{t.email}</Label>
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
                
                {/* Address Input */}
                <div className="mt-4 border-t border-border pt-4">
                  <AddressInput
                    value={addressData}
                    onChange={setAddressData}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="notes">{t.anythingElse}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="Access info, special instructions, etc."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                
                {/* Photo Upload */}
                <div className="mt-4">
                  <BookingPhotoUpload
                    onPhotosChange={setBookingPhotoUrls}
                    maxPhotos={10}
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
                    {t.booking}
                  </>
                ) : (
                  <>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {t.confirmBooking}
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-success/10 border-2 border-success/30 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-3" />
            <h3 className="font-semibold text-charcoal text-lg mb-2">{t.bookingConfirmedTitle}</h3>
            <p className="text-muted-foreground">
              {t.pickupScheduled}{" "}
              <strong className="text-foreground">
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy", { locale: isSpanish ? es : undefined })} {t.at} {selectedTime}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t.checkEmail}
            </p>
          </div>
        )}

        {/* Junk Bingo Modal - shows after estimate */}
        <JunkBingoModal
          open={showBingo}
          onOpenChange={setShowBingo}
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
            <strong>{t.headsUp}</strong> {t.disclaimer}
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
          <h3 className="font-semibold text-charcoal mb-1">{t.oops}</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>{t.tryAgain}</Button>
          <Button asChild variant="outline">
            <a href="tel:+13606109233">
              <Phone className="mr-2 h-4 w-4" />
              {t.justCallUs}
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
                <img src={preview} alt={`${t.analyzing} ${index + 1}`} className="w-full h-full object-cover" />
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
        <p className="text-muted-foreground text-sm">{t.usuallyTakes}</p>
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
            : "border-border"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          id="junk-upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        />
        
        {/* Visible clickable button for better mobile support */}
        <Button
          type="button"
          variant="ghost"
          className="w-full h-full min-h-[180px] sm:min-h-[160px] flex flex-col items-center justify-center gap-4 sm:gap-5 hover:bg-section-alt px-4 sm:px-6 py-6 sm:py-8 active:scale-[0.98] transition-transform"
          onClick={() => {
            const input = document.getElementById('junk-upload-input') as HTMLInputElement;
            if (input) input.click();
          }}
        >
          <div className="flex justify-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:gap-1.5 text-center px-2 sm:px-4 mx-auto w-full max-w-[220px] sm:max-w-xs">
            <p className="font-semibold text-charcoal text-base leading-snug whitespace-normal">
              {t.dropPhotos}
            </p>
            <p className="text-sm text-muted-foreground font-normal leading-relaxed whitespace-normal">
              {t.takePics}
            </p>
          </div>
        </Button>
      </div>

      <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>{t.poweredByAI}</span>
      </div>
    </div>
  );
}
