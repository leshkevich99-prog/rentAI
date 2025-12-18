
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
  Zap
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

    if (!isConfigured) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCar({ ...currentCar, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
      alert('Демо режим: Картинка загружена локально как Base64.');
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex text-gray-100 font-sans relative">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-900 border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5"><Logo /></div>
        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400'}`}><LayoutDashboard size={20} /><span>Обзор</span></button>
          <button onClick={() => setActiveTab('fleet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'fleet' ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400'}`}><CarIcon size={20} /><span>Автопарк</span></button>
        </nav>
        <div className="p-4 border-t border-white/5"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors"><LogOut size={20} /><span>Выйти</span></button></div>
      </aside>

      <main className="flex-1 p-4 md:p-8 md:ml-64 pt-28 md:pt-8 w-full">
        {activeTab === 'dashboard' && <div className="animate-fade-in-up"><h1 className="text-3xl font-serif text-white mb-8">Обзор</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-900 p-6 rounded-xl border border-white/5">
            <h3 className="text-gray-400 text-sm uppercase mb-1">Авто в парке</h3>
            <p className="text-3xl font-bold text-white">{cars.length}</p>
          </div>
        </div></div>}

        {activeTab === 'fleet' && <div className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-serif text-white">Автопарк</h1><button onClick={() => openEditModal()} className="bg-gold-500 text-black px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-2"><Plus size={18} /> Добавить авто</button></div>
          <div className="bg-dark-900 rounded-xl border border-white/5 overflow-x-auto"><table className="w-full text-left whitespace-nowrap"><thead className="bg-white/5 text-gray-400 uppercase text-xs"><tr><th className="px-6 py-4">Автомобиль</th><th className="px-6 py-4">Цена</th><th className="px-6 py-4">Статус</th><th className="px-6 py-4 text-right">Действия</th></tr></thead><tbody className="divide-y divide-white/5">
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={car.imageUrl} className="w-10 h-10 rounded object-cover" /><div><div className="font-bold text-white">{car.name}</div><div className="text-[10px] text-gray-500">{car.category}</div></div></div></td>
                <td className="px-6 py-4 text-gold-400">{car.pricePerDay} BYN</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-bold ${car.available ? 'text-green-500' : 'text-red-500'}`}>{car.available ? 'Доступен' : 'Занят'}</span>
                    {car.isAvailableToday && <span className="text-[10px] text-gold-400 flex items-center gap-1 font-bold uppercase"><Zap size={10} fill="currentColor" /> Сегодня</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2"><button onClick={() => openEditModal(car)} className="p-2 hover:text-gold-400"><Edit size={18} /></button><button onClick={() => handleSecureDelete(car.id)} className="p-2 hover:text-red-500"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody></table></div>
        </div>}
      </main>

      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-2xl bg-dark-800 rounded-2xl border border-white/10 shadow-2xl z-10 my-8 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center"><h3 className="text-xl font-serif text-white">{currentCar.id ? 'Редактировать' : 'Добавить'} авто</h3><button onClick={() => setIsEditing(false)}><X size={24} /></button></div>
            <form onSubmit={handleSaveCar} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 mb-1 block">Название (RU)</label><input required type="text" value={currentCar.name || ''} onChange={e => setCurrentCar({...currentCar, name: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-2 rounded text-sm" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Название (EN)</label><input type="text" value={currentCar.name_en || ''} onChange={e => setCurrentCar({...currentCar, name_en: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-2 rounded text-sm" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 mb-1 block">Категория</label><select value={currentCar.category} onChange={e => setCurrentCar({...currentCar, category: e.target.value as CarCategory})} className="w-full bg-dark-900 border border-white/10 p-2 rounded text-sm">{Object.values(CarCategory).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Цена / День</label><input required type="number" value={currentCar.pricePerDay || 0} onChange={e => setCurrentCar({...currentCar, pricePerDay: Number(e.target.value)})} className="w-full bg-dark-900 border border-white/10 p-2 rounded text-sm" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded border border-white/10">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="available" checked={currentCar.available} onChange={e => setCurrentCar({...currentCar, available: e.target.checked})} className="w-4 h-4 accent-gold-500" />
                  <label htmlFor="available" className="text-xs text-white">Доступен для аренды</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="today" checked={currentCar.isAvailableToday} onChange={e => setCurrentCar({...currentCar, isAvailableToday: e.target.checked})} className="w-4 h-4 accent-gold-500" />
                  <label htmlFor="today" className="text-xs text-white">Доступен сегодня (Молния)</label>
                </div>
              </div>

              <div><label className="text-xs text-gray-500 mb-1 block">Описание (RU)</label><textarea rows={3} value={currentCar.description || ''} onChange={e => setCurrentCar({...currentCar, description: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-2 rounded text-xs" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Описание (EN)</label><textarea rows={3} value={currentCar.description_en || ''} onChange={e => setCurrentCar({...currentCar, description_en: e.target.value})} className="w-full bg-dark-900 border border-white/10 p-2 rounded text-xs" /></div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={isSaving} className="flex-1 bg-gold-500 text-black font-bold uppercase py-3 rounded text-xs">{isSaving ? 'Сохранение...' : 'Сохранить'}</button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-white/10 text-white font-bold uppercase py-3 rounded text-xs">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
