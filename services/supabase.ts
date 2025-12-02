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

// Helper for Hashing (Auth)
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // SHA-256 for 'admin'

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

// Deprecated direct client calls (kept for backward compat or read-only if needed, but not used for writing anymore)
export const saveCar = async (car: Car) => {
   console.warn("Direct client saveCar is deprecated. Use saveCarSecure via Admin panel.");
};
export const deleteCarById = async (id: string) => {
   console.warn("Direct client deleteCarById is deprecated. Use deleteCarSecure via Admin panel.");
};

// --- STORAGE API ---

/**
 * Загрузка изображений через серверный прокси.
 * Решает проблему CORS и RLS при загрузке напрямую из браузера.
 */
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

export const checkAdminPassword = async (password: string): Promise<boolean> => {
  const hash = await sha256(password);
  
  if (!isConfigured) {
    return hash === DEFAULT_HASH;
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password_hash')
      .single();
    
    if (error || !data) {
      return hash === DEFAULT_HASH;
    }

    return data.value === hash;
  } catch (e) {
    console.error("Auth check failed", e);
    return hash === DEFAULT_HASH;
  }
};

export const updateAdminPassword = async (newPassword: string) => {
  if (!isConfigured) throw new Error("Database not configured");
  
  const hash = await sha256(newPassword);
  
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'admin_password_hash', value: hash });
    
  if (error) throw error;
};

// --- TELEGRAM API ---

export const getTelegramSettings = async () => {
  if (!isConfigured) return { botToken: '', chatId: '' };

  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['telegram_bot_token', 'telegram_chat_id']);

  const settings: any = {};
  data?.forEach((item: any) => {
    settings[item.key] = item.value;
  });

  return {
    botToken: settings['telegram_bot_token'] || '',
    chatId: settings['telegram_chat_id'] || ''
  };
};

export const saveTelegramSettings = async (token: string, chatId: string) => {
  if (!isConfigured) throw new Error("Database not configured");

  const { error: err1 } = await supabase
    .from('settings')
    .upsert({ key: 'telegram_bot_token', value: token });
    
  const { error: err2 } = await supabase
    .from('settings')
    .upsert({ key: 'telegram_chat_id', value: chatId });

  if (err1 || err2) throw new Error("Failed to save settings");
};