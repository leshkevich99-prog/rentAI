import React, { useState, useEffect } from 'react';
import { Car, CarCategory } from '../types';
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
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAdminPassword, updateAdminPassword, getTelegramSettings, saveTelegramSettings, isUsingEnv } from '../services/supabase';

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
  
  // Settings State
  const [newPassword, setNewPassword] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [settingsStatus, setSettingsStatus] = useState('');
  
  // Supabase Settings State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const navigate = useNavigate();

  // Load Settings
  useEffect(() => {
    // Load local storage keys for Supabase
    setSupabaseUrl(localStorage.getItem('supabase_project_url') || '');
    setSupabaseKey(localStorage.getItem('supabase_anon_key') || '');

    if (activeTab === 'settings' && isAuthenticated) {
      getTelegramSettings().then(settings => {
        setTelegramToken(settings.botToken);
        setTelegramChatId(settings.chatId);
      });
    }
  }, [activeTab, isAuthenticated]);

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
      setLoginError('Ошибка входа. Попробуйте пароль "admin", если база не настроена.');
    }
  };

  const handleResetSettings = () => {
    if(window.confirm('Это сбросит настройки подключения к Supabase в браузере. Продолжить?')) {
      localStorage.removeItem('supabase_project_url');
      localStorage.removeItem('supabase_anon_key');
      window.location.reload();
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
      setCurrentCar({ ...car });
    } else {
      setCurrentCar({
        id: '', 
        name: '',
        category: CarCategory.SEDAN,
        pricePerDay: 0,
        specs: { hp: 0, zeroToSixty: 0, maxSpeed: 0 },
        imageUrl: '',
        available: true
      });
    }
    setIsEditing(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCar({ ...currentCar, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCar.name) {
      if (currentCar.id) {
        onUpdateCar(currentCar as Car);
      } else {
        onAddCar(currentCar as Car);
      }
      setIsEditing(false);
    }
  };

  // Settings Handlers
  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus('Сохранение Telegram...');
    try {
      await saveTelegramSettings(telegramToken, telegramChatId);
      setSettingsStatus('Telegram настройки сохранены!');
      setTimeout(() => setSettingsStatus(''), 3000);
    } catch (error) {
      setSettingsStatus('Ошибка сохранения. Проверьте подключение к БД.');
    }
  };
  
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setSettingsStatus('Обновление пароля...');
    try {
      await updateAdminPassword(newPassword);
      setNewPassword('');
      setSettingsStatus('Пароль успешно обновлен!');
      setTimeout(() => setSettingsStatus(''), 3000);
    } catch (error) {
      setSettingsStatus('Ошибка обновления пароля.');
    }
  };

  const handleSaveDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate URL
    if (supabaseUrl && !supabaseUrl.startsWith('http')) {
      setSettingsStatus('Ошибка: URL должен начинаться с https://');
      return;
    }

    setSettingsStatus('Сохранение подключения...');
    localStorage.setItem('supabase_project_url', supabaseUrl);
    localStorage.setItem('supabase_anon_key', supabaseKey);
    setSettingsStatus('Сохранено! Перезагрузка страницы...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-dark-900 border border-white/10 p-8 rounded-2xl shadow-2xl relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-white mb-2">EliteDrive <span className="text-gold-400">Admin</span></h2>
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
            <div className="flex flex-col gap-2 items-center">
               <p className="text-xs text-center text-gray-600">
                  * По умолчанию пароль: <b>admin</b>
               </p>
               <button 
                type="button"
                onClick={handleResetSettings}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition-colors"
               >
                 <RefreshCw size={10} /> Сбросить настройки подключения
               </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex text-gray-100 font-sans relative">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-dark-900 border-b border-white/5 p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-bold text-white">
           Elite<span className="text-gold-400">Panel</span>
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
           <Link to="/" className="text-2xl font-serif font-bold text-white">
              Elite<span className="text-gold-400">Panel</span>
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
      <main className="flex-1 p-4 md:p-8 bg-black min-h-screen md:ml-64 pt-20 md:pt-8 w-full overflow-hidden">
        
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

            <div className="bg-dark-900 rounded-xl border border-white/5 p-6">
              <h3 className="text-xl font-serif text-white mb-6">Последние действия</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-white/5 last:border-0 gap-2 md:gap-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Check size={16} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm md:text-base">Новая бронь: Rolls-Royce Cullinan</p>
                        <p className="text-xs text-gray-500">2 минуты назад • Иван Петров</p>
                      </div>
                    </div>
                    <span className="text-gold-400 font-bold ml-14 md:ml-0">4 200 BYN</span>
                  </div>
                ))}
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
                            onClick={() => onDeleteCar(car.id)}
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
              
              {/* Database Settings */}
              <div className="bg-dark-900 p-6 rounded-xl border border-white/5 lg:col-span-2">
                 <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><Database size={24} /></div>
                  <h3 className="text-xl font-bold text-white">База Данных (Supabase)</h3>
                </div>
                
                {isUsingEnv ? (
                  <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-500/10 rounded-full shrink-0">
                         <ShieldCheck className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-2">Безопасное подключение активно</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                          Приложение использует ключи доступа из переменных окружения (<code>.env</code> или Vercel Env). 
                          Это наиболее безопасный способ подключения (Option B).
                        </p>
                        <p className="text-xs text-gray-500">
                          Чтобы изменить базу данных, обновите переменные <code>VITE_SUPABASE_URL</code> и <code>VITE_SUPABASE_KEY</code> в конфигурации вашего сервера или локальном файле.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveDatabase} className="space-y-4">
                    <div className="text-sm text-gray-400 bg-white/5 p-4 rounded mb-4">
                      <p>Для работы админ-панели и сохранения данных укажите ключи вашего проекта Supabase.</p>
                      <p className="mt-2 text-xs opacity-70">Project Settings &rarr; API &rarr; Project URL / Anon Key</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase text-gray-500 mb-2">Project URL</label>
                        <input 
                          type="text" 
                          value={supabaseUrl}
                          onChange={e => setSupabaseUrl(e.target.value)}
                          placeholder="https://xyz.supabase.co"
                          className="w-full bg-dark-800 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-gray-500 mb-2">Anon API Key</label>
                        <input 
                          type="password" 
                          value={supabaseKey}
                          onChange={e => setSupabaseKey(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                          className="w-full bg-dark-800 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <button className="bg-purple-600 text-white font-bold uppercase px-6 py-3 rounded hover:bg-purple-500 transition-colors w-full md:w-auto">
                        Сохранить настройки БД
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Telegram Settings */}
              <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><MessageCircle size={24} /></div>
                  <h3 className="text-xl font-bold text-white">Уведомления Telegram</h3>
                </div>
                
                <form onSubmit={handleSaveTelegram} className="space-y-4">
                  <div className="text-sm text-gray-400 bg-white/5 p-4 rounded mb-4">
                    <p className="mb-2"><b>Важно:</b> Telegram бот НЕ может писать вам первым по username. Он может отвечать только по Chat ID.</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Создайте бота в <b>@BotFather</b> и получите Token.</li>
                      <li>Напишите своему боту <code>/start</code>.</li>
                      <li>Узнайте свой Chat ID в боте <b>@getmyid_bot</b>.</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Telegram Bot Token</label>
                    <input 
                      type="text" 
                      value={telegramToken}
                      onChange={e => setTelegramToken(e.target.value)}
                      placeholder="123456:ABC-DEF..."
                      className="w-full bg-dark-800 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Ваш Chat ID</label>
                    <input 
                      type="text" 
                      value={telegramChatId}
                      onChange={e => setTelegramChatId(e.target.value)}
                      placeholder="12345678"
                      className="w-full bg-dark-800 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                     <button className="bg-gold-500 text-black font-bold uppercase px-6 py-3 rounded hover:bg-gold-400 transition-colors w-full">
                       Сохранить настройки Telegram
                     </button>
                  </div>
                </form>
              </div>

              {/* Password Settings */}
              <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><Lock size={24} /></div>
                  <h3 className="text-xl font-bold text-white">Смена пароля</h3>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4">
                   <p className="text-sm text-gray-400 mb-4">
                     Пароль шифруется (SHA-256) и хранится в базе Supabase. Если база не подключена, работает пароль 'admin'.
                   </p>
                   <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Новый пароль</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Введите новый пароль"
                      className="w-full bg-dark-800 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                   <div className="pt-4 border-t border-white/5">
                     <button className="bg-white/10 text-white font-bold uppercase px-6 py-3 rounded hover:bg-white/20 transition-colors w-full border border-white/10">
                       Обновить пароль
                     </button>
                  </div>
                </form>
              </div>
            </div>

            {settingsStatus && (
              <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up z-50">
                 {settingsStatus}
              </div>
            )}
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
                    <button onClick={() => setActiveTab('settings')} className="mt-4 text-gold-400 hover:text-white underline text-sm">Настроить Telegram</button>
                </div>
             </div>
           </div>
        )}

      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-dark-800 rounded-2xl w-full md:max-w-2xl border border-white/10 my-8">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark-800 rounded-t-2xl z-10">
              <h3 className="text-xl font-serif text-white pr-8">
                {currentCar.id ? 'Редактировать' : 'Добавить'} автомобиль
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
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
                        <div className="relative h-40 w-full rounded overflow-hidden border border-white/10">
                            <img src={currentCar.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    
                    <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer bg-dark-900 border border-white/10 p-3 text-white rounded hover:border-gold-400 transition-colors flex items-center justify-center gap-2">
                            <Upload size={18} />
                            <span>Загрузить фото (файл)</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                    
                    <div className="relative">
                        <span className="absolute -top-2 left-3 bg-dark-800 px-2 text-[10px] text-gray-500">Или вставьте ссылку</span>
                        <input 
                            type="text" 
                            value={currentCar.imageUrl || ''}
                            onChange={e => setCurrentCar({...currentCar, imageUrl: e.target.value})}
                            className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none text-sm"
                            placeholder="https://..."
                        />
                    </div>
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
                >
                  Сохранить
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white/10 text-white font-bold uppercase py-3 hover:bg-white/20 transition-colors rounded"
                >
                  Отмена
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};