import React, { useState, useMemo } from 'react';
import { ActivityStats, NormalizedMessage } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/formatting';
import { Calendar, ChevronLeft, ChevronRight, X, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

interface CalendarHeatmapProps {
  activity: ActivityStats;
  messages: NormalizedMessage[];
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ activity, messages }) => {
  const { availableYears, activeYear, setActiveYear } = useChatStore();
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const currentYear = activeYear || (availableYears.length > 0 ? availableYears[0] : new Date().getFullYear());

  // Generate all 365/366 days of currentYear
  const yearDays = useMemo(() => {
    const days: Array<{ date: string; month: number; dayOfWeek: number; count: number }> = [];
    const isLeap = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
    const totalDays = isLeap ? 366 : 365;

    const startDate = new Date(currentYear, 0, 1);
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(currentYear, 0, 1 + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const count = activity.calendarHeatmap[dateStr] || 0;

      // JS getDay(): 0 is Sunday. Let's make Monday = 0, Sunday = 6
      const jsDay = d.getDay();
      const dayOfWeek = (jsDay + 6) % 7;

      days.push({
        date: dateStr,
        month: d.getMonth(),
        dayOfWeek,
        count,
      });
    }
    return days;
  }, [currentYear, activity.calendarHeatmap]);

  // Max count for scaling intensity
  const maxDayCount = useMemo(() => {
    let max = 1;
    for (const d of yearDays) {
      if (d.count > max) max = d.count;
    }
    return max;
  }, [yearDays]);

  // Group into 53 weeks (columns of 7 days)
  const weeks = useMemo(() => {
    const cols: Array<Array<{ date: string; count: number; month: number } | null>> = [];
    if (yearDays.length === 0) return cols;

    let currentWeek: Array<{ date: string; count: number; month: number } | null> = new Array(7).fill(null);
    for (let i = 0; i < yearDays.length; i++) {
      const dayItem = yearDays[i];
      currentWeek[dayItem.dayOfWeek] = dayItem;

      // If Sunday (end of week) or last day of year, push week
      if (dayItem.dayOfWeek === 6 || i === yearDays.length - 1) {
        cols.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
    }
    return cols;
  }, [yearDays]);

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-neutral-200/50 hover:bg-neutral-300';
    const ratio = count / maxDayCount;
    if (ratio < 0.25) return 'bg-emerald-200 hover:bg-emerald-300';
    if (ratio < 0.5) return 'bg-emerald-400 hover:bg-emerald-500';
    if (ratio < 0.75) return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    return 'bg-emerald-800 hover:bg-emerald-900 text-white';
  };

  // Messages on selected day
  const selectedDayMessages = useMemo(() => {
    if (!selectedDay) return [];
    return messages.filter((m) => m.date === selectedDay);
  }, [selectedDay, messages]);

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Card variant="white" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              HEATMAP
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-mono text-emerald-600 font-medium">
              Daily frequency
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Your year, day by day.
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            GitHub-style activity calendar. Hover or click any day to inspect details.
          </p>
        </div>

        {/* Year Selector */}
        {availableYears.length > 0 && (
          <div className="flex items-center gap-1.5 bg-[#FAF8F3] border border-neutral-200/80 p-1.5 rounded-2xl self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 ml-1.5 mr-0.5" />
            <span className="text-[11px] font-mono text-neutral-500 mr-1">Year:</span>
            {availableYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setActiveYear(yr)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all ${
                  currentYear === yr
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Heatmap Grid */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          {/* Weekday labels + squares */}
          <div className="flex gap-1.5">
            <div className="flex flex-col justify-between text-[9px] font-mono text-neutral-400 pr-2 py-0.5 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>

            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={`week-${wIdx}`} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={`empty-${wIdx}-${dIdx}`} className="w-3 h-3 rounded-sm opacity-0" />;
                    }
                    return (
                      <div
                        key={day.date}
                        onClick={() => setSelectedDay(day.date)}
                        onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count })}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-150 ${getColorClass(
                          day.count
                        )} ${selectedDay === day.date ? 'ring-2 ring-neutral-900 ring-offset-1' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Month labels footer */}
          <div className="flex justify-between pl-8 pr-2 pt-2 text-[10px] font-mono text-neutral-400 select-none">
            {monthLabels.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Hover Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-neutral-100 text-xs font-mono">
        <div className="text-neutral-600">
          {hoveredDay ? (
            <span>
              <strong>{formatDate(hoveredDay.date)}:</strong>{' '}
              {hoveredDay.count > 0 ? `${formatNumber(hoveredDay.count)} messages` : 'No messages'}
            </span>
          ) : (
            <span className="text-neutral-400">Hover over any square to see message count</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <span>Less</span>
          <span className="w-3 h-3 rounded-sm bg-neutral-200/50" />
          <span className="w-3 h-3 rounded-sm bg-emerald-200" />
          <span className="w-3 h-3 rounded-sm bg-emerald-400" />
          <span className="w-3 h-3 rounded-sm bg-emerald-600" />
          <span className="w-3 h-3 rounded-sm bg-emerald-800" />
          <span>More</span>
        </div>
      </div>

      {/* Selected Day Messages Drawer / Inspector */}
      {selectedDay && (
        <div className="mt-6 p-5 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-neutral-900 text-base">
                Messages on {formatDate(selectedDay)}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedDayMessages.length} messages
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedDayMessages.length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-2">
              No messages exchanged on this day.
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-200/60">
              {selectedDayMessages.map((m) => (
                <div key={m.id} className="pt-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] mb-0.5">
                    <span className="font-semibold text-neutral-900">{m.sender}</span>
                    <span>{m.timestamp.slice(11, 16)}</span>
                  </div>
                  <p className="text-neutral-700 whitespace-pre-line leading-relaxed font-sans">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
