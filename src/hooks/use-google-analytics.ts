import { useEffect } from 'react';
import { isCategoryConsented, CookiePreferences } from '@/lib/cookies';

// Replace with your GA4 Measurement ID when ready
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function injectGAScript(measurementId: string): void {
  if (!measurementId || document.getElementById('ga-script')) return;

  // Create and inject the GA script
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
  });
}

function updateGAConsent(granted: boolean): void {
  if (!window.gtag) return;
  
  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

export function useGoogleAnalytics(): void {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Check initial consent
    const hasAnalyticsConsent = isCategoryConsented('analytics');
    
    if (hasAnalyticsConsent) {
      injectGAScript(GA_MEASUREMENT_ID);
    }

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent<CookiePreferences>) => {
      const { analytics } = event.detail;
      
      if (analytics) {
        injectGAScript(GA_MEASUREMENT_ID);
        updateGAConsent(true);
      } else {
        updateGAConsent(false);
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    };
  }, []);
}
