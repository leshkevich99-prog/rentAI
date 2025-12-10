
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-700 border-b ${
          isScrolled
            ? 'bg-dark-950/90 backdrop-blur-md border-white/5 py-4'
            : 'bg-transparent border-transparent py-6 lg:py-8'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="group hover:opacity-80 transition-opacity">
              <Logo />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-[11px] font-medium uppercase tracking-luxury transition-all duration-300 ${
                      isActive(link.path) ? 'text-gold-400' : 'text-gray-400 hover:text-white'
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
            <div className="lg:hidden">
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-dark-950 flex flex-col justify-center items-center transition-all duration-500 ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-2xl font-serif uppercase tracking-widest ${
                 isActive(link.path) ? 'text-gold-400' : 'text-white/60 hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
