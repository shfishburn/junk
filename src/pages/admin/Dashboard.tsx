import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from "@/hooks";
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCards from '@/components/admin/StatsCards';
import CreateBookingDialog from '@/components/admin/CreateBookingDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Loader2, Calendar, Clock, AlertTriangle, Plus } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  message: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
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
      
      // Real-time subscription
      const channel = supabase
        .channel('admin-bookings')
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
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(b => b.booking_date >= today && b.status !== 'cancelled')
      .slice(0, 5);
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingBookings = getUpcomingBookings();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your booking activity</p>
        </div>

        <StatsCards bookings={bookings} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming appointments
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{booking.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {getDateLabel(booking.booking_date)} at {booking.booking_time}
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <CreateBookingDialog 
                onBookingCreated={fetchBookings}
                trigger={
                  <button className="w-full text-left p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20">
                    <p className="font-medium flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" />
                      Create Booking
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add booking from phone call or text
                    </p>
                  </button>
                }
              />
              <button
                onClick={() => navigate('/admin/bookings')}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="font-medium">View All Bookings</p>
                <p className="text-sm text-muted-foreground">
                  Manage and update booking statuses
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/calendar')}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="font-medium">Calendar View</p>
                <p className="text-sm text-muted-foreground">
                  See your schedule at a glance
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/hazmat')}
                className="w-full text-left p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <p className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Hazmat Requests
                </p>
                <p className="text-sm text-muted-foreground">
                  Manage hazardous material pickups
                </p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
