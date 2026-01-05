import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Sparkles, Clock } from "lucide-react";

const ANNOUNCEMENT_DISMISSED_KEY = "junky-gurus-announcement-dismissed";
const ANNOUNCEMENT_VERSION = "v1";

export function HeroSection() {
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY);
      setAnnouncementVisible(dismissed !== ANNOUNCEMENT_VERSION);
    } catch {
      setAnnouncementVisible(true);
    }
    
    const handleDismiss = () => setAnnouncementVisible(false);
    window.addEventListener('announcementDismissed', handleDismiss);
    return () => window.removeEventListener('announcementDismissed', handleDismiss);
  }, []);

  // Calculate the total header area height
  const totalHeaderHeight = announcementVisible 
    ? 'calc(var(--header-height-expanded) + var(--announcement-bar-height))'
    : 'var(--header-height-expanded)';

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url("/lovable-uploads/1a609a72-5d33-4187-a5ca-c308b7fc5c42.jpg")',
        // Pull hero up behind the fixed header so background fills viewport top
        marginTop: `calc(-1 * ${totalHeaderHeight})`,
        // Add padding so content stays visible below header
        paddingTop: `calc(${totalHeaderHeight} + 4rem)`,
        paddingBottom: '4rem',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-overlay/60" />

      <div className="container max-w-6xl relative z-10">
        <div className="max-w-3xl mx-auto text-center lg:max-w-4xl">
          {/* Urgency Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium mb-6 animate-fade-in"
          >
            <Clock className="h-4 w-4" />
            Same-Day Service Available
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-on-primary mb-4 sm:mb-5 leading-tight animate-fade-in px-2 sm:px-0">
            We Love Your Junk (So You Don't Have To)
          </h1>
          <p
            className="text-base sm:text-lg md:text-lg text-on-primary font-medium mb-3 sm:mb-4 leading-relaxed animate-fade-in px-4 sm:px-0"
            style={{
              animationDelay: "0.05s",
            }}
          >
            Real pricing upfront. Reliable scheduling. Responsible disposal. From a local team that actually shows up.
          </p>
          <p
            className="text-base sm:text-lg md:text-xl text-on-primary-muted mb-6 sm:mb-8 leading-relaxed animate-fade-in px-4 sm:px-0"
            style={{
              animationDelay: "0.1s",
            }}
          >
            That old couch mocking you from the garage? That exercise bike
            turned clothes hanger? We'll make it disappear faster than your
            motivation to use it.
          </p>
          <div
            className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center animate-fade-in px-4 sm:px-0"
            style={{
              animationDelay: "0.2s",
            }}
          >
            <Button asChild size="lg" className="w-full sm:w-auto text-base shadow-lg hover:shadow-xl min-h-[48px]">
              <Link to="/book">
                Book Pickup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="invert" className="w-full sm:w-auto text-base min-h-[48px]">
              <Link to="/ai-estimator">
                <Sparkles className="mr-2 h-4 w-4" />
                Know Your Price First
              </Link>
            </Button>
            <Button asChild variant="hero" size="lg" className="w-full sm:w-auto text-base min-h-[48px]">
              <a href="tel:+13606109233">
                <Phone className="mr-2 h-4 w-4" />
                (360) 610-9233
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}