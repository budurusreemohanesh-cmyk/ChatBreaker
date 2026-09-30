import React from 'react';
import { TimelineStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatDateTime, formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/formatting';
import { Compass, Flag, Sparkles, MessageSquare } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TimelineSectionProps {
  timeline: TimelineStats;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  const { firstMessage, lastMessage, monthlyVolume } = timeline;

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              BOOKENDS & MOMENTUM
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-purple-600 font-medium">
              Conversation timeline
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            The Journey
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            From the very first exchange to the latest message recorded in your chat export.
          </p>
        </div>
      </div>

      {/* Bookends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* First Message */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-amber-600" />
              It all started here.
            </div>
            <div className="text-[11px] font-mono text-neutral-500 mb-3">
              {formatDateTime(firstMessage.timestamp)}
            </div>
            <blockquote className="font-serif text-sm text-neutral-800 italic bg-white p-3.5 rounded-xl border border-amber-200/60 leading-relaxed">
              "{firstMessage.message}"
            </blockquote>
          </div>
          <div className="pt-3 border-t border-amber-200/40 mt-3 text-xs font-medium text-neutral-700 flex items-center justify-between font-mono">
            <span>Sender: <strong className="text-neutral-900">{firstMessage.sender}</strong></span>
            <span className="text-[10px] text-neutral-400">Day 1</span>
          </div>
        </div>

        {/* Last Message */}
        <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-800 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Flag className="w-4 h-4 text-purple-600" />
              And for now, it ends here.
            </div>
            <div className="text-[11px] font-mono text-neutral-500 mb-3">
              {formatDateTime(lastMessage.timestamp)}
            </div>
            <blockquote className="font-serif text-sm text-neutral-800 italic bg-white p-3.5 rounded-xl border border-purple-200/60 leading-relaxed">
              "{lastMessage.message}"
            </blockquote>
          </div>
          <div className="pt-3 border-t border-purple-200/40 mt-3 text-xs font-medium text-neutral-700 flex items-center justify-between font-mono">
            <span>Sender: <strong className="text-neutral-900">{lastMessage.sender}</strong></span>
            <span className="text-[10px] text-neutral-400">Latest record</span>
          </div>
        </div>
      </div>

      {/* Monthly Volume Area Chart */}
      {monthlyVolume.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-neutral-500 uppercase tracking-wider">
              Monthly Message Cadence
            </span>
            <span className="text-neutral-400">
              {monthlyVolume.length} active months
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolume} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-neutral-200 p-2.5 rounded-xl shadow-float text-xs font-mono">
                          <div className="font-semibold text-neutral-900">{d.label}</div>
                          <div className="text-purple-700 mt-0.5">
                            {formatNumber(d.count)} messages
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#monthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
};
