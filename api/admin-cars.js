import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Хеширование для сверки пароля (SHA-256)
// Using standard Node.js crypto for better serverless compatibility
function sha256(message) {
  return crypto.createHash('sha256').update(message).digest('hex');
}

const DEFAULT_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // SHA-256 для 'admin'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, password, car, id } = req.body;

  if (!password) {
    return res.status(401).json({ error: 'Password required' });
  }

  // 1. Инициализация Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server configuration error (Missing DB Keys)' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 2. Проверка пароля (Auth)
  let isAuthenticated = false;
  const inputHash = sha256(password);

  // Сначала проверяем дефолтный хэш (чтобы работало без БД настроек)
  if (inputHash === DEFAULT_HASH) {
    isAuthenticated = true;
  } else {
    // Если не дефолтный, проверяем в БД (таблица settings)
    const { data: settingsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password_hash')
      .single();
    
    if (settingsData && settingsData.value === inputHash) {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  // 3. Выполнение действий
  try {
    if (action === 'save') {
      if (!car) return res.status(400).json({ error: 'Car data missing' });

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

      if (car.id && car.id.length > 10) {
        // Update
        const { error } = await supabase.from('cars').update(carData).eq('id', car.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from('cars').insert([carData]);
        if (error) throw error;
      }

      return res.status(200).json({ success: true });

    } else if (action === 'delete') {
      if (!id) return res.status(400).json({ error: 'ID missing' });
      
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;

      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Unknown action' });
    }

  } catch (dbError) {
    console.error("Database Operation Error:", dbError);
    return res.status(500).json({ error: dbError.message });
  }
}