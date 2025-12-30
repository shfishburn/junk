import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Sparkles, CalendarDays, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib";
import logo from "@/assets/logo.png";

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
];

const serviceLinks = [
  { href: "/services", label: "All Services" },
  { href: "/ai-estimator", label: "AI Instant Quote", icon: Sparkles },
  { href: "/service-area", label: "Service Areas" },
];

const resourceLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/discounts", label: "Discounts & Deals" },
  { href: "/referrals", label: "Referral Program" },
  { href: "/bingo", label: "Junk Bingo Game" },
];

interface HeaderProps {
  announcementVisible?: boolean;
}

export function Header({ announcementVisible = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Initialize with actual scroll position to prevent flash on page refresh
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY > 20;
    }
    return false;
  });
  // Track scroll progress for progressive shadow (0 to 1, capped at 200px scroll)
  const [scrollProgress, setScrollProgress] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.scrollY / 200, 1);
    }
    return 0;
  });
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isSpanish = location.pathname === "/espanol";
  const hasHero = isHome || isSpanish;

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    // Set initial state immediately on mount
    setIsScrolled(window.scrollY > 20);
    setScrollProgress(Math.min(window.scrollY / 200, 1));
    
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrolled = scrollY > 20;
        const progress = Math.min(scrollY / 200, 1);
        
        // Only update state if it actually changed
        setIsScrolled(prev => prev !== scrolled ? scrolled : prev);
        setScrollProgress(progress);
        if (isOpen) closeMenu();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Progressive shadow: starts subtle, intensifies with scroll
  const progressiveShadow = isScrolled 
    ? `0 ${4 + scrollProgress * 8}px ${8 + scrollProgress * 16}px -${2 + scrollProgress * 2}px rgba(0, 0, 0, ${0.05 + scrollProgress * 0.1})`
    : 'none';

  const headerBg = hasHero && !isScrolled
    ? "bg-transparent"
    : "bg-background/95 backdrop-blur-md border-b border-border";

  const textColor = hasHero && !isScrolled
    ? "text-on-primary [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]"
    : "text-foreground";

  const mutedColor = hasHero && !isScrolled
    ? "text-on-primary/90 [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]"
    : "text-muted-foreground";

  // Calculate header top position based on announcement bar
  const headerTop = announcementVisible ? 'var(--announcement-bar-height)' : '0';

  return (
    <header 
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        headerBg
      )}
      style={{ 
        top: headerTop,
        boxShadow: progressiveShadow 
      }}
    >
      <div 
        className="container flex items-center justify-between transition-all duration-300"
        style={{ height: isScrolled ? 'var(--header-height-collapsed)' : 'var(--header-height-expanded)' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <img 
            src={logo} 
            alt="Junky Gurus LLC" 
            className={cn(
              "w-auto transition-all duration-300",
              isScrolled ? "h-10" : "h-14",
              hasHero && !isScrolled && "drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNavLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const isHeroMode = hasHero && !isScrolled;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? isHeroMode
                      ? "text-on-primary bg-on-primary/20 [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]"
                      : "text-primary bg-primary/10"
                    : cn(mutedColor, "hover:text-primary hover:bg-primary/5")
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
              mutedColor, "hover:text-primary hover:bg-primary/5"
            )}>
              Tools
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 bg-background border border-border shadow-lg z-50">
              {serviceLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {link.icon && <link.icon className="h-4 w-4 text-primary" />}
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
              mutedColor, "hover:text-primary hover:bg-primary/5"
            )}>
              More
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 bg-background border border-border shadow-lg z-50">
              {resourceLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link to={link.href} className="cursor-pointer">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/contact"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              mutedColor, "hover:text-primary hover:bg-primary/5"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {isSpanish ? (
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md",
                mutedColor, "hover:text-primary hover:bg-primary/5"
              )}
              title="View in English"
            >
              <span aria-hidden="true">🇺🇸</span>
              <span className="hidden xl:inline">English</span>
            </Link>
          ) : (
            <Link
              to="/espanol"
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md",
                mutedColor, "hover:text-primary hover:bg-primary/5"
              )}
              title="Servicio disponible en español"
            >
              <span aria-hidden="true">🇲🇽</span>
              <span className="hidden xl:inline">Español</span>
            </Link>
          )}
          
          <a 
            href="tel:+13606109233" 
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-full",
              hasHero && !isScrolled 
                ? "text-on-primary bg-on-primary/10 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                : "text-muted-foreground hover:text-primary"
            )}
            aria-label="Call us at (360) 610-9233"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xl:inline">(360) 610-9233</span>
            <span className="xl:hidden sr-only">(360) 610-9233</span>
          </a>

          <Button 
            asChild 
            size="sm" 
            className={cn(
              "gap-2 transition-all duration-300",
              hasHero && !isScrolled && "shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)]"
            )}
          >
            <Link to="/book">
              <CalendarDays className="h-4 w-4" />
              Book Now
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            "lg:hidden p-2 -mr-2 rounded-md transition-colors",
            textColor, "hover:bg-primary/10"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <div 
        id="mobile-menu"
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-all duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{
          top: isScrolled ? 'var(--header-height-collapsed)' : 'var(--header-height-expanded)'
        }}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-overlay/50 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
        
        <nav 
          className={cn(
            "absolute top-0 right-0 w-80 max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 overflow-y-auto",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
          style={{
            height: isScrolled ? 'calc(100vh - var(--header-height-collapsed))' : 'calc(100vh - var(--header-height-expanded))'
          }}
          aria-label="Mobile navigation"
        >
          <div className="p-6 flex flex-col gap-1">
            {/* Main Links */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Navigation
            </p>
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className={cn(
                  "py-3 px-4 text-base font-medium rounded-lg transition-colors",
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={closeMenu}
              className={cn(
                "py-3 px-4 text-base font-medium rounded-lg transition-colors",
                location.pathname === "/contact"
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:bg-muted"
              )}
            >
              Contact
            </Link>

            {/* Tools Section */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-2">
              Tools
            </p>
            {serviceLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className="py-3 px-4 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
              >
                {link.icon && <link.icon className="h-4 w-4 text-primary" />}
                {link.label}
              </Link>
            ))}

            {/* Resources Section */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-2">
              Resources
            </p>
            {resourceLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className="py-3 px-4 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Link */}
            {isSpanish ? (
              <Link
                to="/"
                onClick={closeMenu}
                className="py-3 px-4 text-base font-medium text-primary bg-primary/10 rounded-lg mt-6 flex items-center gap-2"
              >
                <span aria-hidden="true">🇺🇸</span>
                View in English
              </Link>
            ) : (
              <Link
                to="/espanol"
                onClick={closeMenu}
                className="py-3 px-4 text-base font-medium text-primary bg-primary/10 rounded-lg mt-6 flex items-center gap-2"
              >
                <span aria-hidden="true">🇲🇽</span>
                ¿Hablas español?
              </Link>
            )}

            {/* CTAs */}
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <a
                href="tel:+13606109233"
                className="flex items-center justify-center gap-2 py-3 px-4 text-base font-medium text-foreground bg-muted rounded-lg"
              >
                <Phone className="h-4 w-4" />
                (360) 610-9233
              </a>
              <Button asChild className="w-full" size="lg">
                <Link to="/book" onClick={closeMenu}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
