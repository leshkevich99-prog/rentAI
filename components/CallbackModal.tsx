import React, { useState } from 'react';
import { X, Phone, User, Loader2, CheckCircle, PhoneCall } from 'lucide-react';

interface CallbackModalProps {
  onClose: () => void;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'form' | 'sending' | 'success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sending');

    try {
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'callback',
          booking: { name, phone }
        }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        alert('Ошибка отправки. Попробуйте позже.');
        setStep('form');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка соединения.');
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-dark-800 border border-white/10 w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up rounded-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {step === 'form' ? (
          <div className="p-8">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">Обратный звонок</h3>
              <p className="text-gray-400 text-sm">
                Оставьте номер, и мы перезвоним вам в течение 15 минут.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 tracking-wider">Ваше имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Иван"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 tracking-wider">Телефон</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input 
                    type="tel" 
                    required 
                    placeholder="+375 (29) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gold-500 text-black font-bold uppercase tracking-widest py-4 hover:bg-gold-400 transition-colors rounded mt-4"
              >
                Жду звонка
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Или</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <a 
                href="tel:+375291234567"
                className="w-full flex items-center justify-center gap-2 border border-white/20 text-white font-bold uppercase tracking-widest py-3 hover:bg-white hover:text-black transition-colors rounded"
              >
                <PhoneCall size={18} />
                Позвонить сейчас
              </a>
            </form>
          </div>
        ) : step === 'sending' ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
             <Loader2 className="w-10 h-10 text-gold-400 animate-spin mb-4" />
             <p className="text-white">Отправляем запрос...</p>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-2">Запрос отправлен</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Скоро с вами свяжется наш менеджер.
            </p>
            <button 
              onClick={onClose}
              className="px-8 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs font-bold rounded"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};