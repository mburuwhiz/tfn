import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/client/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import { toast, Toaster } from "sonner";
import api from '@/client/lib/api';

const RootLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketData, setTicketData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', ticketData);
      toast.success('Ticket created! We will contact you soon.');
      setIsTicketOpen(false);
      setTicketData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Plans', path: '/plans' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Sticky Glassmorphic Navbar */}
      <nav className="glass sticky top-0 z-50 px-4 md:px-12 py-4 flex items-center justify-between transition-all duration-300">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl">2M</span>
          </div>
          <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
            TWOEM FIBRE
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`text-sm font-bold tracking-tight transition-all hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-slate-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <Dialog open={isTicketOpen} onOpenChange={setIsTicketOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-secondary text-white rounded-2xl px-8 py-6 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                GET STARTED
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[32px] border-none shadow-2xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <DialogHeader className="space-y-4 relative z-10">
                <DialogTitle className="text-3xl font-black text-slate-900">Start Your Journey</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Enter your details and our team will get you connected in no time.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTicketSubmit} className="space-y-6 mt-8 relative z-10">
                <div className="space-y-4">
                  <Input 
                    placeholder="Full Name" 
                    required 
                    className="bg-slate-50 border-slate-100 rounded-xl h-14 px-6 focus:ring-primary"
                    value={ticketData.name}
                    onChange={(e) => setTicketData({...ticketData, name: e.target.value})}
                  />
                  <Input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    className="bg-slate-50 border-slate-100 rounded-xl h-14 px-6 focus:ring-primary"
                    value={ticketData.email}
                    onChange={(e) => setTicketData({...ticketData, email: e.target.value})}
                  />
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required 
                    className="bg-slate-50 border-slate-100 rounded-xl h-14 px-6 focus:ring-primary"
                    value={ticketData.phone}
                    onChange={(e) => setTicketData({...ticketData, phone: e.target.value})}
                  />
                  <textarea 
                    placeholder="How can we help?" 
                    required 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-6 focus:ring-2 focus:ring-primary outline-none transition-all h-32 resize-none"
                    value={ticketData.message}
                    onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-primary text-white h-14 rounded-xl font-bold text-lg transition-all"
                >
                  {isSubmitting ? 'Sending...' : 'SUBMIT REQUEST'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Modern Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8 md:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2M</span>
                </div>
                <span className="text-lg font-black text-slate-900">TWOEM</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  key={link.path}
                >
                  <Link 
                    to={link.path} 
                    className={`text-4xl font-black flex items-center justify-between group ${
                      location.pathname === link.path ? 'text-primary' : 'text-slate-900'
                    }`}
                  >
                    {link.name}
                    <ChevronRight className="group-hover:translate-x-2 transition-transform text-slate-300" size={32} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-6">
              <Button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsTicketOpen(true);
                }}
                className="w-full bg-primary hover:bg-secondary text-white h-16 rounded-2xl font-black text-xl shadow-xl shadow-primary/20"
              >
                GET STARTED NOW
              </Button>
              <div className="flex justify-center gap-8 text-slate-400">
                <span className="font-bold text-sm">FB</span>
                <span className="font-bold text-sm">TW</span>
                <span className="font-bold text-sm">IG</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Float Action Button for Mobile */}
      <button 
        onClick={() => setIsTicketOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 animate-bounce"
      >
        <MessageSquare size={24} />
      </button>

      {/* Dense Professional Footer */}
      <footer className="bg-slate-900 text-slate-300 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2M</span>
              </div>
              <h3 className="text-white text-2xl font-black tracking-tight">TWOEM FIBRE</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Empowering the digital era with high-speed, reliable fibre optic connectivity across the nation.
            </p>
            <div className="flex space-x-6">
              <span className="text-xs font-black text-slate-500 hover:text-primary cursor-pointer transition-colors">FACEBOOK</span>
              <span className="text-xs font-black text-slate-500 hover:text-primary cursor-pointer transition-colors">TWITTER</span>
              <span className="text-xs font-black text-slate-500 hover:text-primary cursor-pointer transition-colors">INSTAGRAM</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Quick Navigation</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="hover:text-primary transition-colors">Home Experience</Link></li>
              <li><Link to="/plans" className="hover:text-primary transition-colors">Fibre Packages</Link></li>
              <li><Link to="/news" className="hover:text-primary transition-colors">Company Journal</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Support Center</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Direct Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center space-x-3 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-primary">
                  <Phone size={14} />
                </div>
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-primary">
                  <Mail size={14} />
                </div>
                <span>info@twoem.com</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-primary">
                  <MapPin size={14} />
                </div>
                <span>Nairobi HQ, Kenya</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Newsletter</h4>
            <p className="text-sm text-slate-400">Get early access to our coverage expansion updates.</p>
            <div className="flex bg-slate-800 p-2 rounded-2xl">
              <input type="email" placeholder="Your Email" className="bg-transparent border-none px-4 py-2 focus:ring-0 w-full text-sm font-bold" />
              <button className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-secondary transition-all font-black text-xs">JOIN</button>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">&copy; 2026 TWOEM FIBRE NETWORK. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </footer>
    </div>
  );
};

export default RootLayout;
