import React from 'react';
import { ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '@/utils/formatting';
import { Users, Smile, Link2, Image, Calendar, MessageSquare, Award } from 'lucide-react';

interface ShareOfVoiceProps {
  participants: ParticipantStats[];
}

export const ShareOfVoice: React.FC<ShareOfVoiceProps> = ({ participants }) => {
  const chartData = participants.map((p) => ({
    name: p.name,
    value: p.messageCount,
    percentage: p.percentage,
    color: p.color,
  }));

  const topParticipant = participants[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
      {/* Donut Chart Card */}
      <Card variant="white" className="lg:col-span-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              DISTRIBUTION
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {participants.length} contributors
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Share of Voice
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Percentage of total conversation volume contributed by each participant.
          </p>
        </div>

        {/* Recharts Donut */}
        <div className="h-64 my-4 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur-sm border border-neutral-200 p-3 rounded-2xl shadow-float text-xs font-mono">
                        <div className="font-semibold text-neutral-900">{data.name}</div>
                        <div className="text-neutral-600 mt-1">
                          {formatNumber(data.value)} messages ({data.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout */}
          {topParticipant && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                Leading Voice
              </span>
              <span className="font-serif font-bold text-lg text-neutral-900 leading-tight">
                {topParticipant.name}
              </span>
              <span className="text-xs font-semibold text-purple-700">
                {topParticipant.percentage}%
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-neutral-100">
          {participants.slice(0, 4).map((p) => (
            <div key={p.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-neutral-800 font-medium">{p.name}</span>
              <span className="text-neutral-400 font-mono text-[11px]">
                {p.percentage}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Participant Comparison Table / Deep Dive */}
      <Card variant="white" className="lg:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
              PARTICIPANT ROSTER
            </span>
            <span className="text-xs text-neutral-400 font-mono">Ranked by volume</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Individual Dynamics
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Detailed breakdown of words, emojis, links, and average message size.
          </p>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                <th className="py-2.5 font-medium">Participant</th>
                <th className="py-2.5 font-medium text-right">Messages</th>
                <th className="py-2.5 font-medium text-right">Words</th>
                <th className="py-2.5 font-medium text-right">Avg Chars</th>
                <th className="py-2.5 font-medium text-right">Emojis</th>
                <th className="py-2.5 font-medium text-right">Links</th>
                <th className="py-2.5 font-medium text-right">Days Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {participants.map((p, idx) => (
                <tr key={p.name} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-semibold text-neutral-900">
                        {p.name}
                      </span>
                      {idx === 0 && (
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono font-medium text-neutral-800">
                    {formatNumber(p.messageCount)}
                    <span className="text-neutral-400 text-[10px] ml-1">
                      ({p.percentage}%)
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-neutral-600">
                    {formatNumber(p.wordCount)}
                  </td>
                  <td className="py-3 text-right font-mono text-neutral-600">
                    {p.avgMessageLength}
                  </td>
                  <td className="py-3 text-right font-mono text-neutral-600">
                    {p.emojiCount}
                  </td>
                  <td className="py-3 text-right font-mono text-neutral-600">
                    {p.linksShared}
                  </td>
                  <td className="py-3 text-right font-mono text-neutral-600">
                    {p.activeDays}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>* Words normalized without punctuation</span>
          <span>Median response calculated separately</span>
        </div>
      </Card>
    </div>
  );
};
