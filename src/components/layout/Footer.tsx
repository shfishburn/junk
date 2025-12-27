import { Link } from "react-router-dom";
import { Cookie, Clock, Heart } from "lucide-react";
import { openCookiePreferences } from "@/components/CookieConsent";
import { ContactInfoCard } from "@/components/ContactInfoCard";

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
              <span>15% off for seniors & veterans</span>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p>Mon - Sat: 8am - 6pm</p>
                <p>Sunday: Closed</p>
              </div>
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

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Junky Gurus. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors link-hover-underline inline-block">
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors link-hover-underline inline-block">
              Terms & Conditions
            </Link>
            <span className="text-border">|</span>
            <button
              onClick={openCookiePreferences}
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <Cookie className="h-3 w-3" />
              Cookie Settings
            </button>
            <span className="text-border">|</span>
            <Link to="/admin" className="hover:text-primary transition-colors link-hover-underline inline-block">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
