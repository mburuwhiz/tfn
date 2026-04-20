import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/client/lib/api';

const News = () => {
  const { data: newsItems, isLoading, isError } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data } = await api.get('/news');
      return data;
    },
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center text-primary animate-spin"><Loader2 size={40} /></div>;

  const displayNews = (Array.isArray(newsItems) && newsItems.length > 0) ? newsItems : [
    { title: "Expanding to Mombasa", date: new Date(), richTextContent: "We are thrilled to announce our expansion into the coastal city...", mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600" },
    { title: "Optimizing Your Home WiFi", date: new Date(), richTextContent: "Learn how to get the most out of your high-speed fibre...", mediaUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600" },
    { title: "Community Tech Day 2026", date: new Date(), richTextContent: "Join us for a day of learning and exploration at our headquarters...", mediaUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600" }
  ];

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-none">The <span className="text-primary">Fibre</span> Journal</h1>
            <p className="text-xl text-slate-500">Stay updated with the latest network expansions, tech tips, and community stories from TWOEM.</p>
          </div>
        </div>

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold">
            Failed to fetch live news. Showing archives instead.
          </div>
        )}

        {/* Featured Post */}
        {displayNews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[600px] rounded-[40px] overflow-hidden group cursor-pointer"
          >
            <img src={displayNews[0].mediaUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200'} alt="Featured" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-12 space-y-6 max-w-3xl">
              <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs">FEATURED</span>
                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(displayNews[0].date).toLocaleDateString()}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight group-hover:text-primary transition-colors">
                {displayNews[0].title}
              </h2>
              <div className="text-lg text-white/70 line-clamp-2" dangerouslySetInnerHTML={{ __html: displayNews[0].richTextContent }} />
              <button className="flex items-center gap-3 text-white font-bold hover:text-primary transition-colors">
                READ FULL ARTICLE <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Sleek Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayNews.slice(1).map((item: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer space-y-6"
            >
              <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-lg">
                <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Calendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2"><User size={12} /> ADMIN</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                <div className="text-slate-500 text-sm line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.richTextContent }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Dense Section */}
        <div className="bg-slate-50 rounded-[40px] p-16 flex flex-col md:flex-row items-center gap-12 border border-slate-100">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h3 className="text-4xl font-black">Never Miss an Update</h3>
            <p className="text-lg text-slate-500">Subscribe to our newsletter and get the latest news delivered directly to your inbox every week.</p>
          </div>
          <div className="flex-1 w-full">
            <form className="flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Your email address" className="flex-grow bg-white border border-slate-200 px-8 py-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary shadow-sm" />
              <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl hover:shadow-primary/30">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
