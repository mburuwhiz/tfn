import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Loader2, CheckCircle2, Clock, Trash2, Phone, Mail } from 'lucide-react';
import api from '@/client/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminTickets = () => {
  const queryClient = useQueryClient();
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const { data } = await api.get('/contact');
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => api.patch(`/contact/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success('Ticket status updated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update ticket');
    }
  });

  const deleteTicketMutation = useMutation({
    mutationFn: (id: string) => {
      console.log('FRONTEND - ATTEMPTING DELETE:', id);
      return api.delete(`/contact/${id}`);
    },
    onSuccess: (data: any) => {
      console.log('FRONTEND - DELETE SUCCESS:', data);
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success('Ticket deleted.');
    },
    onError: (err: any) => {
      console.error('FRONTEND - DELETE FAILED:', err);
      toast.error(err.response?.data?.message || 'Failed to delete ticket');
    }
  });

  if (isLoading) return <div className="h-full flex items-center justify-center text-primary animate-spin"><Loader2 size={40} /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 md:space-y-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900">Support Tickets</h1>
          <p className="text-slate-500 font-medium">Manage customer inquiries and support requests.</p>
        </div>
        <div className="relative w-full md:max-w-md">
          <input type="text" placeholder="Search tickets..." className="w-full bg-white border border-slate-200 px-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary shadow-sm" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Message</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.isArray(tickets) && tickets.map((ticket: any) => (
              <tr key={ticket._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{ticket.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Phone size={10} /> {ticket.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mail size={10} /> {ticket.email}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 max-w-md">
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">{ticket.message}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {ticket.status === 'resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {ticket.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {ticket.status !== 'resolved' && (
                      <button 
                        disabled={updateStatusMutation.isPending}
                        onClick={() => updateStatusMutation.mutate({ id: ticket._id, status: 'resolved' })}
                        className="bg-primary text-white p-2 rounded-xl hover:bg-secondary transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button 
                      disabled={deleteTicketMutation.isPending}
                      onClick={() => {
                        if(confirm('Delete this ticket?')) {
                          deleteTicketMutation.mutate(ticket._id);
                        }
                      }}
                      className="text-slate-200 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </motion.div>
  );
};

export default AdminTickets;
