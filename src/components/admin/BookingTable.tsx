import { format, parseISO } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Phone } from 'lucide-react';

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

interface BookingTableProps {
  bookings: Booking[];
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function BookingTable({ bookings, onStatusUpdate, onDelete }: BookingTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No bookings found
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="whitespace-nowrap">
                <div className="font-medium">
                  {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {booking.booking_time}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{booking.name}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <a 
                    href={`mailto:${booking.email}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-3 w-3" />
                    {booking.email}
                  </a>
                  {booking.phone && (
                    <a 
                      href={`tel:${booking.phone}`}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-3 w-3" />
                      {booking.phone}
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={booking.status}
                  onValueChange={(value) => onStatusUpdate(booking.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="max-w-xs">
                {booking.message ? (
                  <p className="text-sm text-muted-foreground truncate">
                    {booking.message}
                  </p>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(booking.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
