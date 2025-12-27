import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Sparkles, CalendarDays, MessageCircle, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book Now", icon: CalendarDays },
  { href: "/ai-estimator", label: "AI Quote", icon: Sparkles },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/discounts", label: "Discounts", icon: Percent },
  { href: "/contact", label: "Contact" },
];

const anchorLinks = [
  { href: "/#services", label: "Our Services" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact Us" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactBar, setShowContactBar] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) closeMenu();
      setShowContactBar(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border bg-background transition-shadow duration-300",
      showContactBar && "shadow-md"
    )}>
      {/* Mobile Contact Bar - appears on scroll */}
      {showContactBar && (
        <div className="md:hidden bg-primary text-primary-foreground h-10">
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
          
          {/* Anchor links for homepage sections */}
          <span className="text-muted-foreground/30">|</span>
          {anchorLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/espanol"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            title="Servicio disponible en español"
          >
            <span aria-hidden="true">🇲🇽</span>
            <span>Español</span>
          </Link>
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
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col justify-center items-center w-6 h-6">
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300",
                isOpen ? "rotate-45 translate-y-[5px]" : ""
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300 my-[4px]",
                isOpen ? "opacity-0" : ""
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300",
                isOpen ? "-rotate-45 -translate-y-[5px]" : ""
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 top-16 bg-black/40 z-40"
            onClick={closeMenu}
          />
          <nav className="md:hidden absolute left-0 right-0 top-full bg-background border-b border-border z-50 shadow-lg">
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "py-2 text-base font-medium transition-colors flex items-center gap-2",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                    link.icon && "text-primary"
                  )}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              
              {/* Anchor links for homepage sections */}
              <div className="pt-2 mt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Quick Links</p>
                {anchorLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={closeMenu}
                    className="py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <Link
                to="/espanol"
                onClick={closeMenu}
                className="py-2 text-base font-medium text-primary flex items-center gap-2 bg-primary/10 rounded-lg px-3 -mx-1"
              >
                <span aria-hidden="true">🇲🇽</span>
                <span>¿Hablas español? Nosotros también.</span>
              </Link>
              <div className="pt-4 mt-2 border-t border-border">
                <Button asChild className="w-full">
                  <Link to="/contact" onClick={closeMenu}>
                    Get a Free Quote
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}