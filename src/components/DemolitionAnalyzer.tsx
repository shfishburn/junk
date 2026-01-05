import { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast, useBookingSlots } from "@/hooks";
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
  AlertTriangle,
  CalendarDays
} from "lucide-react";
import { JunkRouletteModal } from "./JunkRouletteModal";
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
    chooseWhen: "Choose when you'd like us to come for your demolition estimate.",
    timeSlotUnavailable: "Time slot no longer available",
    someoneJustBooked: "Someone just booked this slot. Please select another time.",
    bookingConfirmed: "Booking confirmed!",
    checkEmail: "Check your email for confirmation details.",
    somethingWentWrong: "Something went wrong",
    tryCallingUs: "Please try calling us directly at (360) 610-9233.",
    estimatedTotal: "Estimated Total",
    highConfidence: "High confidence estimate",
    mediumConfidence: "Medium confidence — final price may vary",
    roughEstimate: "Rough estimate — call for accurate quote",
    labor: "Labor",
    disposal: "Disposal",
    hours: "Hours",
    crew: "Crew",
    truckLoads: "Truck Loads",
    complexity: "Complexity",
    simple: "Simple",
    moderate: "Moderate",
    complex: "Complex",
    structuresIdentified: "Structures Identified",
    editStructures: "Edit Structures",
    addStructure: "Add structure",
    removeStructure: "Remove",
    structuresEdited: "Structures updated! Your estimate may vary based on actual scope.",
    recalculate: "Recalculate Estimate",
    recalculating: "Recalculating...",
    equipmentNeeded: "Equipment Needed",
    safetyConsiderations: "Safety Considerations",
    bookYourQuote: "Book Your Demolition Quote",
    yourDetails: "Your Details",
    name: "Name *",
    yourName: "Your name",
    phone: "Phone *",
    email: "Email *",
    anythingElse: "Anything else we should know?",
    addressPlaceholder: "Address, accessibility, timeline, etc.",
    booking: "Booking...",
    confirmBooking: "Confirm Booking",
    bookingConfirmedTitle: "Booking Confirmed!",
    quoteScheduled: "Your demolition quote is scheduled for",
    at: "at",
    newPhotos: "New Photos",
    headsUp: "Heads up!",
    disclaimer: "Our AI is smart, but demolition projects can be tricky! This estimate is for planning purposes only. Actual pricing depends on hidden factors like rotten wood, concrete footings, or surprise wasps' nests. We'll give you the real deal with an on-site quote. No surprises, pinky promise.",
    oops: "Oops! Something went wrong",
    tryAgain: "Try Again",
    callForQuote: "Call for Quote",
    uploadTitle: "Upload Demolition Photos",
    dropHere: "Drop your photos here!",
    dragDrop: "Drag & drop or click to upload photos of decks, sheds, fences, etc.",
    fileTypes: "JPG, PNG, or HEIC • Max 10MB per image",
    aiAnalysis: "Our AI will analyze your demolition project and provide an instant estimate. Perfect for decks, sheds, fences, and more!",
    conditionGood: "Good",
    conditionWeathered: "Weathered",
    conditionDamaged: "Damaged",
    conditionRotted: "Rotted",
    loadingMessages: [
      "Sizing up the demolition zone...",
      "Calculating destruction levels...",
      "Consulting the teardown experts...",
      "Measuring the mayhem...",
      "Estimating the rubble...",
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
    chooseWhen: "Elige cuándo te gustaría que lleguemos para tu estimado de demolición.",
    timeSlotUnavailable: "Horario ya no disponible",
    someoneJustBooked: "Alguien acaba de reservar este horario. Por favor selecciona otro.",
    bookingConfirmed: "¡Reserva confirmada!",
    checkEmail: "Revisa tu correo para los detalles de confirmación.",
    somethingWentWrong: "Algo salió mal",
    tryCallingUs: "Por favor intenta llamarnos directamente al (360) 610-9233.",
    estimatedTotal: "Total Estimado",
    highConfidence: "Estimado de alta confianza",
    mediumConfidence: "Confianza media — el precio final puede variar",
    roughEstimate: "Estimado aproximado — llama para cotización exacta",
    labor: "Mano de Obra",
    disposal: "Disposición",
    hours: "Horas",
    crew: "Equipo",
    truckLoads: "Cargas de Camión",
    complexity: "Complejidad",
    simple: "Simple",
    moderate: "Moderado",
    complex: "Complejo",
    structuresIdentified: "Estructuras Identificadas",
    editStructures: "Editar Estructuras",
    addStructure: "Agregar estructura",
    removeStructure: "Quitar",
    structuresEdited: "¡Estructuras actualizadas! Tu estimado puede variar según el alcance real.",
    recalculate: "Recalcular Estimado",
    recalculating: "Recalculando...",
    equipmentNeeded: "Equipo Necesario",
    safetyConsiderations: "Consideraciones de Seguridad",
    bookYourQuote: "Reserva Tu Cotización de Demolición",
    yourDetails: "Tus Datos",
    name: "Nombre *",
    yourName: "Tu nombre",
    phone: "Teléfono *",
    email: "Correo *",
    anythingElse: "¿Algo más que debamos saber?",
    addressPlaceholder: "Dirección, accesibilidad, tiempo, etc.",
    booking: "Reservando...",
    confirmBooking: "Confirmar Reserva",
    bookingConfirmedTitle: "¡Reserva Confirmada!",
    quoteScheduled: "Tu cotización de demolición está programada para",
    at: "a las",
    newPhotos: "Nuevas Fotos",
    headsUp: "¡Atención!",
    disclaimer: "Nuestra IA es inteligente, ¡pero los proyectos de demolición pueden ser complicados! Este estimado es solo para planificación. El precio real depende de factores ocultos como madera podrida, cimientos de concreto o nidos de avispas sorpresa. Te daremos el precio real con una cotización en sitio. Sin sorpresas, lo prometemos.",
    oops: "¡Ups! Algo salió mal",
    tryAgain: "Intentar de Nuevo",
    callForQuote: "Llamar para Cotización",
    uploadTitle: "Subir Fotos de Demolición",
    dropHere: "¡Suelta tus fotos aquí!",
    dragDrop: "Arrastra y suelta o haz clic para subir fotos de terrazas, cobertizos, cercas, etc.",
    fileTypes: "JPG, PNG o HEIC • Máximo 10MB por imagen",
    aiAnalysis: "Nuestra IA analizará tu proyecto de demolición y proporcionará un estimado instantáneo. ¡Perfecto para terrazas, cobertizos, cercas y más!",
    conditionGood: "Bueno",
    conditionWeathered: "Desgastado",
    conditionDamaged: "Dañado",
    conditionRotted: "Podrido",
    loadingMessages: [
      "Evaluando la zona de demolición...",
      "Calculando niveles de destrucción...",
      "Consultando a los expertos...",
      "Midiendo el caos...",
      "Estimando los escombros...",
    ],
  },
};

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

