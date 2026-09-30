import React from 'react';
import { ActivityStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CalendarDays, TrendingUp, Sparkles } from 'lucide-react';

interface ActivityDayOfWeekChartProps {
  activity: ActivityStats;
}

export const ActivityDayOfWeekChart: React.FC<ActivityDayOfWeekChartProps> = ({
  activity,
}) => {
  const { byDayOfWeek, busiestDayOfWeek, quietestDayOfWeek } = activity;

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              WEEKLY CADENCE
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-emerald-600 font-medium">
              Busiest: {busiestDayOfWeek}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Activity by Day of Week
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Compare message volume and typical daily traffic across the week.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            ★ Most active: {busiestDayOfWeek}
          </span>
          <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600">
            Quietest: {quietestDayOfWeek}
          </span>
        </div>
      </div>

      <div className="h-60 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byDayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tickFormatter={(day) => day.slice(0, 3)}
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
                      <div className="font-semibold text-neutral-900">{data.day}</div>
                      <div className="text-neutral-700 mt-1">
                        Total: {formatNumber(data.count)} messages
                      </div>
                      <div className="text-neutral-500">
                        Avg: ~{data.average} msgs / day
                      </div>
                      {data.day === busiestDayOfWeek && (
                        <div className="text-emerald-700 font-semibold mt-1">
                          ★ Peak day of the week
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {byDayOfWeek.map((entry) => (
                <Cell
                  key={`day-${entry.day}`}
                  fill={entry.day === busiestDayOfWeek ? '#10B981' : '#D4D4D4'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
