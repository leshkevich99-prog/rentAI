import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

// Helper to safely get env vars without crashing in browser if process is undefined
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
  } catch (e) {
    return undefined;
  }
};

// Helper to get credentials from Env or LocalStorage
const getCredentials = () => {
  const envUrl = getEnv('SUPABASE_URL');
  const envKey = getEnv('SUPABASE_KEY');
  const lsUrl = localStorage.getItem('supabase_project_url');
  const lsKey = localStorage.getItem('supabase_anon_key');

  // Use env var if it's set and not the default placeholder, otherwise use localStorage
  let url = (envUrl && envUrl !== 'https://YOUR_PROJECT_URL.supabase.co') ? envUrl : lsUrl;
  let key = (envKey && envKey !== 'YOUR_ANON_KEY') ? envKey : lsKey;

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

// Initialize Supabase
// We use a try-catch block during initialization wrapper to be extra safe, 
// though createClient usually handles valid strings fine.
let supabaseClient;
try {
  supabaseClient = createClient(url, key);
} catch (error) {
  console.error("Supabase init failed:", error);
  // Fallback to a dummy client to prevent app crash
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
  try {
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    
    if (error) {
      // Log the error message properly
      console.warn('Supabase error fetching cars:', error.message || error);
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
    console.error('Failed to fetch cars:', err.message || err);
    return [];
  }
};

export const saveCar = async (car: Car) => {
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
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
};

// --- Settings & Auth API ---

export const checkAdminPassword = async (password: string): Promise<boolean> => {
  const hash = await sha256(password);
  
  // 1. Try to check against DB
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'admin_password_hash')
    .single();

  // 2. If DB connection fails (e.g. not configured), fallback to local check for 'admin'
  if (error) {
    console.warn("Database check failed, using fallback authentication. Error:", error.message || error);
    // Hash for 'admin'
    const defaultHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
    return hash === defaultHash;
  }

  if (!data) return false;
  return data.value === hash;
};

export const updateAdminPassword = async (newPassword: string) => {
  const hash = await sha256(newPassword);
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'admin_password_hash', value: hash });
  
  if (error) throw error;
};

export const getTelegramSettings = async () => {
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
  await supabase.from('settings').upsert({ key: 'telegram_bot_token', value: botToken });
  await supabase.from('settings').upsert({ key: 'telegram_chat_id', value: chatId });
};
