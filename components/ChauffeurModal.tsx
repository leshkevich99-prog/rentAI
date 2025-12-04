
import React, { useState } from 'react';
import { X, Phone, User, Loader2, CheckCircle, MapPin, Car } from 'lucide-react';

interface ChauffeurModalProps {
  onClose: () => void;
}

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('375')) digits = digits.slice(3);
  else if (digits.startsWith('80')) digits = digits.slice(2);
  digits = digits.slice(0, 9);
  
  if (digits.length === 0) return '';
  let formatted = '';
  if (digits.length > 0) formatted += `(${digits.slice(0, 2)}`;
  if (digits.length >= 3) formatted += `) ${digits.slice(2, 5)}`;
  if (digits.length >= 6) formatted += `-${digits.slice(5, 7)}`;
  if (digits.length >= 8) formatted += `-${digits.slice(7, 9)}`;
  return formatted;
};

export const ChauffeurModal: React.FC<ChauffeurModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'form' | 'sending' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    duration: 'transfer', // transfer, 3h, 5h, 8h, event
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sending');

    try {
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chauffeur',
          booking: {
            ...formData,
            phone: '+375 ' + formData.phone,
            // Fields removed from UI, but backend might expect them or we just omit them.
            // Sending default values just in case.
            date: 'По согласованию', 
            time: 'По согласованию'
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-dark-800 border-t sm:border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up sm:rounded-xl rounded-t-2xl max-h-[90vh] flex flex-col h-auto">
        
        {/* HEADER - Sticky */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-dark-900 shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <Car className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-serif text-lg md:text-xl text-white">Аренда с водителем</h3>
             </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>
        </div>

        {/* BODY - Scrollable */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {step === 'form' ? (
            <form id="chauffeur-form" onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-400 text-xs mb-2">
                Заполните заявку, и мы свяжемся с вами для согласования времени и маршрута.
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold">Ваше имя</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-gold-400 transition-colors" />
                    <input 
                      type="text" 
                      required 
                      placeholder="Иван"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full h-12 bg-dark-900 border border-white/10 pl-9 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors appearance-none rounded-lg text-sm"
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
                      placeholder="(29) ..."
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full h-12 bg-dark-900 border border-white/10 pl-24 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors appearance-none rounded-lg font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold">Тип услуги</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="w-full h-12 bg-dark-900 border border-white/10 px-4 text-white focus:outline-none focus:border-gold-400 transition-colors appearance-none rounded-lg text-sm"
                  >
                      <option value="transfer">Трансфер (Аэропорт/Точка-Точка)</option>
                      <option value="3h">Почасовая (3 часа)</option>
                      <option value="5h">Почасовая (5 часов)</option>
                      <option value="8h">Полный день (8 часов)</option>
                      <option value="event">Свадьба / Мероприятие</option>
                  </select>
              </div>

              {/* Details */}
              <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold">Маршрут / Пожелания</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 text-gray-500 w-4 h-4 group-focus-within:text-gold-400" />
                    <textarea 
                        rows={3}
                        placeholder="Куда ехать, какое авто предпочитаете..."
                        value={formData.details}
                        onChange={(e) => handleChange('details', e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 pl-9 pr-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded-lg resize-none text-sm"
                    />
                  </div>
              </div>
            </form>
          ) : step === 'sending' ? (
            <div className="flex flex-col items-center justify-center py-10">
                 <Loader2 className="w-12 h-12 text-gold-400 animate-spin mb-4" />
                 <p className="text-white text-lg font-serif">Согласовываем детали...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-fade-in-up">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">Заявка принята</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Мы скоро свяжемся с вами.
                </p>
            </div>
          )}
        </div>

        {/* FOOTER - Sticky */}
        <div className="p-4 border-t border-white/5 bg-dark-900 shrink-0 z-10 pb-6 sm:pb-4">
           {step === 'form' ? (
                <button 
                  form="chauffeur-form"
                  type="submit" 
                  className="w-full bg-white text-black font-bold uppercase tracking-widest py-3.5 hover:bg-gold-400 transition-colors rounded-lg shadow-lg active:scale-[0.98] text-sm"
                >
                  Отправить заявку
                </button>
           ) : step === 'success' ? (
                <button 
                  onClick={onClose}
                  className="w-full border border-white/20 text-white font-bold uppercase tracking-widest py-3.5 hover:bg-white hover:text-black transition-colors rounded-lg text-sm"
                >
                  Закрыть
                </button>
           ) : (
               <button disabled className="w-full py-3.5 bg-white/5 text-gray-500 rounded-lg text-sm uppercase font-bold tracking-widest cursor-not-allowed">
                    Отправка...
               </button>
           )}
        </div>

      </div>
    </div>
  );
};
