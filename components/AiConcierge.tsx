import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AiConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Здравствуйте! Я ваш персональный консьерж EliteDrive. Помочь вам с выбором автомобиля?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Произошла ошибка. Попробуйте еще раз.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 bg-gold-500 text-black p-4 rounded-full shadow-lg shadow-gold-500/20 hover:bg-gold-400 transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Консьерж
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-0 right-0 sm:bottom-8 sm:right-8 z-50 w-full sm:w-[400px] h-full sm:h-[600px] bg-dark-800 sm:rounded-2xl border border-white/10 shadow-2xl flex flex-col transition-all duration-500 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-dark-900/50 backdrop-blur-md sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="text-white font-serif font-bold">Elite Консьерж</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gold-500 text-black rounded-2xl rounded-tr-sm font-medium'
                    : 'bg-white/5 text-gray-200 rounded-2xl rounded-tl-sm border border-white/5'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm border border-white/5">
                <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5 bg-dark-900/50 backdrop-blur-md sm:rounded-b-2xl">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Спросите о машинах..."
              className="w-full bg-dark-700 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-400/50 border border-white/5 placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
