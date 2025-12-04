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
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

  try {
    const { image, filename } = req.body;

    if (!image || !filename) {
      return res.status(400).json({ error: 'Missing image data or filename' });
    }

    // Используем хелпер для поиска ключей
    const supabaseUrl = getEnvVar('SUPABASE_URL');
    const supabaseKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Server configuration error: DB keys missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Декодируем Base64
    const base64Data = image.split(',')[1];
    if (!base64Data) {
        return res.status(400).json({ error: 'Invalid image format' });
    }
    
    const buffer = Buffer.from(base64Data, 'base64');
    const contentType = image.substring(image.indexOf(':') + 1, image.indexOf(';')) || 'image/jpeg';

    // Загружаем в Storage
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(filename, buffer, {
        contentType: contentType,
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from('car-images')
      .getPublicUrl(filename);

    return res.status(200).json({ publicUrl: publicData.publicUrl });

  } catch (error) {
    console.error("Upload API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}