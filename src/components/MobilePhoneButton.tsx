import { Phone } from "lucide-react";

export function MobilePhoneButton() {
  return (
    <a
      href="tel:+13606109233"
      className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      aria-label="Call us"
    >
      <Phone className="h-6 w-6" />
    </a>
  );
}
