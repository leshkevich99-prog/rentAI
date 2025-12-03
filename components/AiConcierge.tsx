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
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Slight delay for animation
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Прошу прощения, возникла ошибка связи. Пожалуйста, попробуйте позже.', isError: true }]);
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
        className={`fixed bottom-8 left-8 z-40 bg-dark-900 border border-gold-400/50 text-gold-400 p-4 rounded-full shadow-lg shadow-gold-900/20 hover:bg-gold-400 hover:text-black hover:border-gold-400 transition-all duration-300 hover:scale-110 group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Sparkles className="w-6 h-6 animate-pulse-slow" />
        <span className="absolute left-full ml-4 bg-white text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI Консьерж
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed z-50 transition-all duration-500 ease-in-out flex flex-col bg-dark-800/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden
          ${isOpen 
            ? 'opacity-100 translate-y-0 bottom-0 left-0 w-full h-full md:bottom-24 md:left-8 md:w-96 md:h-[600px] md:rounded-2xl' 
            : 'opacity-0 translate-y-10 pointer-events-none bottom-8 left-8 w-96 h-0'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-dark-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-400/20">
              <Bot className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white leading-none">LÉON AI</h3>
              <span className="text-[10px] text-green-400 uppercase tracking-wider font-bold">Online</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
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
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-white text-black rounded-tr-none' 
                    : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                } ${msg.isError ? 'border-red-500/50 text-red-200' : ''}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center h-12">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-dark-900/50">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Спросите о наличии авто..."
              className="w-full bg-dark-900 border border-white/10 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:border-gold-400 transition-colors text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold-400 hover:text-white disabled:opacity-50 disabled:hover:text-gold-400 transition-colors"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};