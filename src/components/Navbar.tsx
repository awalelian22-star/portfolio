import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, Menu, X, Heart, Search, LogOut } from 'lucide-react';
import { auth } from '@/src/lib/firebase';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b",
        isScrolled 
          ? "bg-black/60 backdrop-blur-md py-4 border-white/10" 
          : "bg-transparent py-6 border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 group">
          <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center transition-all duration-300 group-hover:neon-border">
            <div className="w-2 h-2 bg-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-glow">
            NEON<span className="font-thin opacity-50">_MODS</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.2em] transition-colors relative group",
                location.pathname === link.path ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full",
                location.pathname === link.path && "w-full"
              )} />
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white">
              ADMIN_ROOT
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="hidden sm:block text-white/60 hover:text-white transition-colors">
            <Search size={18} />
          </button>
          
          <Link to="/wishlist" className="text-white/60 hover:text-white transition-colors relative">
            <Heart size={18} />
          </Link>

          <Link to="/cart" className="text-white/60 hover:text-white transition-colors relative">
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-white/60">
                {profile?.displayName || user.email?.split('@')[0]}
              </Link>
              <button 
                onClick={() => logout()}
                className="text-white/40 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white/60 hover:text-white transition-colors">
              <User size={18} />
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest text-white/60 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest text-white/40 hover:text-white"
                >
                  ADMIN_ROOT
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
