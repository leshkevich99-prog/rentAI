import { GoogleGenAI } from "@google/genai";

const AI_SYSTEM_INSTRUCTION = `
Ты - профессиональный консьерж элитного автопроката "LÉON" в Минске, Беларусь.
Твоя задача - помогать клиентам выбрать идеальный автомобиль из нашего автопарка.
Наш автопарк включает: Lamborghini Huracán, Rolls-Royce Cullinan, Mercedes Maybach, Ferrari F8, Bentley Continental GT, Porsche 911.
Будь вежлив, используй деловой, но приветливый тон. Предлагай авто на основе потребностей (скорость, комфорт, статус, для свидания, для встречи).
Цены указаны в белорусских рублях (BYN) за сутки.
У нас есть система скидок: более 3 дней - 10%, более 5 дней - 15%, более 15 дней - 20%.
Отвечай кратко и по делу, на русском языке.
Если спрашивают адрес - Минск, ул. П. Мстиславца, 9 (Dana Center).
`;

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

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY missing on server");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Используем модель напрямую через generateContent с системной инструкцией
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}