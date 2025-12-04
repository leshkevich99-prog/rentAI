
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim().slice(0, 2000);
};

// Robust environment variable finder
const findEnv = (possibleKeys) => {
  for (const key of possibleKeys) {
    const value = process.env[key] || process.env[key.toUpperCase()] || process.env[key.toLowerCase()];
    if (value) return value.trim(); // Trim whitespace which often causes issues
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

  try {
    const { booking, car, type } = req.body;

    // --- CONFIGURATION ---
    // Expanded list of possible keys
    const botToken = findEnv([
      'TELEGRAM_BOT_TOKEN', 
      'BOT_TOKEN', 
      'TG_BOT_TOKEN',
      'TELEGRAM_TOKEN',
      'VITE_TELEGRAM_BOT_TOKEN'
    ]);
    
    const chatId = findEnv([
      'TELEGRAM_CHAT_ID', 
      'CHAT_ID', 
      'TG_CHAT_ID',
      'TELEGRAM_CHATID',
      'TG_CHATID',
      'CHATID',
      'VITE_TELEGRAM_CHAT_ID'
    ]);

    if (!botToken || !chatId) {
      // Security: List keys found in process.env that might be relevant (masking values)
      const relevantEnvKeys = Object.keys(process.env).filter(k => {
        const lower = k.toLowerCase();
        return lower.includes('telegram') || lower.includes('chat') || lower.includes('token') || lower.includes('id');
      });

      console.error('Server Configuration Error: Telegram credentials missing.');
      console.error('BotToken Found:', !!botToken);
      console.error('ChatID Found:', !!chatId);
      console.error('Available Relevant Env Keys:', relevantEnvKeys);

      return res.status(500).json({ 
        error: 'Server misconfiguration: Telegram keys missing',
        details: {
          botTokenFound: !!botToken,
          chatIdFound: !!chatId,
          relevantKeysInEnv: relevantEnvKeys,
          instruction: 'Check Vercel Settings -> Environment Variables. Ensure TELEGRAM_CHAT_ID is set.'
        }
      });
    }

    // --- VALIDATION & PREPARATION ---
    const safeName = sanitize(booking?.name);
    const safePhone = sanitize(booking?.phone);
    
    if (!booking || !safePhone || safePhone.length < 5) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    let message = '';

    if (type === 'callback') {
        // --- CALLBACK ---
        message = `
📞 <b>ЗАКАЗ ОБРАТНОГО ЗВОНКА</b>

👤 <b>Имя:</b> ${safeName || 'Не указано'}
📱 <b>Телефон:</b> ${safePhone}
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Minsk' })}
        `.trim();

    } else if (type === 'chauffeur') {
        // --- CHAUFFEUR ---
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
        // --- RENTAL ---
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

    // --- SEND TO TELEGRAM ---
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
      return res.status(502).json({ error: 'Failed to send to Telegram', details: errText });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Send-Booking Handler Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
