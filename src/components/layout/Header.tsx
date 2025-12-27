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

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) closeMenu();
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const headerBg = isHome && !isScrolled
    ? "bg-transparent"
    : "bg-background/95 backdrop-blur-md border-b border-border shadow-sm";

  const textColor = isHome && !isScrolled
    ? "text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]"
    : "text-foreground";

  const mutedColor = isHome && !isScrolled
    ? "text-white/90 [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]"
    : "text-muted-foreground";

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      headerBg
    )}>
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <img 
            src={logo} 
            alt="Junky Gurus LLC" 
            className={cn(
              "h-14 w-auto transition-all duration-300",
              isHome && !isScrolled && "drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === link.href
                  ? "text-primary bg-primary/10"
                  : cn(mutedColor, "hover:text-primary hover:bg-primary/5")
              )}
            >
              {link.label}
            </Link>
          ))}

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
          <Link
            to="/espanol"
            className={cn(
              "text-sm font-medium transition-colors flex items-center gap-1",
              mutedColor, "hover:text-primary"
            )}
            title="Servicio disponible en español"
          >
            <span aria-hidden="true">🇲🇽</span>
          </Link>
          
          <a 
            href="tel:+13606109233" 
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              mutedColor, "hover:text-primary"
            )}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">(360) 610-9233</span>
          </a>

          <Button 
            asChild 
            size="sm" 
            className={cn(
              "gap-2 transition-all duration-300",
              isHome && !isScrolled && "shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)]"
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
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className={cn(
        "lg:hidden fixed inset-0 top-20 z-40 transition-all duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        />
        
        <nav className={cn(
          "absolute top-0 right-0 w-80 max-w-[85vw] h-[calc(100vh-5rem)] bg-background shadow-2xl transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
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

            {/* Spanish Link */}
            <Link
              to="/espanol"
              onClick={closeMenu}
              className="py-3 px-4 text-base font-medium text-primary bg-primary/10 rounded-lg mt-6 flex items-center gap-2"
            >
              <span aria-hidden="true">🇲🇽</span>
              ¿Hablas español?
            </Link>

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
