import {
  NormalizedMessage,
  ConversationAnalytics,
  OverviewStats,
  ParticipantStats,
  ActivityStats,
  ReplyTimeStats,
  ConversationStarterStats,
  StreakStats,
  WordStats,
  PhraseStats,
  EmojiStats,
  LongestMessageStats,
  LinkStats,
  MediaStats,
  TimelineStats,
  AIInsightFact,
  LongestMessageItem,
} from '@/types/chat';
import { getParticipantColor, truncateText } from '@/utils/formatting';
import { formatDate } from '@/utils/date';

const STOPWORDS = new Set([
  'the', 'and', 'to', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are',
  'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had',
  'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said',
  'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up',
  'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would',
  'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see',
  'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who', 'its', 'now', 'find',
  'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'just', 'ok', 'okay',
  'yeah', 'yes', 'omitted', 'media', 'pm', 'am', 'http', 'https', 'me', 'too', 'also', 'im',
  'dont', 'cant', 'didnt', 'wont', 'gonna', 'got', 'think', 'know', 'want', 'good', 'well',
  'really', 'much', 'even', 'back', 'here', 'ill', 'ive', 'youre', 'thats', 'going', 'see',
  'let', 'take', 'come', 'tell', 'say', 'right', 'already', 'still', 'always', 'never', 'again',
]);

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function computeAnalytics(
  messages: NormalizedMessage[],
  conversationThresholdHours: number = 3
): ConversationAnalytics {
  if (messages.length === 0) {
    throw new Error('No valid messages found to analyze.');
  }

  // Sort chronologically just in case
  const sorted = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const totalMessages = sorted.length;
  const firstMsg = sorted[0];
  const lastMsg = sorted[sorted.length - 1];

  const startDate = firstMsg.date;
  const endDate = lastMsg.date;

  const startMs = new Date(firstMsg.timestamp).getTime();
  const endMs = new Date(lastMsg.timestamp).getTime();
  const diffDays = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

  // Groupings
  const participantMap = new Map<string, NormalizedMessage[]>();
  const activeDatesSet = new Set<string>();
  const calendarHeatmap: Record<string, number> = {};
  const hourCounts = new Array(24).fill(0);
  const dayOfWeekCounts = new Array(7).fill(0);
  const participantHourMap: Record<string, number[]> = {};

  let totalWords = 0;
  let totalCharacters = 0;

  for (const msg of sorted) {
    const sender = msg.sender;
    if (!participantMap.has(sender)) {
      participantMap.set(sender, []);
      participantHourMap[sender] = new Array(24).fill(0);
    }
    participantMap.get(sender)!.push(msg);

    activeDatesSet.add(msg.date);
    calendarHeatmap[msg.date] = (calendarHeatmap[msg.date] || 0) + 1;

    // Hour distribution
    if (msg.hour >= 0 && msg.hour < 24) {
      hourCounts[msg.hour]++;
      participantHourMap[sender][msg.hour]++;
    }

    // Day of week distribution (0 = Sunday in JS, so convert to Monday = 0)
    const msgDate = new Date(msg.date + 'T12:00:00');
    const jsDay = msgDate.getDay(); // 0 is Sun, 1 is Mon...
    const mondayIndex = (jsDay + 6) % 7;
    dayOfWeekCounts[mondayIndex]++;

    totalWords += msg.wordCount;
    totalCharacters += msg.characterCount;
  }

  const activeDays = activeDatesSet.size;
  const totalParticipants = participantMap.size;

  // OVERVIEW STATS
  const overview: OverviewStats = {
    totalMessages,
    totalParticipants,
    activeDays,
    startDate,
    endDate,
    durationDays: diffDays,
    totalWords,
    totalCharacters,
    avgMessagesPerDay: Number((totalMessages / activeDays).toFixed(1)),
    avgWordsPerMessage: Number((totalWords / totalMessages).toFixed(1)),
    avgMessageLength: Number((totalCharacters / totalMessages).toFixed(1)),
  };

  // CONVERSATION STARTERS & REPLY TIMES
  const thresholdMs = conversationThresholdHours * 60 * 60 * 1000;
  const startersCount: Record<string, number> = {};
  let totalConversations = 0;

  const replyTimeGaps: number[] = []; // in minutes
  const participantReplyGaps: Record<string, number[]> = {};
  let fastestReplySeconds = Infinity;
  let longestGapHours = 0;

  // First message starts conversation 1
  startersCount[firstMsg.sender] = 1;
  totalConversations = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const prevTime = new Date(prev.timestamp).getTime();
    const currTime = new Date(curr.timestamp).getTime();
    const diffMs = currTime - prevTime;

    if (diffMs > thresholdMs) {
      totalConversations++;
      startersCount[curr.sender] = (startersCount[curr.sender] || 0) + 1;
    }

    const gapHours = diffMs / (1000 * 60 * 60);
    if (gapHours > longestGapHours) {
      longestGapHours = gapHours;
    }

    // Reply time: sender changed and gap within 24h
    if (curr.sender !== prev.sender && diffMs > 0 && diffMs < 24 * 60 * 60 * 1000) {
      const gapMin = diffMs / (1000 * 60);
      const gapSec = diffMs / 1000;
      replyTimeGaps.push(gapMin);

      if (gapSec < fastestReplySeconds) {
        fastestReplySeconds = gapSec;
      }

      if (!participantReplyGaps[curr.sender]) {
        participantReplyGaps[curr.sender] = [];
      }
      participantReplyGaps[curr.sender].push(gapMin);
    }
  }

  if (fastestReplySeconds === Infinity) {
    fastestReplySeconds = 0;
  }

  const median = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  };

  const average = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    return arr.reduce((acc, v) => acc + v, 0) / arr.length;
  };

  const overallMedianReply = Number(median(replyTimeGaps).toFixed(1));
  const overallAvgReply = Number(average(replyTimeGaps).toFixed(1));

  const byParticipantReply: Record<string, { medianMinutes: number; avgMinutes: number; count: number }> = {};
  for (const [sender, gaps] of Object.entries(participantReplyGaps)) {
    byParticipantReply[sender] = {
      medianMinutes: Number(median(gaps).toFixed(1)),
      avgMinutes: Number(average(gaps).toFixed(1)),
      count: gaps.length,
    };
  }

  const replyTimes: ReplyTimeStats = {
    overallMedianMinutes: overallMedianReply,
    overallAvgMinutes: overallAvgReply,
    fastestReplySeconds: Math.round(fastestReplySeconds),
    longestGapHours: Number(longestGapHours.toFixed(1)),
    byParticipant: byParticipantReply,
  };

  const conversationStarters: ConversationStarterStats = {
    thresholdHours: conversationThresholdHours,
    totalConversations,
    starters: Object.entries(startersCount)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Number(((count / totalConversations) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count),
  };

  // EMOJIS, WORDS, PHRASES, LINKS, MEDIA
  const emojiRegex = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu;
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

  const wordFreqOverall = new Map<string, number>();
  const wordsPerParticipant: Record<string, Map<string, number>> = {};
  const phrase2Map = new Map<string, number>();
  const phrase3Map = new Map<string, number>();
  const phrase4Map = new Map<string, number>();

  const emojiFreqOverall = new Map<string, number>();
  const emojiPerParticipant: Record<string, Map<string, number>> = {};
  const emojiCombosMap = new Map<string, number>();

  const domainCountMap = new Map<string, number>();
  const linksPerParticipant: Record<string, number> = {};
  let totalLinks = 0;

  const mediaPerParticipant: Record<string, number> = {};
  let totalMedia = 0;

  const longestByWordsList: LongestMessageItem[] = [];
  const longestByCharsList: LongestMessageItem[] = [];
  const participantLongestMap: Record<string, LongestMessageItem> = {};

  for (const msg of sorted) {
    const sender = msg.sender;
    const text = msg.message;

    // Track longest messages
    const msgItem: LongestMessageItem = {
      sender,
      date: msg.date,
      timestamp: msg.timestamp,
      wordCount: msg.wordCount,
      characterCount: msg.characterCount,
      preview: truncateText(text, 140),
      fullText: text,
    };

    longestByWordsList.push(msgItem);
    longestByCharsList.push(msgItem);

    if (!participantLongestMap[sender] || msg.wordCount > participantLongestMap[sender].wordCount) {
      participantLongestMap[sender] = msgItem;
    }

    // Media
    if (msg.isMedia) {
      totalMedia++;
      mediaPerParticipant[sender] = (mediaPerParticipant[sender] || 0) + 1;
    }

    // URLs
    const urls = text.match(urlRegex) || [];
    if (urls.length > 0) {
      totalLinks += urls.length;
      linksPerParticipant[sender] = (linksPerParticipant[sender] || 0) + urls.length;
      for (const u of urls) {
        try {
          const parsed = new URL(u);
          const domain = parsed.hostname.replace(/^www\./, '');
          domainCountMap.set(domain, (domainCountMap.get(domain) || 0) + 1);
        } catch {
          // invalid url ignored
        }
      }
    }

    // Emojis
    const emojisFound = text.match(emojiRegex) || [];
    if (emojisFound.length > 0) {
      if (!emojiPerParticipant[sender]) emojiPerParticipant[sender] = new Map();
      for (let eIdx = 0; eIdx < emojisFound.length; eIdx++) {
        const emo = emojisFound[eIdx];
        emojiFreqOverall.set(emo, (emojiFreqOverall.get(emo) || 0) + 1);
        emojiPerParticipant[sender].set(
          emo,
          (emojiPerParticipant[sender].get(emo) || 0) + 1
        );

        if (eIdx < emojisFound.length - 1) {
          const combo = `${emojisFound[eIdx]} ${emojisFound[eIdx + 1]}`;
          emojiCombosMap.set(combo, (emojiCombosMap.get(combo) || 0) + 1);
        }
      }
    }

    // Words & N-grams (clean text: strip urls, punctuation)
    const cleanedText = text
      .replace(urlRegex, '')
      .replace(/[^\p{L}\p{N}\s']/gu, ' ')
      .toLowerCase();

    const rawTokens = cleanedText
      .split(/\s+/)
      .map((t) => t.replace(/^'+|'+$/g, ''))
      .filter((t) => t.length > 1 && !/^\d+$/.test(t));

    if (!wordsPerParticipant[sender]) wordsPerParticipant[sender] = new Map();

    const filteredTokens: string[] = [];
    for (const token of rawTokens) {
      if (!STOPWORDS.has(token)) {
        filteredTokens.push(token);
        wordFreqOverall.set(token, (wordFreqOverall.get(token) || 0) + 1);
        wordsPerParticipant[sender].set(
          token,
          (wordsPerParticipant[sender].get(token) || 0) + 1
        );
      }
    }

    // Phrases (n-grams from filtered or cleaned tokens)
    for (let i = 0; i < filteredTokens.length - 1; i++) {
      const p2 = `${filteredTokens[i]} ${filteredTokens[i + 1]}`;
      phrase2Map.set(p2, (phrase2Map.get(p2) || 0) + 1);

      if (i < filteredTokens.length - 2) {
        const p3 = `${filteredTokens[i]} ${filteredTokens[i + 1]} ${filteredTokens[i + 2]}`;
        phrase3Map.set(p3, (phrase3Map.get(p3) || 0) + 1);
      }

      if (i < filteredTokens.length - 3) {
        const p4 = `${filteredTokens[i]} ${filteredTokens[i + 1]} ${filteredTokens[i + 2]} ${filteredTokens[i + 3]}`;
        phrase4Map.set(p4, (phrase4Map.get(p4) || 0) + 1);
      }
    }
  }

  // Sort longest messages
  longestByWordsList.sort((a, b) => b.wordCount - a.wordCount);
  longestByCharsList.sort((a, b) => b.characterCount - a.characterCount);

  const longestMessages: LongestMessageStats = {
    byWords: longestByWordsList.slice(0, 10),
    byChars: longestByCharsList.slice(0, 10),
    perParticipant: participantLongestMap,
  };

  // Top words
  const topWords = Array.from(wordFreqOverall.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  const formattedWordsPerParticipant: Record<string, Array<{ word: string; count: number }>> = {};
  for (const [sender, map] of Object.entries(wordsPerParticipant)) {
    formattedWordsPerParticipant[sender] = Array.from(map.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  const words: WordStats = {
    topWords,
    totalUniqueWords: wordFreqOverall.size,
    wordsPerParticipant: formattedWordsPerParticipant,
  };

  // Phrases
  const getTopEntries = (m: Map<string, number>, limit: number) =>
    Array.from(m.entries())
      .filter(([, c]) => c > 1) // only repeating phrases
      .map(([phrase, count]) => ({ phrase, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

  const phrases: PhraseStats = {
    twoWordPhrases: getTopEntries(phrase2Map, 15),
    threeWordPhrases: getTopEntries(phrase3Map, 15),
    fourWordPhrases: getTopEntries(phrase4Map, 10),
  };

  // Emojis
  const topEmojis = Array.from(emojiFreqOverall.entries())
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);

  const totalEmojis = Array.from(emojiFreqOverall.values()).reduce((a, b) => a + b, 0);

  const formattedEmojisPerParticipant: Record<string, Array<{ emoji: string; count: number }>> = {};
  for (const [sender, map] of Object.entries(emojiPerParticipant)) {
    formattedEmojisPerParticipant[sender] = Array.from(map.entries())
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }

  const emojiCombinations = Array.from(emojiCombosMap.entries())
    .filter(([, count]) => count > 1)
    .map(([combo, count]) => ({ combo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const emojis: EmojiStats = {
    topEmojis,
    totalEmojis,
    emojisPerParticipant: formattedEmojisPerParticipant,
    emojiCombinations,
  };

  // Links & Media
  const topDomains = Array.from(domainCountMap.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const links: LinkStats = {
    totalLinks,
    linksPerParticipant,
    topDomains,
  };

  const media: MediaStats = {
    totalMedia,
    mediaPerParticipant,
  };

  // PARTICIPANT STATS
  const participants: ParticipantStats[] = [];
  let pIdx = 0;
  for (const [name, pMessages] of participantMap.entries()) {
    const pWordCount = pMessages.reduce((acc, m) => acc + m.wordCount, 0);
    const pCharCount = pMessages.reduce((acc, m) => acc + m.characterCount, 0);
    const pActiveDays = new Set(pMessages.map((m) => m.date)).size;
    const pStarts = startersCount[name] || 0;
    const pStartsPct = totalConversations > 0 ? (pStarts / totalConversations) * 100 : 0;
    const pEmojisMap = emojiPerParticipant[name];
    const pEmojiCount = pEmojisMap
      ? Array.from(pEmojisMap.values()).reduce((a, b) => a + b, 0)
      : 0;

    const pReply = byParticipantReply[name];
    const pLongest = participantLongestMap[name];

    participants.push({
      name,
      messageCount: pMessages.length,
      percentage: Number(((pMessages.length / totalMessages) * 100).toFixed(1)),
      wordCount: pWordCount,
      avgWordsPerMessage: Number((pWordCount / pMessages.length).toFixed(1)),
      avgMessageLength: Number((pCharCount / pMessages.length).toFixed(1)),
      longestMessageWords: pLongest?.wordCount || 0,
      longestMessageChars: pLongest?.characterCount || 0,
      longestMessageText: pLongest?.preview || '',
      emojiCount: pEmojiCount,
      linksShared: linksPerParticipant[name] || 0,
      mediaCount: mediaPerParticipant[name] || 0,
      activeDays: pActiveDays,
      conversationStarts: pStarts,
      conversationStartsPct: Number(pStartsPct.toFixed(1)),
      medianReplyTimeMinutes: pReply ? pReply.medianMinutes : null,
      avgReplyTimeMinutes: pReply ? pReply.avgMinutes : null,
      color: getParticipantColor(pIdx++),
    });
  }

  // Sort participants by message count descending
  participants.sort((a, b) => b.messageCount - a.messageCount);

  // ACTIVITY BY HOUR & DAY OF WEEK
  let peakHour = 0;
  let maxHourCount = -1;
  let quietHour = 0;
  let minHourCount = Infinity;

  const byHour = hourCounts.map((count, hour) => {
    if (count > maxHourCount) {
      maxHourCount = count;
      peakHour = hour;
    }
    if (count < minHourCount) {
      minHourCount = count;
      quietHour = hour;
    }
    return {
      hour,
      count,
      percentage: Number(((count / totalMessages) * 100).toFixed(1)),
    };
  });

  // Late night messages (between 22:00 and 03:59)
  const lateNightCount =
    hourCounts[22] + hourCounts[23] + hourCounts[0] + hourCounts[1] + hourCounts[2] + hourCounts[3];
  const nightOwlPercentage = Number(((lateNightCount / totalMessages) * 100).toFixed(1));

  let busiestDayIdx = 0;
  let quietestDayIdx = 0;
  let maxDayCount = -1;
  let minDayCount = Infinity;

  const byDayOfWeek = DAYS_OF_WEEK.map((day, idx) => {
    const count = dayOfWeekCounts[idx];
    if (count > maxDayCount) {
      maxDayCount = count;
      busiestDayIdx = idx;
    }
    if (count < minDayCount) {
      minDayCount = count;
      quietestDayIdx = idx;
    }
    // Estimated occurrences of this day in range
    const estWeeks = Math.max(1, diffDays / 7);
    return {
      day,
      dayIndex: idx,
      count,
      average: Number((count / estWeeks).toFixed(1)),
    };
  });

  // Busiest individual calendar dates
  const busiestDays = Object.entries(calendarHeatmap)
    .map(([date, count]) => ({
      date,
      count,
      formattedDate: formatDate(date),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const activity: ActivityStats = {
    byHour,
    byDayOfWeek,
    peakHour,
    quietHour,
    nightOwlPercentage,
    busiestDayOfWeek: DAYS_OF_WEEK[busiestDayIdx],
    quietestDayOfWeek: DAYS_OF_WEEK[quietestDayIdx],
    calendarHeatmap,
    busiestDays,
    participantByHour: participantHourMap,
  };

  // STREAKS & GAPS
  const sortedDates = Array.from(activeDatesSet).sort();
  let longestStreakDays = 1;
  let currentStreakRun = 1;
  let streakStart = sortedDates[0];
  let streakEnd = sortedDates[0];
  let bestStreakStart = sortedDates[0];
  let bestStreakEnd = sortedDates[0];

  let longestSilenceDays = 0;
  let silenceStart = '';
  let silenceEnd = '';
  const gapsList: number[] = [];

  for (let i = 1; i < sortedDates.length; i++) {
    const prevD = new Date(sortedDates[i - 1] + 'T00:00:00');
    const currD = new Date(sortedDates[i] + 'T00:00:00');
    const dayDiff = Math.round((currD.getTime() - prevD.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreakRun++;
      streakEnd = sortedDates[i];
      if (currentStreakRun > longestStreakDays) {
        longestStreakDays = currentStreakRun;
        bestStreakStart = streakStart;
        bestStreakEnd = streakEnd;
      }
    } else {
      currentStreakRun = 1;
      streakStart = sortedDates[i];
      streakEnd = sortedDates[i];

      const gap = dayDiff - 1;
      gapsList.push(gap);
      if (gap > longestSilenceDays) {
        longestSilenceDays = gap;
        silenceStart = sortedDates[i - 1];
        silenceEnd = sortedDates[i];
      }
    }
  }

  // Check if current streak extends to today or the last active date
  const streaks: StreakStats = {
    longestStreakDays,
    longestStreakStart: bestStreakStart,
    longestStreakEnd: bestStreakEnd,
    currentStreakDays: currentStreakRun,
    longestSilenceDays,
    longestSilenceStart: silenceStart,
    longestSilenceEnd: silenceEnd,
    avgGapDays: gapsList.length > 0 ? Number(average(gapsList).toFixed(1)) : 0,
  };

  // TIMELINE
  const monthlyCounts: Record<string, number> = {};
  for (const msg of sorted) {
    const m = msg.date.slice(0, 7); // YYYY-MM
    monthlyCounts[m] = (monthlyCounts[m] || 0) + 1;
  }

  const monthlyVolume = Object.entries(monthlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      const [year, m] = month.split('-');
      const d = new Date(parseInt(year, 10), parseInt(m, 10) - 1, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return { month, count, label };
    });

  const timeline: TimelineStats = {
    firstMessage: firstMsg,
    lastMessage: lastMsg,
    monthlyVolume,
  };

  // AI INSIGHT FACTS (Deterministic editorial observations based on facts only)
  const aiInsights: AIInsightFact[] = generateDeterministicInsights({
    overview,
    participants,
    activity,
    replyTimes,
    conversationStarters,
    streaks,
    emojis,
    words,
  });

  return {
    overview,
    participants,
    activity,
    replyTimes,
    conversationStarters,
    streaks,
    words,
    phrases,
    emojis,
    longestMessages,
    links,
    media,
    timeline,
    aiInsights,
  };
}

function generateDeterministicInsights(data: {
  overview: OverviewStats;
  participants: ParticipantStats[];
  activity: ActivityStats;
  replyTimes: ReplyTimeStats;
  conversationStarters: ConversationStarterStats;
  streaks: StreakStats;
  emojis: EmojiStats;
  words: WordStats;
}): AIInsightFact[] {
  const insights: AIInsightFact[] = [];
  const topP = data.participants[0];
  const secP = data.participants[1];

  // 1. Share of voice
  if (topP) {
    insights.push({
      type: 'dynamics',
      headline: `${topP.name} holds the conversation lead`,
      description: `${topP.name} contributed ${topP.percentage}% of all messages (${topP.messageCount.toLocaleString()} total messages).`,
      metric: `${topP.percentage}% share`,
    });
  }

  // 2. Rhythm and peak hour
  const peakH = data.activity.peakHour;
  const peakTimeStr = peakH === 0 ? '12 AM' : peakH > 12 ? `${peakH - 12} PM` : `${peakH} AM`;
  const isNightOwl = peakH >= 21 || peakH <= 3;
  insights.push({
    type: 'rhythm',
    headline: isNightOwl ? 'Late night conversations dominate' : 'Daytime is your peak active window',
    description: `Activity consistently peaks around ${peakTimeStr}, accounting for ${(
      data.activity.byHour[peakH]?.percentage || 0
    )}% of the chat volume. ${
      data.activity.nightOwlPercentage > 20
        ? `${data.activity.nightOwlPercentage}% of messages were sent after 10 PM.`
        : ''
    }`,
    metric: `Peak at ${peakTimeStr}`,
  });

  // 3. Conversation starters
  const topStarter = data.conversationStarters.starters[0];
  if (topStarter) {
    insights.push({
      type: 'habits',
      headline: `${topStarter.name} frequently breaks the silence`,
      description: `With a 3-hour inactivity threshold, ${topStarter.name} initiated ${topStarter.percentage}% of all conversations (${topStarter.count} times).`,
      metric: `${topStarter.count} starts`,
    });
  }

  // 4. Response speed
  if (data.replyTimes.overallMedianMinutes > 0) {
    const med = data.replyTimes.overallMedianMinutes;
    const speedDesc =
      med <= 2
        ? 'Rapid-fire responses: you exchange messages almost in real time.'
        : med <= 15
        ? 'A steady conversational pace with quick turnarounds.'
        : 'An asynchronous conversation where participants reply when convenient.';
    insights.push({
      type: 'rhythm',
      headline: `Median response time is ${med < 1 ? '<1 min' : `${Math.round(med)} minutes`}`,
      description: speedDesc,
      metric: `${med < 1 ? '<1m' : `${Math.round(med)}m`} median`,
    });
  }

  // 5. Streaks
  if (data.streaks.longestStreakDays > 1) {
    insights.push({
      type: 'habits',
      headline: `${data.streaks.longestStreakDays}-day streak of non-stop chatting`,
      description: `The conversation remained active for ${data.streaks.longestStreakDays} consecutive days without a single day of silence.`,
      metric: `${data.streaks.longestStreakDays} days`,
    });
  }

  // 6. Top Emoji
  if (data.emojis.topEmojis.length > 0) {
    const topEmoji = data.emojis.topEmojis[0];
    insights.push({
      type: 'language',
      headline: `${topEmoji.emoji} is your hallmark reaction`,
      description: `Used ${topEmoji.count.toLocaleString()} times across the conversation.`,
      metric: `${topEmoji.count}x`,
    });
  }

  return insights;
}
