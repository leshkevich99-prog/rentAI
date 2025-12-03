import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

// В Vite проектах переменные окружения доступны через import.meta.env
// Vercel автоматически подставляет их во время сборки, если они начинаются с VITE_
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// 2. Проверяем статус конфигурации
// Мы не выбрасываем фатальную ошибку (throw), чтобы приложение могло запуститься
// в демо-режиме (Mock Data) если ключи еще не добавлены.
export const isConfigured = !!(supabaseUrl && supabaseKey);
export const isUsingEnv = true;

if (!isConfigured) {
  console.warn('⚠️ Supabase ключи не найдены в .env. Приложение работает в режиме Mock-данных.');
}

// 3. Создаем клиент
// Передаем пустые строки если ключей нет, чтобы инициализация не упала.
// Флаг isConfigured не даст функциям ниже делать реальные запросы.
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

// --- CARS API ---

export const fetchCars = async (): Promise<Car[]> => {
  if (!isConfigured) throw new Error("Database not configured");
  
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    throw error;
  }

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

/**
 * Безопасное сохранение через серверный API.
 * Использует переданный пароль для авторизации на сервере.
 */
export const saveCarSecure = async (car: Car, password: string) => {
  if (!isConfigured) {
      // Demo fallback
      console.log("Demo mode: save simulated");
      return;
  }

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
    const err = await response.json();
    throw new Error(err.error || 'Failed to save car');
  }
};

/**
 * Безопасное удаление через серверный API.
 */
export const deleteCarSecure = async (id: string, password: string) => {
  if (!isConfigured) {
      console.log("Demo mode: delete simulated");
      return;
  }

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
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete car');
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
  if (!isConfigured) throw new Error("Database not configured");

  // 1. Конвертируем File в Base64 для передачи на сервер
  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
  });

  const base64Image = await toBase64(file);
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  // 2. Отправляем на наш API
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

/**
 * Проверка пароля теперь происходит через API,
 * так как пароль хранится в переменных окружения сервера.
 */
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
    // Fallback for local dev without backend running properly
    return password === 'admin';
  }
};

export const updateAdminPassword = async (newPassword: string) => {
  // Теперь управляется через ENV переменные
  throw new Error("Пароль меняется через переменные окружения Vercel (ADMIN_PASSWORD).");
};

// --- TELEGRAM API ---

export const getTelegramSettings = async () => {
  // Теперь управляется через ENV переменные
  return { botToken: '***', chatId: '***' };
};

export const saveTelegramSettings = async (token: string, chatId: string) => {
  // Теперь управляется через ENV переменные
  throw new Error("Настройки Telegram меняются через переменные окружения Vercel.");
};