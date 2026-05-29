import { Link } from "react-router-dom";
import { Cookie, Heart, Instagram, Facebook } from "lucide-react";
import { openCookiePreferences } from "@/components/features";
import { ContactInfoCard, BusinessHours } from "@/components/shared";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-primary">
              Junky Gurus
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Fast, reliable junk removal serving Mount Vernon and the Puget Sound Region.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
              <Heart className="h-4 w-4" />
              <span>10% off for seniors & veterans</span>
            </div>
            <BusinessHours variant="compact" className="mt-3" />
            
            {/* Social Links */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.instagram.com/junkygurus/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/JunkyGurus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Contact Us</h4>
            <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              <span>🇲🇽</span> ¡Hablamos Español!
            </div>
            <ContactInfoCard variant="compact" showHours={false} showTextUs />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Junky Gurus. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors link-hover-underline inline-block py-1 min-h-[44px] flex items-center">
              Privacy Policy
            </Link>
            <span className="text-border hidden sm:inline">|</span>
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors link-hover-underline inline-block py-1 min-h-[44px] flex items-center">
              Terms & Conditions
            </Link>
            <span className="text-border hidden sm:inline">|</span>
            <button
              onClick={openCookiePreferences}
              className="hover:text-primary transition-colors inline-flex items-center gap-1 py-1 min-h-[44px]"
            >
              <Cookie className="h-3 w-3" />
              Cookie Settings
            </button>
            <span className="text-border hidden sm:inline">|</span>
            <Link to="/admin" className="hover:text-primary transition-colors link-hover-underline inline-block py-1 min-h-[44px] flex items-center">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
