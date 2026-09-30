import React, { useState, useMemo } from 'react';
import { NormalizedMessage, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatDateTime } from '@/utils/date';
import { formatNumber } from '@/utils/formatting';
import { Search, Filter, X, Calendar, MessageSquare, Image } from 'lucide-react';

interface MessageSearchProps {
  messages: NormalizedMessage[];
  participants: ParticipantStats[];
  initialQuery?: string;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  messages,
  participants,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedSender, setSelectedSender] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'media'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const colorMap = new Map(participants.map((p) => [p.name, p.color || '#6366F1']));

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      // Text match
      if (q && !m.message.toLowerCase().includes(q)) {
        return false;
      }
      // Sender match
      if (selectedSender !== 'all' && m.sender !== selectedSender) {
        return false;
      }
      // Date match
      if (dateFilter && m.date !== dateFilter) {
        return false;
      }
      // Type match
      if (filterType === 'media' && !m.isMedia) return false;
      if (filterType === 'text' && m.isMedia) return false;

      return true;
    });
  }, [messages, query, selectedSender, dateFilter, filterType]);

  const displayedResults = filteredResults.slice(0, 100);

  return (
    <Card variant="white" className="mb-10" id="search-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              EXPLORER
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-neutral-400">
              {filteredResults.length} matching messages
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Search Conversation
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Full-text search with instant participant, media, and date filters.
          </p>
        </div>
      </div>

      {/* Search Input and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search keywords, phrases, coffee, demo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sender Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedSender}
            onChange={(e) => setSelectedSender(e.target.value)}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="all">All Senders</option>
            {participants.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="md:col-span-3 flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="all">All Types</option>
            <option value="text">Text Only</option>
            <option value="media">Media Only</option>
          </select>

          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              title="Clear date filter"
              className="p-2 rounded-xl bg-neutral-200 text-neutral-700 shrink-0 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1 divide-y divide-neutral-100">
        {displayedResults.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-sm italic">
            No messages matched your query or filters.
          </div>
        ) : (
          displayedResults.map((m) => {
            const color = colorMap.get(m.sender) || '#6366F1';
            return (
              <div key={m.id} className="pt-2.5 pb-1 text-xs">
                <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-neutral-900">{m.sender}</span>
                    {m.isMedia && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-mono">
                        media
                      </span>
                    )}
                  </div>
                  <span>{formatDateTime(m.timestamp)}</span>
                </div>
                <p className="text-neutral-800 leading-relaxed font-sans pl-4 border-l-2 border-neutral-200/80 whitespace-pre-line">
                  {m.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {filteredResults.length > 100 && (
        <div className="pt-3 border-t border-neutral-100 text-center text-[11px] font-mono text-neutral-400">
          Showing first 100 of {formatNumber(filteredResults.length)} results.
        </div>
      )}
    </Card>
  );
};
