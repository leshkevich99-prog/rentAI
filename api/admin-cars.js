
import { createClient } from '@supabase/supabase-js';

// Helper to find env var by checking multiple common naming conventions
const findEnv = (possibleKeys) => {
  for (const key of possibleKeys) {
    if (process.env[key]) return process.env[key];
    if (process.env[key.toLowerCase()]) return process.env[key.toLowerCase()];
    if (process.env[key.toUpperCase()]) return process.env[key.toUpperCase()];
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

  // 1. Authorization Check (Environment Variable)
  const envPassword = findEnv([
    'ADMIN_PASSWORD',
    'admin_password',
    'VITE_ADMIN_PASSWORD',
    'PASSWORD'
  ]);
  
  // Strict comparison, trimming to avoid whitespace issues
  const cleanInputPass = String(password).trim();
  const cleanEnvPass = envPassword ? String(envPassword).trim() : null;

  if (!cleanEnvPass) {
      console.error('ADMIN_PASSWORD env var is missing');
      return res.status(500).json({ error: 'Server auth misconfiguration: ADMIN_PASSWORD missing' });
  }

  if (cleanInputPass !== cleanEnvPass) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  // If this is just an auth check from the frontend
  if (action === 'check_auth') {
    return res.status(200).json({ success: true });
  }

  // 2. Database Connection
  const supabaseUrl = findEnv(['SUPABASE_URL', 'VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL']);
  const supabaseServiceKey = findEnv([
      'SUPABASE_SERVICE_ROLE_KEY', 
      'SUPABASE_KEY', 
      'SUPABASE_ANON_KEY', 
      'VITE_SUPABASE_ANON_KEY'
  ]);

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Database configuration missing');
    return res.status(500).json({ error: 'Server DB misconfiguration: Keys missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
