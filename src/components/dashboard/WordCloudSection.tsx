import React, { useState } from 'react';
import { WordStats, PhraseStats, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting';
import { BookOpen, Hash, MessageCircle } from 'lucide-react';

interface WordCloudSectionProps {
  words: WordStats;
  phrases: PhraseStats;
  participants: ParticipantStats[];
  onSelectWord?: (word: string) => void;
}

export const WordCloudSection: React.FC<WordCloudSectionProps> = ({
  words,
  phrases,
  participants,
  onSelectWord,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'words' | 'phrases'>('words');
  const [phraseLength, setPhraseLength] = useState<2 | 3 | 4>(2);

  const displayedWords =
    selectedParticipant === 'all'
      ? words.topWords
      : words.wordsPerParticipant[selectedParticipant] || [];

  const maxCount = displayedWords[0]?.count || 1;

  const currentPhrases =
    phraseLength === 2
      ? phrases.twoWordPhrases
      : phraseLength === 3
      ? phrases.threeWordPhrases
      : phrases.fourWordPhrases;

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              VOCABULARY
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-purple-600 font-medium">
              {formatNumber(words.totalUniqueWords)} unique words
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Your Words</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Most frequent terms and repeated conversational phrases (stopwords stripped).
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-[#FAF8F3] border border-neutral-200/80 p-1 rounded-2xl flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('words')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'words'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Words
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('phrases')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'phrases'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Common Phrases
            </button>
          </div>

          {activeTab === 'words' && (
            <select
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              className="text-xs font-medium bg-[#FAF8F3] border border-neutral-200/80 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="all">Everyone</option>
              {participants.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {activeTab === 'words' ? (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2.5 items-center">
            {displayedWords.map((item, idx) => {
              const weight = item.count / maxCount;
              const isLead = idx < 3;
              return (
                <button
                  key={item.word}
                  type="button"
                  onClick={() => onSelectWord && onSelectWord(item.word)}
                  title={`Used ${item.count} times - Click to search in chat`}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${
                    isLead
                      ? 'bg-purple-100 border-purple-300 text-purple-900 font-bold'
                      : weight > 0.4
                      ? 'bg-purple-50/70 border-purple-200 text-purple-800 font-medium'
                      : 'bg-[#FAF8F3] border-neutral-200 text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <span className="font-serif text-sm capitalize">{item.word}</span>
                  <span className="text-[11px] font-mono opacity-60">
                    {formatNumber(item.count)}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-neutral-400 font-mono mt-4 pt-4 border-t border-neutral-100">
            * English conversational stopwords like "the", "and", "ok", "yeah" have been excluded.
            Click any word to search messages.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {/* Phrase Length Toggle */}
          <div className="flex items-center gap-2 mb-4 text-xs font-mono">
            <span className="text-neutral-500">N-Gram length:</span>
            {[2, 3, 4].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setPhraseLength(len as 2 | 3 | 4)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  phraseLength === len
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {len}-word phrases
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentPhrases.length === 0 ? (
              <p className="text-xs text-neutral-400 col-span-3 py-4 text-center italic">
                No repeating phrases detected for this length.
              </p>
            ) : (
              currentPhrases.map((phraseItem, idx) => (
                <div
                  key={phraseItem.phrase}
                  className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-neutral-900 truncate capitalize font-serif">
                      "{phraseItem.phrase}"
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-600 shrink-0">
                    {phraseItem.count}x
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
