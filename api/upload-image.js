import { createClient } from '@supabase/supabase-js';

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

    // Инициализация Supabase с сервисным ключом для обхода RLS
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    // Используем Service Key если есть, иначе Anon Key (но Anon может не сработать если RLS включен)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Декодируем Base64 (формат: "data:image/png;base64,.....")
    const base64Data = image.split(',')[1];
    if (!base64Data) {
        return res.status(400).json({ error: 'Invalid image format' });
    }
    
    const buffer = Buffer.from(base64Data, 'base64');

    // Определяем Content-Type
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

    // Получаем публичную ссылку
    const { data: publicData } = supabase.storage
      .from('car-images')
      .getPublicUrl(filename);

    return res.status(200).json({ publicUrl: publicData.publicUrl });

  } catch (error) {
    console.error("Upload API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}