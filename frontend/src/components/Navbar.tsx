import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* We'll assume the logo is in the public folder */}
          <img src="/logo.png" alt="Twoem Fibre Network" className="h-8" />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/plans" className="hover:text-primary transition-colors">Plans</Link>
          <Link to="/news" className="hover:text-primary transition-colors">News</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="default">
            <Link to="/contact">Get Connected</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
