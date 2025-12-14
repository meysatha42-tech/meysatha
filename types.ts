export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface BotConfig {
  name: string;
  purpose: string; // The "System Instruction"
  temperature: number;
  model: string;
}

export enum Tab {
  CHAT = 'CHAT',
  CONFIG = 'CONFIG',
  LOGS = 'LOGS'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'action' | 'error';
  message: string;
  details?: string;
}
