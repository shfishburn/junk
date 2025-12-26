import { useState, useEffect, useCallback } from "react";
import { format, isBefore, startOfDay, isSunday } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

interface Booking {
  booking_date: string;
  booking_time: string;
  status: string;
}

export function useBookingSlots() {
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_date, booking_time, status")
        .in("status", ["pending", "confirmed"]);

      if (error) throw error;
      setExistingBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  // Check if a specific time slot is booked
  const isTimeBooked = useCallback((date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return existingBookings.some(
      (booking) => booking.booking_date === dateStr && booking.booking_time === time
    );
  }, [existingBookings]);

  // Get available time slots for a date
  const getAvailableSlots = useCallback((date: Date) => {
    return TIME_SLOTS.filter((time) => !isTimeBooked(date, time));
  }, [isTimeBooked]);

  // Check if a date is fully booked
  const isDateFullyBooked = useCallback((date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const bookedSlots = existingBookings.filter(
      (booking) => booking.booking_date === dateStr
    );
    return bookedSlots.length >= TIME_SLOTS.length;
  }, [existingBookings]);

  // Disable dates that are past, Sunday, or fully booked
  const isDateDisabled = useCallback((date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || isSunday(date) || isDateFullyBooked(date);
  }, [isDateFullyBooked]);

  return {
    existingBookings,
    isLoading,
    isTimeBooked,
    getAvailableSlots,
    isDateFullyBooked,
    isDateDisabled,
    refetchBookings: fetchBookings,
    TIME_SLOTS,
  };
}
