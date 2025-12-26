import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingSlots, TIME_SLOTS } from "@/hooks/use-booking-slots";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading availability...</span>
      </div>
    );
  }

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
              onSelect={(date) => {
                onDateChange(date);
                onTimeChange("");
              }}
              disabled={isDateDisabled}
              className="rounded-md border w-full"
              modifiers={{
                fullyBooked: (date) => isDateFullyBooked(date),
              }}
              modifiersStyles={{
                fullyBooked: {
                  color: "hsl(var(--muted-foreground))",
                  textDecoration: "line-through",
                },
              }}
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Select Time
            </label>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isBooked = isTimeBooked(selectedDate, time);
                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      disabled={isBooked}
                      onClick={() => onTimeChange(time)}
                      className={cn(
                        "w-full text-sm",
                        isBooked && "opacity-50 line-through"
                      )}
                      size="sm"
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Please select a date first
              </p>
            )}
          </div>
        </div>

        {/* Selected appointment summary */}
        {selectedDate && selectedTime && (
          <div className="bg-primary/10 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Selected appointment:</p>
            <p className="text-primary font-semibold">
              {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
            </p>
          </div>
        )}
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
            onSelect={(date) => {
              onDateChange(date);
              onTimeChange("");
            }}
            disabled={isDateDisabled}
            className="rounded-md border w-full"
            modifiers={{
              fullyBooked: (date) => isDateFullyBooked(date),
            }}
            modifiersStyles={{
              fullyBooked: {
                color: "hsl(var(--muted-foreground))",
                textDecoration: "line-through",
              },
            }}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((time) => {
                const isBooked = isTimeBooked(selectedDate, time);
                return (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTime === time ? "default" : "outline"}
                    disabled={isBooked}
                    onClick={() => onTimeChange(time)}
                    className={cn(
                      "w-full",
                      isBooked && "opacity-50 line-through"
                    )}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Please select a date first
            </p>
          )}

          {/* Selected appointment summary */}
          {selectedDate && selectedTime && (
            <div className="mt-4 bg-primary/10 p-4 rounded-lg">
              <p className="text-sm font-medium">Your Appointment</p>
              <p className="text-primary font-semibold">
                {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
