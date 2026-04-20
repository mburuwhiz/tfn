import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Settings, Users, LogOut, ChevronRight, Image as ImageIcon, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/client/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import api from '@/client/lib/api';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      toast.success('Authenticated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[48px] shadow-2xl border border-slate-100 w-full max-w-md space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="text-center space-y-2 relative z-10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
              <span className="text-white font-black text-2xl">2M</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 font-medium">Enter your credentials to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full bg-slate-900 hover:bg-primary text-white py-8 rounded-2xl font-black text-lg transition-all shadow-xl">
              AUTHENTICATE
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Plans', path: '/admin/plans', icon: <Settings size={20} /> },
    { name: 'News', path: '/admin/news', icon: <Newspaper size={20} /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">2M</span>
          </div>
          <span className="font-black text-slate-900">TWOEM ADMIN</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </Button>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-80 bg-white border-r border-slate-200 flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-10">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">2M</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">TWOEM <span className="text-primary">ADMIN</span></span>
          </Link>
        </div>
        
        <nav className="flex-grow px-6 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                location.pathname === item.path ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm uppercase tracking-widest">{item.name}</span>
              </div>
              <ChevronRight size={16} className={`transition-transform ${location.pathname === item.path ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-4 text-slate-400 hover:text-red-500 font-black text-xs uppercase tracking-[0.2em] transition-colors w-full px-6 py-4">
            <LogOut size={18} />
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[70] lg:hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2M</span>
                  </div>
                  <span className="font-black text-slate-900">TWOEM ADMIN</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <X size={24} />
                </Button>
              </div>
              <nav className="flex-grow px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                      location.pathname === item.path ? 'bg-primary text-white' : 'text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <span className="font-bold uppercase tracking-widest text-xs">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </nav>
              <div className="p-8 border-t border-slate-100">
                <Button variant="destructive" className="w-full py-6 rounded-xl font-black text-xs tracking-widest" onClick={handleLogout}>
                  LOGOUT
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow lg:ml-80 p-6 md:p-12 mt-20 lg:mt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
        <Toaster position="top-right" richColors />
      </main>
    </div>
  );
};

export default AdminLayout;
