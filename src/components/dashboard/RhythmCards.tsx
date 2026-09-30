import React from 'react';
import { ReplyTimeStats, StreakStats, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatMinutes } from '@/utils/date';
import { Timer, Flame, Moon, Zap, Info } from 'lucide-react';

interface RhythmCardsProps {
  replyTimes: ReplyTimeStats;
  streaks: StreakStats;
  participants: ParticipantStats[];
}

export const RhythmCards: React.FC<RhythmCardsProps> = ({
  replyTimes,
  streaks,
  participants,
}) => {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
            DYNAMICS
          </span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-mono text-neutral-400">Response & cadence</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-neutral-900">Your rhythm</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          How quickly replies flow and how long the conversation kept uninterrupted momentum.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Median Reply Time */}
        <Card variant="blue" hoverEffect className="relative">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              Median Reply Time
            </span>
            <div className="p-2 rounded-2xl bg-white/80 text-sky-600">
              <Timer className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <span className="font-serif text-3xl font-bold tracking-tight text-neutral-900 block">
              {formatMinutes(replyTimes.overallMedianMinutes)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-sky-900 mt-2 font-medium">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Median eliminates distortion from long weekend breaks</span>
            </div>
          </div>
        </Card>

        {/* Longest Active Streak */}
        <Card variant="green" hoverEffect className="relative">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Longest Streak
            </span>
            <div className="p-2 rounded-2xl bg-white/80 text-emerald-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <span className="font-serif text-3xl font-bold tracking-tight text-neutral-900 block">
              {streaks.longestStreakDays} days
            </span>
            <p className="text-[11px] text-emerald-800 mt-2 font-mono">
              {streaks.longestStreakStart || 'N/A'} → {streaks.longestStreakEnd || 'N/A'}
            </p>
          </div>
        </Card>

        {/* Longest Silence */}
        <Card variant="lavender" hoverEffect className="relative">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-800">
              Longest Silence
            </span>
            <div className="p-2 rounded-2xl bg-white/80 text-purple-600">
              <Moon className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <span className="font-serif text-3xl font-bold tracking-tight text-neutral-900 block">
              {streaks.longestSilenceDays} days
            </span>
            <p className="text-[11px] text-purple-800 mt-2 font-mono">
              Longest quiet gap between active chats
            </p>
          </div>
        </Card>

        {/* Fastest Reply */}
        <Card variant="peach" hoverEffect className="relative">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-800">
              Fastest Reply
            </span>
            <div className="p-2 rounded-2xl bg-white/80 text-orange-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <span className="font-serif text-3xl font-bold tracking-tight text-neutral-900 block">
              {replyTimes.fastestReplySeconds < 60
                ? `${replyTimes.fastestReplySeconds} sec`
                : `${Math.round(replyTimes.fastestReplySeconds / 60)} min`}
            </span>
            <p className="text-[11px] text-orange-800 mt-2 font-medium">
              Average reply: {formatMinutes(replyTimes.overallAvgMinutes)}
            </p>
          </div>
        </Card>
      </div>

      {/* Per-participant Median Reply Times */}
      {Object.keys(replyTimes.byParticipant).length > 0 && (
        <div className="mt-4 bg-white border border-neutral-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider font-mono">
            Median Response By Person:
          </span>
          <div className="flex flex-wrap items-center gap-6 text-xs">
            {Object.entries(replyTimes.byParticipant).map(([name, data]) => {
              const p = participants.find((x) => x.name === name);
              return (
                <div key={name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p?.color || '#6366F1' }}
                  />
                  <span className="font-medium text-neutral-800">{name}:</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {formatMinutes(data.medianMinutes)}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    ({data.count} replies)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
