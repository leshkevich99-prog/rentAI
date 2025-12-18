
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

export const UserAgreement: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-white mb-8 border-b border-gold-400/20 pb-6">
          {t('legal.agreementTitle')}
        </h1>
        
        <div className="text-gray-400 space-y-8 leading-relaxed font-light text-sm md:text-base">
          <p className="italic text-gray-300">{t('legal.agreementIntro')}</p>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.agreementS1')}
            </h2>
            <div className="space-y-3 pl-4">
              <p>{t('legal.agreementS1_1')}</p>
              <p>{t('legal.agreementS1_2')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.agreementS2')}
            </h2>
            <div className="space-y-3 pl-4">
              <p>{t('legal.agreementS2_1')}</p>
              <p>{t('legal.agreementS2_2')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.agreementS3')}
            </h2>
            <div className="space-y-3 pl-4">
              <p>{t('legal.agreementS3_1')}</p>
              <p>{t('legal.agreementS3_2')}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.agreementS4')}
            </h2>
            <div className="space-y-3 pl-4">
              <p>{t('legal.agreementS4_1')}</p>
              <p>{t('legal.agreementS4_2')}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-gold-400 block" />
              {t('legal.agreementS5')}
            </h2>
            <div className="pl-4">
              <p>{t('legal.agreementS5_1')}</p>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
            Terms of Service | LÉON PREMIUM RENTAL BY ROMAN BATURO
          </div>
        </div>
      </div>
    </section>
  );
};
