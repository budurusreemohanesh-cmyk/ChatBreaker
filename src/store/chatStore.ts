import { create } from 'zustand';
import { NormalizedMessage, ConversationAnalytics } from '@/types/chat';
import { parseWhatsAppChat } from '@/utils/parser';
import { computeAnalytics } from '@/services/analytics';
import { SAMPLE_DUO_CHAT, SAMPLE_GROUP_CHAT } from '@/data/sampleChats';

interface ChatState {
  rawText: string;
  fileName: string;
  messages: NormalizedMessage[];
  analytics: ConversationAnalytics | null;
  isAnalyzing: boolean;
  error: string | null;
  activeYear: number;
  availableYears: number[];
  conversationThresholdHours: number;
  processingMode: 'local' | 'backend';
  
  // Actions
  loadChat: (text: string, fileName?: string) => Promise<void>;
  loadSample: (sampleType: 'duo' | 'group') => void;
  setThreshold: (hours: number) => void;
  setActiveYear: (year: number) => void;
  setProcessingMode: (mode: 'local' | 'backend') => void;
  clearData: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rawText: '',
  fileName: '',
  messages: [],
  analytics: null,
  isAnalyzing: false,
  error: null,
  activeYear: new Date().getFullYear(),
  availableYears: [],
  conversationThresholdHours: 3,
  processingMode: 'local',

  loadChat: async (text: string, fileName: string = 'chat.txt') => {
    set({ isAnalyzing: true, error: null });
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('The uploaded file is empty. Please select a valid WhatsApp .txt export.');
      }

      const { messages, totalParsed, detectedFormat } = parseWhatsAppChat(text);

      if (messages.length === 0) {
        throw new Error(
          `We couldn't recognize this WhatsApp export format. Please export the conversation again using WhatsApp's "Export chat" option and choose "Without media".`
        );
      }

      const analytics = computeAnalytics(messages, get().conversationThresholdHours);

      // Extract unique years from messages
      const yearsSet = new Set<number>();
      for (const m of messages) {
        const yr = parseInt(m.date.slice(0, 4), 10);
        if (!isNaN(yr)) yearsSet.add(yr);
      }
      const availableYears = Array.from(yearsSet).sort((a, b) => b - a);
      const activeYear = availableYears[0] || new Date().getFullYear();

      set({
        rawText: text,
        fileName,
        messages,
        analytics,
        availableYears,
        activeYear,
        isAnalyzing: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isAnalyzing: false,
        error: err.message || 'An unexpected error occurred while parsing the chat.',
      });
      throw err;
    }
  },

  loadSample: (sampleType: 'duo' | 'group') => {
    const text = sampleType === 'duo' ? SAMPLE_DUO_CHAT : SAMPLE_GROUP_CHAT;
    const fileName = sampleType === 'duo' ? 'paula_liam_chat.txt' : 'product_launch_group.txt';
    get().loadChat(text, fileName);
  },

  setThreshold: (hours: number) => {
    const { messages } = get();
    if (messages.length === 0) {
      set({ conversationThresholdHours: hours });
      return;
    }
    const analytics = computeAnalytics(messages, hours);
    set({ conversationThresholdHours: hours, analytics });
  },

  setActiveYear: (year: number) => {
    set({ activeYear: year });
  },

  setProcessingMode: (mode: 'local' | 'backend') => {
    set({ processingMode: mode });
  },

  clearData: () => {
    set({
      rawText: '',
      fileName: '',
      messages: [],
      analytics: null,
      error: null,
      isAnalyzing: false,
    });
  },
}));
