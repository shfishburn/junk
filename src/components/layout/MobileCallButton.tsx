import { Phone, MessageCircle } from "lucide-react";

export function MobileCallButton() {
  return (
    <div className="absolute right-4 top-[calc(100dvh-9.5rem)] z-50 flex flex-col gap-3 md:hidden animate-fade-in [animation-delay:500ms] [animation-fill-mode:backwards]">
      <a
        href="sms:+13606109233"
        className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Text now"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">Text Us</span>
      </a>
      <a
        href="tel:+13606109233"
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Call now"
      >
        <Phone className="h-5 w-5" />
        <span className="font-medium">Call Now</span>
      </a>
    </div>
  );
}
