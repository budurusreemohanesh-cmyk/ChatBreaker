import React, { useState } from 'react';
import { EmojiStats, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting';
import { Smile, Sparkles, Flame } from 'lucide-react';

interface EmojiSectionProps {
  emojis: EmojiStats;
  participants: ParticipantStats[];
}

export const EmojiSection: React.FC<EmojiSectionProps> = ({ emojis, participants }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string>('all');

  const topEmojisList =
    selectedParticipant === 'all'
      ? emojis.topEmojis
      : emojis.emojisPerParticipant[selectedParticipant] || [];

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              REACTIONS & TONE
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-pink-600 font-medium">
              {formatNumber(emojis.totalEmojis)} total reactions
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Your Emojis</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            The visual emotional signature of your conversations and favorite pairings.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500 font-mono">By:</label>
          <select
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            className="text-xs font-medium bg-[#FAF8F3] border border-neutral-200/80 rounded-2xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="all">Entire Chat</option>
            {participants.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Top Emojis Grid */}
        <div className="lg:col-span-8">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3">
            Most Frequently Sent
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {topEmojisList.slice(0, 15).map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={item.emoji}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isFirst
                      ? 'bg-pink-50 border-pink-200 shadow-soft'
                      : 'bg-[#FAF8F3] border-neutral-200/80 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-3xl block transition-transform hover:scale-125 mb-1.5">
                    {item.emoji}
                  </span>
                  <div className="font-mono text-xs font-bold text-neutral-800">
                    {formatNumber(item.count)}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    Rank #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emoji Combinations / Duos */}
        <div className="lg:col-span-4 bg-[#FAF8F3] p-5 rounded-3xl border border-neutral-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-pink-700 uppercase tracking-wider mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Emoji Duos
            </div>
            <h4 className="font-serif font-bold text-lg text-neutral-900">
              Common Combinations
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Emojis sent back-to-back in the same message.
            </p>

            <div className="space-y-2.5 mt-4">
              {emojis.emojiCombinations.length === 0 ? (
                <p className="text-xs text-neutral-400 italic py-2">
                  No multi-emoji sequences recorded.
                </p>
              ) : (
                emojis.emojiCombinations.slice(0, 6).map((combo) => (
                  <div
                    key={combo.combo}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200 text-xs"
                  >
                    <span className="text-xl tracking-wider">{combo.combo}</span>
                    <span className="font-mono font-semibold text-neutral-600">
                      {combo.count} times
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200/60 text-[11px] font-mono text-neutral-400 mt-4">
            Total unique emojis: {topEmojisList.length}
          </div>
        </div>
      </div>
    </Card>
  );
};
