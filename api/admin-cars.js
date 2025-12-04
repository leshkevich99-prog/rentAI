import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key) => {
  const variations = [
    key, 
    key.toUpperCase(), 
    key.toLowerCase(),
    `VITE_${key}`,
    `VITE_${key.toUpperCase()}`
  ];
  for (const v of variations) {
    if (process.env[v]) return process.env[v];
  }
  return null;
};

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

  // 1. Проверка пароля
  const envPassword = getEnvVar('ADMIN_PASSWORD');
  
  // Пароль по умолчанию "admin" работает ТОЛЬКО если переменная окружения НЕ задана вообще.
  const isAuthValid = envPassword ? (password === envPassword) : (password === 'admin');

  if (!isAuthValid) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  // Если это просто проверка авторизации (при логине на фронтенде)
  if (action === 'check_auth') {
    return res.status(200).json({ success: true });
  }

  // 2. Инициализация Supabase
  const supabaseUrl = getEnvVar('SUPABASE_URL');
  const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('SUPABASE_KEY') || getEnvVar('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Database keys missing on server');
    return res.status(500).json({ error: 'Server configuration error (Missing DB Keys)' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 3. Выполнение действий с данными
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
        // Update (assuming UUID length > 10, mocks are usually '1', '2')
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