import { useState } from "react";
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
import { setConsentPreferences, getConsentPreferences } from "@/lib/cookies";
import { Cookie, BarChart3, Megaphone, Shield } from "lucide-react";

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
            Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            Choose which cookies you'd like to allow. Essential cookies are always 
            active to keep things running smoothly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Essential Cookies - Always On */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label className="font-medium">Essential Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Required for basic site functionality, security, and remembering 
                  your preferences. Can't be turned off.
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
                  Analytics Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors use our site so we can improve 
                  your experience. Includes Google Analytics.
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
                  Marketing Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Used to show you relevant ads and measure campaign effectiveness. 
                  Currently not in use.
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
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
