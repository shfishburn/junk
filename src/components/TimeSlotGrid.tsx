import { Button } from "@/components/ui/button";
import { TIME_SLOTS } from "@/hooks";
import { cn } from "@/lib/utils";

interface TimeSlotGridProps {
  /** The currently selected date (needed to check slot availability) */
  selectedDate: Date;
  /** The currently selected time slot */
  selectedTime: string;
  /** Callback when a time slot is selected */
  onTimeChange: (time: string) => void;
  /** Function to check if a time slot is booked */
  isTimeBooked?: (date: Date, time: string) => boolean;
  /** Number of columns in the grid */
  columns?: 2 | 3 | 5;
  /** Show abbreviated time format (e.g., "8AM" vs "8:00 AM") */
  abbreviatedTime?: boolean;
  /** Size of the buttons */
  size?: "sm" | "default";
}

export function TimeSlotGrid({
  selectedDate,
  selectedTime,
  onTimeChange,
  isTimeBooked,
  columns = 5,
  abbreviatedTime = false,
  size = "sm",
}: TimeSlotGridProps) {
  const formatTimeLabel = (slot: string) => {
    return abbreviatedTime ? slot.replace(":00 ", "") : slot;
  };

  const getGridColumns = () => {
    switch (columns) {
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-2 sm:grid-cols-3";
      case 5: return "grid-cols-5";
      default: return "grid-cols-5";
    }
  };

  return (
    <div className={cn("grid gap-2", getGridColumns())}>
      {TIME_SLOTS.map((slot) => {
        const isBooked = isTimeBooked?.(selectedDate, slot) ?? false;
        return (
          <Button
            key={slot}
            type="button"
            variant={selectedTime === slot ? "default" : "outline"}
            size={size}
            disabled={isBooked}
            onClick={() => onTimeChange(slot)}
            className={cn(
              "w-full",
              size === "sm" && "text-xs",
              isBooked && "opacity-50 line-through"
            )}
          >
            {formatTimeLabel(slot)}
          </Button>
        );
      })}
    </div>
  );
}
