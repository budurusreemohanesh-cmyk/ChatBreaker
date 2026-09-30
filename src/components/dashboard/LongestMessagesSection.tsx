import React, { useState } from 'react';
import { LongestMessageStats, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/formatting';
import { FileText, ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface LongestMessagesSectionProps {
  longestMessages: LongestMessageStats;
  participants: ParticipantStats[];
}

export const LongestMessagesSection: React.FC<LongestMessagesSectionProps> = ({
  longestMessages,
  participants,
}) => {
  const [activeTab, setActiveTab] = useState<'overall' | 'perParticipant'>('overall');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const colorMap = new Map(participants.map((p) => [p.name, p.color || '#6366F1']));

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              ESSAYS & MONOLOGUES
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-neutral-400">Word length peaks</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Longest Messages
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            The most extensive, detailed messages sent throughout the conversation history.
          </p>
        </div>

        <div className="bg-[#FAF8F3] border border-neutral-200/80 p-1 rounded-2xl flex items-center self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overall')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'overall'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Top Overall
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('perParticipant')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'perParticipant'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Per Person
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {activeTab === 'overall' ? (
          longestMessages.byWords.slice(0, 5).map((msg, idx) => {
            const isExpanded = expandedId === `overall-${idx}`;
            const color = colorMap.get(msg.sender) || '#6366F1';
            return (
              <div
                key={`longest-${idx}`}
                className="p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-xs text-neutral-900">
                      {msg.sender}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {formatDate(msg.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
                    <span>
                      <strong className="text-neutral-900">{formatNumber(msg.wordCount)}</strong> words
                    </span>
                    <span>•</span>
                    <span>{formatNumber(msg.characterCount)} chars</span>
                  </div>
                </div>

                <div className="relative font-serif text-sm text-neutral-800 leading-relaxed italic bg-white p-3.5 rounded-xl border border-neutral-200/60">
                  <Quote className="w-3.5 h-3.5 text-neutral-300 inline mr-1 -mt-1" />
                  {isExpanded ? msg.fullText : msg.preview}
                </div>

                {msg.fullText.length > msg.preview.length && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(`overall-${idx}`)}
                    className="mt-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-mono"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" /> Read full message
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(longestMessages.perParticipant).map(([name, msg]) => {
              const color = colorMap.get(name) || '#6366F1';
              const isExpanded = expandedId === `per-${name}`;
              return (
                <div
                  key={name}
                  className="p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-xs text-neutral-900">{name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {msg.wordCount} words
                      </span>
                    </div>

                    <div className="font-serif text-xs text-neutral-700 leading-relaxed italic bg-white p-3 rounded-xl border border-neutral-200/60 my-2">
                      "{isExpanded ? msg.fullText : msg.preview}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-200/40">
                    <span>{formatDate(msg.date)}</span>
                    {msg.fullText.length > msg.preview.length && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(`per-${name}`)}
                        className="text-neutral-700 hover:underline"
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
