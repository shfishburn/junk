import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/components/ContactInfoCard";

type PhoneType = "primary" | "secondary";

interface PhoneLinkProps {
  phone?: PhoneType | typeof CONTACT_INFO.phones[0];
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function PhoneLink({
  phone = "primary",
  showIcon = false,
  iconSize = "sm",
  className,
  children,
}: PhoneLinkProps) {
  const phoneData = typeof phone === "string"
    ? CONTACT_INFO.phones[phone === "primary" ? 0 : 1]
    : phone;

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <a
      href={`tel:${phoneData.number}`}
      className={cn(
        "hover:text-primary transition-colors",
        showIcon && "inline-flex items-center gap-2",
        className
      )}
    >
      {showIcon && <Phone className={cn(iconSizes[iconSize], "flex-shrink-0")} />}
      {children ?? phoneData.display}
    </a>
  );
}

interface PhoneButtonProps {
  phone?: PhoneType;
  showIcon?: boolean;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children?: React.ReactNode;
}

export function PhoneButton({
  phone = "primary",
  showIcon = true,
  className,
  children,
}: PhoneButtonProps) {
  const phoneData = CONTACT_INFO.phones[phone === "primary" ? 0 : 1];

  return (
    <a
      href={`tel:${phoneData.number}`}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        className
      )}
    >
      {showIcon && <Phone className="h-4 w-4" />}
      {children ?? phoneData.display}
    </a>
  );
}

export { CONTACT_INFO };
