import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { AIAssistant } from "@/components/AIAssistant";
import { PageTransition } from "@/components/PageTransition";
import { useGoogleAnalytics } from "@/hooks/use-google-analytics";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Initialize Google Analytics (respects cookie consent)
  useGoogleAnalytics();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <CookieConsent />
      <AIAssistant />
    </div>
  );
}
