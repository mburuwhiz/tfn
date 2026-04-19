import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminGallery() {
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/gallery`);
      if (!res.ok) throw new Error('Failed to fetch gallery');
      return res.json();
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: { url: string, description: string }) => {
      const res = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to add image');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      setDescription('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete image');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
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
        addMutation.mutate({ url: data.url, description });
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gallery Manager</h1>

      <Card>
        <CardHeader><CardTitle>Upload New Image</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end max-w-xl">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Image description..." />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Select Image</label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading || addMutation.isPending} />
            </div>
          </div>
          {(isUploading || addMutation.isPending) && <div className="mt-4 flex items-center text-sm text-brand-blue"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading and saving...</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Gallery Images</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center p-4"><Loader2 className="animate-spin text-brand-blue" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery?.map((img: any) => (
                <div key={img._id} className="relative group rounded-lg overflow-hidden border">
                  <img src={img.url} alt={img.description} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="sm" onClick={() => {if(window.confirm('Delete?')) deleteMutation.mutate(img._id)}}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
