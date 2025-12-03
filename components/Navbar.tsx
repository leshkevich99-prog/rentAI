import React, { useState, useEffect } from 'react';
import { Menu, X, Car } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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

  const navLinks = [
    { name: 'Автопарк', path: '/fleet' },
    { name: 'Условия', path: '/terms' },
    { name: 'Услуги', path: '/services' },
    { name: 'О нас', path: '/about' },
    { name: 'Контакты', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isScrolled || location.pathname !== '/'
          ? 'bg-dark-900/80 backdrop-blur-xl border-white/5 py-4 shadow-lg shadow-black/50'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Car className="w-8 h-8 text-gold-400 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-serif font-bold tracking-wider text-white">
              LÉ<span className="text-gold-400 group-hover:text-white transition-colors">ON</span>
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-xs font-bold uppercase tracking-[0.15em] transition-colors py-2 group ${
                    isActive(link.path) ? 'text-gold-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[1px] bg-gold-400 transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 transition-transform active:scale-90"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-dark-900/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-4 py-4 text-sm font-bold uppercase tracking-widest border-l-2 transition-all ${
                 isActive(link.path) 
                 ? 'border-gold-400 text-gold-400 bg-white/5' 
                 : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};