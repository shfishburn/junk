import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBookingSlots, TIME_SLOTS } from "@/hooks/use-booking-slots";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  /** The selected date */
  date: Date | undefined;
  /** The selected time slot */
  time: string;
  /** Callback when date changes */
  onDateChange: (date: Date | undefined) => void;
  /** Callback when time changes */
  onTimeChange: (time: string) => void;
  /** Label text for the picker */
  label?: string;
  /** Whether time selection is required after date selection */
  showTimeSlots?: boolean;
  /** Number of columns for time slot grid (default: 5) */
  timeSlotColumns?: 3 | 5;
  /** Show abbreviated time format (e.g., "8AM" vs "8:00 AM") */
  abbreviatedTime?: boolean;
}

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  label = "Preferred Appointment (Optional)",
  showTimeSlots = true,
  timeSlotColumns = 5,
  abbreviatedTime = true,
}: DateTimePickerProps) {
  const { isDateDisabled, isTimeBooked } = useBookingSlots();

  const handleDateSelect = (newDate: Date | undefined) => {
    onDateChange(newDate);
    onTimeChange(""); // Reset time when date changes
  };

  const formatTimeLabel = (slot: string) => {
    return abbreviatedTime ? slot.replace(":00 ", "") : slot;
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {showTimeSlots && date && (
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">
            Select a time slot
          </Label>
          <div className={cn(
            "grid gap-2",
            timeSlotColumns === 5 ? "grid-cols-5" : "grid-cols-3"
          )}>
            {TIME_SLOTS.map((slot) => {
              const isBooked = isTimeBooked(date, slot);
              return (
                <Button
                  key={slot}
                  type="button"
                  variant={time === slot ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs",
                    isBooked && "opacity-50 line-through"
                  )}
                  disabled={isBooked}
                  onClick={() => onTimeChange(slot)}
                >
                  {formatTimeLabel(slot)}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
