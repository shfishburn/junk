import { useState } from "react";
import { Mail } from "lucide-react";
import { cn, CONTACT_INFO } from "@/lib";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmailLinkProps {
  email?: string;
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const EMAIL_PROVIDERS = [
  {
    name: "Gmail",
    icon: "📧",
    getUrl: (email: string) =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
  },
  {
    name: "Outlook",
    icon: "📨",
    getUrl: (email: string) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}`,
  },
  {
    name: "Yahoo Mail",
    icon: "✉️",
    getUrl: (email: string) =>
      `https://compose.mail.yahoo.com/?to=${encodeURIComponent(email)}`,
  },
  {
    name: "Default Email App",
    icon: "💻",
    getUrl: (email: string) => `mailto:${email}`,
    isMailto: true,
  },
];

export function EmailLink({
  email = CONTACT_INFO.email,
  showIcon = false,
  iconSize = "sm",
  className,
  children,
}: EmailLinkProps) {
  const [open, setOpen] = useState(false);

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleProviderClick = (provider: typeof EMAIL_PROVIDERS[0]) => {
    const url = provider.getUrl(email);
    if (provider.isMailto) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "hover:text-primary transition-colors cursor-pointer text-left",
            showIcon && "inline-flex items-center gap-2",
            className
          )}
        >
          {showIcon && <Mail className={cn(iconSizes[iconSize], "flex-shrink-0")} />}
          {children ?? email}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <p className="text-sm font-medium text-muted-foreground px-2 py-1.5">
          Open with:
        </p>
        <div className="space-y-1">
          {EMAIL_PROVIDERS.map((provider) => (
            <button
              key={provider.name}
              onClick={() => handleProviderClick(provider)}
              className="w-full flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
            >
              <span className="text-lg">{provider.icon}</span>
              <span>{provider.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
