import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ConfigPanel from './components/ConfigPanel';
import ChatArea from './components/ChatArea';
import DebugPanel from './components/DebugPanel';
import { BotConfig, Message, Tab, LogEntry } from './types';
import { DEFAULT_CONFIG } from './constants';
import { sendMessageStream } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONFIG);
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: LogEntry['type'] = 'info', details?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleStartChat = () => {
    setActiveTab(Tab.CHAT);
    addLog('Configuration Saved', 'action', `System Prompt updated: "${config.purpose.substring(0, 50)}..."`);
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Educational Logging
    addLog('User Input Received', 'info', input);
    addLog('Intent Detection', 'action', `Model: ${config.model}\nTemperature: ${config.temperature}\nAnalyzing user input context...`);

    try {
      // Placeholder for the model's response
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now()
      }]);

      const stream = sendMessageStream(userMessage.content, config, messages);
      
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, content: fullResponse } : msg
        ));
      }
      
      addLog('Response Generated', 'action', `Tokens processed. Response sent to UI.`);
      
    } catch (error) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "I encountered an error connecting to the AI service. Please check your connection and API key.",
        timestamp: Date.now(),
        isError: true
      }]);
      addLog('Error', 'error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, config, messages]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar for navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile-friendly switching logic could be added here, currently defaulting to desktop grid */}
        
        <div className={`flex-1 flex flex-col transition-opacity duration-300 ${activeTab === Tab.CONFIG ? 'opacity-100 z-10' : 'hidden'}`}>
           <div className="flex-1 overflow-y-auto bg-slate-900">
             <ConfigPanel config={config} setConfig={setConfig} onStartChat={handleStartChat} />
           </div>
        </div>

        <div className={`flex-1 flex flex-col transition-opacity duration-300 ${activeTab === Tab.CHAT ? 'opacity-100 z-10' : 'hidden'}`}>
           <ChatArea 
             messages={messages} 
             isLoading={isLoading} 
             input={input} 
             setInput={setInput} 
             onSend={handleSendMessage}
             config={config}
           />
        </div>

         <div className={`flex-1 flex flex-col transition-opacity duration-300 ${activeTab === Tab.LOGS ? 'opacity-100 z-10' : 'hidden'}`}>
            <DebugPanel logs={logs} onClear={() => setLogs([])} />
         </div>

      </main>
      
      {/* Desktop: Right Log Panel is always visible if screen is wide enough, 
          but for this layout let's keep it clean and use the sidebar tabs strictly 
          to avoid clutter on smaller screens. 
          Actually, let's make the Log Panel separate on large screens? 
          No, single view focus is better for "App-like" feel.
      */}
    </div>
  );
};

export default App;
