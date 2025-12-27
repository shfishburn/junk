import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

interface Booking {
  id: string;
  booking_date: string;
  status: string;
}

interface StatsCardsProps {
  bookings: Booking[];
}

export default function StatsCards({ bookings }: StatsCardsProps) {
  const today = new Date();
  
  const todayBookings = bookings.filter((b) => 
    isToday(parseISO(b.booking_date)) && b.status !== 'cancelled'
  );
  
  const weekBookings = bookings.filter((b) => 
    isThisWeek(parseISO(b.booking_date)) && b.status !== 'cancelled'
  );
  
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  
  const completedBookings = bookings.filter((b) => 
    isThisMonth(parseISO(b.booking_date)) && b.status === 'completed'
  );

  const stats = [
    {
      title: "Today's Appointments",
      value: todayBookings.length,
      icon: CalendarCheck,
      description: 'scheduled for today'
    },
    {
      title: 'This Week',
      value: weekBookings.length,
      icon: Clock,
      description: 'appointments this week'
    },
    {
      title: 'Pending',
      value: pendingBookings.length,
      icon: Clock,
      description: 'awaiting confirmation'
    },
    {
      title: 'Completed',
      value: completedBookings.length,
      icon: CheckCircle,
      description: 'this month'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
