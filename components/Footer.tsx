import React from 'react';
import { Car, Instagram, Send, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Car className="w-6 h-6 text-gold-400" />
              <Link to="/" className="text-xl font-serif font-bold tracking-wider text-white">
                Elite<span className="text-gold-400">Drive</span>
              </Link>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Предоставляем исключительный сервис аренды премиальных автомобилей в Минске. Каждый момент за рулем — это искусство.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Компания</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">О нас</Link></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Карьера</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Блог</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Поддержка</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Правила аренды</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">Страхование</Link></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">FAQ</a></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Мы в соцсетях</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all" title="Telegram">
                <Send size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all" title="TikTok">
                <Video size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2024 EliteDrive Belarus. Все права защищены.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-400">Политика конфиденциальности</Link>
            <Link to="/user-agreement" className="hover:text-gray-400">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};