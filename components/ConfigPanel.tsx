import React from 'react';
import { BotConfig } from '../types';
import { PRESETS } from '../constants';

interface ConfigPanelProps {
  config: BotConfig;
  setConfig: (config: BotConfig) => void;
  onStartChat: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onStartChat }) => {
  
  const handlePresetChange = (key: string) => {
    setConfig(PRESETS[key]);
  };

  const handleInputChange = (field: keyof BotConfig, value: string | number) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-6 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Define Your Chatbot</h2>
        <p className="text-slate-400">
          Follow the "Core Components" guide. Set the purpose, personality, and knowledge base rules here.
        </p>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(PRESETS).map((key) => (
          <button
            key={key}
            onClick={() => handlePresetChange(key)}
            className={`p-4 rounded-xl border transition-all text-left ${
              config.name === PRESETS[key].name
                ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="font-bold text-white mb-1">{key === 'DEFAULT' ? 'General Assistant' : PRESETS[key].name}</div>
            <div className="text-xs text-slate-400 line-clamp-2">{PRESETS[key].purpose}</div>
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            4.1 Bot Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. HelpBot 3000"
          />
        </div>

        {/* System Instruction */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            4.2 & 4.3 Purpose & Knowledge Base (System Instruction)
          </label>
          <p className="text-xs text-slate-500 mb-2">
            This defines the 'Intent Detection' logic and 'Knowledge Base' tone. Tell the AI who it is and how to behave.
          </p>
          <textarea
            value={config.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm leading-relaxed"
            placeholder="You are a helpful assistant..."
          />
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Response Creativity (Temperature: {config.temperature})
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Strict / Factual</span>
            <span>Creative / Random</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onStartChat}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2"
        >
          <span>Save & Start Chatting</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ConfigPanel;
