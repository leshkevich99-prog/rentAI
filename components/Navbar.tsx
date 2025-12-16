
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Instagram, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Автопарк', path: '/fleet' },
    { name: 'Условия', path: '/terms' },
    { name: 'Услуги', path: '/services' },
    { name: 'О нас', path: '/about' },
    { name: 'Контакты', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-dark-950/90 backdrop-blur-md border-b border-white/5 py-4'
            : 'bg-transparent border-transparent py-8'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="group hover:opacity-80 transition-opacity z-50 relative">
              <Logo />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-xs font-bold uppercase tracking-luxury transition-all duration-300 ${
                      isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span 
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-px bg-gold-400 transition-all duration-500 ${
                            isActive(link.path) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full'
                        }`} 
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden z-50 relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gold-400 transition-colors p-2"
              >
                {isMobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Simplified Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8 mb-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-lg font-bold uppercase tracking-[0.2em] transition-colors ${
                 isActive(link.path) ? 'text-gold-400' : 'text-white hover:text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="w-12 h-px bg-white/10 mb-8" />

        <div className="flex flex-col items-center gap-6">
           <a 
              href="tel:+375257422222"
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
           >
              <Phone size={18} />
              <span className="text-sm tracking-wider">+375 (25) 742-22-22</span>
           </a>
           <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="https://t.me/username" className="text-gray-500 hover:text-white transition-colors"><Send size={20} /></a>
           </div>
        </div>
      </div>
    </>
  );
};
