import React from 'react';
import { ConversationStarterStats, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { useChatStore } from '@/store/chatStore';
import { Sparkles, Sliders, Zap } from 'lucide-react';
import { formatNumber } from '@/utils/formatting';

interface ConversationStartersProps {
  conversationStarters: ConversationStarterStats;
  participants: ParticipantStats[];
}

export const ConversationStarters: React.FC<ConversationStartersProps> = ({
  conversationStarters,
  participants,
}) => {
  const { conversationThresholdHours, setThreshold } = useChatStore();

  const thresholdOptions = [1, 2, 3, 6, 12, 24];

  // Map participant colors
  const colorMap = new Map(participants.map((p) => [p.name, p.color || '#6366F1']));

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              INITIATIVE
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-indigo-600 font-medium">
              {conversationStarters.totalConversations} total conversations
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Who starts the conversation?
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            A new conversation is triggered whenever a message arrives after at least{' '}
            <strong className="text-neutral-700">{conversationThresholdHours} hours</strong> of
            inactivity.
          </p>
        </div>

        {/* Threshold Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F3] border border-neutral-200/80 p-1.5 rounded-2xl self-start sm:self-auto">
          <span className="text-[11px] font-mono font-medium text-neutral-500 px-2 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-neutral-400" /> Threshold:
          </span>
          <div className="flex items-center gap-1">
            {thresholdOptions.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setThreshold(h)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium transition-all ${
                  conversationThresholdHours === h
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart for Starters */}
      <div className="mt-6 space-y-4">
        {conversationStarters.starters.map((starter) => {
          const color = colorMap.get(starter.name) || '#6366F1';
          return (
            <div key={starter.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-neutral-900">{starter.name}</span>
                </div>
                <div className="font-mono text-neutral-600">
                  <span className="font-semibold text-neutral-900">
                    {formatNumber(starter.count)}
                  </span>{' '}
                  conversations ({starter.percentage}%)
                </div>
              </div>

              {/* Bar track */}
              <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(starter.percentage, 2)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
