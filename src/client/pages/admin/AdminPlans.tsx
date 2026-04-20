import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Loader2, Save, Trash2, Settings } from 'lucide-react';
import api from '@/client/lib/api';
import { toast } from 'sonner';

import { motion } from 'framer-motion';

const AdminPlans = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>({
    title: '',
    speed: '',
    price: '',
    features: ['']
  });

  const { data: plans, isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const { data } = await api.get('/plans');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newPlan: any) => {
      if (newPlan._id) {
        return api.put(`/plans/${newPlan._id}`, newPlan);
      }
      return api.post('/plans', newPlan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      setIsEditing(false);
      setCurrentPlan({
        title: '',
        speed: '',
        price: '',
        features: ['']
      });
      toast.success('Subscription plan saved!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save plan');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast.success('Subscription plan deleted.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete plan');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(currentPlan);
  };

  const handleEdit = (plan: any) => {
    setCurrentPlan(plan);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddFeature = () => {
    setCurrentPlan({...currentPlan, features: [...currentPlan.features, '']});
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...currentPlan.features];
    newFeatures[index] = value;
    setCurrentPlan({...currentPlan, features: newFeatures});
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = currentPlan.features.filter((_: any, i: number) => i !== index);
    setCurrentPlan({...currentPlan, features: newFeatures});
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
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">Plan Management</h1>
          <p className="text-slate-500 font-medium">Configure your fibre subscription packages.</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) {
              setCurrentPlan({
                title: '',
                speed: '',
                price: '',
                features: ['']
              });
            }
          }}
          className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          {isEditing ? 'CANCEL' : (
            <><Plus size={20} /> NEW PLAN</>
          )}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-200 shadow-2xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Plan Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Premium"
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  value={currentPlan.title}
                  onChange={(e) => setCurrentPlan({...currentPlan, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Speed</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. 50 Mbps"
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  value={currentPlan.speed}
                  onChange={(e) => setCurrentPlan({...currentPlan, speed: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Price (KES)</label>
                <input 
                  required
                  type="number" 
                  placeholder="e.g. 5000"
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  value={currentPlan.price}
                  onChange={(e) => setCurrentPlan({...currentPlan, price: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                Plan Features
                <button type="button" onClick={handleAddFeature} className="text-primary hover:underline font-bold">+ ADD FEATURE</button>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPlan.features.map((feature: string, idx: number) => (
                  <div key={idx} className="relative group/feat">
                    <input 
                      type="text" 
                      placeholder="e.g. Unlimited Data"
                      className="w-full bg-slate-50 border border-slate-100 px-6 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary pr-12"
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    />
                    {currentPlan.features.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button 
              disabled={createMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {currentPlan._id ? 'UPDATE PLAN' : 'SAVE PLAN'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(plans) && plans.map((plan: any) => (
          <div key={plan._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 relative group overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">{plan.title}</h3>
                <div className="text-4xl font-black text-slate-900">{plan.speed}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-slate-900">KES {plan.price.toLocaleString()}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PER MONTH</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {plan.features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> {f}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              <button 
                onClick={() => handleEdit(plan)}
                className="flex-grow bg-slate-50 text-slate-900 py-3 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <Settings size={14} /> EDIT
              </button>
              <button 
                onClick={() => {
                  if(confirm('Are you sure you want to delete this plan?')) {
                    deleteMutation.mutate(plan._id);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="bg-slate-50 text-slate-300 hover:text-red-500 p-3 rounded-xl transition-all disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminPlans;
