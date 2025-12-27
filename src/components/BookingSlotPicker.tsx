import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { useBookingSlots } from "@/hooks/use-booking-slots";

interface BookingSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  compact?: boolean;
}

export function BookingSlotPicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  compact = false,
}: BookingSlotPickerProps) {
  const {
    isLoading,
    isTimeBooked,
    isDateFullyBooked,
    isDateDisabled,
  } = useBookingSlots();

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date);
    onTimeChange("");
  };

  const calendarModifiers = {
    fullyBooked: (date: Date) => isDateFullyBooked(date),
  };

  const calendarModifiersStyles = {
    fullyBooked: {
      color: "hsl(var(--muted-foreground))",
      textDecoration: "line-through",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading availability...</span>
      </div>
    );
  }

  // Appointment summary component
  const AppointmentSummary = ({ className = "" }: { className?: string }) => (
    selectedDate && selectedTime ? (
      <div className={`bg-primary/10 p-3 rounded-lg ${className}`}>
        <p className="text-sm text-muted-foreground">
          {compact ? "Selected appointment:" : "Your Appointment"}
        </p>
        <p className="text-primary font-semibold">
          {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
        </p>
      </div>
    ) : null
  );

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Select Date
            </label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border w-full"
              modifiers={calendarModifiers}
              modifiersStyles={calendarModifiersStyles}
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Select Time
            </label>
            {selectedDate ? (
              <TimeSlotGrid
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeChange={onTimeChange}
                isTimeBooked={isTimeBooked}
                columns={2}
                abbreviatedTime={false}
              />
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Please select a date first
              </p>
            )}
          </div>
        </div>

        <AppointmentSummary className="text-center" />
      </div>
    );
  }

  // Full layout (used in dedicated booking page)
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Calendar Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-5 w-5 text-primary" />
            Select a Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border w-full"
            modifiers={calendarModifiers}
            modifiersStyles={calendarModifiersStyles}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted border"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            Select a Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <TimeSlotGrid
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeChange={onTimeChange}
              isTimeBooked={isTimeBooked}
              columns={3}
              abbreviatedTime={false}
              size="default"
            />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Please select a date first
            </p>
          )}

          {selectedDate && selectedTime && (
            <AppointmentSummary className="mt-4" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
