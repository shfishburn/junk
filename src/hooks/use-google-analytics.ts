import { useEffect } from 'react';
import { isCategoryConsented, type CookiePreferences } from "@/lib";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function updateGAConsent(analyticsGranted: boolean, marketingGranted: boolean): void {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('consent', 'update', {
    'analytics_storage': analyticsGranted ? 'granted' : 'denied',
    'ad_storage': marketingGranted ? 'granted' : 'denied',
    'ad_user_data': marketingGranted ? 'granted' : 'denied',
    'ad_personalization': marketingGranted ? 'granted' : 'denied',
  });
}

export function useGoogleAnalytics(): void {
  useEffect(() => {
    // Check if user has already consented and update GA
    const hasAnalyticsConsent = isCategoryConsented('analytics');
    const hasMarketingConsent = isCategoryConsented('marketing');
    
    if (hasAnalyticsConsent || hasMarketingConsent) {
      updateGAConsent(hasAnalyticsConsent, hasMarketingConsent);
    }

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent<CookiePreferences>) => {
      const { analytics, marketing } = event.detail;
      updateGAConsent(analytics, marketing);
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    };
  }, []);
}
