import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Loader2, CheckCircle2, Clock, Trash2, Phone, Mail, Send } from 'lucide-react';
import api from '@/client/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const AdminTickets = () => {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const { data } = await api.get('/contact');
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, replyMessage }: { id: string, status: string, replyMessage?: string }) =>
      api.patch(`/contact/${id}`, { status, replyMessage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success('Ticket resolved and reply sent!');
      setReplyingTo(null);
      setReplyMessage('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to resolve ticket');
    }
  });

  const deleteTicketMutation = useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success('Ticket deleted.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete ticket');
    }
  });

  const handleResolve = (ticketId: string) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message.');
      return;
    }
    updateStatusMutation.mutate({ id: ticketId, status: 'resolved', replyMessage });
  };

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
                <td className="px-8 py-6 align-top">
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
                <td className="px-8 py-6 max-w-md align-top">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4">{ticket.message}</p>

                  <AnimatePresence>
                    {replyingTo === ticket._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply to the customer..."
                          className="w-full min-h-[100px] p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyMessage('');
                            }}
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleResolve(ticket._id)}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-secondary transition-colors disabled:opacity-50"
                          >
                            {updateStatusMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            Send & Resolve
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
                <td className="px-8 py-6 align-top">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {ticket.status === 'resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {ticket.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-slate-400 font-medium align-top">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right align-top">
                  <div className="flex items-center justify-end gap-2">
                    {ticket.status !== 'resolved' && replyingTo !== ticket._id && (
                      <button 
                        onClick={() => {
                          setReplyingTo(ticket._id);
                          setReplyMessage('');
                        }}
                        className="bg-primary text-white p-2 rounded-xl hover:bg-secondary transition-all"
                        title="Reply and Resolve"
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
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
                      title="Delete Ticket"
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
