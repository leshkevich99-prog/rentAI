import { BookingDetails, Car } from '../types';

/**
 * Отправляет данные бронирования на серверный эндпоинт /api/send-booking.
 * Это скрывает токен бота от браузера и повышает безопасность.
 */
export const sendTelegramBooking = async (booking: BookingDetails, car: Car): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        booking,
        car
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend Booking Error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network Error sending booking:', error);
    return false;
  }
};