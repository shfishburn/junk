import { Calendar } from "@/components/ui/calendar";
import { useBookingSlots } from "@/hooks";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
}

export function BookingCalendar({
  selectedDate,
  onDateChange,
  className = "",
}: BookingCalendarProps) {
  const { isDateFullyBooked, isDateDisabled } = useBookingSlots();

  const calendarModifiers = {
    fullyBooked: (date: Date) => isDateFullyBooked(date),
  };

  const calendarModifiersStyles = {
    fullyBooked: {
      color: "hsl(var(--muted-foreground))",
      textDecoration: "line-through",
    },
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onDateChange}
      disabled={isDateDisabled}
      className={`rounded-md border w-full pointer-events-auto ${className}`}
      modifiers={calendarModifiers}
      modifiersStyles={calendarModifiersStyles}
    />
  );
}
