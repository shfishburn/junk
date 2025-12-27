import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Sparkles, CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/service-area", label: "Service Area" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ai-estimator", label: "AI Estimator", icon: Sparkles },
  { href: "/book", label: "Book Now", icon: CalendarDays },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactBar, setShowContactBar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowContactBar(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/80 bg-gradient-to-r from-background via-background/95 to-background bg-[length:200%_100%] animate-gradient-shift transition-shadow duration-300",
      showContactBar && "shadow-md"
    )}>
      {/* Mobile Contact Bar - appears on scroll */}
      <div
        className={cn(
          "md:hidden bg-primary text-primary-foreground transition-all duration-300 overflow-hidden",
          showContactBar ? "h-10" : "h-0"
        )}
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
          className="md:hidden p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "py-2 text-base font-medium transition-colors flex items-center gap-2",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground",
                  link.icon && "text-primary"
                )}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-border">
              <Button asChild className="w-full">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
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