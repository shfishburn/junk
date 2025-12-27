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
import { Trash2, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface HazmatMaterial {
  name: string;
  quantity: number;
}

interface HazmatRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  materials: HazmatMaterial[];
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface HazmatRequestTableProps {
  requests: HazmatRequest[];
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function HazmatRequestTable({ requests, onStatusUpdate, onDelete }: HazmatRequestTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-status-confirmed/15 text-status-confirmed';
      case 'pending': return 'bg-status-pending/15 text-status-pending';
      case 'completed': return 'bg-status-completed/15 text-status-completed';
      case 'cancelled': return 'bg-status-cancelled/15 text-status-cancelled';
      case 'scheduled': return 'bg-status-scheduled/15 text-status-scheduled';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hazmat requests found
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Requested</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Materials</TableHead>
            <TableHead>Preferred Pickup</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="whitespace-nowrap">
                <div className="font-medium">
                  {format(parseISO(request.created_at), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(parseISO(request.created_at), 'h:mm a')}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{request.name}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[150px]">{request.address}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <a 
                    href={`mailto:${request.email}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-3 w-3" />
                    {request.email}
                  </a>
                  <a 
                    href={`tel:${request.phone}`}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-3 w-3" />
                    {request.phone}
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      {request.materials?.length || 0} items
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Hazmat Materials
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {request.materials && request.materials.length > 0 ? (
                        <ul className="space-y-2">
                          {request.materials.map((material, idx) => (
                            <li key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="font-medium">{material.name}</span>
                              <Badge variant="secondary">Qty: {material.quantity}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No materials specified</p>
                      )}
                      {request.notes && (
                        <div className="mt-4 p-3 bg-muted/50 rounded">
                          <p className="text-sm font-medium mb-1">Additional Notes:</p>
                          <p className="text-sm text-muted-foreground">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {request.preferred_date ? (
                  <div>
                    <div className="font-medium">
                      {format(parseISO(request.preferred_date), 'MMM d, yyyy')}
                    </div>
                    {request.preferred_time && (
                      <div className="text-sm text-muted-foreground">
                        {request.preferred_time}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not specified</span>
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={request.status}
                  onValueChange={(value) => onStatusUpdate(request.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(request.id)}
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
