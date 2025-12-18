
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
      <h1 className="text-9xl font-serif text-gold-400 font-bold mb-4 opacity-80 select-none">404</h1>
      <h2 className="text-3xl md:text-4xl text-white font-serif mb-6">{t('error.notfound')}</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
        {t('error.notfoundDesc')}
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-gold-500 text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors rounded-sm"
      >
        <Home size={18} />
        {t('error.backHome')}
      </Link>
    </div>
  );
};
