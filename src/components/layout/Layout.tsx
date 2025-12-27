import { ReactNode, useState, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CookieConsent, AIAssistant, ExitIntentPopup } from "@/components/features";
import { PageTransition } from "@/components/shared";
import { useGoogleAnalytics, useExitIntent } from "@/hooks";

const ANNOUNCEMENT_DISMISSED_KEY = "junky-gurus-announcement-dismissed";
const ANNOUNCEMENT_VERSION = "v1";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Initialize Google Analytics (respects cookie consent)
  useGoogleAnalytics();
  
  // Exit intent popup for first-time visitors
  const { showPopup, closePopup } = useExitIntent();
  
  // Track if announcement bar is visible for layout adjustments
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY);
      setAnnouncementVisible(dismissed !== ANNOUNCEMENT_VERSION);
    } catch {
      setAnnouncementVisible(true);
    }
    
    // Listen for dismissal
    const handleStorage = () => {
      try {
        const dismissed = localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY);
        setAnnouncementVisible(dismissed !== ANNOUNCEMENT_VERSION);
      } catch {
        // Keep current state
      }
    };
    
    window.addEventListener('storage', handleStorage);
    
    // Custom event for same-tab updates
    const handleDismiss = () => setAnnouncementVisible(false);
    window.addEventListener('announcementDismissed', handleDismiss);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('announcementDismissed', handleDismiss);
    };
  }, []);

  // Calculate total top offset
  const topOffset = announcementVisible 
    ? 'calc(var(--header-height-expanded) + var(--announcement-bar-height))'
    : 'var(--header-height-expanded)';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <AnnouncementBar />
      <Header announcementVisible={announcementVisible} />
      <main id="main-content" className="flex-1 relative" style={{ paddingTop: topOffset }} tabIndex={-1}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <CookieConsent />
      <AIAssistant />
      <ExitIntentPopup open={showPopup} onClose={closePopup} />
    </div>
  );
}
