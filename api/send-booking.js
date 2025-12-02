import { createClient } from '@supabase/supabase-js';

// Простая функция очистки HTML тегов для безопасности
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim().slice(0, 2000); // Лимит 2000 символов
};

export default async function handler(req, res) {
  // Настройка CORS
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
    const { booking, car, type } = req.body;

    // --- SECURITY VALIDATION ---
    if (!booking) return res.status(400).json({ error: 'No data provided' });

    // Очистка данных
    const safeName = sanitize(booking.name);
    const safePhone = sanitize(booking.phone);
    
    // Проверка обязательных полей
    if (!safePhone || safePhone.length < 5) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Инициализация Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase Env Vars on Server');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Получаем настройки Telegram
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
      return res.status(500).json({ error: 'Telegram settings not configured' });
    }

    // Формируем сообщение
    let message = '';

    if (type === 'callback') {
        // --- ЗАКАЗ ЗВОНКА ---
        message = `
📞 <b>ЗАКАЗ ОБРАТНОГО ЗВОНКА</b>

👤 <b>Имя:</b> ${safeName || 'Не указано'}
📱 <b>Телефон:</b> ${safePhone}
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Minsk' })}
        `.trim();

    } else if (type === 'chauffeur') {
        // --- АРЕНДА С ВОДИТЕЛЕМ ---
        const safeDetails = sanitize(booking.details);
        const mapDuration = {
            'transfer': 'Трансфер',
            '3h': '3 часа',
            '5h': '5 часов',
            '8h': '8 часов (Полный день)',
            'event': 'Свадьба / Мероприятие'
        };

        message = `
🎩 <b>ЗАЯВКА: С ВОДИТЕЛЕМ</b>

👤 <b>Клиент:</b> ${safeName}
📱 <b>Телефон:</b> ${safePhone}

📅 <b>Дата:</b> ${sanitize(booking.date)}
⏰ <b>Время:</b> ${sanitize(booking.time)}
⏳ <b>Услуга:</b> ${mapDuration[booking.duration] || booking.duration}

📍 <b>Детали:</b>
${safeDetails || 'Не указано'}
        `.trim();

    } else {
        // --- БРОНИРОВАНИЕ АВТО ---
        if (!car) return res.status(400).json({ error: 'Missing car data' });
        
        message = `
🚗 <b>НОВАЯ ЗАЯВКА (Аренда)</b>

<b>Автомобиль:</b> ${sanitize(car.name)}
<b>Цена:</b> ${car.pricePerDay} BYN/сутки

👤 <b>Клиент:</b> ${safeName}
📱 <b>Телефон:</b> ${safePhone}

📅 <b>Даты:</b>
С: ${sanitize(booking.startDate)}
По: ${sanitize(booking.endDate)}

💰 <b>Итого:</b> ${booking.totalPrice ? booking.totalPrice + ' BYN' : 'Не рассчитано'}
        `.trim();
    }

    // Отправка в Telegram
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
      console.error('Telegram API Error');
      return res.status(502).json({ error: 'Failed to send to Telegram' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server Function Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}