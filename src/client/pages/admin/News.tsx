import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Loader2, Save, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '@/client/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminNews = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<any>({
    title: '',
    richTextContent: '',
    mediaUrl: '',
    date: new Date()
  });

  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const { data } = await api.get('/news');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newNews: any) => {
      if (newNews._id) {
        return api.put(`/news/${newNews._id}`, newNews);
      }
      return api.post('/news', newNews);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      setIsEditing(false);
      setCurrentNews({
        title: '',
        richTextContent: '',
        mediaUrl: '',
        date: new Date()
      });
      toast.success('News article saved!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save news');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast.success('News article deleted.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete news');
    }
  });

  const handleEdit = (item: any) => {
    setCurrentNews(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(currentNews);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentNews({...currentNews, mediaUrl: data.url});
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
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
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">News Management</h1>
          <p className="text-slate-500 font-medium">Create and manage your official fibre updates.</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) {
              setCurrentNews({
                title: '',
                richTextContent: '',
                mediaUrl: '',
                date: new Date()
              });
            }
          }}
          className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          {isEditing ? 'CANCEL' : (
            <><Plus size={20} /> NEW ARTICLE</>
          )}
        </button>
      </div>

      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-200 shadow-2xl space-y-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Article Title</label>
              <input 
                required
                type="text" 
                placeholder="Enter a catchy title..."
                className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-2xl text-2xl font-black outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                value={currentNews.title}
                onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Featured Image</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="flex-grow bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm"
                  />
                  {currentNews.mediaUrl && <img src={currentNews.mediaUrl} className="w-12 h-12 rounded-xl object-cover" />}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm"
                  value={currentNews.date ? new Date(currentNews.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setCurrentNews({...currentNews, date: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 h-[400px]">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Content</label>
              <ReactQuill 
                theme="snow" 
                value={currentNews.richTextContent}
                onChange={(val) => setCurrentNews({...currentNews, richTextContent: val})}
                className="h-[320px] rounded-2xl overflow-hidden"
              />
            </div>

            <button 
              disabled={createMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {currentNews._id ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:max-w-md">
            <input type="text" placeholder="Search news..." className="w-full bg-slate-50 border border-slate-100 px-12 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary text-sm font-bold" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 text-slate-400 font-black text-xs hover:text-slate-900 uppercase tracking-widest"><Filter size={14} /> FILTER</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-4">Title</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {Array.isArray(newsItems) && newsItems.map((item: any) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={item.mediaUrl} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-slate-900 line-clamp-1">{item.title}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-8 py-6">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">LIVE</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-slate-300 hover:text-primary transition-colors p-2"
                    >
                      <Plus size={18} className="rotate-45" /> {/* Using Plus rotated as a quick Edit icon if Settings/Edit not imported, but wait I have Save/Trash */}
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm('Are you sure you want to delete this article?')) {
                          deleteMutation.mutate(item._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
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

export default AdminNews;
