import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AiConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Здравствуйте! Я ваш персональный консьерж LÉON. Помочь вам с выбором автомобиля?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

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
        className={`fixed bottom-8 right-8 z-40 bg-white text-black p-4 rounded-full shadow-2xl shadow-white/10 hover:bg-gold-400 transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isOpen ? 'hidden' : 'block'}`}
      >
        <Sparkles className="w-6 h-6 text-black" />
        <span className="absolute right-full mr-4 bg-dark-900 border border-white/20 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Консьерж
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[380px] h-[100dvh] sm:h-[600px] bg-dark-900 sm:rounded-2xl border-l border-t sm:border border-white/10 shadow-2xl flex flex-col transition-all duration-500 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-gradient-to-r from-dark-800 to-dark-900 sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                <Bot className="w-6 h-6 text-gold-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-dark-900"></div>
            </div>
            <div>
              <h3 className="text-white font-serif font-bold tracking-wide">LÉON AI</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Premium Concierge</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-black/40">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{ animationDuration: '0.3s' }}
            >
              <div
                className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gold-500 text-black rounded-2xl rounded-tr-sm font-medium'
                    : 'bg-dark-800 text-gray-100 rounded-2xl rounded-tl-sm border border-white/5'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-dark-800 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5 bg-dark-900 sm:rounded-b-2xl">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Спросите о наличии..."
              className="flex-1 bg-dark-800 text-white pl-4 pr-12 py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-400/50 border border-white/10 placeholder-gray-600 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-gold-500 rounded-lg text-black hover:bg-gold-400 transition-colors disabled:opacity-0 disabled:scale-75 transform duration-200"
            >
              <Send size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};