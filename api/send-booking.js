
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim().slice(0, 2000);
};

const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
      'VITE_TELEGRAM_CHAT_ID'
    ]);

    if (!botToken || !chatId) {
      console.error('Missing Telegram Credentials');
      return res.status(500).json({ 
        error: 'Server misconfiguration: Telegram keys missing',
        details: {
          botTokenSet: !!botToken,
          chatIdSet: !!chatId,
          instruction: "Please verify Env Vars in Vercel Project Settings and REDEPLOY."
        }
      });
    }

    let message = '';

    if (type === 'callback') {
       // --- CALLBACK REQUEST ---
       message = `📞 <b>ЗАКАЗ ЗВОНКА</b>\n\n` +
                 `👤 <b>Имя:</b> ${escapeHtml(booking.name)}\n` +
                 `📱 <b>Телефон:</b> <code>${escapeHtml(booking.phone)}</code>\n` +
                 `🕒 <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Minsk' })}`;
    } else if (type === 'chauffeur') {
       // --- CHAUFFEUR REQUEST ---
       message = `👨‍✈️ <b>АРЕНДА С ВОДИТЕЛЕМ</b>\n\n` +
                 `👤 <b>Имя:</b> ${escapeHtml(booking.name)}\n` +
                 `📱 <b>Телефон:</b> <code>${escapeHtml(booking.phone)}</code>\n\n` +
                 `📋 <b>Детали заказа:</b>\n` +
                 `• Тип: ${escapeHtml(booking.duration || 'Не указано')}\n` +
                 `• Пожелания: ${escapeHtml(booking.details || 'Нет')}\n\n` +
                 `🕒 <b>Создано:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Minsk' })}`;
    } else {
       // --- CAR BOOKING ---
       const carName = car ? escapeHtml(car.name) : 'Неизвестное авто';
       const price = booking.totalPrice ? `${booking.totalPrice} BYN` : 'Не рассчитана';
       
       message = `🚘 <b>НОВАЯ ЗАЯВКА НА АРЕНДУ</b>\n\n` +
                 `🚗 <b>Авто:</b> ${carName}\n` +
                 `📅 <b>Даты:</b> ${escapeHtml(booking.startDate)} — ${escapeHtml(booking.endDate)}\n` +
                 `🗓 <b>Дней:</b> ${booking.days || '?'}\n` +
                 `💰 <b>Сумма:</b> ${price}\n` +
                 (booking.discountApplied ? `🔖 <b>Скидка:</b> ${booking.discountApplied}%\n` : '') +
                 `\n` +
                 `👤 <b>Клиент:</b> ${escapeHtml(booking.name)}\n` +
                 `📱 <b>Телефон:</b> <code>${escapeHtml(booking.phone)}</code>`;
    }

    // Send to Telegram
    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgResponse = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const tgData = await tgResponse.json();

    if (!tgResponse.ok) {
      console.error('Telegram API Error:', tgData);
      return res.status(500).json({ error: 'Failed to send to Telegram', details: tgData });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Handler Error:", error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
