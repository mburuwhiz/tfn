import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function News() {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/news`);
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    }
  });

  return (
    <div className="container py-12 bg-slate-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-slate-900">Network Updates</h1>
        <p className="text-lg text-slate-500">The latest news, maintenance schedules, and announcements.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Failed to load news. Please try again later.</div>
      ) : news?.length === 0 ? (
        <div className="text-center text-slate-500 py-10">No news updates available.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item: any, i: number) => (
             <motion.div
             key={item._id}
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.1, duration: 0.3 }}
           >
             <Card className="h-full flex flex-col overflow-hidden">
               {item.mediaUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-slate-200">
                     {item.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null ? (
                        <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                     ) : (
                        <iframe src={item.mediaUrl} className="w-full h-full border-0" allowFullScreen />
                     )}
                  </div>
               )}
               <CardHeader className="pb-4">
                 <CardDescription className="text-xs font-semibold text-brand-blue uppercase tracking-wider">
                   {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                 </CardDescription>
                 <CardTitle className="text-xl line-clamp-2 leading-tight">{item.title}</CardTitle>
               </CardHeader>
               <CardContent className="flex-1">
                 <div
                   className="text-sm text-slate-600 prose prose-sm max-w-none line-clamp-4"
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }}
                 />
               </CardContent>
             </Card>
           </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
