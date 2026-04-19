import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootLayout from '@/layouts/RootLayout';
import AdminLayout from '@/layouts/AdminLayout';

import Home from '@/pages/Home';
import Plans from '@/pages/Plans';
import News from '@/pages/News';
import Contact from '@/pages/Contact';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminNews from '@/pages/admin/AdminNews';
import AdminPlans from '@/pages/admin/AdminPlans';
import AdminTickets from '@/pages/admin/AdminTickets';
import AdminGallery from '@/pages/admin/AdminGallery';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="plans" element={<Plans />} />
            <Route path="news" element={<News />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
