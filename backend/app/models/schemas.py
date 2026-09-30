from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class NormalizedMessage(BaseModel):
    id: str
    timestamp: str  # ISO 8601 YYYY-MM-DDTHH:MM:SS
    sender: str
    message: str
    date: str  # YYYY-MM-DD
    hour: int  # 0-23
    wordCount: int
    characterCount: int
    isMedia: bool = False

class OverviewStats(BaseModel):
    totalMessages: int
    totalParticipants: int
    activeDays: int
    startDate: str
    endDate: str
    durationDays: int
    totalWords: int
    totalCharacters: int
    avgMessagesPerDay: float
    avgWordsPerMessage: float
    avgMessageLength: float

class ParticipantStats(BaseModel):
    name: str
    messageCount: int
    percentage: float
    wordCount: int
    avgWordsPerMessage: float
    avgMessageLength: float
    longestMessageWords: int
    longestMessageChars: int
    longestMessageText: str
    emojiCount: int
    linksShared: int
    mediaCount: int
    activeDays: int
    conversationStarts: int
    conversationStartsPct: float
    medianReplyTimeMinutes: Optional[float] = None
    avgReplyTimeMinutes: Optional[float] = None
    color: Optional[str] = None

class HourActivityItem(BaseModel):
    hour: int
    count: int
    percentage: float

class DayOfWeekActivityItem(BaseModel):
    day: str
    dayIndex: int
    count: int
    average: float

class BusiestDayItem(BaseModel):
    date: str
    count: int
    formattedDate: str

class ActivityStats(BaseModel):
    byHour: List[HourActivityItem]
    byDayOfWeek: List[DayOfWeekActivityItem]
    peakHour: int
    quietHour: int
    nightOwlPercentage: float
    busiestDayOfWeek: str
    quietestDayOfWeek: str
    calendarHeatmap: Dict[str, int]
    busiestDays: List[BusiestDayItem]
    participantByHour: Dict[str, List[int]]

class ParticipantReplyStats(BaseModel):
    medianMinutes: float
    avgMinutes: float
    count: int

class ReplyTimeStats(BaseModel):
    overallMedianMinutes: float
    overallAvgMinutes: float
    fastestReplySeconds: int
    longestGapHours: float
    byParticipant: Dict[str, ParticipantReplyStats]

class StarterItem(BaseModel):
    name: str
    count: int
    percentage: float

class ConversationStarterStats(BaseModel):
    thresholdHours: int
    totalConversations: int
    starters: List[StarterItem]

class StreakStats(BaseModel):
    longestStreakDays: int
    longestStreakStart: str
    longestStreakEnd: str
    currentStreakDays: int
    longestSilenceDays: int
    longestSilenceStart: str
    longestSilenceEnd: str
    avgGapDays: float

class WordFrequencyItem(BaseModel):
    word: str
    count: int

class WordStats(BaseModel):
    topWords: List[WordFrequencyItem]
    totalUniqueWords: int
    wordsPerParticipant: Dict[str, List[WordFrequencyItem]]

class PhraseItem(BaseModel):
    phrase: str
    count: int

class PhraseStats(BaseModel):
    twoWordPhrases: List[PhraseItem]
    threeWordPhrases: List[PhraseItem]
    fourWordPhrases: List[PhraseItem]

class EmojiFrequencyItem(BaseModel):
    emoji: str
    count: int

class EmojiComboItem(BaseModel):
    combo: str
    count: int

class EmojiStats(BaseModel):
    topEmojis: List[EmojiFrequencyItem]
    totalEmojis: int
    emojisPerParticipant: Dict[str, List[EmojiFrequencyItem]]
    emojiCombinations: List[EmojiComboItem]

class LongestMessageItem(BaseModel):
    sender: str
    date: str
    timestamp: str
    wordCount: int
    characterCount: int
    preview: str
    fullText: str

class LongestMessageStats(BaseModel):
    byWords: List[LongestMessageItem]
    byChars: List[LongestMessageItem]
    perParticipant: Dict[str, LongestMessageItem]

class DomainItem(BaseModel):
    domain: str
    count: int

class LinkStats(BaseModel):
    totalLinks: int
    linksPerParticipant: Dict[str, int]
    topDomains: List[DomainItem]

class MediaStats(BaseModel):
    totalMedia: int
    mediaPerParticipant: Dict[str, int]

class MonthlyVolumeItem(BaseModel):
    month: str
    count: int
    label: str

class TimelineStats(BaseModel):
    firstMessage: NormalizedMessage
    lastMessage: NormalizedMessage
    monthlyVolume: List[MonthlyVolumeItem]

class AIInsightFact(BaseModel):
    type: str
    headline: str
    description: str
    metric: str

class ConversationAnalytics(BaseModel):
    overview: OverviewStats
    participants: List[ParticipantStats]
    activity: ActivityStats
    replyTimes: ReplyTimeStats
    conversationStarters: ConversationStarterStats
    streaks: StreakStats
    words: WordStats
    phrases: PhraseStats
    emojis: EmojiStats
    longestMessages: LongestMessageStats
    links: LinkStats
    media: MediaStats
    timeline: TimelineStats
    aiInsights: List[AIInsightFact]

class AnalyzeRequest(BaseModel):
    raw_text: Optional[str] = None
    messages: Optional[List[NormalizedMessage]] = None
    threshold_hours: int = 3

class ReportCreateRequest(BaseModel):
    title: str
    analytics: ConversationAnalytics

class ReportResponse(BaseModel):
    id: str
    title: str
    createdAt: str
    analytics: ConversationAnalytics
