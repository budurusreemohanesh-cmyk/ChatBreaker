import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { formatDate, formatHour } from '@/utils/date';
import { formatNumber } from '@/utils/formatting';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Sparkles,
  ArrowRight,
  Flame,
  Moon,
  MessageSquare,
  Smile,
  Calendar,
  Trophy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Wrapped: React.FC = () => {
  const navigate = useNavigate();
  const { analytics, fileName, loadSample } = useChatStore();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // If no analytics loaded, trigger demo or redirect
  useEffect(() => {
    if (!analytics) {
      loadSample('duo');
    }
  }, [analytics, loadSample]);

  const overview = analytics?.overview;
  const participants = analytics?.participants || [];
  const topParticipant = participants[0];
  const activity = analytics?.activity;
  const emojis = analytics?.emojis;
  const streaks = analytics?.streaks;
  const busiestDay = activity?.busiestDays[0];

  const year = overview ? overview.startDate.slice(0, 4) : '2026';

  // Screens definition
  const screens = [
    // SCREEN 1
    {
      id: 'intro',
      background: 'from-amber-100 via-rose-100 to-purple-100',
      badge: 'CHAT WRAPPED',
      headline: `YOUR ${year} CONVERSATION`,
      subhead: fileName ? `A deep dive into ${fileName}` : 'Every text, rhythm, and silence',
      highlight: participants.map((p) => p.name).join(' & '),
      footer: 'Tap anywhere to start your story',
    },
    // SCREEN 2
    {
      id: 'messages',
      background: 'from-purple-100 via-indigo-100 to-sky-100',
      badge: 'TOTAL VOLUME',
      headline: `${formatNumber(overview?.totalMessages || 0)} messages`,
      subhead: `Totaling ${formatNumber(overview?.totalWords || 0)} words exchanged`,
      highlight: `That's an average of ${overview?.avgMessagesPerDay || 0} messages every active day`,
      footer: 'You had a lot to say to each other',
    },
    // SCREEN 3
    {
      id: 'days',
      background: 'from-emerald-100 via-teal-100 to-cyan-100',
      badge: 'CONSISTENCY',
      headline: `You talked across ${overview?.activeDays || 0} days`,
      subhead: `Spanning ${overview?.durationDays || 0} calendar days from start to finish`,
      highlight: `${Math.round(((overview?.activeDays || 1) / (overview?.durationDays || 1)) * 100)}% of the year had you talking`,
      footer: 'True conversational dedication',
    },
    // SCREEN 4
    {
      id: 'voice',
      background: 'from-pink-100 via-rose-100 to-amber-100',
      badge: 'SHARE OF VOICE',
      headline: `${topParticipant?.name || 'Someone'} sent ${topParticipant?.percentage || 0}% of the messages`,
      subhead: `${topParticipant?.name} took the lead with ${formatNumber(topParticipant?.messageCount || 0)} total messages`,
      highlight: participants[1]
        ? `While ${participants[1].name} contributed ${participants[1].percentage}% (${formatNumber(participants[1].messageCount)} messages)`
        : 'The undisputed voice of the room',
      footer: 'Balance is an art form',
    },
    // SCREEN 5
    {
      id: 'hour',
      background: 'from-indigo-900 via-purple-900 to-neutral-950 text-white',
      badge: 'CHRONOLOGY',
      headline: `${formatHour(activity?.peakHour || 0)} was your peak hour`,
      subhead: `${activity?.nightOwlPercentage || 0}% of your messages were sent late after 10 PM`,
      highlight: (activity?.peakHour || 0) >= 21 || (activity?.peakHour || 0) <= 4 ? 'Certified night owls 🌙' : 'Daytime conversationalists ☀️',
      footer: 'When the world slept, you kept talking',
      isDark: true,
    },
    // SCREEN 6
    {
      id: 'streak',
      background: 'from-orange-100 via-amber-100 to-yellow-100',
      badge: 'MOMENTUM',
      headline: `Your longest streak was ${streaks?.longestStreakDays || 0} days`,
      subhead: `Non-stop banter from ${streaks?.longestStreakStart || 'day one'} to ${streaks?.longestStreakEnd || 'now'}`,
      highlight: 'Zero missed days during this run 🔥',
      footer: 'An unbreakable chain of thoughts',
    },
    // SCREEN 7
    {
      id: 'emoji',
      background: 'from-yellow-100 via-pink-100 to-rose-100',
      badge: 'HALLMARK REACTION',
      headline: `Your most-used emoji was ${emojis?.topEmojis[0]?.emoji || '❤️'}`,
      subhead: `Sent a grand total of ${formatNumber(emojis?.topEmojis[0]?.count || 0)} times`,
      highlight: emojis?.emojiCombinations[0]
        ? `Your go-to combo: ${emojis.emojiCombinations[0].combo}`
        : 'Words just were not enough',
      footer: 'The emotion that defined your year',
    },
    // SCREEN 8
    {
      id: 'start',
      background: 'from-blue-100 via-indigo-100 to-purple-100',
      badge: 'ORIGIN STORY',
      headline: `Your conversation started on ${formatDate(overview?.startDate || '')}`,
      subhead: `First words: "${analytics?.timeline.firstMessage.message.slice(0, 60)}..."`,
      highlight: `Initiated by ${analytics?.timeline.firstMessage.sender || 'you'}`,
      footer: 'Where history began',
    },
    // SCREEN 9
    {
      id: 'busiest',
      background: 'from-rose-100 via-amber-100 to-orange-100',
      badge: 'VOLUME RECORD',
      headline: `Your busiest day was ${busiestDay?.formattedDate || 'Record Day'}`,
      subhead: `A record-shattering ${formatNumber(busiestDay?.count || 0)} messages in 24 hours`,
      highlight: 'What was happening that day?! 🚀',
      footer: 'Peak conversation energy',
    },
    // SCREEN 10
    {
      id: 'outro',
      background: 'from-neutral-900 via-purple-950 to-neutral-900 text-white',
      badge: 'CHAT WRAPPED 2026',
      headline: "That's your conversation.",
      subhead: `${formatNumber(overview?.totalMessages || 0)} messages · ${overview?.activeDays || 0} active days · ${participants.length} voices`,
      highlight: 'Export your wrapped card or dive back into the dashboard',
      footer: 'ChatBreaker — Your conversation, visualized.',
      isOutro: true,
      isDark: true,
    },
  ];

  const totalScreens = screens.length;

  const nextScreen = useCallback(() => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen((prev) => prev + 1);
    }
  }, [currentScreen, totalScreens]);

  const prevScreen = useCallback(() => {
    if (currentScreen > 0) {
      setCurrentScreen((prev) => prev - 1);
    }
  }, [currentScreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextScreen();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevScreen();
      } else if (e.key === 'Escape') {
        navigate('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextScreen, prevScreen, navigate]);

  // Trigger confetti on the final screen
  useEffect(() => {
    if (currentScreen === totalScreens - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [currentScreen, totalScreens]);

  const screen = screens[currentScreen];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      onClick={nextScreen}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 select-none cursor-pointer bg-gradient-to-br transition-colors duration-700 ${screen.background}`}
    >
      {/* Top Header / Progress Bars */}
      <div className="w-full max-w-xl mx-auto space-y-4">
        {/* Progress indicators (Instagram/Spotify story style) */}
        <div className="flex items-center gap-1.5 w-full">
          {screens.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full overflow-hidden transition-all duration-300 ${
                screen.isDark ? 'bg-white/20' : 'bg-black/15'
              }`}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  idx <= currentScreen
                    ? screen.isDark
                      ? 'bg-white'
                      : 'bg-neutral-900'
                    : 'w-0'
                }`}
                style={{ width: idx <= currentScreen ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Top bar controls */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-mono font-semibold tracking-wider px-3 py-1 rounded-full uppercase ${
              screen.isDark
                ? 'bg-white/10 text-white/90 border border-white/20'
                : 'bg-black/5 text-neutral-800 border border-black/10'
            }`}
          >
            {screen.badge}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                screen.isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-black/5 text-neutral-800 hover:bg-black/10'
              }`}
              title="Copy link"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <Link
              to="/dashboard"
              onClick={(e) => e.stopPropagation()}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                screen.isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-black/5 text-neutral-800 hover:bg-black/10'
              }`}
              title="Close Wrapped"
            >
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Animated Content */}
      <div className="w-full max-w-xl mx-auto my-auto text-center py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.02 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Screen Index indicator */}
            <div
              className={`text-xs font-mono tracking-widest uppercase ${
                screen.isDark ? 'text-white/60' : 'text-neutral-500'
              }`}
            >
              Screen {currentScreen + 1} of {totalScreens}
            </div>

            {/* Headline */}
            <h2
              className={`text-4xl sm:text-6xl font-serif font-bold tracking-tight leading-[1.1] ${
                screen.isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {screen.headline}
            </h2>

            {/* Subhead */}
            <p
              className={`text-base sm:text-xl font-sans max-w-md mx-auto leading-relaxed ${
                screen.isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              {screen.subhead}
            </p>

            {/* Highlight Box */}
            <div
              className={`inline-block px-5 py-3 rounded-2xl backdrop-blur-md text-sm font-medium border shadow-soft ${
                screen.isDark
                  ? 'bg-white/10 border-white/20 text-yellow-300'
                  : 'bg-white/80 border-neutral-300/80 text-neutral-900'
              }`}
            >
              {screen.highlight}
            </div>

            {/* Outro Actions */}
            {screen.isOutro && (
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-auto"
                >
                  <button
                    type="button"
                    className="w-full px-6 py-3 rounded-full bg-white text-neutral-900 font-semibold text-sm hover:bg-neutral-100 transition-all shadow-float flex items-center justify-center gap-2"
                  >
                    Explore Full Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen(0);
                  }}
                  className="px-5 py-3 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono hover:bg-white/20 transition-all"
                >
                  Replay Story ↺
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Footer & Navigation Prompts */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between text-xs font-mono">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevScreen();
          }}
          disabled={currentScreen === 0}
          className={`flex items-center gap-1 p-2 rounded-xl disabled:opacity-0 transition-opacity ${
            screen.isDark ? 'text-white/70 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span
          className={`text-[11px] ${
            screen.isDark ? 'text-white/50' : 'text-neutral-400'
          }`}
        >
          {screen.footer}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextScreen();
          }}
          disabled={currentScreen === totalScreens - 1}
          className={`flex items-center gap-1 p-2 rounded-xl disabled:opacity-0 transition-opacity ${
            screen.isDark ? 'text-white/70 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
