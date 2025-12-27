import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { setConsentPreferences, getConsentPreferences } from "@/lib";
import { Cookie, BarChart3, Megaphone, Shield } from "lucide-react";

const translations = {
  en: {
    title: "Cookie Preferences",
    description: "Choose which cookies you'd like to allow. Essential cookies are always active to keep things running smoothly.",
    essential: "Essential Cookies",
    essentialDesc: "Required for basic site functionality, security, and remembering your preferences. Can't be turned off.",
    analytics: "Analytics Cookies",
    analyticsDesc: "Help us understand how visitors use our site so we can improve your experience. Includes Google Analytics.",
    marketing: "Marketing Cookies",
    marketingDesc: "Used to show you relevant ads and measure campaign effectiveness. Currently not in use.",
    cancel: "Cancel",
    save: "Save Preferences",
  },
  es: {
    title: "Preferencias de Cookies",
    description: "Elija qué cookies desea permitir. Las cookies esenciales siempre están activas para que todo funcione correctamente.",
    essential: "Cookies Esenciales",
    essentialDesc: "Necesarias para la funcionalidad básica del sitio, seguridad y recordar sus preferencias. No se pueden desactivar.",
    analytics: "Cookies de Análisis",
    analyticsDesc: "Nos ayudan a entender cómo los visitantes usan nuestro sitio para mejorar su experiencia. Incluye Google Analytics.",
    marketing: "Cookies de Marketing",
    marketingDesc: "Se usan para mostrarle anuncios relevantes y medir la efectividad de campañas. Actualmente no están en uso.",
    cancel: "Cancelar",
    save: "Guardar Preferencias",
  },
};

interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export function CookiePreferencesModal({ 
  open, 
  onOpenChange,
  onSave 
}: CookiePreferencesModalProps) {
  const location = useLocation();
  const isSpanish = location.pathname === "/espanol";
  const t = isSpanish ? translations.es : translations.en;

  const existingPrefs = getConsentPreferences();
  
  const [analytics, setAnalytics] = useState(existingPrefs?.analytics ?? false);
  const [marketing, setMarketing] = useState(existingPrefs?.marketing ?? false);

  const handleSave = () => {
    setConsentPreferences({ analytics, marketing });
    onOpenChange(false);
    onSave?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Essential Cookies - Always On */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label className="font-medium">{t.essential}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.essentialDesc}
                </p>
              </div>
            </div>
            <Switch checked disabled className="opacity-70" />
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label htmlFor="analytics" className="font-medium">
                  {t.analytics}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t.analyticsDesc}
                </p>
              </div>
            </div>
            <Switch 
              id="analytics"
              checked={analytics} 
              onCheckedChange={setAnalytics}
            />
          </div>

          {/* Marketing Cookies */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <Megaphone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label htmlFor="marketing" className="font-medium">
                  {t.marketing}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t.marketingDesc}
                </p>
              </div>
            </div>
            <Switch 
              id="marketing"
              checked={marketing} 
              onCheckedChange={setMarketing}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
