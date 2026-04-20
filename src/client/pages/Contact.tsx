import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Shield, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/client/lib/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Info & Features */}
        <div className="space-y-16">
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl font-black text-slate-900 leading-none"
            >
              Get in <span className="text-primary">Touch</span>
            </motion.h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              Have questions about our fibre coverage or need technical support? Our team is here to help you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold">Call Us</h3>
              <p className="text-slate-500 text-sm leading-relaxed">+254 700 000 000<br/>+254 711 000 000</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold">Email Us</h3>
              <p className="text-slate-500 text-sm leading-relaxed">info@twoem.com<br/>support@twoem.com</p>
            </div>
          </div>

          <div className="space-y-8 bg-slate-900 text-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
            <h3 className="text-2xl font-bold relative z-10">Why Choose TWOEM?</h3>
            <div className="space-y-6 relative z-10">
              {[
                { icon: <Clock size={18} />, title: "Average response time < 5 mins" },
                { icon: <Shield size={18} />, title: "Enterprise-grade data security" },
                { icon: <MessageSquare size={18} />, title: "Multilingual support team" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-slate-300">
                  <div className="text-primary">{item.icon}</div>
                  <span className="font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-2xl shadow-primary/5"
        >
          {isSuccess ? (
            <div className="text-center py-20 space-y-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Message Received!</h2>
              <p className="text-slate-500 text-lg">Thank you for reaching out. One of our representatives will contact you shortly.</p>
              <button onClick={() => setIsSuccess(false)} className="text-primary font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  placeholder="+254 700 000 000"
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SENDING...' : (
                  <>SEND MESSAGE <Send size={20} /></>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
