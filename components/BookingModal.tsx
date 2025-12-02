import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, CheckCircle, Loader2, Calculator } from 'lucide-react';
import { Car } from '../types';
import { BookingDetails } from '../types';
import { sendTelegramBooking } from '../services/telegram';

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ car, onClose }) => {
  const [step, setStep] = useState<'form' | 'sending' | 'success'>('form');
  const [formData, setFormData] = useState<Partial<BookingDetails>>({
    name: '',
    phone: '',
    startDate: '',
    endDate: ''
  });

  // Calculation State
  const [calc, setCalc] = useState<{
    days: number;
    originalTotal: number;
    discountPercent: number;
    discountAmount: number;
    finalTotal: number;
  } | null>(null);

  useEffect(() => {
    if (formData.startDate && formData.endDate && car) {
      calculatePrice(formData.startDate, formData.endDate);
    } else {
      setCalc(null);
    }
  }, [formData.startDate, formData.endDate, car]);

  const calculatePrice = (start: string, end: string) => {
    if (!car) return;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day

    if (days <= 0 || isNaN(days)) {
        setCalc(null);
        return;
    }

    const originalTotal = days * car.pricePerDay;
    let discountPercent = 0;

    // Default rules if none provided
    const rules = car.discountRules && car.discountRules.length > 0 
        ? car.discountRules 
        : [
            { days: 3, discount: 10 },
            { days: 5, discount: 15 },
            { days: 15, discount: 20 }
        ];

    // Find highest applicable discount
    // "Больше 3 дней" means days > 3
    const applicableRule = rules
        .filter(r => days > r.days)
        .sort((a, b) => b.discount - a.discount)[0];

    if (applicableRule) {
        discountPercent = applicableRule.discount;
    }

    const discountAmount = Math.round(originalTotal * (discountPercent / 100));
    const finalTotal = originalTotal - discountAmount;

    setCalc({
        days,
        originalTotal,
        discountPercent,
        discountAmount,
        finalTotal
    });
  };

  if (!car) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sending');

    const booking: BookingDetails = {
      carId: car.id,
      name: formData.name || '',
      phone: formData.phone || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      totalPrice: calc?.finalTotal,
      days: calc?.days,
      discountApplied: calc?.discountPercent
    };

    // Send to Telegram
    await sendTelegramBooking(booking, car);
    
    setStep('success');
  };

  // Helper to open calendar on click
  const openCalendar = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      if ('showPicker' in HTMLInputElement.prototype) {
        e.currentTarget.showPicker();
      }
    } catch (error) {
      // Fallback for older browsers or if prevented
      console.log('Native picker not supported or blocked');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-800 border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
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
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>

              {/* Changed grid-cols-2 to stack on mobile (grid-cols-1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Начало</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5 pointer-events-none" />
                    <input 
                      type="date" 
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      onClick={openCalendar}
                      className="w-full bg-dark-900 border border-white/10 pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors calendar-input cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Окончание</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5 pointer-events-none" />
                    <input 
                      type="date" 
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      onClick={openCalendar}
                      className="w-full bg-dark-900 border border-white/10 pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors calendar-input cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Расчет стоимости */}
              {calc && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                          <span>Цена за {calc.days} дн. ({car.pricePerDay} BYN/сут)</span>
                          <span>{calc.originalTotal.toLocaleString()} BYN</span>
                      </div>
                      
                      {calc.discountPercent > 0 && (
                          <div className="flex justify-between text-sm text-green-400">
                              <span>Скидка ({calc.discountPercent}%)</span>
                              <span>- {calc.discountAmount.toLocaleString()} BYN</span>
                          </div>
                      )}
                      
                      <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-2">
                          <span className="text-white font-medium">Итого к оплате</span>
                          <span className="text-xl font-bold text-gold-400">{calc.finalTotal.toLocaleString()} BYN</span>
                      </div>
                  </div>
              )}

              <div className="pt-4 border-t border-white/10 mt-6">
                {!calc && (
                    <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Цена в сутки:</span>
                    <span className="text-xl font-bold text-white">{car.pricePerDay.toLocaleString()} BYN</span>
                    </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={!calc}
                  className={`w-full font-bold uppercase tracking-widest py-4 transition-colors ${
                      calc 
                      ? 'bg-gold-500 text-black hover:bg-gold-400' 
                      : 'bg-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {calc ? 'Подтвердить бронирование' : 'Выберите даты'}
                </button>
              </div>
            </form>
          </div>
        ) : step === 'sending' ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
             <Loader2 className="w-12 h-12 text-gold-400 animate-spin mb-4" />
             <p className="text-white text-lg">Обработка заявки...</p>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-serif text-3xl text-white mb-4">Заявка Принята</h3>
            <p className="text-gray-400 mb-8 max-w-xs">
              Наш менеджер свяжется с вами в течение 15 минут для подтверждения бронирования.
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