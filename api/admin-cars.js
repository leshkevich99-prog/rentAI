
import { createClient } from '@supabase/supabase-js';

const findEnv = (possibleKeys) => {
  for (const key of possibleKeys) {
    if (process.env[key]) return process.env[key];
    if (process.env[key.toLowerCase()]) return process.env[key.toLowerCase()];
    if (process.env[key.toUpperCase()]) return process.env[key.toUpperCase()];
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

  if (!password) {
    return res.status(401).json({ error: 'Password required' });
  }

  const envPassword = findEnv(['ADMIN_PASSWORD', 'PASSWORD']);
  const cleanInputPass = String(password).trim();
  const cleanEnvPass = envPassword ? String(envPassword).trim() : 'admin';

  if (cleanInputPass !== cleanEnvPass) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  if (action === 'check_auth') {
    return res.status(200).json({ success: true });
  }

  const supabaseUrl = findEnv(['SUPABASE_URL']);
  const supabaseServiceKey = findEnv(['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_KEY']);

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'DB keys missing' });
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
        available: car.available,
        is_available_today: car.is_available_today || car.isAvailableToday,
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
