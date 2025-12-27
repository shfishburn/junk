import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieConsent, AIAssistant, ExitIntentPopup } from "@/components/features";
import { PageTransition } from "@/components/shared";
import { useGoogleAnalytics, useExitIntent } from "@/hooks";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Initialize Google Analytics (respects cookie consent)
  useGoogleAnalytics();
  
  // Exit intent popup for first-time visitors
  const { showPopup, closePopup } = useExitIntent();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 relative pt-20" tabIndex={-1}>
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
