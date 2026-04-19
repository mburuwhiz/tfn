import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/news`);
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string, content: string, mediaUrl: string }) => {
      const res = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create news');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      setTitle('');
      setContent('');
      setMediaUrl('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete news');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMediaUrl(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">News Editor</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Media (Upload Image or Paste URL)</label>
              <div className="flex gap-2">
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="flex-1" />
                <Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Or paste YouTube embed URL" className="flex-1" />
              </div>
              {isUploading && <div className="text-sm text-brand-blue flex items-center"><Loader2 className="w-4 h-4 animate-spin mr-1"/> Uploading...</div>}
              {mediaUrl && <img src={mediaUrl} alt="Preview" className="h-20 object-cover rounded mt-2" />}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <div className="bg-white">
                <ReactQuill theme="snow" value={content} onChange={setContent} className="h-48 mb-12" />
              </div>
            </div>
            <Button
              onClick={() => createMutation.mutate({ title, content, mediaUrl })}
              disabled={createMutation.isPending || !title || !content}
              className="w-full"
            >
              {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publish Article'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-brand-blue" /></div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {news?.map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500">{format(new Date(item.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {if(window.confirm('Delete?')) deleteMutation.mutate(item._id)}}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
