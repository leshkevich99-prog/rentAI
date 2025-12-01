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
  Upload,
  Lock,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminPasswordHash, updateAdminPasswordHash } from '../services/supabase';

interface AdminProps {
  cars: Car[];
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
}

// Utility to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const Admin: React.FC<AdminProps> = ({ cars, onAddCar, onUpdateCar, onDeleteCar }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'bookings' | 'security'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');

  const navigate = useNavigate();

  // Initialize Admin Auth
  useEffect(() => {
    const checkSession = () => {
        // Check if already logged in (session storage)
        const sessionAuth = sessionStorage.getItem('admin_session');
        if (sessionAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsAuthChecking(false);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (email !== 'admin@elitedrive.by') {
      setLoginError('Неверный Email');
      return;
    }

    try {
        const storedHash = await getAdminPasswordHash();
        const inputHash = await hashPassword(password);

        // Fallback or exact match
        if (storedHash && inputHash === storedHash) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_session', 'true');
        } else {
            setLoginError('Неверный пароль');
        }
    } catch (err) {
        setLoginError('Ошибка соединения с сервером');
        console.error(err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_session');
    navigate('/');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage('');

    if (newPassword.length < 5) {
      setSecurityMessage('Пароль слишком короткий (минимум 5 символов)');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMessage('Пароли не совпадают');
      return;
    }

    try {
        const newHash = await hashPassword(newPassword);
        await updateAdminPasswordHash(newHash);
        setSecurityMessage('Пароль успешно изменен!');
        setNewPassword('');
        setConfirmPassword('');
    } catch (err) {
        setSecurityMessage('Ошибка при сохранении пароля');
        console.error(err);
    }
  };

  // Car Editor Handlers
  const openEditModal = (car?: Car) => {
    if (car) {
      setCurrentCar({ ...car });
    } else {
      setCurrentCar({
        // Do not set ID here for new cars, Supabase will generate UUID
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
      if (file.size > 2 * 1024 * 1024) { // 2MB limit warning
        alert("Внимание: Изображение более 2МБ может замедлить работу сайта.");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // In a full implementation, we would upload to Supabase Storage here and get a public URL
        // For now, we will save the Base64 string to the DB text field as requested by the constraints
        setCurrentCar(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCar.name) {
      // Check if it's an existing car or new
      const existing = cars.find(c => c.id === currentCar.id);
      if (existing && currentCar.id) {
        onUpdateCar(currentCar as Car);
      } else {
        onAddCar(currentCar as Car);
      }
      setIsEditing(false);
    }
  };

  if (isAuthChecking) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-dark-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-white mb-2">EliteDrive <span className="text-gold-400">Admin</span></h2>
            <p className="text-gray-400">Вход в панель управления</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2 tracking-widest">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none rounded"
                placeholder="admin@elitedrive.by"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2 tracking-widest">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none rounded"
                placeholder="Ввод пароля"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button className="w-full bg-gold-500 text-black font-bold uppercase py-3 hover:bg-gold-400 transition-colors rounded">
              Войти
            </button>
            <p className="text-xs text-gray-600 text-center mt-4">
               Стандартный пароль при первом входе: <span className="text-gray-400">admin</span>
            </p>
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
             onClick={() => { setActiveTab('security'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Lock size={20} />
            <span className="font-medium">Безопасность</span>
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

        {/* Bookings View - Mock */}
        {activeTab === 'bookings' && (
           <div className="animate-fade-in-up">
             <h1 className="text-2xl md:text-3xl font-serif text-white mb-8">Заявки на бронирование</h1>
             <div className="bg-dark-900 rounded-xl border border-white/5 overflow-hidden">
                <div className="p-8 text-center text-gray-500">
                    <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Здесь будут отображаться активные заявки с сайта.</p>
                </div>
             </div>
           </div>
        )}

        {/* Security View */}
        {activeTab === 'security' && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl font-serif text-white mb-8">Настройки безопасности</h1>
            
            <div className="max-w-xl">
              <div className="bg-dark-900 rounded-xl border border-white/5 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Смена пароля администратора</h3>
                    <p className="text-gray-400 text-sm">Пароль будет захэширован и сохранен в Supabase.</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2 tracking-widest">Новый пароль</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none rounded"
                      placeholder="Минимум 5 символов"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2 tracking-widest">Подтвердите пароль</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none rounded"
                      placeholder="Повторите пароль"
                    />
                  </div>
                  
                  {securityMessage && (
                    <div className={`p-3 rounded text-sm ${securityMessage.includes('успешно') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {securityMessage}
                    </div>
                  )}

                  <button className="w-full bg-white text-black font-bold uppercase py-3 hover:bg-gold-400 transition-colors rounded">
                    Обновить пароль
                  </button>
                </form>
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
                    value={currentCar.name}
                    onChange={e => setCurrentCar({...currentCar, name: e.target.value})}
                    className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-2">Категория</label>
                  <select 
                    value={currentCar.category}
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
                 
                 {/* File Upload Input */}
                 <div className="mb-4">
                   <div className="relative border border-dashed border-white/20 bg-dark-900 p-6 rounded hover:border-gold-400 transition-colors group cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gold-400">
                        <Upload size={32} className="mb-2" />
                        <span className="text-sm">Нажмите для загрузки фото</span>
                        <span className="text-xs text-gray-600 mt-1">Макс. 2MB (хранение в БД)</span>
                      </div>
                   </div>
                 </div>

                 {/* URL Fallback */}
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Или укажите прямую ссылку:</span>
                 </div>
                  <input 
                    type="text" 
                    value={currentCar.imageUrl}
                    onChange={e => setCurrentCar({...currentCar, imageUrl: e.target.value})}
                    className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none text-sm text-gray-400"
                    placeholder="https://..."
                  />

                  {/* Preview */}
                  {currentCar.imageUrl && (
                    <div className="mt-4 w-full h-40 rounded border border-white/10 overflow-hidden bg-black">
                      <img src={currentCar.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-xs uppercase text-gray-500 mb-2">Цена / Сутки (BYN)</label>
                   <input 
                      required
                      type="number" 
                      value={currentCar.pricePerDay}
                      onChange={e => setCurrentCar({...currentCar, pricePerDay: Number(e.target.value)})}
                      className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                   />
                </div>
                 <div className="flex items-center md:pt-8 gap-3">
                   <input 
                      type="checkbox" 
                      id="available"
                      checked={currentCar.available}
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
                      value={currentCar.specs?.hp}
                      onChange={e => setCurrentCar({
                        ...currentCar, 
                        specs: { ...currentCar.specs!, hp: Number(e.target.value) }
                      })}
                      className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Разгон 0-100</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={currentCar.specs?.zeroToSixty}
                      onChange={e => setCurrentCar({
                        ...currentCar, 
                        specs: { ...currentCar.specs!, zeroToSixty: Number(e.target.value) }
                      })}
                      className="w-full bg-dark-900 border border-white/10 p-3 text-white rounded focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-2">Макс. скорость</label>
                    <input 
                      type="number" 
                      value={currentCar.specs?.maxSpeed}
                      onChange={e => setCurrentCar({
                        ...currentCar, 
                        specs: { ...currentCar.specs!, maxSpeed: Number(e.target.value) }
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