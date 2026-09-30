import React, { useState } from 'react';
import { ActivityStats, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatHour } from '@/utils/date';
import { formatNumber } from '@/utils/formatting';
import { Moon, Sun, Clock, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ActivityHourChartProps {
  activity: ActivityStats;
  participants: ParticipantStats[];
}

export const ActivityHourChart: React.FC<ActivityHourChartProps> = ({
  activity,
  participants,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string>('all');

  const { byHour, peakHour, quietHour, nightOwlPercentage, participantByHour } = activity;

  const chartData = byHour.map((item) => {
    let count = item.count;
    if (selectedParticipant !== 'all' && participantByHour[selectedParticipant]) {
      count = participantByHour[selectedParticipant][item.hour] || 0;
    }
    return {
      hour: item.hour,
      label: formatHour(item.hour),
      count,
      isPeak: item.hour === peakHour,
      isNight: item.hour >= 22 || item.hour < 4,
    };
  });

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              24-HOUR CHRONOLOGY
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-amber-600 font-medium">
              Peak: {formatHour(peakHour)}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Activity by Hour
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Distribution of messages across the clock from midnight to late night.
          </p>
        </div>

        {/* Filter by participant */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500 font-mono">View:</label>
          <select
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            className="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="all">Everyone Combined</option>
            {participants.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-amber-800 uppercase tracking-wide">
              Peak Hour
            </div>
            <div className="text-sm font-bold text-neutral-900">
              {formatHour(peakHour)} ({formatNumber(byHour[peakHour]?.count || 0)} msgs)
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-200/70 text-indigo-800 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-indigo-800 uppercase tracking-wide">
              Night Owl Messages
            </div>
            <div className="text-sm font-bold text-neutral-900">
              {nightOwlPercentage}% sent after 10 PM
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-200/70 text-sky-800 flex items-center justify-center shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-sky-800 uppercase tracking-wide">
              Quietest Hour
            </div>
            <div className="text-sm font-bold text-neutral-900">
              {formatHour(quietHour)} ({byHour[quietHour]?.count || 0} msgs)
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="hour"
              tickFormatter={(hour) => (hour % 3 === 0 ? formatHour(hour) : '')}
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
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-neutral-200 p-3 rounded-2xl shadow-float text-xs font-mono">
                      <div className="font-semibold text-neutral-900">{data.label}</div>
                      <div className="text-neutral-600 mt-1">
                        {formatNumber(data.count)} messages
                      </div>
                      {data.isPeak && (
                        <div className="text-amber-600 font-semibold mt-1">★ Peak hour of day</div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.hour}`}
                  fill={entry.isPeak ? '#F59E0B' : entry.isNight ? '#818CF8' : '#D4D4D4'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-3 border-t border-neutral-100">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> Peak Hour
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#818CF8]" /> Late Night (10PM - 4AM)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D4D4D4]" /> Regular Daytime
          </span>
        </div>
        <span>Times inferred from export timestamps</span>
      </div>
    </Card>
  );
};
