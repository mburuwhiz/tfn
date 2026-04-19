import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit ticket');
      return res.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-slate-900">Get in Touch</h1>
          <p className="text-lg text-slate-600 mb-8">
            Whether you have a question about our plans, need technical support, or want to discuss a custom business solution, our team is ready to help.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-brand-blue/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-brand-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Phone Support</h3>
                <p className="text-slate-600">1-800-TWOEM-FIBRE</p>
                <p className="text-sm text-slate-500">Mon-Fri 8am to 8pm</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-brand-cyan/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-brand-cyan" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email Us</h3>
                <p className="text-slate-600">support@twoem.com</p>
                <p className="text-sm text-slate-500">We aim to reply within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-brand-magenta/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-brand-magenta" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Headquarters</h3>
                <p className="text-slate-600">123 Fibre Way, Tech District</p>
                <p className="text-sm text-slate-500">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-t-4 border-t-brand-blue shadow-lg">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200">
                  Your message has been sent successfully. We will be in touch soon!
                </div>
              )}
              {mutation.isError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
                  Failed to send message. Please try again.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name *</label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email *</label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject *</label>
                  <Input id="subject" name="subject" required value={formData.subject} onChange={handleChange} placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message *</label>
                  <Textarea id="message" name="message" required value={formData.message} onChange={handleChange} placeholder="Your message details..." className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
