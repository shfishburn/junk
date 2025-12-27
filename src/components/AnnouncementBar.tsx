import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib";

const ANNOUNCEMENT_DISMISSED_KEY = "junky-gurus-announcement-dismissed";
const ANNOUNCEMENT_VERSION = "v1"; // Change this to show announcement again after updates

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this version of the announcement
    try {
      const dismissed = localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY);
      if (dismissed !== ANNOUNCEMENT_VERSION) {
        setIsVisible(true);
      }
    } catch {
      // If localStorage fails, show the announcement
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, ANNOUNCEMENT_VERSION);
      // Dispatch event for Layout to update padding
      window.dispatchEvent(new CustomEvent('announcementDismissed'));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground",
        "transition-all duration-300"
      )}
      style={{ height: 'var(--announcement-bar-height, 2.5rem)' }}
      role="banner"
      aria-label="Announcement"
    >
      <div className="container h-full flex items-center justify-center gap-2 px-4">
        <Zap className="h-4 w-4 flex-shrink-0 animate-pulse" aria-hidden="true" />
        <p className="text-sm font-medium truncate">
          <span className="hidden sm:inline">🎉 </span>
          Same-day pickups available!
          <Link 
            to="/book" 
            className="ml-2 underline underline-offset-2 hover:no-underline font-semibold"
          >
            Book now
          </Link>
        </p>
        <button
          onClick={handleDismiss}
          className="ml-auto p-1 rounded-md hover:bg-primary-foreground/20 transition-colors flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
