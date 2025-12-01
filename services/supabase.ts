import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';
import { CARS } from '../constants';

// Initialize Supabase client
// NOTE: In a real production app, ensure these are loaded from environment variables
// For this demo, we assume process.env is populated or you can replace strings here.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// --- CARS API ---

export const fetchCars = async (): Promise<Car[]> => {
  if (!supabase) {
    console.warn("Supabase not configured. Using local fallback.");
    const stored = localStorage.getItem('fleet_data');
    return stored ? JSON.parse(stored) : CARS;
  }

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching cars:', error);
    return [];
  }

  // Map database columns (snake_case) to application types (camelCase)
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    pricePerDay: item.price_per_day,
    specs: item.specs,
    imageUrl: item.image_url,
    available: item.available
  }));
};

export const addCarToDb = async (car: Car): Promise<Car | null> => {
  if (!supabase) return null;

  // We don't send 'id' for new records to let DB generate UUID
  const { id, ...carData } = car;

  const { data, error } = await supabase
    .from('cars')
    .insert([{
      name: carData.name,
      category: carData.category,
      price_per_day: carData.pricePerDay,
      specs: carData.specs,
      image_url: carData.imageUrl,
      available: carData.available
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding car:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    pricePerDay: data.price_per_day,
    specs: data.specs,
    imageUrl: data.image_url,
    available: data.available
  };
};

export const updateCarInDb = async (car: Car): Promise<boolean> => {
  if (!supabase) return false;

  const { error } = await supabase
    .from('cars')
    .update({
      name: car.name,
      category: car.category,
      price_per_day: car.pricePerDay,
      specs: car.specs,
      image_url: car.imageUrl,
      available: car.available
    })
    .eq('id', car.id);

  if (error) {
    console.error('Error updating car:', error);
    throw error;
  }
  return true;
};

export const deleteCarFromDb = async (id: string): Promise<boolean> => {
  if (!supabase) return false;

  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
  return true;
};

// --- SECURITY API ---

export const getAdminPasswordHash = async (): Promise<string | null> => {
  if (!supabase) {
    return localStorage.getItem('admin_pwh') || '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  }

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'admin_password_hash')
    .single();

  if (error || !data) {
    // If not found in DB, try to insert default
    if (error?.code === 'PGRST116') { // No rows found
         await supabase.from('settings').insert({
             key: 'admin_password_hash',
             value: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // 'admin'
         });
         return '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
    }
    return null;
  }

  return data.value;
};

export const updateAdminPasswordHash = async (newHash: string): Promise<boolean> => {
  if (!supabase) {
    localStorage.setItem('admin_pwh', newHash);
    return true;
  }

  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'admin_password_hash', value: newHash });

  if (error) {
    console.error('Error updating password:', error);
    throw error;
  }
  return true;
};