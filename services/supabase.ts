import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

// --- КОНФИГУРАЦИЯ (OPTION B: ENV VARS) ---

const getEnvVar = (key: string): string => {
  // 1. Vite Standard (import.meta.env)
  try {
    // @ts-ignore
    if (import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  // 2. Process Env (Fallback)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

// Проверяем переменные окружения
const envUrl = getEnvVar('VITE_SUPABASE_URL');
const envKey = getEnvVar('VITE_SUPABASE_KEY');

// Проверяем LocalStorage (как резервный вариант, если .env не создан)
let lsUrl = '';
let lsKey = '';
try {
  lsUrl = localStorage.getItem('supabase_project_url') || '';
  lsKey = localStorage.getItem('supabase_anon_key') || '';
} catch (e) {}

// Логика выбора кредов
const getCredentials = () => {
  // Приоритет 1: .env файл (Самый безопасный)
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, configured: true, usingEnv: true };
  }

  // Приоритет 2: LocalStorage (Настройка через UI)
  if (lsUrl && lsKey) {
    return { url: lsUrl, key: lsKey, configured: true, usingEnv: false };
  }

  // Fallback: Заглушка
  return { url: 'https://placeholder.supabase.co', key: 'placeholder', configured: false, usingEnv: false };
};

const { url, key, configured, usingEnv } = getCredentials();

export const isConfigured = configured;
export const isUsingEnv = usingEnv;

// Initialize Supabase safely
const supabase = createClient(url, key);

// Helper for Hashing
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Default fallback hash for 'admin'
const DEFAULT_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; 

// --- CARS API ---

export const fetchCars = async (): Promise<Car[]> => {
  if (!configured) throw new Error("Database not configured");
  
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
    available: car.available
  }));
};

export const saveCar = async (car: Car) => {
  if (!configured) throw new Error("Database not configured");

  const carData = {
    name: car.name,
    category: car.category,
    price_per_day: car.pricePerDay,
    specs: car.specs,
    image_url: car.imageUrl,
    available: car.available
  };

  // Only update if it looks like a valid UUID (length > 20 is a safe heuristic for UUIDs)
  // This prevents sending Mock IDs "1", "2" to Postgres which expects UUID
  if (car.id && car.id.length > 20) { 
    const { error } = await supabase.from('cars').update(carData).eq('id', car.id);
    if (error) throw error;
  } else {
    // Insert as new
    const { error } = await supabase.from('cars').insert([carData]);
    if (error) throw error;
  }
};

export const deleteCarById = async (id: string) => {
  if (!configured) throw new Error("Database not configured");
  
  // Prevent deleting Mock items from DB (they don't exist in DB anyway, but ID format causes error)
  if (!id || id.length < 20) {
    console.warn("Skipping DB delete for mock/invalid ID:", id);
    return;
  }

  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
};

// --- AUTH API ---

export const checkAdminPassword = async (password: string): Promise<boolean> => {
  const hash = await sha256(password);
  
  if (!configured) {
    // Fallback if DB is not connected: allow 'admin'
    return hash === DEFAULT_HASH;
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password_hash')
      .single();
    
    if (error || !data) {
      // If setting doesn't exist, fallback to default 'admin' check
      console.warn("Password setting not found in DB, using default");
      return hash === DEFAULT_HASH;
    }

    return data.value === hash;
  } catch (e) {
    console.error("Auth check failed", e);
    // Fallback
    return hash === DEFAULT_HASH;
  }
};

export const updateAdminPassword = async (newPassword: string) => {
  if (!configured) throw new Error("Database not configured");
  
  const hash = await sha256(newPassword);
  
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'admin_password_hash', value: hash });
    
  if (error) throw error;
};

// --- TELEGRAM API ---

export const getTelegramSettings = async () => {
  if (!configured) return { botToken: '', chatId: '' };

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
  if (!configured) throw new Error("Database not configured");

  const { error: err1 } = await supabase
    .from('settings')
    .upsert({ key: 'telegram_bot_token', value: token });
    
  const { error: err2 } = await supabase
    .from('settings')
    .upsert({ key: 'telegram_chat_id', value: chatId });

  if (err1 || err2) throw new Error("Failed to save settings");
};