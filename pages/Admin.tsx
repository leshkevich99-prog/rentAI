
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
  Server,
  Zap,
  Info
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
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ supabaseUrl: boolean, supabaseKey: boolean, adminPassword: boolean } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin-cars', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_status', password: 'check' }) 
      })
      .then(res => res.json())
      .then(data => setBackendStatus(data))
      .catch(() => {});
    }
  }, [isAuthenticated]);

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

  const openEditModal = (car?: Car) => {
    if (car) {
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
        name_en: '',
        category: CarCategory.SEDAN,
        pricePerDay: 0,
        specs: { hp: 0, zeroToSixty: 0, maxSpeed: 0 },
        imageUrl: '',
        available: true,
        isAvailableToday: false,
        description: '',
        description_en: '',
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

    if (file.size > 4.5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимальный размер: 4.5 MB');
        return;
    }

    try {
      setIsUploadingImage(true);
      const publicUrl = await uploadCarImage(file);
      setCurrentCar({ ...currentCar, imageUrl: publicUrl });
    } catch (error: any) {
      console.error(error);
      alert(`Ошибка загрузки: ${error.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCar.name) return;

    setIsSaving(true);
    try {
      await saveCarSecure(currentCar as Car, password);
      
      if (currentCar.id && currentCar.id.length > 10) {
        onUpdateCar(currentCar as Car);
      } else {
        onAddCar(currentCar as Car);
      }
      setIsEditing(false);
      alert('Успешно сохранено');
    } catch (error: any) {
      console.error(error);
      alert('Ошибка сохранения: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecureDelete = async (id: string) => {
    if (window.confirm('Вы уверены?')) {
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
        <div className="max-w-md w-full bg-dark-900 border border-white/10 p-8 rounded-2xl shadow-2xl relative text-center">
          <Logo className="justify-center mb-8" />
          <h2 className="text-xl font-serif text-white mb-2">Панель управления</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-dark-800 border border-white/10 p-3 text-white focus:border-gold-400 focus:outline-none rounded"
              placeholder="Пароль"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button className="w-full bg-gold-500 text-black font-bold uppercase py-3 hover:bg-gold-400 transition-colors rounded">Войти</button>
          </form>
          <p className="mt-6 text-gray-500 text-[10px] uppercase tracking-widest">LÉON Admin Portal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex text-gray-100 font-sans relative">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-900 border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5"><Logo /></div>
        <nav className="flex-1 p-4 space-y-2 mt-8">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gold-500/10 text-gold-400 font-bold' : 'text-gray-400 hover:bg-white/5'}`}><LayoutDashboard size={20} /><span>Обзор</span></button>
          <button onClick={() => setActiveTab('fleet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'fleet' ? 'bg-gold-500/10 text-gold-400 font-bold' : 'text-gray-400 hover:bg-white/5'}`}><CarIcon size={20} /><span>Автопарк</span></button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors"><LogOut size={20} /><span>Выйти</span></button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 md:ml-64 pt-28 md:pt-8 w-full">
        {activeTab === 'dashboard' && <div className="animate-fade-in-up">
          <h1 className="text-3xl font-serif text-white mb-8">Обзор</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
              <h3 className="text-gray-400 text-sm uppercase mb-1">Авто в парке</h3>
              <p className="text-3xl font-bold text-white">{cars.length}</p>
            </div>
            <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
              <h3 className="text-gray-400 text-sm uppercase mb-1">Доступно сегодня</h3>
              <p className="text-3xl font-bold text-gold-400">{cars.filter(c => c.isAvailableToday).length}</p>
            </div>
          </div>

          <div className="bg-dark-900 rounded-xl border border-white/5 p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-gold-400" size={24} />
              <h2 className="text-xl font-serif text-white">Статус системы</h2>
            </div>
            
            {backendStatus ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5">
                  <span className="text-sm">Supabase URL</span>
                  {backendStatus.supabaseUrl ? <span className="text-green-500 text-xs font-bold flex items-center gap-1"><Check size={14}/> ОК</span> : <span className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertTriangle size={14}/> MISSING</span>}
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5">
                  <span className="text-sm">Supabase Secret Key</span>
                  {backendStatus.supabaseKey ? <span className="text-green-500 text-xs font-bold flex items-center gap-1"><Check size={14}/> ОК</span> : <span className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertTriangle size={14}/> MISSING</span>}
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5">
                  <span className="text-sm">Admin Password Env</span>
                  {backendStatus.adminPassword ? <span className="text-green-500 text-xs font-bold flex items-center gap-1"><Check size={14}/> ОК</span> : <span className="text-gray-500 text-xs font-bold flex items-center gap-1"><Info size={14}/> USING DEFAULT</span>}
                </div>
                
                {(!backendStatus.supabaseUrl || !backendStatus.supabaseKey) && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-xs leading-relaxed">
                      <strong>Внимание:</strong> Не все переменные окружения заданы на Vercel. 
                      Добавьте <code>SUPABASE_URL</code> и <code>SUPABASE_SERVICE_ROLE_KEY</code> в настройки проекта и сделайте Redeploy.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Проверка конфигурации...</span>
              </div>
            )}
          </div>
        </div>}

        {activeTab === 'fleet' && <div className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif text-white">Автопарк</h1>
            <button onClick={() => openEditModal()} className="bg-gold-500 text-black px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-2 hover:bg-gold-400 transition-colors">
              <Plus size={18} /> Добавить авто
            </button>
          </div>
          
          <div className="bg-dark-900 rounded-xl border border-white/5 overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Автомобиль</th>
                  <th className="px-6 py-4">Цена / День</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cars.map(car => (
                  <tr key={car.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={car.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-dark-800" />
                        <div>
                          <div className="font-bold text-white">{car.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">{car.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gold-400 font-bold">{car.pricePerDay} BYN</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${car.available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {car.available ? 'Доступен' : 'Занят'}
                        </span>
                        {car.isAvailableToday && (
                          <span className="text-[10px] text-gold-400 flex items-center gap-1 font-bold uppercase">
                            <Zap size={10} fill="currentColor" /> Доступно сегодня
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(car)} className="p-2 text-gray-400 hover:text-gold-400 transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleSecureDelete(car.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </main>

      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-2xl bg-dark-800 rounded-2xl border border-white/10 shadow-2xl z-10 my-8 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-serif text-white">{currentCar.id ? 'Редактировать' : 'Добавить'} авто</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveCar} className="p-6 space-y-6 overflow-y-auto">
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-dark-900 p-4 rounded-xl border border-white/5">
                   <div className="relative w-24 h-24 bg-dark-950 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      {currentCar.imageUrl ? (
                        <img src={currentCar.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="text-gray-600" />
                      )}
                      {isUploadingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-gold-400" /></div>}
                   </div>
                   <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-2 block font-bold uppercase tracking-wider">Изображение</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Название (RU)</label><input required type="text" value={currentCar.name || ''} onChange={e => setCurrentCar({...currentCar, name: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-gold-400 focus:outline-none" /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Название (EN)</label><input type="text" value={currentCar.name_en || ''} onChange={e => setCurrentCar({...currentCar, name_en: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-gold-400 focus:outline-none" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Категория</label>
                    <select value={currentCar.category} onChange={e => setCurrentCar({...currentCar, category: e.target.value as CarCategory})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-gold-400 focus:outline-none appearance-none">
                      {Object.values(CarCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Цена / День (BYN)</label><input required type="number" value={currentCar.pricePerDay || 0} onChange={e => setCurrentCar({...currentCar, pricePerDay: Number(e.target.value)})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-gold-400 focus:outline-none" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="available" checked={currentCar.available} onChange={e => setCurrentCar({...currentCar, available: e.target.checked})} className="w-5 h-5 accent-gold-500 rounded" />
                    <label htmlFor="available" className="text-xs font-bold uppercase tracking-wider text-white cursor-pointer">Доступен в аренду</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="today" checked={currentCar.isAvailableToday} onChange={e => setCurrentCar({...currentCar, isAvailableToday: e.target.checked})} className="w-5 h-5 accent-gold-500 rounded" />
                    <label htmlFor="today" className="text-xs font-bold uppercase tracking-wider text-gold-400 cursor-pointer flex items-center gap-1"><Zap size={14} fill="currentColor" /> Доступно сегодня</label>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Л.С.</label><input type="number" value={currentCar.specs?.hp || 0} onChange={e => setCurrentCar({...currentCar, specs: {...(currentCar.specs as any), hp: Number(e.target.value)}})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm" /></div>
                   <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">0-100 с.</label><input type="number" step="0.1" value={currentCar.specs?.zeroToSixty || 0} onChange={e => setCurrentCar({...currentCar, specs: {...(currentCar.specs as any), zeroToSixty: Number(e.target.value)}})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm" /></div>
                   <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Макс. км/ч</label><input type="number" value={currentCar.specs?.maxSpeed || 0} onChange={e => setCurrentCar({...currentCar, specs: {...(currentCar.specs as any), maxSpeed: Number(e.target.value)}})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm" /></div>
                </div>

                <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Описание (RU)</label><textarea rows={3} value={currentCar.description || ''} onChange={e => setCurrentCar({...currentCar, description: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-gold-400 focus:outline-none resize-none" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Описание (EN)</label><textarea rows={3} value={currentCar.description_en || ''} onChange={e => setCurrentCar({...currentCar, description_en: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-3 rounded-lg text-sm text-white focus:border-gold-400 focus:outline-none resize-none" /></div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button type="submit" disabled={isSaving} className="flex-1 bg-gold-500 text-black font-bold uppercase py-4 rounded-xl text-xs hover:bg-gold-400 transition-colors disabled:opacity-50">
                  {isSaving ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Сохранить изменения'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-8 bg-white/5 text-white font-bold uppercase py-4 rounded-xl text-xs hover:bg-white/10 transition-colors">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
