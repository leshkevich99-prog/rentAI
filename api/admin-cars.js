
import { createClient } from '@supabase/supabase-js';

const getEnv = (key) => {
  const variations = [
    key, 
    key.toUpperCase(), 
    key.toLowerCase(),
    `VITE_${key}`,
    `VITE_${key.toUpperCase()}`
  ];
  for (const v of variations) {
    if (process.env[v]) return process.env[v].trim();
  }
  return null;
};

export default async function handler(req, res) {
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

  if (action === 'get_status') {
    return res.status(200).json({
      supabaseUrl: !!getEnv('SUPABASE_URL'),
      supabaseKey: !!(getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_KEY')),
      adminPassword: !!getEnv('ADMIN_PASSWORD')
    });
  }

  if (!password) {
    return res.status(401).json({ error: 'Password required' });
  }

  const envPassword = getEnv('ADMIN_PASSWORD') || 'admin';
  if (String(password).trim() !== String(envPassword).trim()) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  if (action === 'check_auth') {
    return res.status(200).json({ success: true });
  }

  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'DB keys missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel Env Vars.' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (action === 'save') {
      const carData = {
        name: car.name,
        name_en: car.name_en,
        category: car.category,
        price_per_day: car.price_per_day || car.pricePerDay,
        specs: car.specs,
        image_url: car.image_url || car.imageUrl,
        available: car.available === true || car.available === 'true',
        is_available_today: car.is_available_today === true || car.is_available_today === 'true',
        description: car.description,
        description_en: car.description_en,
        discount_rules: car.discount_rules || car.discountRules
      };

      if (car.id && car.id.length > 10) {
        const { error } = await supabase.from('cars').update(carData).eq('id', car.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cars').insert([carData]);
        if (error) throw error;
      }
      return res.status(200).json({ success: true });

    } else if (action === 'delete') {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }
  } catch (dbError) {
    return res.status(500).json({ error: dbError.message });
  }
}
