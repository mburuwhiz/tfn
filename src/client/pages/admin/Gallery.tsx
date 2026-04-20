import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Loader2, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '@/client/lib/api';
import { toast } from 'sonner';

import { motion } from 'framer-motion';

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<any>({
    imageUrl: '',
    description: ''
  });

  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data } = await api.get('/gallery');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newItem: any) => api.post('/gallery', newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      setIsEditing(false);
      setCurrentImage({ imageUrl: '', description: '' });
      toast.success('Image added to gallery!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add image');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Image removed from gallery.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete image');
    }
  });

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    const toastId = toast.loading('Uploading image...');
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentImage({...currentImage, imageUrl: data.url});
      toast.success('Image uploaded!', { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentImage.imageUrl) return toast.error('Please upload an image');
    createMutation.mutate(currentImage);
  };

  if (isLoading) return <div className="h-full flex items-center justify-center text-primary animate-spin"><Loader2 size={40} /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900">Gallery Manager</h1>
          <p className="text-slate-500">Manage images for your website's gallery.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          {isEditing ? 'CANCEL' : (
            <><Plus size={20} /> ADD IMAGE</>
          )}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Upload Image</label>
                <div className="flex flex-col gap-4">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm"
                  />
                  {currentImage.imageUrl && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100">
                      <img src={currentImage.imageUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Describe this image..."
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none"
                  value={currentImage.description}
                  onChange={(e) => setCurrentImage({...currentImage, description: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={createMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              SAVE TO GALLERY
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.isArray(galleryItems) && galleryItems.map((item: any) => (
          <div key={item._id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    if(confirm('Delete this image?')) {
                      deleteMutation.mutate(item._id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="bg-white text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 line-clamp-2 font-medium">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {(!galleryItems || galleryItems.length === 0) && !isLoading && (
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
          <ImageIcon className="mx-auto text-slate-200 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-400">No images in gallery</h3>
          <p className="text-slate-400 text-sm">Upload your first image to get started.</p>
        </div>
      )}
    </motion.div>
  );
};

export default AdminGallery;
