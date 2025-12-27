import { Clock } from "lucide-react";
import { cn } from "@/lib";

export const BUSINESS_HOURS = {
  weekdays: {
    days: "Monday - Saturday",
    daysShort: "Mon - Sat",
    hours: "8am - 6pm",
    opens: "08:00",
    closes: "18:00",
  },
  weekend: {
    days: "Sunday",
    status: "Closed",
  },
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

interface BusinessHoursProps {
  variant?: "full" | "compact" | "inline";
  showIcon?: boolean;
  className?: string;
}

export function BusinessHours({
  variant = "full",
  showIcon = true,
  className,
}: BusinessHoursProps) {
  if (variant === "inline") {
    return (
      <span className={className}>
        {BUSINESS_HOURS.weekdays.daysShort}: {BUSINESS_HOURS.weekdays.hours}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-start gap-2 text-sm text-muted-foreground", className)}>
        {showIcon && <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />}
        <div>
          <p>{BUSINESS_HOURS.weekdays.daysShort}: {BUSINESS_HOURS.weekdays.hours}</p>
          <p>{BUSINESS_HOURS.weekend.days}: {BUSINESS_HOURS.weekend.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-lg bg-card border border-border", className)}>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Clock className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-charcoal">Business Hours</h3>
        <p className="text-muted-foreground">{BUSINESS_HOURS.weekdays.days}: {BUSINESS_HOURS.weekdays.hours}</p>
        <p className="text-muted-foreground">{BUSINESS_HOURS.weekend.days}: {BUSINESS_HOURS.weekend.status}</p>
      </div>
    </div>
  );
}
