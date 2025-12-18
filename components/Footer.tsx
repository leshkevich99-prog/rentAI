
import React from 'react';
import { Instagram, Send, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useTranslation } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark-900 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">{t('footer.company')}</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/fleet" className="hover:text-gold-400 transition-colors">{t('nav.fleet')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">{t('footer.support')}</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">{t('nav.terms')}</Link></li>
              <li><Link to="/services" className="hover:text-gold-400 transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">{t('footer.social')}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://t.me/leonrental" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all" title="Telegram">
                <Send size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all" title="TikTok">
                <Video size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-400">{t('footer.privacy')}</Link>
            <Link to="/user-agreement" className="hover:text-gray-400">{t('footer.agreement')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
