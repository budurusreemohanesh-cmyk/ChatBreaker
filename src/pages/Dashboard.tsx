import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/chatStore';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { ShareOfVoice } from '@/components/dashboard/ShareOfVoice';
import { ConversationStarters } from '@/components/dashboard/ConversationStarters';
import { RhythmCards } from '@/components/dashboard/RhythmCards';
import { ActivityHourChart } from '@/components/dashboard/ActivityHourChart';
import { ActivityDayOfWeekChart } from '@/components/dashboard/ActivityDayOfWeekChart';
import { CalendarHeatmap } from '@/components/dashboard/CalendarHeatmap';
import { BusiestDaysList } from '@/components/dashboard/BusiestDaysList';
import { WordCloudSection } from '@/components/dashboard/WordCloudSection';
import { EmojiSection } from '@/components/dashboard/EmojiSection';
import { LongestMessagesSection } from '@/components/dashboard/LongestMessagesSection';
import { LinksAndMediaSection } from '@/components/dashboard/LinksAndMediaSection';
import { TimelineSection } from '@/components/dashboard/TimelineSection';
import { MessageSearch } from '@/components/dashboard/MessageSearch';
import { AIInsightsCard } from '@/components/insights/AIInsightsCard';
import { Button } from '@/components/ui/Button';
import { Upload, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { analytics, fileName, messages, loadSample } = useChatStore();

  if (!analytics) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            No conversation loaded yet
          </h2>
          <p className="text-xs text-neutral-500">
            Upload a WhatsApp .txt export or try a demonstration conversation to explore the analytics.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="primary" onClick={() => navigate('/upload')}>
            <Upload className="w-4 h-4 mr-1.5" /> Upload Chat
          </Button>
          <Button variant="secondary" onClick={() => loadSample('duo')}>
            <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" /> Try Demo Chat
          </Button>
        </div>
      </div>
    );
  }

  const handleSelectWord = (word: string) => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="dashboard-content" className="space-y-2">
      {/* 1. Conversation Header & Exports */}
      <DashboardHeader analytics={analytics} fileName={fileName} />

      {/* 2. Overview Metrics Cards */}
      <OverviewCards overview={analytics.overview} />

      {/* 3. AI Insights (Fact-Grounded) */}
      <AIInsightsCard insights={analytics.aiInsights} analytics={analytics} />

      {/* 4. Calendar Heatmap (Day-by-day) */}
      <CalendarHeatmap activity={analytics.activity} messages={messages} />

      {/* 5. Share of Voice & Participant Dynamics */}
      <ShareOfVoice participants={analytics.participants} />

      {/* 6. Who starts the conversation? (Configurable threshold) */}
      <ConversationStarters
        conversationStarters={analytics.conversationStarters}
        participants={analytics.participants}
      />

      {/* 7. Your Rhythm (Median reply time, streaks, silences) */}
      <RhythmCards
        replyTimes={analytics.replyTimes}
        streaks={analytics.streaks}
        participants={analytics.participants}
      />

      {/* 8. Activity by Hour */}
      <ActivityHourChart
        activity={analytics.activity}
        participants={analytics.participants}
      />

      {/* 9. Activity by Day of Week */}
      <ActivityDayOfWeekChart activity={analytics.activity} />

      {/* 10. Busiest Days */}
      <BusiestDaysList activity={analytics.activity} />

      {/* 11. Your Words & Phrases */}
      <WordCloudSection
        words={analytics.words}
        phrases={analytics.phrases}
        participants={analytics.participants}
        onSelectWord={handleSelectWord}
      />

      {/* 12. Your Emojis */}
      <EmojiSection
        emojis={analytics.emojis}
        participants={analytics.participants}
      />

      {/* 13. Longest Messages */}
      <LongestMessagesSection
        longestMessages={analytics.longestMessages}
        participants={analytics.participants}
      />

      {/* 14. Links & Media References */}
      <LinksAndMediaSection
        links={analytics.links}
        media={analytics.media}
        participants={analytics.participants}
      />

      {/* 15. The Timeline (Bookends & monthly trend) */}
      <TimelineSection timeline={analytics.timeline} />

      {/* 16. Full-Text Search Explorer */}
      <MessageSearch messages={messages} participants={analytics.participants} />
    </div>
  );
};
