
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-white mb-8 border-b border-gold-400/20 pb-6">
          {t('legal.privacyTitle')}
        </h1>
        
        <div className="text-gray-400 space-y-8 leading-relaxed font-light text-sm md:text-base">
          <p className="italic text-gray-300">{t('legal.privacyIntro')}</p>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.privacyS1')}
            </h2>
            <div className="space-y-3 pl-4">
              <p>{t('legal.privacyS1_1')}</p>
              <p>{t('legal.privacyS1_2')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.privacyS2')}
            </h2>
            <div className="space-y-3 pl-4">
              <p>{t('legal.privacyS2_1')}</p>
              <p>{t('legal.privacyS2_2')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.privacyS3')}
            </h2>
            <div className="space-y-2 pl-4">
              <p>• {t('legal.privacyS3_1')}</p>
              <p>• {t('legal.privacyS3_2')}</p>
              <p>• {t('legal.privacyS3_3')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.privacyS4')}
            </h2>
            <div className="pl-4">
              <p>{t('legal.privacyS4_1')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.privacyS5')}
            </h2>
            <div className="pl-4">
              <p>{t('legal.privacyS5_1')}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.privacyS6')}
            </h2>
            <div className="pl-4">
              <p>{t('legal.privacyS6_1')}</p>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
            Last updated: May 2025 | LÉON PREMIUM RENTAL
          </div>
        </div>
      </div>
    </section>
  );
};
