import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Cookie, Clock, Heart } from "lucide-react";
import { openCookiePreferences } from "@/components/CookieConsent";

const serviceAreas = [
  "Mount Vernon",
  "Burlington",
  "Anacortes",
  "Sedro-Woolley",
  "Bellingham",
  "Marysville",
  "Everett",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors link-hover-underline inline-block">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors link-hover-underline inline-block">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors link-hover-underline inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors link-hover-underline inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/referrals" className="text-muted-foreground hover:text-primary transition-colors link-hover-underline inline-block">
                  Referral Program
                </Link>
              </li>
              <li>
                <Link to="/service-area" className="text-muted-foreground hover:text-primary transition-colors link-hover-underline inline-block">
                  Service Area
                </Link>
              </li>
              <li>
                <Link to="/espanol" className="text-primary hover:text-primary/80 transition-colors link-hover-underline inline-block flex items-center gap-1.5">
                  <span>🇲🇽</span> Español
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Service Areas</h4>
            <ul className="space-y-2 text-sm">
              {serviceAreas.map((area) => (
                <li key={area} className="text-muted-foreground">
                  {area}, WA
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Contact Us</h4>
            <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              <span>🇲🇽</span> ¡Hablamos Español!
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+13606109233"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  (360) 610-9233
                </a>
              </li>
              <li>
                <a
                  href="tel:+13604222428"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  (360) 422-2428
                </a>
              </li>
              <li>
                <a
                  href="sms:+13606109233"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  Text Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:Junkygurus@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  Junkygurus@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Mount Vernon, WA</span>
              </li>
            </ul>
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
