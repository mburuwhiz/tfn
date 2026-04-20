import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import api from '@/client/lib/api';

const Gallery = () => {
  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ['public-gallery'],
    queryFn: async () => {
      const { data } = await api.get('/gallery');
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary animate-spin">
        <Loader2 size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          >
            <ImageIcon size={14} /> Our Community in Focus
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter"
          >
            Network <span className="text-primary">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium"
          >
            Take a look at our recent installations and community events.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(galleryItems) && galleryItems.length > 0 ? (
            galleryItems.map((item: any, idx: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-square rounded-[32px] overflow-hidden bg-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.description || 'Gallery image'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {item.description && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <p className="text-white font-bold text-lg leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.description}
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-400 font-bold">No gallery items found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
