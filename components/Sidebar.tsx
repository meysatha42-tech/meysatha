import React from 'react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: Tab.CONFIG, label: '1. Configure', icon: '⚡' },
    { id: Tab.CHAT, label: '2. Chat', icon: '💬' },
    { id: Tab.LOGS, label: '3. Logs & Logic', icon: '🛠️' },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          BotArchitect
        </h1>
        <p className="text-xs text-slate-400 mt-1">Build & Test Your Chatbot</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-900/50 border-t border-slate-700">
        <div className="text-xs text-slate-500">
          Powered by <span className="text-blue-400">Gemini 2.5 Flash</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
