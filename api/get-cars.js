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
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = getEnvVar('SUPABASE_URL');
  const supabaseKey = getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_KEY') || getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({ error: error.message });
  }
}