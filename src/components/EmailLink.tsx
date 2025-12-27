import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/contact-info";

interface EmailLinkProps {
  email?: string;
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function EmailLink({
  email = CONTACT_INFO.email,
  showIcon = false,
  iconSize = "sm",
  className,
  children,
}: EmailLinkProps) {
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <a
      href={`mailto:${email}`}
      className={cn(
        "hover:text-primary transition-colors",
        showIcon && "inline-flex items-center gap-2",
        className
      )}
    >
      {showIcon && <Mail className={cn(iconSizes[iconSize], "flex-shrink-0")} />}
      {children ?? email}
    </a>
  );
}
