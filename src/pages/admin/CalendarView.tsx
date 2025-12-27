import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from "@/hooks";
import AdminLayout from '@/components/admin/AdminLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isSameDay } from 'date-fns';
import { Loader2, Clock, User, Mail, Phone } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  message: string | null;
}

export default function AdminCalendarView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
      
      const channel = supabase
        .channel('admin-calendar')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          () => fetchBookings()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((b) => isSameDay(parseISO(b.booking_date), date));
  };

  const getDatesWithBookings = () => {
    return bookings.map((b) => parseISO(b.booking_date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-status-confirmed/15 text-status-confirmed';
      case 'pending': return 'bg-status-pending/15 text-status-pending';
      case 'completed': return 'bg-status-completed/15 text-status-completed';
      case 'cancelled': return 'bg-status-cancelled/15 text-status-cancelled';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View your booking schedule</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
          <Card>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  booked: getDatesWithBookings()
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: 'bold',
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    color: 'hsl(var(--primary))'
                  }
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                  : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No bookings for this date
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{booking.booking_time}</span>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`mailto:${booking.email}`}
                            className="text-primary hover:underline"
                          >
                            {booking.email}
                          </a>
                        </div>
                        {booking.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={`tel:${booking.phone}`}
                              className="text-primary hover:underline"
                            >
                              {booking.phone}
                            </a>
                          </div>
                        )}
                        {booking.message && (
                          <p className="mt-2 text-muted-foreground bg-muted p-2 rounded">
                            {booking.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
