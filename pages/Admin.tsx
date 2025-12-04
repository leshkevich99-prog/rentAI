
import React, { useState, useEffect } from 'react';
import { Car, CarCategory, DiscountRule } from '../types';
import { 
  LayoutDashboard, 
  Car as CarIcon, 
  CalendarDays, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Check,
  X,
  DollarSign,
  Users,
  Menu,
  Settings,
  Upload,
  Lock,
  MessageCircle,
  Database,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Server
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAdminPassword, isConfigured, uploadCarImage, saveCarSecure, deleteCarSecure } from '../services/supabase';
import { Logo } from '../components/Logo';

interface AdminProps {
  cars: Car[];
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ cars, onAddCar, onUpdateCar, onDeleteCar }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'bookings' | 'settings'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const isValid = await checkAdminPassword(password);
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Неверный пароль');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Ошибка соединения с сервером');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    navigate('/');
  };

  // Car Editor Handlers
  const openEditModal = (car?: Car) => {
    if (car) {
      // Ensure discountRules exists
      setCurrentCar({ 
          ...car,
          discountRules: car.discountRules || [
            { days: 3, discount: 10 },
            { days: 5, discount: 15 },
            { days: 15, discount: 20 }
          ]
      });
    } else {
      setCurrentCar({
        id: '', 
        name: '',
        category: CarCategory.SEDAN,
        pricePerDay: 0,
        specs: { hp: 0, zeroToSixty: 0, maxSpeed: 0 },
        imageUrl: '',
        available: true,
        description: '',
        discountRules: [
            { days: 3, discount: 10 },
            { days: 5, discount: 15 },
            { days: 15, discount: 20 }
        ]
      });
    }
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 4.5MB to be safe for Vercel functions)
    if (file.size > 4.5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимальный размер: 4.5 MB');
        return;
    }

    // Demo mode fallback
    if (!isConfigured) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCar({ ...currentCar, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
      alert('Демо режим: Картинка загружена локально как Base64 (не ссылка).');
      return;
    }

    try {
      setIsUploadingImage(true);
      const publicUrl = await uploadCarImage(file);
      setCurrentCar({ ...currentCar, imageUrl: publicUrl });
    } catch (error: any) {
      console.error(error);
      alert(`Ошибка загрузки: ${error.message || 'Попробуйте файл меньшего размера'}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDiscountChange = (index: number, field: keyof DiscountRule, value: number) => {
      const newRules = [...(currentCar.discountRules || [])];
      newRules[index] = { ...newRules[index], [field]: value };
      setCurrentCar({ ...currentCar, discountRules: newRules });
  };

  const addDiscountRule = () => {
      setCurrentCar({
          ...currentCar,
          discountRules: [...(currentCar.discountRules || []), { days: 0, discount: 0 }]
      });
  };

  const removeDiscountRule = (index: number) => {
      const newRules = [...(currentCar.discountRules || [])];
      newRules.splice(index, 1);
      setCurrentCar({ ...currentCar, discountRules: newRules });
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCar.name) return;

    setIsSaving(true);
    try {
      // 1. Secure Server-Side Save
      await saveCarSecure(currentCar as Car, password);
      
      // 2. Update Local UI State
      if (currentCar.id) {
        onUpdateCar(currentCar as Car);
      } else {
        onAddCar(currentCar as Car);
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      alert('Ошибка сохранения: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecureDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      try {
        await deleteCarSecure(id, password);
        onDeleteCar(id);
      } catch (error: any) {
        console.error(error);
        alert('Ошибка удаления: ' + error.message);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-dark-900 border border-white/10 p-8 rounded-2xl shadow-2xl relative">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-xl font-serif text-white mb-2">Панель управления</h2>
            <p className="text-gray-400">Безопасный вход</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2 tracking-widest">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none rounded"
                placeholder="Введите пароль администратора"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button className="w-full bg-gold-500 text-black font-bold uppercase py-3 hover:bg-gold-400 transition-colors rounded">
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex text-gray-100 font-sans relative">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-dark-900 border-b border-white/5 p-4 flex items-center justify-between">
        <Link to="/">
           <Logo variant="icon" />
        </Link>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-900 border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/5 hidden md:block">
           <Link to="/">
              <Logo />
            </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0">
          <button 
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Обзор</span>
          </button>
          <button 
             onClick={() => { setActiveTab('fleet'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'fleet' ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <CarIcon size={20} />
            <span className="font-medium">Автопарк</span>
          </button>
          <button 
             onClick={() => { setActiveTab('bookings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bookings' ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <CalendarDays size={20} />
            <span className="font-medium">Заявки</span>
          </button>
          <button 
             onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Settings size={20} />
            <span className="font-medium">Настройки</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-black min-h-screen md:ml-64 pt-28 md:pt-8 w-full overflow-hidden">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl font-serif text-white mb-8">Обзор показателей</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><DollarSign size={24} /></div>
                  <span className="text-green-500 text-sm font-bold">+12%</span>
                </div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Выручка за месяц</h3>
                <p className="text-2xl md:text-3xl font-bold text-white">125k BYN</p>
              </div>

              <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><CalendarDays size={24} /></div>
                  <span className="text-blue-500 text-sm font-bold">+5</span>
                </div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Активные аренды</h3>
                <p className="text-2xl md:text-3xl font-bold text-white">12</p>
              </div>

              <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gold-500/10 rounded-lg text-gold-500"><Users size={24} /></div>
                  <span className="text-gold-500 text-sm font-bold">+28</span>
                </div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Новые клиенты</h3>
                <p className="text-2xl md:text-3xl font-bold text-white">145</p>
              </div>
            </div>
          </div>
        )}

        {/* Fleet View */}
        {activeTab === 'fleet' && (
          <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h1 className="text-2xl md:text-3xl font-serif text-white">Управление автопарком</h1>
              <button 
                onClick={() => openEditModal()}
                className="bg-gold-500 text-black px-4 py-3 md:py-2 rounded font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-gold-400 transition-colors w-full md:w-auto"
              >
                <Plus size={18} /> Добавить авто
              </button>
            </div>

            <div className="bg-dark-900 rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Автомобиль</th>
                      <th className="px-6 py-4">Категория</th>
                      <th className="px-6 py-4">Цена / день</th>
                      <th className="px-6 py-4">Статус</th>
                      <th className="px-6 py-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {cars.map(car => (
                      <tr key={car.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={car.imageUrl} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded object-cover bg-gray-800" />
                            <span className="font-bold text-white text-sm md:text-base">{car.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs border border-white/10 text-gray-300">
                            {car.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gold-400 font-medium">
                          {car.pricePerDay.toLocaleString()} BYN
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${car.available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {car.available ? 'Доступен' : 'Занят'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => openEditModal(car)}
                            className="p-2 hover:text-gold-400 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleSecureDelete(car.id)}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in-up pb-12">
            <h1 className="text-2xl md:text-3xl font-serif text-white mb-8">Настройки и Безопасность</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Database Status */}
              <div className="bg-dark-900 p-6 rounded-xl border border-white/5 lg:col-span-2">
                 <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><Database size={24} /></div>
                  <h3 className="text-xl font-bold text-white">Статус Базы Данных</h3>
                </div>
                
                {isConfigured ? (
                  <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-500/10 rounded-full shrink-0">
                         <ShieldCheck className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-2">Supabase Подключен</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Приложение успешно использует ключи из переменных окружения.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-yellow-500/10 rounded-full shrink-0">
                         <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-2">Работа в Демо-режиме</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-2">
                           Ключи <code>VITE_SUPABASE_URL</code> и <code>VITE_SUPABASE_ANON_KEY</code> не найдены в окружении.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Vercel Environment Info */}
              <div className="bg-dark-900 p-6 rounded-xl border border-white/5 lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Server size={24} /></div>
                  <h3 className="text-xl font-bold text-white">Переменные Окружения</h3>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Настройки безопасности и интеграций теперь управляются через панель Vercel. 
                    Для изменения пароля администратора или токенов Telegram, пожалуйста, перейдите в настройки проекта:
                  </p>
                  <p className="text-sm font-mono text-gold-400 mb-6 bg-black/50 p-4 rounded block">
                    Settings &rarr; Environment Variables
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Telegram Bot Token</h4>
                      <code className="text-xs text-gray-500">TELEGRAM_BOT_TOKEN</code>
                    </div>
                     <div>
                      <h4 className="text-white font-bold text-sm mb-1">Telegram Chat ID</h4>
                      <code className="text-xs text-gray-500">TELEGRAM_CHAT_ID</code>
                    </div>
                     <div>
                      <h4 className="text-white font-bold text-sm mb-1">Пароль Администратора</h4>
                      <code className="text-xs text-gray-500">ADMIN_PASSWORD</code>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Bookings View - Mock */}
        {activeTab === 'bookings' && (
           <div className="animate-fade-in-up">
             <h1 className="text-2xl md:text-3xl font-serif text-white mb-8">Заявки на бронирование</h1>
             <div className="bg-dark-900 rounded-xl border border-white/5 overflow-hidden">
                <div className="p-8 text-center text-gray-500">
                    <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Заявки отправляются напрямую в ваш Telegram.</p>
                </div>
             </div>
           </div>
        )}

      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsEditing(false)}
          />

          {/* Modal Positioning Wrapper */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-dark-800 rounded-2xl border border-white/10 shadow-2xl z-10 my-8">
              
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-dark-800 rounded-t-2xl">
                <h3 className="text-xl font-serif text-white pr-8">
                  {currentCar.id ? 'Редактировать' : 'Добавить'} автомобиль
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              {/* Form Content */}
              <form onSubmit={handleSaveCar} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Название</label>
                    <input 
                      required
                      type="text" 
                      value={currentCar.name || ''}
                      onChange={e => setCurrentCar({...currentCar, name: e.target.value})}
                      className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Категория</label>
                    <select 
                      value={currentCar.category || CarCategory.SEDAN}
                      onChange={e => setCurrentCar({...currentCar, category: e.target.value as CarCategory})}
                      className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    >
                      {Object.values(CarCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-xs uppercase text-gray-500 mb-2">Изображение</label>
                   
                   <div className="flex flex-col gap-4">
                      {/* Preview */}
                      {currentCar.imageUrl && (
                          <div className="relative h-40 w-full rounded overflow-hidden border border-white/10 bg-black/20">
                              <img src={currentCar.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                      )}
                      
                      <div className="flex gap-2">
                          <label className={`flex-1 cursor-pointer bg-dark-900 border border-white/10 p-3 text-white rounded hover:border-gold-400 transition-colors flex items-center justify-center gap-2 ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                              {isUploadingImage ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                              <span>{isUploadingImage ? 'Загрузка...' : 'Загрузить фото (Server)'}</span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploadingImage} />
                          </label>
                      </div>
                      
                      <div className="relative">
                          <span className="absolute -top-2 left-3 bg-dark-800 px-2 text-[10px] text-gray-500">Ссылка (генерируется автоматически)</span>
                          <input 
                              type="text" 
                              value={currentCar.imageUrl || ''}
                              onChange={e => setCurrentCar({...currentCar, imageUrl: e.target.value})}
                              className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none text-sm"
                              placeholder="https://..."
                              readOnly
                          />
                      </div>
                   </div>
                </div>

                 {/* Description */}
                 <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Описание</label>
                    <textarea 
                      rows={4}
                      value={currentCar.description || ''}
                      onChange={e => setCurrentCar({...currentCar, description: e.target.value})}
                      placeholder="Подробное описание автомобиля..."
                      className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    />
                 </div>

                {/* Discount Rules */}
                <div className="bg-dark-900 border border-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs uppercase text-gray-500">Правила скидок</label>
                        <button 
                          type="button"
                          onClick={addDiscountRule}
                          className="text-xs text-gold-400 hover:text-white uppercase font-bold flex items-center gap-1"
                        >
                            <Plus size={12} /> Добавить правило
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {(currentCar.discountRules || []).map((rule, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 block mb-1">Больше дней</label>
                                    <input 
                                      type="number"
                                      value={rule.days}
                                      onChange={(e) => handleDiscountChange(idx, 'days', Number(e.target.value))}
                                      className="w-full bg-dark-800 border border-white/10 p-2 text-white rounded focus:border-gold-400 focus:outline-none text-sm"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 block mb-1">Скидка %</label>
                                    <input 
                                      type="number"
                                      value={rule.discount}
                                      onChange={(e) => handleDiscountChange(idx, 'discount', Number(e.target.value))}
                                      className="w-full bg-dark-800 border border-white/10 p-2 text-white rounded focus:border-gold-400 focus:outline-none text-sm"
                                    />
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => removeDiscountRule(idx)}
                                  className="mt-4 p-2 text-red-500 hover:text-white"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {(currentCar.discountRules || []).length === 0 && (
                            <p className="text-sm text-gray-500 italic">Нет правил скидок. Будут использоваться значения по умолчанию.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                     <label className="block text-xs uppercase text-gray-500 mb-2">Цена / Сутки (BYN)</label>
                     <input 
                        required
                        type="number" 
                        value={currentCar.pricePerDay || 0}
                        onChange={e => setCurrentCar({...currentCar, pricePerDay: Number(e.target.value)})}
                        className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                     />
                  </div>
                   <div className="flex items-center md:pt-8 gap-3">
                     <input 
                        type="checkbox" 
                        id="available"
                        checked={currentCar.available || false}
                        onChange={e => setCurrentCar({...currentCar, available: e.target.checked})}
                        className="w-5 h-5 accent-gold-500"
                     />
                     <label htmlFor="available" className="text-white">Доступен для аренды</label>
                   </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-white mb-4 font-medium">Характеристики</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2">Мощность (л.с.)</label>
                      <input 
                        type="number" 
                        value={currentCar.specs?.hp || 0}
                        onChange={e => setCurrentCar({
                          ...currentCar, 
                          specs: { ...(currentCar.specs || { hp:0, zeroToSixty:0, maxSpeed:0 }), hp: Number(e.target.value) }
                        })}
                        className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2">Разгон 0-100</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={currentCar.specs?.zeroToSixty || 0}
                        onChange={e => setCurrentCar({
                          ...currentCar, 
                          specs: { ...(currentCar.specs || { hp:0, zeroToSixty:0, maxSpeed:0 }), zeroToSixty: Number(e.target.value) }
                        })}
                        className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2">Макс. скорость</label>
                      <input 
                        type="number" 
                        value={currentCar.specs?.maxSpeed || 0}
                        onChange={e => setCurrentCar({
                          ...currentCar, 
                          specs: { ...(currentCar.specs || { hp:0, zeroToSixty:0, maxSpeed:0 }), maxSpeed: Number(e.target.value) }
                        })}
                        className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col md:flex-row gap-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-gold-500 text-black font-bold uppercase py-3 hover:bg-gold-400 transition-colors rounded"
                    disabled={isUploadingImage || isSaving}
                  >
                    {isUploadingImage ? 'Ждем загрузку...' : isSaving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white/10 text-white font-bold uppercase py-3 hover:bg-white/20 transition-colors rounded"
                    disabled={isSaving}
                  >
                    Отмена
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
