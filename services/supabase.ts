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

export const saveCar = async (car: Car) => {
  if (!isConfigured) throw new Error("Database not configured");

  const carData = {
    name: car.name,
    category: car.category,
    price_per_day: car.pricePerDay,
    specs: car.specs,
    image_url: car.imageUrl,
    available: car.available,
    description: car.description,
    discount_rules: car.discountRules
  };

  if (car.id && car.id.length > 20) { 
    const { error } = await supabase.from('cars').update(carData).eq('id', car.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('cars').insert([carData]);
    if (error) throw error;
  }
};

export const deleteCarById = async (id: string) => {
  if (!isConfigured) throw new Error("Database not configured");
  
  if (!id || id.length < 20) {
    console.warn("Skipping DB delete for mock/invalid ID:", id);
    return;
  }

  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
};

// --- STORAGE API ---

export const uploadCarImage = async (file: File): Promise<string> => {
  if (!isConfigured) throw new Error("Database not configured");

  // 1. Создаем уникальное имя файла
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  // 2. Загружаем в бакет 'car-images'
  const { error: uploadError } = await supabase.storage
    .from('car-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error(`Ошибка загрузки: ${uploadError.message}`);
  }

  // 3. Получаем публичную ссылку
  const { data } = supabase.storage
    .from('car-images')
    .getPublicUrl(filePath);

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