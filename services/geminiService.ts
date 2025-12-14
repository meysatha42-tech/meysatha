import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { BotConfig, Message } from "../types";

let chatSession: Chat | null = null;
let currentConfig: BotConfig | null = null;

// Initialize the Gemini client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (config: BotConfig, history: Message[]) => {
  const ai = getClient();
  
  // Convert our app's message history to the Gemini API format if needed.
  // Ideally, for a fresh start, we just init the chat. 
  // For this app, we will rely on maintaining the chat session state.
  
  chatSession = ai.chats.create({
    model: config.model,
    config: {
      temperature: config.temperature,
      systemInstruction: config.purpose,
    },
    history: history.filter(h => h.role !== 'system').map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }))
  });
  
  currentConfig = config;
  return chatSession;
};

export const sendMessageStream = async function* (
  message: string, 
  config: BotConfig,
  currentHistory: Message[]
): AsyncGenerator<string, void, unknown> {
  
  // Re-initialize if config changed or session doesn't exist
  if (!chatSession || config !== currentConfig) {
    initializeChat(config, currentHistory);
  }

  if (!chatSession) throw new Error("Failed to initialize chat session");

  try {
    const resultStream = await chatSession.sendMessageStream({
      message: message
    });

    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
