import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import AdminLayout from '@/components/admin/AdminLayout';
import HazmatRequestTable from '@/components/admin/HazmatRequestTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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

export default function AdminHazmatRequests() {
  const [requests, setRequests] = useState<HazmatRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<HazmatRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();

      // Real-time subscription
      const channel = supabase
        .channel('admin-hazmat-requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'hazmat_requests' },
          () => fetchRequests()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('hazmat_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse materials JSONB field
      const parsedData = (data || []).map(item => ({
        ...item,
        materials: Array.isArray(item.materials) 
          ? (item.materials as unknown as HazmatMaterial[]) 
          : []
      }));
      
      setRequests(parsedData as HazmatRequest[]);
    } catch (err) {
      console.error('Error fetching hazmat requests:', err);
      toast.error('Failed to load hazmat requests');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          r.phone.includes(search) ||
          r.address.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('hazmat_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Status updated');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hazmat request?')) return;

    try {
      const { error } = await supabase
        .from('hazmat_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Request deleted');
    } catch (err) {
      console.error('Error deleting request:', err);
      toast.error('Failed to delete request');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              Hazmat Requests
            </h1>
            <p className="text-muted-foreground">
              Manage hazardous material pickup requests
              {pendingCount > 0 && (
                <span className="ml-2 text-amber-600 font-medium">
                  ({pendingCount} pending)
                </span>
              )}
            </p>
          </div>
          <Button onClick={fetchRequests} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredRequests.length} of {requests.length} requests
        </p>

        {/* Table */}
        <HazmatRequestTable
          requests={filteredRequests}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
