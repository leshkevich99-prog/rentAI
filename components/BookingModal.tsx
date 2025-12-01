import React, { useState } from 'react';
import { X, Calendar, User, Phone, CheckCircle } from 'lucide-react';
import { Car } from '../types';

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ car, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (!car) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setStep('success'), 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-800 border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {step === 'form' ? (
          <div className="p-8">
            <div className="mb-6">
              <h3 className="font-serif text-2xl text-white mb-1">Бронирование</h3>
              <p className="text-gold-400 text-sm font-bold uppercase tracking-wider">{car.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 tracking-wider">Ваше имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Александр"
                    className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
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
                    className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Начало</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-dark-900 border border-white/10 pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors calendar-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Окончание</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-dark-900 border border-white/10 pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors calendar-input"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Итого в сутки:</span>
                  <span className="text-xl font-bold text-white">{car.pricePerDay.toLocaleString()} BYN</span>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gold-500 text-black font-bold uppercase tracking-widest py-4 hover:bg-gold-400 transition-colors"
                >
                  Подтвердить
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-serif text-3xl text-white mb-4">Заявка Принята</h3>
            <p className="text-gray-400 mb-8 max-w-xs">
              Наш менеджер свяжется с вами в течение 15 минут для подтверждения бронирования {car.name}.
            </p>
            <button 
              onClick={onClose}
              className="px-8 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm font-bold"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};