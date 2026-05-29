import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, Settings } from "lucide-react";
import { 
  cn,
  hasConsentBeenGiven, 
  acceptAllCookies, 
  acceptEssentialOnly 
} from "@/lib";
import { CookiePreferencesModal } from "./CookiePreferencesModal";

const translations = {
  en: {
    title: "We use cookies to haul away a better experience!",
    description: "Essential cookies keep things running smoothly. Analytics cookies help us understand how to serve you better. No junk here!",
    learnMore: "Read our privacy policy",
    essentialOnly: "Essential Only",
    customize: "Customize",
    acceptAll: "Accept All",
  },
  es: {
    title: "¡Usamos cookies para una mejor experiencia!",
    description: "Las cookies esenciales mantienen todo funcionando. Las cookies de análisis nos ayudan a servirle mejor. ¡Sin basura aquí!",
    learnMore: "Lee nuestra política de privacidad",
    essentialOnly: "Solo Esenciales",
    customize: "Personalizar",
    acceptAll: "Aceptar Todo",
  },
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const location = useLocation();
  
  const isSpanish = location.pathname === "/espanol";
  const t = isSpanish ? translations.es : translations.en;

  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      if (!hasConsentBeenGiven()) {
        setIsVisible(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    handleClose();
  };

  const handleEssentialOnly = () => {
    acceptEssentialOnly();
    handleClose();
  };

  const handleCustomize = () => {
    setIsModalOpen(true);
  };

  const handleModalSave = () => {
    handleClose();
  };

  // Also expose a way to reopen via global event
  useEffect(() => {
    const handleOpenPreferences = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('openCookiePreferences', handleOpenPreferences);
    return () => {
      window.removeEventListener('openCookiePreferences', handleOpenPreferences);
    };
  }, []);

  if (!isVisible && !isModalOpen) return null;

  return (
    <>
      {isVisible && (
        <div 
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6",
            "transition-transform duration-300 ease-out",
            isAnimatingOut ? "translate-y-full" : "translate-y-0 animate-in slide-in-from-bottom"
          )}
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {/* Icon and Text */}
              <div className="flex gap-3 flex-1">
                <Cookie className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {t.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.description}{" "}
                    <a 
                      href="/privacy-policy" 
                      className="text-primary hover:underline"
                    >
                      {t.learnMore}
                    </a>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEssentialOnly}
                  className="text-sm"
                >
                  {t.essentialOnly}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomize}
                  className="text-sm gap-1"
                >
                  <Settings className="h-4 w-4" />
                  {t.customize}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-sm shadow-sm"
                >
                  {t.acceptAll}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CookiePreferencesModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSave={handleModalSave}
      />
    </>
  );
}

// Helper function to open preferences modal from anywhere
export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent('openCookiePreferences'));
}
