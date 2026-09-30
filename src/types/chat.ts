export interface NormalizedMessage {
  id: string;
  timestamp: string; // ISO 8601
  sender: string;
  message: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
  wordCount: number;
  characterCount: number;
  isMedia?: boolean;
}

export interface OverviewStats {
  totalMessages: number;
  totalParticipants: number;
  activeDays: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalWords: number;
  totalCharacters: number;
  avgMessagesPerDay: number;
  avgWordsPerMessage: number;
  avgMessageLength: number;
}

export interface ParticipantStats {
  name: string;
  messageCount: number;
  percentage: number;
  wordCount: number;
  avgWordsPerMessage: number;
  avgMessageLength: number;
  longestMessageWords: number;
  longestMessageChars: number;
  longestMessageText: string;
  emojiCount: number;
  linksShared: number;
  mediaCount: number;
  activeDays: number;
  conversationStarts: number;
  conversationStartsPct: number;
  medianReplyTimeMinutes: number | null;
  avgReplyTimeMinutes: number | null;
  color?: string;
}

export interface ActivityStats {
  byHour: Array<{ hour: number; count: number; percentage: number }>;
  byDayOfWeek: Array<{ day: string; dayIndex: number; count: number; average: number }>;
  peakHour: number;
  quietHour: number;
  nightOwlPercentage: number;
  busiestDayOfWeek: string;
  quietestDayOfWeek: string;
  calendarHeatmap: Record<string, number>;
  busiestDays: Array<{ date: string; count: number; formattedDate: string }>;
  participantByHour: Record<string, number[]>;
}

export interface ReplyTimeStats {
  overallMedianMinutes: number;
  overallAvgMinutes: number;
  fastestReplySeconds: number;
  longestGapHours: number;
  byParticipant: Record<string, { medianMinutes: number; avgMinutes: number; count: number }>;
}

export interface ConversationStarterStats {
  thresholdHours: number;
  totalConversations: number;
  starters: Array<{ name: string; count: number; percentage: number }>;
}

export interface StreakStats {
  longestStreakDays: number;
  longestStreakStart: string;
  longestStreakEnd: string;
  currentStreakDays: number;
  longestSilenceDays: number;
  longestSilenceStart: string;
  longestSilenceEnd: string;
  avgGapDays: number;
}

export interface WordStats {
  topWords: Array<{ word: string; count: number }>;
  totalUniqueWords: number;
  wordsPerParticipant: Record<string, Array<{ word: string; count: number }>>;
}

export interface PhraseStats {
  twoWordPhrases: Array<{ phrase: string; count: number }>;
  threeWordPhrases: Array<{ phrase: string; count: number }>;
  fourWordPhrases: Array<{ phrase: string; count: number }>;
}

export interface EmojiStats {
  topEmojis: Array<{ emoji: string; count: number }>;
  totalEmojis: number;
  emojisPerParticipant: Record<string, Array<{ emoji: string; count: number }>>;
  emojiCombinations: Array<{ combo: string; count: number }>;
}

export interface LongestMessageItem {
  sender: string;
  date: string;
  timestamp: string;
  wordCount: number;
  characterCount: number;
  preview: string;
  fullText: string;
}

export interface LongestMessageStats {
  byWords: LongestMessageItem[];
  byChars: LongestMessageItem[];
  perParticipant: Record<string, LongestMessageItem>;
}

export interface LinkStats {
  totalLinks: number;
  linksPerParticipant: Record<string, number>;
  topDomains: Array<{ domain: string; count: number }>;
}

export interface MediaStats {
  totalMedia: number;
  mediaPerParticipant: Record<string, number>;
}

export interface TimelineStats {
  firstMessage: NormalizedMessage;
  lastMessage: NormalizedMessage;
  monthlyVolume: Array<{ month: string; count: number; label: string }>;
}

export interface AIInsightFact {
  type: 'overview' | 'rhythm' | 'dynamics' | 'habits' | 'language';
  headline: string;
  description: string;
  metric: string;
}

export interface ConversationAnalytics {
  overview: OverviewStats;
  participants: ParticipantStats[];
  activity: ActivityStats;
  replyTimes: ReplyTimeStats;
  conversationStarters: ConversationStarterStats;
  streaks: StreakStats;
  words: WordStats;
  phrases: PhraseStats;
  emojis: EmojiStats;
  longestMessages: LongestMessageStats;
  links: LinkStats;
  media: MediaStats;
  timeline: TimelineStats;
  aiInsights: AIInsightFact[];
}

export interface ParserResult {
  messages: NormalizedMessage[];
  totalParsed: number;
  systemMessageCount: number;
  errorsCount: number;
  detectedFormat: string;
}
