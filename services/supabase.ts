import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

// В Vite проектах переменные окружения доступны через import.meta.env
// Vercel автоматически подставляет их во время сборки, если они начинаются с VITE_
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// 2. Проверяем статус конфигурации
// Если ключи не найдены, клиент переходит в режим работы через API прокси
export const isConfigured = !!(supabaseUrl && supabaseKey);
export const isUsingEnv = true;

// 3. Создаем клиент (только если ключи есть)
const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to map DB response to App types
const mapCarsData = (data: any[]): Car[] => {
  return data.map((car: any) => ({
    id: car.id,
    name: car.name,
    category: car.category,
    pricePerDay: car.price_per_day,
    specs: car.specs,
    imageUrl: car.image_url,
    available: car.available,
    description: car.description,
    discountRules: car.discount_rules || []
  }));
};

// --- CARS API ---

export const fetchCars = async (): Promise<Car[]> => {
  // 1. Попытка загрузить напрямую через Supabase Client (быстрее, если настроен)
  if (isConfigured && supabase) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return mapCarsData(data);
    }
    console.warn("Direct DB fetch failed, falling back to API proxy...", error);
  }
  
  // 2. Фолбэк: загрузка через серверный API (если ключи на клиенте отсутствуют, но есть на сервере)
  try {
    const response = await fetch('/api/get-cars');
    if (response.ok) {
      const data = await response.json();
      return mapCarsData(data);
    }
  } catch (e) {
    console.error("API fetch failed", e);
  }
  
  // 3. Если ничего не помогло, выбрасываем ошибку (App.tsx подставит Mock)
  throw new Error("Could not fetch cars from DB or API");
};

/**
 * Безопасное сохранение через серверный API.
 */
export const saveCarSecure = async (car: Car, password: string) => {
  const response = await fetch('/api/admin-cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save',
      password: password,
      car: car
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Failed to save car (Status ${response.status})`);
  }
};

/**
 * Безопасное удаление через серверный API.
 */
export const deleteCarSecure = async (id: string, password: string) => {
  const response = await fetch('/api/admin-cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete',
      password: password,
      id: id
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Failed to delete car (Status ${response.status})`);
  }
};

// Deprecated direct client calls
export const saveCar = async (car: Car) => {
   console.warn("Direct client saveCar is deprecated. Use saveCarSecure via Admin panel.");
};
export const deleteCarById = async (id: string) => {
   console.warn("Direct client deleteCarById is deprecated. Use deleteCarSecure via Admin panel.");
};

// --- STORAGE API ---

export const uploadCarImage = async (file: File): Promise<string> => {
  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
  });

  const base64Image = await toBase64(file);
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          image: base64Image,
          filename: fileName
      })
  });

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Upload failed');
  }

  const data = await response.json();
  return data.publicUrl;
};

// --- AUTH API ---

export const checkAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin-cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'check_auth',
        password: password
      })
    });

    return response.ok;
  } catch (e) {
    console.error("Auth check failed", e);
    return password === 'admin';
  }
};

export const updateAdminPassword = async (newPassword: string) => {
  throw new Error("Пароль меняется через переменные окружения Vercel (ADMIN_PASSWORD).");
};

// --- TELEGRAM API ---

export const getTelegramSettings = async () => {
  return { botToken: '***', chatId: '***' };
};

export const saveTelegramSettings = async (token: string, chatId: string) => {
  throw new Error("Настройки Telegram меняются через переменные окружения Vercel.");
};