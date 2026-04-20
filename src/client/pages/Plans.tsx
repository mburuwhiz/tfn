import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/client/lib/api';

const Plans = () => {
  const { data: plans, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data } = await api.get('/plans');
      return data;
    },
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center text-primary animate-spin"><Loader2 size={40} /></div>;

  const displayPlans = (Array.isArray(plans) && plans.length > 0) ? plans : [
    { title: "Standard", speed: "15 Mbps", price: 2500, features: ["Unlimited Data", "Free Installation", "Single Device"] },
    { title: "Premium", speed: "50 Mbps", price: 5000, features: ["Unlimited Data", "Free Installation", "Multi-Device Support", "24/7 Support"] },
    { title: "Ultra", speed: "100 Mbps", price: 8500, features: ["Unlimited Data", "Free Router", "Priority Support", "Public IP"] },
    { title: "Enterprise", speed: "500 Mbps", price: 25000, features: ["Dedicated Line", "SLA Support", "Public IP Block", "Custom Installation"] }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-black text-slate-900 leading-tight">Our <span className="text-primary">Fibre</span> Plans</h1>
          <p className="text-xl text-slate-500">We have a wide range of plans to suit your home and business needs. Choose the one that's right for you.</p>
          <div className="relative max-w-md mx-auto">
            <input type="text" placeholder="Search plans..." className="w-full bg-white border border-slate-200 px-12 py-4 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold">
            Failed to fetch live plans. Showing catalog instead.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayPlans.map((plan: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full"
            >
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">{plan.title}</h3>
                <div className="text-5xl font-black group-hover:text-primary transition-colors">{plan.speed}</div>
              </div>
              
              <div className="text-3xl font-black text-slate-900 mb-8">
                KES {plan.price.toLocaleString()}
                <span className="text-sm font-medium text-slate-400 ml-1">/mo</span>
              </div>

              <div className="space-y-4 flex-grow mb-12">
                {plan.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Check size={12} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Link 
                to="/contact" 
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-primary transition-all hover:shadow-xl hover:shadow-primary/30 text-center"
              >
                Choose Plan
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Dense content section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl">
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Free Installation</h4>
            <p className="text-slate-500 text-sm">All our residential plans come with free installation and a complimentary router.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold">24/7 Support</h4>
            <p className="text-slate-500 text-sm">Experience zero downtime with our dedicated technical support team available around the clock.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold">No Hidden Fees</h4>
            <p className="text-slate-500 text-sm">What you see is what you pay. No activation fees, no extra taxes, just simple billing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
