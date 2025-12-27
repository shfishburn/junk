import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { hasSeenExitPopup } from "@/lib";

interface UseExitIntentOptions {
  delayMs?: number;
  excludePaths?: string[];
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const { delayMs = 5000, excludePaths = ['/book', '/admin'] } = options;
  const [showPopup, setShowPopup] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  const isExcludedPath = excludePaths.some(path => 
    location.pathname.startsWith(path)
  );

  const triggerPopup = useCallback(() => {
    if (isReady && !hasSeenExitPopup() && !isExcludedPath) {
      setShowPopup(true);
    }
  }, [isReady, isExcludedPath]);

  const closePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  useEffect(() => {
    // Don't set up listeners if already seen or on excluded path
    if (hasSeenExitPopup() || isExcludedPath) return;

    // Wait for engagement time before activating
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, delayMs);

    return () => clearTimeout(readyTimer);
  }, [delayMs, isExcludedPath]);

  useEffect(() => {
    if (!isReady || hasSeenExitPopup() || isExcludedPath) return;

    // Desktop: detect mouse leaving viewport at top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerPopup();
      }
    };

    // Mobile: detect back button or rapid scroll up
    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY < 100) {
        scrollUpCount++;
        if (scrollUpCount >= 3) {
          triggerPopup();
        }
      } else {
        scrollUpCount = 0;
      }
      lastScrollY = currentScrollY;
    };

    // Add listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReady, isExcludedPath, triggerPopup]);

  return { showPopup, closePopup };
}
