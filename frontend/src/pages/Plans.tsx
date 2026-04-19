import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Plans() {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/plans`);
      if (!res.ok) throw new Error('Failed to fetch plans');
      return res.json();
    }
  });

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Subscription Plans</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Detailed breakdown of our premium connectivity packages. All plans include free installation and a high-performance router.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Failed to load plans. Please try again later.</div>
      ) : plans?.length === 0 ? (
        <div className="text-center text-slate-500 py-10">No plans currently available.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan: any, i: number) => (
             <motion.div
             key={plan._id}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.1 }}
           >
             <Card className={`h-full flex flex-col relative ${plan.isPopular ? 'border-brand-blue shadow-md' : ''}`}>
               {plan.isPopular && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                   Most Popular
                 </div>
               )}
               <CardHeader>
                 <CardTitle className="text-xl">{plan.name}</CardTitle>
                 <CardDescription className="text-lg font-semibold text-slate-900">{plan.speed}</CardDescription>
               </CardHeader>
               <CardContent className="flex-1">
                 <div className="mb-6">
                   <span className="text-3xl font-bold">${plan.price}</span>
                   <span className="text-slate-500 text-sm">/mo</span>
                 </div>
                 <ul className="space-y-2 text-sm text-slate-600">
                   {plan.features?.map((feature: string, idx: number) => (
                     <li key={idx} className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-brand-magenta flex-shrink-0" />
                       <span>{feature}</span>
                     </li>
                   ))}
                 </ul>
               </CardContent>
               <CardFooter>
                 <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'} asChild>
                   <Link to="/contact">Select Plan</Link>
                 </Button>
               </CardFooter>
             </Card>
           </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
