
import React, { useState } from 'react';
import { X, Phone, User, Loader2, CheckCircle, Send, MessageCircle } from 'lucide-react';

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
          booking: { 
            name, 
            phone
          }
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
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-dark-900 border border-white/10 w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 bg-white/5 rounded-full"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {step === 'form' ? (
          <div className="p-8">
            <div className="mb-8 text-center">
              <h3 className="font-serif text-2xl text-white mb-2">Обратный звонок</h3>
              <p className="text-gray-400 text-sm font-light">
                Оставьте номер, и мы перезвоним в ближайшее время.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-bold">Ваше имя</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-gold-400 transition-colors" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Иван"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 bg-dark-950 border border-white/10 pl-10 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-bold">Телефон</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-gold-400 transition-colors" />
                  <input 
                    type="text" 
                    required 
                    placeholder="+375..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 bg-dark-950 border border-white/10 pl-10 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors font-medium tracking-wide text-sm rounded-lg"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gold-500 text-black font-bold uppercase tracking-widest py-4 hover:bg-gold-400 transition-colors text-xs rounded-lg"
              >
                Жду звонка
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Или напишите нам</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a 
                    href="https://wa.me/375257422222"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold uppercase text-[10px] tracking-widest py-3.5 hover:bg-[#20ba5a] transition-all rounded-lg shadow-lg shadow-[#25D366]/20 group"
                >
                    <MessageCircle size={16} className="group-hover:scale-110 transition-transform" /> 
                    WhatsApp
                </a>
                <a 
                    href="https://t.me/leonrental"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#0088cc] text-white font-bold uppercase text-[10px] tracking-widest py-3.5 hover:bg-[#0077b5] transition-all rounded-lg shadow-lg shadow-[#0088cc]/20 group"
                >
                    <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> 
                    Telegram
                </a>
              </div>
            </form>
          </div>
        ) : step === 'sending' ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
             <Loader2 className="w-10 h-10 text-gold-400 animate-spin mb-4" />
             <p className="text-white font-serif">Отправляем запрос...</p>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-fade-in-up">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-2">Запрос отправлен</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Скоро с вами свяжется наш менеджер.
            </p>
            <button 
              onClick={onClose}
              className="px-8 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs font-bold rounded-lg"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
