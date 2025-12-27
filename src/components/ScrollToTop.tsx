import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

const HEADER_OFFSET = 80; // Offset for fixed header

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // Handle scroll restoration and top-scroll on route change
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Don't scroll to top if there's a hash (let the hash handler below manage it)
    if (hash) return;
    
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash]);

  // Handle smooth scrolling to anchor links with header offset
  useEffect(() => {
    if (!hash) return;

    const scrollToElement = () => {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - HEADER_OFFSET;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(scrollToElement, 100);
    return () => clearTimeout(timeoutId);
  }, [hash, pathname]);

  // Handle click events on anchor links throughout the page
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      
      const elementId = href.replace('#', '');
      const element = document.getElementById(elementId);
      
      if (element) {
        e.preventDefault();
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - HEADER_OFFSET;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL without triggering navigation
        window.history.pushState(null, '', href);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return null;
}
