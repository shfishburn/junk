import { Heart } from "lucide-react";
import { cn } from "@/lib";

interface DiscountBadgeProps {
  variant?: "banner" | "compact" | "inline";
  className?: string;
}

export function DiscountBadge({ variant = "banner", className }: DiscountBadgeProps) {
  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm text-primary font-medium", className)}>
        <Heart className="h-3.5 w-3.5" />
        15% off for seniors & veterans
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium", className)}>
        <Heart className="h-4 w-4" />
        <span>15% off for seniors & veterans</span>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className={cn("p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20", className)}>
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            15% Senior & Veteran Discount
          </p>
          <p className="text-sm text-muted-foreground">
            If you're 65+ or have served in the military, you automatically qualify. No paperwork—just let us know.
          </p>
        </div>
      </div>
    </div>
  );
}
