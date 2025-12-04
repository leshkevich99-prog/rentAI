
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim().slice(0, 2000);
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
    // Проверяем все возможные варианты написания переменных (Vercel обычно использует UPPERCASE)
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.telegram_bot_token || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.telegram_chat_id || process.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram settings missing. BotToken present:', !!botToken, 'ChatID present:', !!chatId);
      // Возвращаем детализированную ошибку, чтобы вы видели в консоли браузера, чего именно не хватает
      return res.status(500).json({ 
        error: 'Server misconfiguration: Telegram keys missing',
        details: {
          botTokenSet: !!botToken,
          chatIdSet: !!chatId,
          instruction: 'Please verify Env Vars in Vercel Project Settings and REDEPLOY.'
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
      console.error('Telegram API Error', errText);
      return res.status(502).json({ error: 'Failed to send to Telegram', details: errText });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Send-Booking Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
