
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowRight, Instagram, Send } from 'lucide-react';
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
    { name: 'Автопарк', path: '/fleet', desc: 'Спорткары и Люкс' },
    { name: 'Условия', path: '/terms', desc: 'Правила аренды' },
    { name: 'Услуги', path: '/services', desc: 'Сервис и опции' },
    { name: 'О нас', path: '/about', desc: 'История LÉON' },
    { name: 'Контакты', path: '/contact', desc: 'Связаться с нами' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5 py-4'
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

      {/* Premium Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.725,0,1)] ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="h-full flex flex-col pt-24 pb-8 px-6 overflow-y-auto">
          
          {/* Menu Items */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                to={link.path}
                className={`group flex items-center justify-between py-2 border-b border-white/5 transition-all duration-500 transform ${
                   isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div>
                   <span className={`block font-serif text-3xl font-medium tracking-wide transition-colors ${
                      isActive(link.path) ? 'text-gold-400' : 'text-white group-hover:text-gold-200'
                   }`}>
                      {link.name}
                   </span>
                   <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">
                      {link.desc}
                   </span>
                </div>
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                    isActive(link.path) ? 'bg-gold-400 text-black border-gold-400' : 'text-gray-500 group-hover:border-gold-400 group-hover:text-gold-400'
                }`}>
                    <ArrowRight size={14} className="-rotate-45" />
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Info Area */}
          <div className={`mt-12 space-y-6 transition-all duration-700 delay-300 transform ${
             isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
             <div className="grid grid-cols-2 gap-4">
                <a 
                   href="tel:+375257422222"
                   className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-lg text-white hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all"
                >
                   <Phone size={18} />
                   <span className="text-xs font-bold uppercase tracking-wider">Позвонить</span>
                </a>
                <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 rounded-lg">
                   <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                   <div className="w-px h-4 bg-white/10"></div>
                   <a href="https://t.me/username" className="text-gray-400 hover:text-white transition-colors"><Send size={20} /></a>
                </div>
             </div>
             
             <div className="text-center">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                   Minsk • Daily 09:00 - 22:00
                </p>
             </div>
          </div>

        </div>
      </div>
    </>
  );
};
