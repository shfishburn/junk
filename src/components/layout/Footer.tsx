import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Cookie } from "lucide-react";
import { openCookiePreferences } from "@/components/CookieConsent";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-primary">
              Junky Gurus
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Fast, reliable junk removal serving Mount Vernon and the North Sound region.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/services", label: "Services" },
                { href: "/service-area", label: "Service Area" },
                { href: "/pricing", label: "Pricing" },
                { href: "/faq", label: "FAQ" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/referrals", label: "Refer a Friend 🎁" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Service Area</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Skagit County</li>
              <li>Whatcom County</li>
              <li>Snohomish County</li>
              <li>King County</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Contact Us</h4>
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
                  href="sms:+13606109233"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  Text Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@junkygurus.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  info@junkygurus.com
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
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <span>|</span>
            <button 
              onClick={openCookiePreferences}
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <Cookie className="h-3 w-3" />
              Cookie Settings
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Locally owned & operated in Mount Vernon, WA
          </p>
        </div>
      </div>
    </footer>
  );
}
