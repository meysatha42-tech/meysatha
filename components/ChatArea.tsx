import React, { useRef, useEffect } from 'react';
import { Message, BotConfig } from '../types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  config: BotConfig;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  isLoading, 
  input, 
  setInput, 
  onSend,
  config
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {config.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white">{config.name}</h3>
            <span className="flex items-center text-xs text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-500 hidden md:block">
          Model: {config.model}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p>Start the conversation with {config.name}...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.isError 
                    ? 'bg-red-900/50 border border-red-500/50 text-red-200 rounded-bl-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              <div className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-slate-800 rounded-2xl rounded-bl-none px-5 py-4 border border-slate-700 flex space-x-2">
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative flex items-end bg-slate-800 border border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-lg">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${config.name}...`}
            className="w-full bg-transparent text-white p-4 max-h-32 min-h-[56px] resize-none outline-none rounded-xl"
            rows={1}
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="mb-2 mr-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-500">
             AI can make mistakes. Please review responses.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
