import { useState } from 'react';
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
import { Trash2, Mail, Phone, MessageSquare, UserPlus, Globe, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import EditBookingDialog from './EditBookingDialog';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  message: string | null;
  created_at: string;
  source?: string;
}

interface BookingTableProps {
  bookings: Booking[];
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onSendEmail: (booking: Booking) => void;
  onBookingUpdated?: () => void;
}

export default function BookingTable({ bookings, onStatusUpdate, onDelete, onSendEmail, onBookingUpdated }: BookingTableProps) {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setEditDialogOpen(true);
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

  const getSourceInfo = (source?: string) => {
    switch (source) {
      case 'phone':
        return { icon: <Phone className="h-3 w-3" />, label: 'Phone', color: 'text-info' };
      case 'text':
        return { icon: <MessageSquare className="h-3 w-3" />, label: 'Text', color: 'text-success' };
      case 'walkin':
        return { icon: <UserPlus className="h-3 w-3" />, label: 'Walk-in', color: 'text-status-scheduled' };
      case 'online':
      default:
        return { icon: <Globe className="h-3 w-3" />, label: 'Online', color: 'text-muted-foreground' };
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
    <TooltipProvider>
      <div className="rounded-md border overflow-x-auto overflow-y-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const sourceInfo = getSourceInfo(booking.source);
              return (
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
                    {booking.address && (
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {booking.address}
                      </div>
                    )}
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`inline-flex items-center gap-1 ${sourceInfo.color}`}>
                          {sourceInfo.icon}
                          <span className="text-sm">{sourceInfo.label}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Booked via {sourceInfo.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(value) => onStatusUpdate(booking.id, value)}
                    >
                      <SelectTrigger className={`w-32 ${getStatusColor(booking.status)}`}>
                        <SelectValue>{booking.status}</SelectValue>
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
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onSendEmail(booking)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send confirmation email</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(booking)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit booking</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(booking.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete booking</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EditBookingDialog
        booking={editingBooking}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onBookingUpdated={onBookingUpdated}
      />
    </TooltipProvider>
  );
}
