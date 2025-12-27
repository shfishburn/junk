import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessHours } from "@/components/BusinessHours";
import { SERVICE_AREA_DATA } from "@/components/ServiceAreaInfo";

interface ContactInfoCardProps {
  variant?: "full" | "compact";
  showHours?: boolean;
  showLocation?: boolean;
  showTextUs?: boolean;
  className?: string;
}

export const CONTACT_INFO = {
  phones: [
    { number: "+13606109233", display: "(360) 610-9233" },
    { number: "+13604222428", display: "(360) 422-2428" },
  ],
  email: "Junkygurus@gmail.com",
  location: SERVICE_AREA_DATA.baseLocation,
  serviceArea: `Serving ${SERVICE_AREA_DATA.counties.map(c => c.name.replace(" County", "")).join(", ")} Counties`,
};

export function ContactInfoCard({
  variant = "full",
  showHours = true,
  showLocation = true,
  showTextUs = false,
  className,
}: ContactInfoCardProps) {
  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        {CONTACT_INFO.phones.map((phone) => (
          <a
            key={phone.number}
            href={`tel:${phone.number}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4 flex-shrink-0" />
            {phone.display}
          </a>
        ))}
        {showTextUs && (
          <a
            href={`sms:${CONTACT_INFO.phones[0].number}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            Text Us
          </a>
        )}
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Mail className="h-4 w-4 flex-shrink-0" />
          {CONTACT_INFO.email}
        </a>
        {showLocation && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{CONTACT_INFO.location}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-charcoal">Call Us</h3>
          {CONTACT_INFO.phones.map((phone) => (
            <a
              key={phone.number}
              href={`tel:${phone.number}`}
              className="text-primary font-medium hover:underline block"
            >
              {phone.display}
            </a>
          ))}
        </div>
      </div>

      <a
        href={`mailto:${CONTACT_INFO.email}`}
        className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-charcoal">Email</h3>
          <p className="text-primary font-medium">{CONTACT_INFO.email}</p>
        </div>
      </a>

      {showHours && <BusinessHours />}

      {showLocation && (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal">Location</h3>
            <p className="text-muted-foreground">Based in {CONTACT_INFO.location}</p>
            <p className="text-muted-foreground text-sm">{CONTACT_INFO.serviceArea}</p>
          </div>
        </div>
      )}
    </div>
  );
}
