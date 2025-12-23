import { Phone } from "lucide-react";

export function MobileCallButton() {
  return (
    <a
      href="tel:+13605551234"
      className="fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
      aria-label="Call now"
    >
      <Phone className="h-5 w-5" />
      <span className="font-medium">Call Now</span>
    </a>
  );
}
