import { getTelegramSettings } from './supabase';
import { BookingDetails, Car } from '../types';

export const sendTelegramBooking = async (booking: BookingDetails, car: Car): Promise<boolean> => {
  try {
    const { botToken, chatId } = await getTelegramSettings();

    if (!botToken || !chatId) {
      console.warn('Telegram settings are missing');
      return false;
    }

    const message = `
🚗 <b>НОВАЯ ЗАЯВКА НА БРОНИРОВАНИЕ</b>

<b>Автомобиль:</b> ${car.name}
<b>Категория:</b> ${car.category}
<b>Цена:</b> ${car.pricePerDay} BYN/сутки

👤 <b>Клиент:</b> ${booking.name}
📱 <b>Телефон:</b> ${booking.phone}

📅 <b>Даты:</b>
С: ${booking.startDate}
По: ${booking.endDate}
    `.trim();

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
};
