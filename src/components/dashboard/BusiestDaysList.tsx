import React from 'react';
import { ActivityStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting';
import { Flame, Calendar, Trophy } from 'lucide-react';

interface BusiestDaysListProps {
  activity: ActivityStats;
}

export const BusiestDaysList: React.FC<BusiestDaysListProps> = ({ activity }) => {
  const { busiestDays } = activity;

  return (
    <Card variant="white" className="mb-10">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              RECORDS
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-amber-600 font-medium">
              Top volume peaks
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Busiest Days
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            The single most conversational calendar dates in your chat history.
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {busiestDays.slice(0, 10).map((day, idx) => {
          const isTop = idx === 0;
          return (
            <div
              key={day.date}
              className={`p-4 rounded-2xl border transition-all ${
                isTop
                  ? 'bg-amber-50/70 border-amber-300 shadow-soft'
                  : 'bg-[#FAF8F3] border-neutral-200/80 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isTop ? 'bg-amber-200 text-amber-900' : 'bg-neutral-200/60 text-neutral-700'
                }`}>
                  #{idx + 1}
                </span>
                {isTop && <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
              </div>

              <div className="font-serif font-bold text-xl text-neutral-900 leading-tight">
                {formatNumber(day.count)}
                <span className="text-xs font-sans font-normal text-neutral-500 ml-1">
                  msgs
                </span>
              </div>

              <p className="text-xs font-medium text-neutral-600 mt-1 font-mono">
                {day.formattedDate}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
