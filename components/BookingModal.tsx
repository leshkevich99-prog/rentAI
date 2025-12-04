
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { Car } from '../types';
import { BookingDetails } from '../types';
import { sendTelegramBooking } from '../services/telegram';

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
}

// Improved Phone formatter helper
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('375')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('80')) {
    digits = digits.slice(2);
  }
  digits = digits.slice(0, 9);
  if (digits.length === 0) return '';
  let formatted = '';
  if (digits.length > 0) formatted += `(${digits.slice(0, 2)}`;
  if (digits.length >= 3) formatted += `) ${digits.slice(2, 5)}`;
  if (digits.length >= 6) formatted += `-${digits.slice(5, 7)}`;
  if (digits.length >= 8) formatted += `-${digits.slice(7, 9)}`;
  return formatted;
};

export const BookingModal: React.FC<BookingModalProps> = ({ car, onClose }) => {
  const [step, setStep] = useState<'form' | 'sending' | 'success'>('form');
  const [formData, setFormData] = useState<Partial<BookingDetails>>({
    name: '',
    phone: '',
    startDate: '',
    endDate: ''
  });

  const [calc, setCalc] = useState<{
    days: number;
    originalTotal: number;
    discountPercent: number;
    discountAmount: number;
    finalTotal: number;
  } | null>(null);

  const today = new Date().toISOString().split('T')[0];

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
    if (endDate < startDate) {
        setCalc(null);
        return;
    }
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    if (days <= 0 || isNaN(days)) {
        setCalc(null);
        return;
    }

    const originalTotal = days * car.pricePerDay;
    let discountPercent = 0;

    const rules = car.discountRules && car.discountRules.length > 0 
        ? car.discountRules 
        : [
            { days: 3, discount: 10 },
            { days: 5, discount: 15 },
            { days: 15, discount: 20 }
        ];

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
      phone: '+375 ' + formData.phone,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      totalPrice: calc?.finalTotal,
      days: calc?.days,
      discountApplied: calc?.discountPercent
    };

    const success = await sendTelegramBooking(booking, car);
    
    if (success) {
        setStep('success');
    } else {
        alert('Не удалось отправить заявку. Пожалуйста, проверьте соединение или свяжитесь с нами по телефону.');
        setStep('form');
    }
  };

  const openCalendar = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      if ('showPicker' in HTMLInputElement.prototype) {
        e.currentTarget.showPicker();
      }
    } catch (error) {
      console.log('Native picker not supported');
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    let newEndDate = formData.endDate;
    if (formData.endDate && newStartDate > formData.endDate) {
        newEndDate = '';
    }
    setFormData({ 
        ...formData, 
        startDate: newStartDate,
        endDate: newEndDate
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const formatted = formatPhoneNumber(val);
      setFormData({...formData, phone: formatted});
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-5">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-dark-800 border-t sm:border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up sm:rounded-xl rounded-t-2xl max-h-[95vh] flex flex-col h-auto">
        
        {/* HEADER - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-dark-900 shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-serif text-xl sm:text-2xl text-white leading-none mb-1">Бронирование</h3>
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest truncate">{car.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full shrink-0"
            >
              <X size={20} />
            </button>
        </div>

        {/* BODY - Scrollable */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {step === 'form' ? (
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold">Ваше имя</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-gold-400 transition-colors" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Александр"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 bg-dark-900 border border-white/10 pl-9 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold">Телефон</label>
                <div className="relative group">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                       <Phone className="text-gray-500 w-4 h-4 group-focus-within:text-gold-400 transition-colors" />
                       <span className="text-gray-400 font-medium border-r border-white/10 pr-2 text-sm">+375</span>
                   </div>
                  <input 
                    type="tel" 
                    required 
                    placeholder="(29) 123-45-67"
                    value={formData.phone || ''}
                    onChange={handlePhoneChange}
                    className="w-full h-12 bg-dark-900 border border-white/10 pl-24 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors rounded-lg font-medium tracking-wide text-sm"
                  />
                </div>
              </div>

              {/* Date Inputs - Always Grid (Side-by-side on mobile) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold">Начало</label>
                  <div className="relative w-full group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none group-focus-within:text-gold-400" />
                    <input 
                      type="date" 
                      min={today}
                      value={formData.startDate || ''}
                      onChange={handleStartDateChange}
                      onClick={openCalendar}
                      className="w-full h-12 bg-dark-900 border border-white/10 pl-9 pr-2 text-white focus:outline-none focus:border-gold-400 transition-colors cursor-pointer rounded-lg appearance-none text-xs sm:text-sm"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold">Окончание</label>
                  <div className="relative w-full group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none group-focus-within:text-gold-400" />
                    <input 
                      type="date" 
                      min={formData.startDate || today}
                      disabled={!formData.startDate}
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      onClick={openCalendar}
                      className={`w-full h-12 bg-dark-900 border border-white/10 pl-9 pr-2 text-white focus:outline-none focus:border-gold-400 transition-colors cursor-pointer rounded-lg appearance-none text-xs sm:text-sm ${!formData.startDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>

              {calc && (
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                          <span>Цена за {calc.days} дн.</span>
                          <span>{calc.originalTotal.toLocaleString()} BYN</span>
                      </div>
                      
                      {calc.discountPercent > 0 && (
                          <div className="flex justify-between text-xs text-green-400">
                              <span>Скидка ({calc.discountPercent}%)</span>
                              <span>- {calc.discountAmount.toLocaleString()} BYN</span>
                          </div>
                      )}
                      
                      <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-1">
                          <span className="text-white font-medium uppercase text-xs tracking-wider">Итого</span>
                          <span className="text-xl font-serif text-gold-400">{calc.finalTotal.toLocaleString()} <span className="text-[10px] align-top">BYN</span></span>
                      </div>
                  </div>
              )}

              {!calc && (
                   <div className="bg-white/5 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Стоимость</span>
                        <span className="text-white font-bold text-sm">{car.pricePerDay.toLocaleString()} BYN / сутки</span>
                   </div>
              )}
            </form>
          ) : step === 'sending' ? (
             <div className="flex flex-col items-center justify-center py-10">
                 <Loader2 className="w-12 h-12 text-gold-400 animate-spin mb-4" />
                 <p className="text-white text-lg font-serif">Обработка заявки...</p>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 animate-fade-in-up">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">Заявка Принята</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Менеджер свяжется с вами в течение 15 минут.
                </p>
            </div>
          )}
        </div>

        {/* FOOTER - Fixed Button */}
        <div className="p-4 border-t border-white/5 bg-dark-900 shrink-0 z-10 pb-6 sm:pb-4">
            {step === 'form' ? (
                <button 
                  form="booking-form"
                  type="submit" 
                  className="w-full font-bold uppercase tracking-widest py-3.5 bg-gold-500 text-black hover:bg-gold-400 rounded-lg shadow-lg hover:shadow-gold-500/20 transition-all active:scale-[0.98] text-sm"
                >
                  {calc ? 'Подтвердить бронирование' : 'Отправить заявку'}
                </button>
            ) : step === 'success' ? (
                <button 
                  onClick={onClose}
                  className="w-full font-bold uppercase tracking-widest py-3.5 border border-white/20 text-white hover:bg-white hover:text-black rounded-lg transition-all text-sm"
                >
                  Закрыть
                </button>
            ) : (
                <button disabled className="w-full py-3.5 bg-white/5 text-gray-500 rounded-lg text-sm uppercase font-bold tracking-widest cursor-not-allowed">
                    Подождите...
                </button>
            )}
        </div>

      </div>
    </div>
  );
};
