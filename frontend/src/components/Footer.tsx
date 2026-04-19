export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-50 py-8">
      <div className="container flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <img src="/logo.png" alt="Twoem Fibre Network" className="h-6 brightness-0 invert" />
          <span>&copy; {new Date().getFullYear()} Twoem Fibre Network. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-cyan transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-cyan transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