interface DemolitionAnalyzerProps {
  variant?: "inline" | "compact";
  onAnalysisComplete?: () => void;
  isSpanish?: boolean;
}

export function DemolitionAnalyzer({ variant = "inline", onAnalysisComplete, isSpanish = false }: DemolitionAnalyzerProps) {
  const t = isSpanish ? translations.es : translations.en;
  const loadingMessages = t.loadingMessages;

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [result, setResult] = useState<DemolitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingPhotoUrls, setBookingPhotoUrls] = useState<string[]>([]);
  const [addressData, setAddressData] = useState<AddressData>(getEmptyAddress());
  const [editedStructures, setEditedStructures] = useState<DemolitionStructure[] | null>(null);
  const [newStructureName, setNewStructureName] = useState("");
  const [isEditingStructures, setIsEditingStructures] = useState(false);
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
    weathered: t.conditionWeathered,
    damaged: t.conditionDamaged,
    rotted: t.conditionRotted,
  };

  const complexityLabels = {
    simple: t.simple,
    moderate: t.moderate,
    complex: t.complex,
  };

  // Restore saved estimate from localStorage on mount
  // NOTE: We only store the result, NOT images (to avoid localStorage quota issues)
  useEffect(() => {
    const saved = localStorage.getItem('demolition-estimate');
    if (saved) {
      try {
        const { result: savedResult, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setResult(savedResult);
          // Images are not restored - user will need to re-upload if they want to modify
        } else {
          localStorage.removeItem('demolition-estimate');
        }
      } catch (e) {
        localStorage.removeItem('demolition-estimate');
      }
    }
  }, []);

  // Save estimate to localStorage when result changes (without images to avoid quota issues)
  useEffect(() => {
    if (result) {
      try {
        localStorage.setItem('demolition-estimate', JSON.stringify({
          result,
          timestamp: Date.now()
        }));
      } catch (e) {
        // If storage fails, just continue without persistence
        console.warn('Could not save estimate to localStorage:', e);
      }
    }
  }, [result]);

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
      const { data, error: fnError } = await supabase.functions.invoke("analyze-demolition", {
        body: { 
          imageBase64: imagePreviews[0],
          totalImages: imagePreviews.length 
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setResult(data);
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

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    localStorage.removeItem('demolition-estimate');
    setImagePreviews([]);
    setResult(null);
    setError(null);
    setRequestSubmitted(false);
    setSelectedDate(undefined);
    setSelectedTime("");
    setBookingPhotoUrls([]);
    setAddressData(getEmptyAddress());
    setFormData({ name: "", email: "", phone: "", notes: "" });
    setEditedStructures(null);
    setIsEditingStructures(false);
  };

  // Recalculate estimate with edited structures
  const recalculateEstimate = useCallback(async () => {
    if (!editedStructures || editedStructures.length === 0) return;
    
    setIsRecalculating(true);
    setIsEditingStructures(false);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-demolition", {
        body: { recalculateStructures: editedStructures },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      // Update result with recalculated estimate
      setResult(data);
      setEditedStructures(data.structures);
      
      toast({
        title: "Estimate Updated",
        description: "Your estimate has been recalculated based on the updated structures.",
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
  }, [editedStructures, toast, t]);

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
      toast({
        title: t.bookingConfirmed,
        description: t.checkEmail,
      });
      
      setShowRoulette(true);
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

  const complexityColors = {
    simple: "bg-success/10 text-success",
    moderate: "bg-warning/10 text-warning",
    complex: "bg-destructive/10 text-destructive",
  };

  // Results view
  if (result) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
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
                <img src={preview} alt={`Demolition ${index + 1}`} className="w-full h-full object-cover" />
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
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t.estimatedTotal}</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold text-primary">
            ${result.priceEstimate.totalMin.toLocaleString()} - ${result.priceEstimate.totalMax.toLocaleString()}
          </div>
          <p className={`text-sm mt-2 ${confidenceColors[result.confidence]}`}>
            {result.confidence === "high" ? t.highConfidence : 
             result.confidence === "medium" ? t.mediumConfidence :
             t.roughEstimate}
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>{t.labor}: ${result.priceEstimate.laborMin}-${result.priceEstimate.laborMax}</span>
            <span>•</span>
            <span>{t.disposal}: ${result.priceEstimate.disposalMin}-${result.priceEstimate.disposalMax}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.scopeOfWork.estimatedHours}</div>
            <div className="text-xs text-muted-foreground">{t.hours}</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.scopeOfWork.crewSize}</div>
            <div className="text-xs text-muted-foreground">{t.crew}</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Truck className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold text-charcoal">{result.debrisEstimate.truckLoads}</div>
            <div className="text-xs text-muted-foreground">{t.truckLoads}</div>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Hammer className="h-5 w-5 mx-auto mb-2 text-primary" />
            <span className={`text-xs px-2 py-1 rounded-full ${complexityColors[result.scopeOfWork.complexity]}`}>
              {complexityLabels[result.scopeOfWork.complexity]}
            </span>
            <div className="text-xs text-muted-foreground mt-1">{t.complexity}</div>
          </div>
        </div>

        {/* Structures list - Editable */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-charcoal flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t.structuresIdentified}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!isEditingStructures) {
                  setEditedStructures(editedStructures || [...result.structures]);
                }
                setIsEditingStructures(!isEditingStructures);
              }}
              className="text-xs text-primary hover:text-primary/80"
            >
              {isEditingStructures ? <CheckCircle2 className="h-3 w-3 mr-1" /> : null}
              {isEditingStructures ? "Done" : t.editStructures}
            </Button>
          </div>
          
          {isEditingStructures && editedStructures ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {editedStructures.map((structure, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-secondary/50 group">
                    <span className="font-medium text-charcoal">{structure.name}</span>
                    <span className="text-sm text-muted-foreground">({structure.material})</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newStructures = editedStructures.filter((_, index) => index !== i);
                        setEditedStructures(newStructures);
                      }}
                      className="text-destructive hover:text-destructive/80 opacity-70 group-hover:opacity-100 transition-opacity ml-auto"
                      aria-label={t.removeStructure}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add new structure */}
              <div className="flex gap-2 mt-3">
                <Input
                  type="text"
                  value={newStructureName}
                  onChange={(e) => setNewStructureName(e.target.value)}
                  placeholder={t.addStructure}
                  className="flex-1 h-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newStructureName.trim()) {
                      e.preventDefault();
                      setEditedStructures([...editedStructures, { 
                        name: newStructureName.trim(), 
                        material: "unknown", 
                        condition: "weathered",
                        estimatedSize: "TBD"
                      }]);
                      setNewStructureName("");
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (newStructureName.trim()) {
                      setEditedStructures([...editedStructures, { 
                        name: newStructureName.trim(), 
                        material: "unknown", 
                        condition: "weathered",
                        estimatedSize: "TBD"
                      }]);
                      setNewStructureName("");
                    }
                  }}
                  disabled={!newStructureName.trim()}
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
                  disabled={isRecalculating || editedStructures.length === 0}
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
                  {t.structuresEdited}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {(editedStructures || result.structures).map((structure, i) => (
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
          )}
        </div>

        {/* Equipment needed */}
        {result.scopeOfWork.equipmentNeeded.length > 0 && (
          <div className="p-4 rounded-lg bg-card border border-border">
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              {t.equipmentNeeded}
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
              {t.safetyConsiderations}
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

        {/* Service Request Form with Booking */}
        {!requestSubmitted ? (
          <div className="p-6 rounded-xl bg-card border-2 border-primary/20">
            <h3 className="font-semibold text-charcoal text-lg mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {t.bookYourQuote}
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
              {t.quoteScheduled}{" "}
              <strong className="text-foreground">
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy", { locale: isSpanish ? es : undefined })} {t.at} {selectedTime}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t.checkEmail}
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
        <h3 className="font-semibold text-charcoal text-lg">{t.oops}</h3>
        <p className="text-muted-foreground">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t.tryAgain}
          </Button>
          <Button asChild variant="outline">
            <a href="tel:+13606109233">
              <Phone className="mr-2 h-4 w-4" />
              {t.callForQuote}
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
          relative p-8 rounded-xl border-2 border-dashed transition-all duration-200
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border"
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          id="demolition-upload-input"
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
          className="w-full h-full min-h-[180px] sm:min-h-[160px] flex flex-col items-center justify-center gap-4 sm:gap-5 hover:bg-secondary/50 px-4 sm:px-6 py-6 sm:py-8 active:scale-[0.98] transition-transform"
          onClick={() => {
            const input = document.getElementById('demolition-upload-input') as HTMLInputElement;
            if (input) input.click();
          }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            {isDragging ? (
              <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse" />
            ) : (
              <Hammer className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:gap-1.5 text-center px-2 sm:px-4 mx-auto w-full max-w-[220px] sm:max-w-xs">
            <h3 className="font-semibold text-charcoal text-base leading-snug whitespace-normal">
              {isDragging ? t.dropHere : t.uploadTitle}
            </h3>
            <p className="text-sm text-muted-foreground font-normal leading-relaxed whitespace-normal">
              {t.dragDrop}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-normal">
            <Camera className="h-4 w-4" />
            <span>{t.fileTypes}</span>
          </div>
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        {t.aiAnalysis}
      </p>
    </div>
  );
}
