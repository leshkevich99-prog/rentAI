import React, { useState } from 'react';
import { X, Phone, User, Loader2, CheckCircle, Calendar, Clock, MapPin, Car } from 'lucide-react';

interface ChauffeurModalProps {
  onClose: () => void;
}

export const ChauffeurModal: React.FC<ChauffeurModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'form' | 'sending' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    duration: 'transfer', // transfer, 3h, 5h, 8h, day
    details: ''
  });

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sending');

    try {
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chauffeur',
          booking: formData
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

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-dark-800 border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up rounded-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {step === 'form' ? (
          <div className="p-8">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">Аренда с водителем</h3>
              <p className="text-gray-400 text-sm">
                Заполните детали поездки, и мы подберем идеальный автомобиль с профессиональным водителем.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Ваше имя</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <input 
                      type="text" 
                      required 
                      placeholder="Иван"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
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
                      placeholder="+375 (29) ..."
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase text-gray-500 tracking-wider">Дата подачи</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5 pointer-events-none" />
                        <input 
                            type="date" 
                            min={today}
                            required
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            onClick={(e) => {try{e.currentTarget.showPicker()}catch(err){}}}
                            className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded cursor-pointer"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-gray-500 tracking-wider">Время</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-500 w-5 h-5 pointer-events-none" />
                        <input 
                            type="time" 
                            required
                            value={formData.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                            onClick={(e) => {try{e.currentTarget.showPicker()}catch(err){}}}
                            className="w-full bg-dark-900 border border-white/10 px-10 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded cursor-pointer"
                        />
                    </div>
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Тип услуги</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded appearance-none"
                  >
                      <option value="transfer">Трансфер (Аэропорт/Точка-Точка)</option>
                      <option value="3h">Почасовая (3 часа)</option>
                      <option value="5h">Почасовая (5 часов)</option>
                      <option value="8h">Полный день (8 часов)</option>
                      <option value="event">Свадьба / Мероприятие</option>
                  </select>
              </div>

              {/* Details */}
              <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 tracking-wider">Маршрут / Пожелания</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <textarea 
                        rows={3}
                        placeholder="Откуда забрать, куда ехать, предпочтения по авто..."
                        value={formData.details}
                        onChange={(e) => handleChange('details', e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors rounded resize-none"
                    />
                  </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gold-400 transition-colors rounded mt-4"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        ) : step === 'sending' ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
             <Loader2 className="w-10 h-10 text-gold-400 animate-spin mb-4" />
             <p className="text-white">Согласовываем детали...</p>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-2">Заявка принята</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Мы свяжемся с вами в ближайшее время для подтверждения автомобиля и водителя.
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