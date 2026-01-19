import { useState, useEffect } from "react";
import { X, Zap, Leaf, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib";
import type { LucideIcon } from "lucide-react";

const ANNOUNCEMENT_DISMISSED_KEY = "junky-gurus-announcement-dismissed";
const ANNOUNCEMENT_VERSION = "v1"; // Change this to show announcement again after updates

interface Announcement {
  icon: LucideIcon;
  emoji: string;
  message: string;
  linkText: string;
  linkTo: string;
}

const announcements: Announcement[] = [
  {
    icon: Clock,
    emoji: "🎉",
    message: "Same-day pickups available!",
    linkText: "Book now",
    linkTo: "/book",
  },
  {
    icon: Leaf,
    emoji: "🌱",
    message: "Eco-friendly disposal — we recycle & donate!",
    linkText: "Learn more",
    linkTo: "/about",
  },
  {
    icon: Zap,
    emoji: "⚡",
    message: "Free estimates in minutes!",
    linkText: "Try it",
    linkTo: "/ai-estimator",
  },
];

const ROTATE_INTERVAL = 4000; // 4 seconds

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Rotate announcements
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
        setIsAnimating(false);
      }, 300); // Half of animation duration
    }, ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isVisible]);

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

  const current = announcements[currentIndex];
  const IconComponent = current.icon;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground",
        "transition-all duration-300"
      )}
      style={{ height: 'var(--announcement-bar-height, 2.5rem)' }}
      role="banner"
      aria-label="Announcement"
      aria-live="polite"
    >
      <div className="container h-full flex items-center justify-center gap-2 px-4">
        <IconComponent 
          className={cn(
            "h-4 w-4 flex-shrink-0 transition-all duration-300",
            isAnimating ? "opacity-0 scale-75" : "opacity-100 scale-100"
          )} 
          aria-hidden="true" 
        />
        <p 
          className={cn(
            "text-sm font-medium truncate transition-all duration-300",
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          <span className="hidden sm:inline">{current.emoji} </span>
          {current.message}
          <Link 
            to={current.linkTo} 
            className="ml-2 underline underline-offset-2 hover:no-underline font-semibold"
          >
            {current.linkText}
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
