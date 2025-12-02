import { Chat } from "@google/genai";

// Интерфейс для совместимости с существующим кодом, хотя мы теперь используем stateless API
// Мы оставляем базовую структуру, но переписываем логику отправки.

export const initializeChat = (): Chat | null => {
  // Теперь инициализация не требуется на клиенте, так как сессия управляется сервером (или stateless)
  // Возвращаем заглушку, чтобы не ломать типы в компонентах, если они проверяют наличие chatSession
  return {} as Chat;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Извините, я не расслышал. Повторите, пожалуйста.";
  } catch (error) {
    console.error("Chat Service Error:", error);
    return "В данный момент связь с консьержем недоступна. Попробуйте позже.";
  }
};