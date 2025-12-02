import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Настройка CORS для разрешения запросов с фронтенда
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

  try {
    const { booking, car } = req.body;

    if (!booking || !car) {
      return res.status(400).json({ error: 'Missing booking or car data' });
    }

    // 1. Инициализация Supabase на сервере
    // Используем process.env, так как это Node.js среда
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase Env Vars on Server');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Безопасно получаем настройки Telegram из базы данных
    // Эти данные никогда не покинут сервер
    const { data: settingsData, error: dbError } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['telegram_bot_token', 'telegram_chat_id']);

    if (dbError) {
      console.error('DB Error:', dbError);
      throw new Error('Failed to fetch settings');
    }

    const settings = {};
    settingsData.forEach(item => {
      settings[item.key] = item.value;
    });

    const botToken = settings['telegram_bot_token'];
    const chatId = settings['telegram_chat_id'];

    if (!botToken || !chatId) {
      return res.status(500).json({ error: 'Telegram settings not configured in Admin panel' });
    }

    // 3. Формируем сообщение
    const message = `
🚗 <b>НОВАЯ ЗАЯВКА (Через сайт)</b>

<b>Автомобиль:</b> ${car.name}
<b>Категория:</b> ${car.category}
<b>Цена:</b> ${car.pricePerDay} BYN/сутки

👤 <b>Клиент:</b> ${booking.name}
📱 <b>Телефон:</b> ${booking.phone}

📅 <b>Даты:</b>
С: ${booking.startDate}
По: ${booking.endDate}

💰 <b>Итого:</b> ${booking.totalPrice ? booking.totalPrice + ' BYN' : 'Не рассчитано'}
${booking.discountApplied ? `🏷 <b>Скидка:</b> ${booking.discountApplied}%` : ''}
    `.trim();

    // 4. Отправляем в Telegram
    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgResponse = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!tgResponse.ok) {
      const errText = await tgResponse.text();
      console.error('Telegram API Error:', errText);
      return res.status(502).json({ error: 'Failed to send to Telegram' });
    }

    // Успех
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server Function Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}