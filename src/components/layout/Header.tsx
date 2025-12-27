import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Sparkles, CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/service-area", label: "Service Area" },
  { href: "/about", label: "About" },
  { href: "/ai-estimator", label: "AI Estimator", icon: Sparkles },
  { href: "/book", label: "Book Now", icon: CalendarDays },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showContactBar, setShowContactBar] = useState(false);
  const [isContactBarVisible, setIsContactBarVisible] = useState(false);
  const [isContactBarClosing, setIsContactBarClosing] = useState(false);
  const location = useLocation();

  const handleMenuToggle = () => {
    if (isOpen) {
      setIsClosing(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
      setIsClosing(false);
    }
  };

  const handleContactBarAnimationEnd = () => {
    if (isContactBarClosing) {
      setIsContactBarVisible(false);
      setIsContactBarClosing(false);
    }
  };

  const handleLinkClick = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Close mobile menu on scroll
      if (isOpen && !isClosing) {
        setIsClosing(true);
      }

      const shouldShow = window.scrollY > 150;
      setShowContactBar(shouldShow);
      
      if (shouldShow && !isContactBarVisible) {
        setIsContactBarVisible(true);
        setIsContactBarClosing(false);
      } else if (!shouldShow && isContactBarVisible && !isContactBarClosing) {
        setIsContactBarClosing(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isContactBarVisible, isContactBarClosing, isOpen, isClosing]);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/80 bg-gradient-to-r from-background via-background/95 to-background bg-[length:200%_100%] animate-gradient-shift transition-shadow duration-300",
      showContactBar && "shadow-md"
    )}>
      {/* Mobile Contact Bar - appears on scroll */}
      {isContactBarVisible && (
        <div 
          className={cn(
            "md:hidden bg-primary text-primary-foreground h-10",
            isContactBarClosing ? "animate-slide-out-up" : "animate-slide-in-down"
          )}
          onAnimationEnd={handleContactBarAnimationEnd}
        >
          <div className="container flex items-center justify-center gap-4 h-10">
            <a
              href="tel:+13606109233"
              className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <span className="text-primary-foreground/50">|</span>
            <a
              href="sms:+13606109233"
              className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              Text
            </a>
            <span className="text-primary-foreground/50">|</span>
            <Link
              to="/contact"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}

      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Junky Gurus LLC" className="h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground",
                link.icon && "text-primary"
              )}
            >
              {link.icon && <link.icon className="h-3.5 w-3.5" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm font-medium">
            <Phone className="h-4 w-4 text-primary" />
            <a href="tel:+13606109233" className="text-charcoal-light hover:text-primary transition-colors">
              (360) 610-9233
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="tel:+13604222428" className="text-charcoal-light hover:text-primary transition-colors">
              (360) 422-2428
            </a>
          </div>
          <Button asChild>
            <Link to="/contact">Get a Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2 relative w-10 h-10 flex items-center justify-center"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col justify-center items-center w-6 h-6">
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300 ease-in-out",
                isOpen ? "rotate-45 translate-y-[5px]" : ""
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300 ease-in-out my-[4px]",
                isOpen ? "opacity-0 scale-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300 ease-in-out",
                isOpen ? "-rotate-45 -translate-y-[5px]" : ""
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Backdrop */}
      {isOpen && (
        <div 
          className={cn(
            "md:hidden fixed inset-0 top-16 bg-black/30 backdrop-blur-md z-40",
            isClosing ? "animate-fade-out" : "animate-fade-in"
          )}
          onClick={handleMenuToggle}
        />
      )}

      {/* Mobile Navigation */}
      {isOpen && (
        <div 
          className={cn(
            "md:hidden border-t border-border bg-background relative z-50",
            isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
          )}
          onAnimationEnd={handleAnimationEnd}
        >
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={handleLinkClick}
                className={cn(
                  "py-2 text-base font-medium transition-colors flex items-center gap-2 opacity-0",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground",
                  link.icon && "text-primary",
                  !isClosing && "animate-fade-in-up"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
            <div 
              className={cn(
                "pt-4 mt-2 border-t border-border opacity-0",
                !isClosing && "animate-fade-in-up"
              )}
              style={{ animationDelay: `${navLinks.length * 50}ms` }}
            >
              <Button asChild className="w-full">
                <Link to="/contact" onClick={handleLinkClick}>
                  Get a Free Quote
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}