import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/components/ContactInfoCard";

interface TextUsLinkProps {
  phone?: string;
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function TextUsLink({
  phone = CONTACT_INFO.phones[0].number,
  showIcon = false,
  iconSize = "sm",
  className,
  children,
}: TextUsLinkProps) {
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <a
      href={`sms:${phone}`}
      className={cn(
        "hover:text-primary transition-colors",
        showIcon && "inline-flex items-center gap-2",
        className
      )}
    >
      {showIcon && <MessageCircle className={cn(iconSizes[iconSize], "flex-shrink-0")} />}
      {children ?? "Text Us"}
    </a>
  );
}
