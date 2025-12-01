import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

// Helper to safely get env vars regardless of bundler (Vite vs CRA vs Node)
const getEnv = (key: string) => {
  try {
    // 1. Check Vite (import.meta.env)
    // We look for standard key or VITE_ prefixed key
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
       // @ts-ignore
       if (import.meta.env[key]) return import.meta.env[key];
       // @ts-ignore
       if (import.meta.env[`VITE_${key}`]) return import.meta.env[`VITE_${key}`];
    }
    
    // 2. Check process.env (Create React App / Node / Webpack)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
       // @ts-ignore
       if (process.env[key]) return process.env[key];
       // @ts-ignore
       if (process.env[`REACT_APP_${key}`]) return process.env[`REACT_APP_${key}`];
    }
  } catch (e) {
    // Ignore errors in environments where these are accessed incorrectly
  }
  return undefined;
};

// Helper to get credentials from Env or LocalStorage
const getCredentials = () => {
  const envUrl = getEnv('SUPABASE_URL');
  const envKey = getEnv('SUPABASE_KEY');
  const lsUrl = localStorage.getItem('supabase_project_url');
  const lsKey = localStorage.getItem('supabase_anon_key');

  // Use env var if it's set and not the default placeholder, otherwise use localStorage
  let url = (envUrl && !envUrl.includes('YOUR_PROJECT_URL')) ? envUrl : lsUrl;
  let key = (envKey && !envKey.includes('YOUR_ANON_KEY')) ? envKey : lsKey;

  // Basic validation to prevent createClient crash
  if (!url || !url.startsWith('http')) {
    url = 'https://placeholder.supabase.co';
  }
  if (!key) {
    key = 'placeholder';
  }

  return { url, key };
};

const { url, key } = getCredentials();
// Check if we are using real credentials or placeholders
const isConfigured = url !== 'https://placeholder.supabase.co' && key !== 'placeholder';

// Initialize Supabase
let supabaseClient;
try {
  supabaseClient = createClient(url, key);
} catch (error) {
  console.error("Supabase init failed:", error);
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder');
}

export const supabase = supabaseClient;

// --- Hashing Utility ---
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// --- Cars API ---
export const fetchCars = async (): Promise<Car[]> => {
  // If not configured, don't even try to fetch, return empty so App falls back to mocks
  if (!isConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      pricePerDay: item.price_per_day,
      specs: item.specs,
      imageUrl: item.image_url,
      available: item.available
    }));
  } catch (err: any) {
    // Suppress "Failed to fetch" noise which happens when URL is wrong or network down
    if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('Network request failed'))) {
        console.warn("Could not connect to Supabase (Network/Config error). Using fallback data.");
    } else {
        console.error('Failed to fetch cars:', err.message || err);
    }
    return [];
  }
};

export const saveCar = async (car: Car) => {
  if (!isConfigured) throw new Error("Database not configured");

  // Convert to DB format
  const dbCar = {
    name: car.name,
    category: car.category,
    price_per_day: car.pricePerDay,
    specs: car.specs,
    image_url: car.imageUrl,
    available: car.available
  };

  if (car.id && car.id.length > 10) { // Assuming UUID length
    // Update
    const { error } = await supabase.from('cars').update(dbCar).eq('id', car.id);
    if (error) throw error;
  } else {
    // Insert
    const { error } = await supabase.from('cars').insert([dbCar]);
    if (error) throw error;
  }
};

export const deleteCarById = async (id: string) => {
  if (!isConfigured) throw new Error("Database not configured");
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
};

// --- Settings & Auth API ---

export const checkAdminPassword = async (password: string): Promise<boolean> => {
  const hash = await sha256(password);
  const defaultHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // hash for 'admin'
  
  // Quick fallback if clearly not configured
  if (!isConfigured && hash === defaultHash) {
    return true;
  }

  try {
    // 1. Try to check against DB
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password_hash')
      .single();

    if (error) throw error;
    if (!data) return false;
    return data.value === hash;

  } catch (error: any) {
    console.warn("Database auth check failed, using local fallback. Error:", error.message || "Unknown");
    // 2. If DB connection fails (e.g. not configured), fallback to local check for 'admin'
    return hash === defaultHash;
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

export const getTelegramSettings = async () => {
  if (!isConfigured) return { botToken: '', chatId: '' };

  try {
    const { data: tokenData } = await supabase.from('settings').select('value').eq('key', 'telegram_bot_token').single();
    const { data: chatData } = await supabase.from('settings').select('value').eq('key', 'telegram_chat_id').single();
    
    return {
      botToken: tokenData?.value || '',
      chatId: chatData?.value || ''
    };
  } catch (e) {
    return { botToken: '', chatId: '' };
  }
};

export const saveTelegramSettings = async (botToken: string, chatId: string) => {
  if (!isConfigured) throw new Error("Database not configured");
  await supabase.from('settings').upsert({ key: 'telegram_bot_token', value: botToken });
  await supabase.from('settings').upsert({ key: 'telegram_chat_id', value: chatId });
};