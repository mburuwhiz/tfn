import { useQuery } from '@tanstack/react-query';
import { Users, Newspaper, CreditCard, Activity, TrendingUp } from 'lucide-react';
import api from '@/client/lib/api';

import { motion } from 'framer-motion';

const Dashboard = () => {
  const { data: dashboardData } = useQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: async () => {
      const [tickets, plans, news] = await Promise.all([
        api.get('/contact'),
        api.get('/plans'),
        api.get('/news')
      ]);
      
      return {
        stats: {
          totalTickets: tickets.data.length,
          activePlans: plans.data.length,
          newsPosts: news.data.length,
          growth: '+12%'
        },
        recentTickets: tickets.data.slice(0, 3)
      };
    }
  });

  const stats = dashboardData?.stats;
  const recentTickets = dashboardData?.recentTickets || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 md:space-y-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, Administrator.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <Activity size={18} className="text-green-500" />
          <span className="text-xs md:text-sm font-black uppercase tracking-widest">SYSTEM: OPERATIONAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Total Tickets', value: stats?.totalTickets || 0, icon: <Users />, color: 'bg-blue-500' },
          { label: 'Active Plans', value: stats?.activePlans || 0, icon: <CreditCard />, color: 'bg-primary' },
          { label: 'News Posts', value: stats?.newsPosts || 0, icon: <Newspaper />, color: 'bg-purple-500' },
          { label: 'MoM Growth', value: stats?.growth || '0%', icon: <TrendingUp />, color: 'bg-green-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-${stat.color.split('-')[1]}/20`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xl font-bold">Recent Tickets</h3>
          <div className="space-y-6">
            {recentTickets.map((ticket: any, i: number) => (
              <div key={ticket._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                    {ticket.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold">{ticket.name}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">{ticket.message}</div>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                  ticket.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                }`}>
                  {ticket.status}
                </div>
              </div>
            ))}
            {recentTickets.length === 0 && (
              <div className="text-center py-10 text-slate-400 font-medium">No recent tickets</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl space-y-8">
          <h3 className="text-xl font-bold">Network Performance</h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">UPTIME</span>
                <span className="text-primary font-bold">99.9%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[99.9%]"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">BANDWIDTH USAGE</span>
                <span className="text-white font-bold">78%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[78%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
