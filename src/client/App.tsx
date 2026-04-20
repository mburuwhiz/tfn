import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootLayout from './components/RootLayout.tsx';
import Home from './pages/Home.tsx';
import Plans from './pages/Plans.tsx';
import News from './pages/News.tsx';
import Gallery from './pages/Gallery.tsx';
import Contact from './pages/Contact.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import AdminNews from './pages/admin/News.tsx';
import AdminPlans from './pages/admin/AdminPlans.tsx';
import AdminTickets from './pages/admin/Tickets.tsx';
import AdminGallery from './pages/admin/Gallery.tsx';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="plans" element={<Plans />} />
            <Route path="news" element={<News />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="tickets" element={<AdminTickets />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
