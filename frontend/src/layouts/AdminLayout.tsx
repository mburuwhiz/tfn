import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-800">
          TFN Admin
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/admin/dashboard" className="p-2 hover:bg-slate-800 rounded">Dashboard</Link>
          <Link to="/admin/news" className="p-2 hover:bg-slate-800 rounded">News Editor</Link>
          <Link to="/admin/plans" className="p-2 hover:bg-slate-800 rounded">Plans Manager</Link>
          <Link to="/admin/tickets" className="p-2 hover:bg-slate-800 rounded">Tickets</Link>
          <Link to="/admin/gallery" className="p-2 hover:bg-slate-800 rounded">Gallery Manager</Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="outline" className="w-full text-black" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
