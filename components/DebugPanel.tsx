import React from 'react';
import { LogEntry } from '../types';

interface DebugPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ logs, onClear }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 w-80 fixed right-0 top-0 bottom-0 md:relative md:w-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <h3 className="font-bold text-slate-200">System Logs</h3>
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-2">
        {logs.length === 0 ? (
          <div className="text-center text-slate-600 mt-10 p-4">
            Waiting for interactions...
            <br />
            This panel shows how the chatbot "thinks" and processes input (Step 4.2 Intent Detection).
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-3 rounded border border-slate-800/50 ${
                log.type === 'action' ? 'bg-blue-900/10 text-blue-200' :
                log.type === 'error' ? 'bg-red-900/10 text-red-200' :
                'bg-slate-900/50 text-slate-400'
              }`}
            >
              <div className="flex justify-between items-center mb-1 opacity-50">
                 <span>{log.timestamp}</span>
                 <span className="uppercase font-bold tracking-wider text-[10px]">{log.type}</span>
              </div>
              <div className="font-semibold mb-1">{log.message}</div>
              {log.details && (
                <div className="mt-1 p-2 bg-black/30 rounded text-slate-500 break-words whitespace-pre-wrap">
                  {log.details}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500">
        Debug View: Simulating Intent Detection & Logic Flow
      </div>
    </div>
  );
};

export default DebugPanel;
