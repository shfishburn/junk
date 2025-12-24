export type CookieCategory = 'essential' | 'analytics' | 'marketing';

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'junky-gurus-cookie-consent';

export const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

export function getConsentPreferences(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading cookie preferences:', e);
  }
  return null;
}

export function setConsentPreferences(preferences: Omit<CookiePreferences, 'essential' | 'timestamp'>): void {
  const fullPreferences: CookiePreferences = {
    ...preferences,
    essential: true, // Always enabled
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(fullPreferences));
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: fullPreferences 
    }));
  } catch (e) {
    console.error('Error saving cookie preferences:', e);
  }
}

export function hasConsentBeenGiven(): boolean {
  return getConsentPreferences() !== null;
}

export function isCategoryConsented(category: CookieCategory): boolean {
  const prefs = getConsentPreferences();
  if (!prefs) return category === 'essential';
  return prefs[category];
}

export function acceptAllCookies(): void {
  setConsentPreferences({
    analytics: true,
    marketing: true,
  });
}

export function acceptEssentialOnly(): void {
  setConsentPreferences({
    analytics: false,
    marketing: false,
  });
}

export function resetCookieConsent(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch (e) {
    console.error('Error resetting cookie preferences:', e);
  }
}
