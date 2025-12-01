import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

// Helper to get credentials from Env or LocalStorage
const getCredentials = () => {
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_KEY;
  const lsUrl = localStorage.getItem('supabase_project_url');
  const lsKey = localStorage.getItem('supabase_anon_key');

  // Use env var if it's set and not the default placeholder, otherwise use localStorage
  const url = (envUrl && envUrl !== 'https://YOUR_PROJECT_URL.supabase.co') ? envUrl : lsUrl;
  const key = (envKey && envKey !== 'YOUR_ANON_KEY') ? envKey : lsKey;

  return { url, key };
};

const { url, key } = getCredentials();

// Initialize with valid URL or a dummy one to prevent crash. 
// If keys are missing, requests will simply fail (and be caught), which is handled in the UI.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co', 
  key || 'placeholder'
);

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
      console.warn('Supabase error fetching cars:', JSON.stringify(error, null, 2));
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
  } catch (err) {
    console.error('Failed to fetch cars (check connection settings in Admin):', err);
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
  // This ensures you can login to the admin panel to configure the keys!
  if (error) {
    console.warn("Database check failed, using fallback authentication for initial setup.");
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