
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
  
  // 1. Оставляем только цифры
  let digits = value.replace(/\D/g, '');
  
  // 2. Если пользователь вставил номер с кодом +375 или 80... обрезаем лишнее
  if (digits.startsWith('375')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('80')) {
    digits = digits.slice(2);
  }
  
  // 3. Обрезаем до 9 цифр (стандарт РБ без кода страны)
  digits = digits.slice(0, 9);
  
  // 4. Формируем маску (XX) XXX-XX-XX
  if (digits.length === 0) return '';
  
  let formatted = '';
  
  // Код оператора
  if (digits.length > 0) {
    formatted += `(${digits.slice(0, 2)}`;
  }
  
  if (digits.length >= 3) {
    formatted += `) ${digits.slice(2, 5)}`;
  }
  
  if (digits.length >= 6) {
    formatted += `-${digits.slice(5, 7)}`;
  }
  
  if (digits.length >= 8) {
    formatted += `-${digits.slice(7, 9)}`;
  }
  
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

  // Calculation State
  const [calc, setCalc] = useState<{
    days: number;
    originalTotal: number;
    discountPercent: number;
    discountAmount: number;
    finalTotal: number;
  } | null>(null);

  // Get today's date in YYYY-MM-DD format for min attribute
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
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day

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

    // Send to Telegram
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
      console.log('Native picker not supported or blocked');
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-dark-800 border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto rounded-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {step === 'form' ? (
          <div className="p-6 md:p-8">
            <div className="mb-8 border-b border-white/5 pb-4">
              <h3 className="font-serif text-3xl text-white mb-2">Бронирование</h3>
              <p className="text-gold-400 text-sm font-bold uppercase tracking-widest">{car.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 tracking-wider">Ваше имя</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-gold-400 transition-colors" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Александр"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-14 bg-dark-900 border border-white/10 pl-10 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 tracking-wider">Телефон</label>
                <div className="relative group">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                       <Phone className="text-gray-500 w-5 h-5 group-focus-within:text-gold-400 transition-colors" />
                       <span className="text-gray-400 font-medium border-r border-white/10 pr-2">+375</span>
                   </div>
                  <input 
                    type="tel" 
                    required 
                    placeholder="(29) 123-45-67"
                    value={formData.phone || ''}
                    onChange={handlePhoneChange}
                    className="w-full h-14 bg-dark-900 border border-white/10 pl-28 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors rounded-lg font-medium tracking-wide"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 w-full min-w-0">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Начало</label>
                  <div className="relative w-full group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none group-focus-within:text-gold-400" />
                    <input 
                      type="date" 
                      min={today}
                      value={formData.startDate || ''}
                      onChange={handleStartDateChange}
                      onClick={openCalendar}
                      className="w-full h-14 bg-dark-900 border border-white/10 pl-10 pr-3 text-white focus:outline-none focus:border-gold-400 transition-colors cursor-pointer rounded-lg appearance-none"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
                <div className="space-y-2 w-full min-w-0">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Окончание</label>
                  <div className="relative w-full group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none group-focus-within:text-gold-400" />
                    <input 
                      type="date" 
                      min={formData.startDate || today}
                      disabled={!formData.startDate}
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      onClick={openCalendar}
                      className={`w-full h-14 bg-dark-900 border border-white/10 pl-10 pr-3 text-white focus:outline-none focus:border-gold-400 transition-colors cursor-pointer rounded-lg appearance-none ${!formData.startDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>

              {calc && (
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-5 rounded-xl space-y-3">
                      <div className="flex justify-between text-sm text-gray-400">
                          <span>Цена за {calc.days} дн.</span>
                          <span>{calc.originalTotal.toLocaleString()} BYN</span>
                      </div>
                      
                      {calc.discountPercent > 0 && (
                          <div className="flex justify-between text-sm text-green-400">
                              <span>Скидка ({calc.discountPercent}%)</span>
                              <span>- {calc.discountAmount.toLocaleString()} BYN</span>
                          </div>
                      )}
                      
                      <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-1">
                          <span className="text-white font-medium uppercase text-sm tracking-wider">Итого к оплате</span>
                          <span className="text-2xl font-serif text-gold-400">{calc.finalTotal.toLocaleString()} <span className="text-xs align-top">BYN</span></span>
                      </div>
                  </div>
              )}

              <div className="pt-4 mt-6">
                {!calc && (
                    <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-lg">
                        <span className="text-gray-400 text-sm">Цена в сутки</span>
                        <span className="text-xl font-bold text-white">{car.pricePerDay.toLocaleString()} BYN</span>
                    </div>
                )}
                
                <button 
                  type="submit" 
                  className={`w-full font-bold uppercase tracking-widest py-4 transition-all rounded-lg shadow-lg hover:shadow-gold-500/20 hover:-translate-y-1 active:translate-y-0 ${
                       'bg-gold-500 text-black hover:bg-gold-400' 
                  }`}
                >
                  {calc ? 'Подтвердить бронирование' : 'Отправить заявку'}
                </button>
              </div>
            </form>
          </div>
        ) : step === 'sending' ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
             <Loader2 className="w-16 h-16 text-gold-400 animate-spin mb-6" />
             <p className="text-white text-xl font-serif">Обработка заявки...</p>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-8 animate-fade-in-up">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="font-serif text-3xl text-white mb-4">Заявка Принята</h3>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
              Наш менеджер свяжется с вами в течение 15 минут для подтверждения бронирования.
            </p>
            <button 
              onClick={onClose}
              className="px-10 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm font-bold rounded-lg"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
