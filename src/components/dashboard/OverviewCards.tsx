import React from 'react';
import { OverviewStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting';
import { MessageSquare, Calendar, Type, TrendingUp, Hash, AlignLeft } from 'lucide-react';

interface OverviewCardsProps {
  overview: OverviewStats;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ overview }) => {
  const cards = [
    {
      label: 'Total Messages',
      value: formatNumber(overview.totalMessages),
      detail: `${overview.totalParticipants} voices in conversation`,
      icon: MessageSquare,
      variant: 'lavender' as const,
      accent: 'text-purple-700',
    },
    {
      label: 'Active Days',
      value: formatNumber(overview.activeDays),
      detail: `Across ${formatNumber(overview.durationDays)} total calendar days`,
      icon: Calendar,
      variant: 'green' as const,
      accent: 'text-emerald-700',
    },
    {
      label: 'Total Words',
      value: formatNumber(overview.totalWords),
      detail: `${formatNumber(overview.totalCharacters)} total characters`,
      icon: Type,
      variant: 'yellow' as const,
      accent: 'text-amber-700',
    },
    {
      label: 'Daily Velocity',
      value: `${overview.avgMessagesPerDay}`,
      detail: 'Average messages per active day',
      icon: TrendingUp,
      variant: 'peach' as const,
      accent: 'text-orange-700',
    },
    {
      label: 'Words / Message',
      value: `${overview.avgWordsPerMessage}`,
      detail: 'Average word density per text',
      icon: Hash,
      variant: 'blue' as const,
      accent: 'text-sky-700',
    },
    {
      label: 'Avg Length',
      value: `${overview.avgMessageLength}`,
      detail: 'Characters per message',
      icon: AlignLeft,
      variant: 'pink' as const,
      accent: 'text-pink-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} variant={c.variant} hoverEffect className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                {c.label}
              </span>
              <div className={`p-2 rounded-2xl bg-white/70 ${c.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 block">
                {c.value}
              </span>
              <p className="text-xs text-neutral-600 mt-1 font-medium">
                {c.detail}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
