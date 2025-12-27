import { Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/contact-info";
import { BusinessHours } from "@/components/BusinessHours";
import { SERVICE_AREA_DATA } from "@/components/ServiceAreaInfo";
import { PhoneLink } from "@/components/PhoneLink";
import { EmailLink } from "@/components/EmailLink";
import { TextUsLink } from "@/components/TextUsLink";

interface ContactInfoCardProps {
  variant?: "full" | "compact";
  showHours?: boolean;
  showLocation?: boolean;
  showTextUs?: boolean;
  className?: string;
}

// Computed values that depend on SERVICE_AREA_DATA
const locationInfo = {
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
          <PhoneLink
            key={phone.number}
            phone={phone}
            showIcon
            className="flex text-sm text-muted-foreground"
          />
        ))}
        {showTextUs && (
          <TextUsLink
            showIcon
            className="flex text-sm text-muted-foreground"
          />
        )}
        <EmailLink
          showIcon
          className="flex text-sm text-muted-foreground"
        />
        {showLocation && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{locationInfo.location}</span>
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
            <PhoneLink
              key={phone.number}
              phone={phone}
              className="text-primary font-medium hover:underline block"
            />
          ))}
        </div>
      </div>

      <EmailLink className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-charcoal">Email</h3>
          <p className="text-primary font-medium">{CONTACT_INFO.email}</p>
        </div>
      </EmailLink>

      {showHours && <BusinessHours />}

      {showLocation && (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal">Location</h3>
            <p className="text-muted-foreground">Based in {locationInfo.location}</p>
            <p className="text-muted-foreground text-sm">{locationInfo.serviceArea}</p>
          </div>
        </div>
      )}
    </div>
  );
}
