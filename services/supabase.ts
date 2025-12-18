
import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isConfigured = !!(supabaseUrl && supabaseKey);
export const isUsingEnv = true;

const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const mapCarsData = (data: any[]): Car[] => {
  return data.map((car: any) => ({
    id: car.id,
    name: car.name,
    name_en: car.name_en,
    category: car.category,
    pricePerDay: car.price_per_day,
    specs: car.specs,
    imageUrl: car.image_url,
    available: car.available,
    isAvailableToday: car.is_available_today,
    description: car.description,
    description_en: car.description_en,
    discountRules: car.discount_rules || []
  }));
};

export const fetchCars = async (): Promise<Car[]> => {
  if (isConfigured && supabase) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return mapCarsData(data);
    }
  }
  
  try {
    const response = await fetch('/api/get-cars');
    if (response.ok) {
      const data = await response.json();
      return mapCarsData(data);
    }
  } catch (e) {
    console.error("API fetch failed", e);
  }
  
  throw new Error("Could not fetch cars from DB or API");
};

export const saveCarSecure = async (car: Car, password: string) => {
  const response = await fetch('/api/admin-cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save',
      password: password,
      car: {
        ...car,
        // Map to DB column names for server side
        price_per_day: car.pricePerDay,
        image_url: car.imageUrl,
        is_available_today: car.isAvailableToday,
        discount_rules: car.discountRules
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Failed to save car (Status ${response.status})`);
  }
};

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
