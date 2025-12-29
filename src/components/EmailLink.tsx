import { Mail } from "lucide-react";
import { cn, CONTACT_INFO } from "@/lib";

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Open Gmail compose with email pre-filled
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={cn(
        "hover:text-primary transition-colors cursor-pointer",
        showIcon && "inline-flex items-center gap-2",
        className
      )}
    >
      {showIcon && <Mail className={cn(iconSizes[iconSize], "flex-shrink-0")} />}
      {children ?? email}
    </a>
  );
}
