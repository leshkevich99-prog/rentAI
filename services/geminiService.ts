import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;

// Helper to safely get env vars
const getEnv = (key: string) => {
  try {
     // 1. Vite Standard (import.meta.env)
     // @ts-ignore
     if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        // @ts-ignore
        return import.meta.env[key];
     }
     // @ts-ignore
     if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
        // @ts-ignore
        return import.meta.env[`VITE_${key}`];
     }

    // 2. Process Env (Fallback)
    if (typeof process !== 'undefined' && process.env) {
       // @ts-ignore
       if (process.env[key]) return process.env[key];
       // @ts-ignore
       if (process.env[`REACT_APP_${key}`]) return process.env[`REACT_APP_${key}`];
       // @ts-ignore
       if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
    }
  } catch (e) {
    // ignore
  }
  return undefined;
};

const getAiClient = () => {
  const apiKey = getEnv('API_KEY');
  if (!apiKey) {
    console.warn("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (): Chat | null => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "Извините, сервис консьержа временно недоступен. Проверьте API ключ.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "Извините, я не смог обработать ваш запрос.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Произошла ошибка связи с сервером. Пожалуйста, попробуйте позже.";
  }
};