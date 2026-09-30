import React from 'react';
import { LinkStats, MediaStats, ParticipantStats } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting';
import { Link2, Image, Globe, ExternalLink } from 'lucide-react';

interface LinksAndMediaSectionProps {
  links: LinkStats;
  media: MediaStats;
  participants: ParticipantStats[];
}

export const LinksAndMediaSection: React.FC<LinksAndMediaSectionProps> = ({
  links,
  media,
  participants,
}) => {
  const colorMap = new Map(participants.map((p) => [p.name, p.color || '#6366F1']));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      {/* Links Card */}
      <Card variant="white">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
                SHARED CONTENT
              </span>
              <span className="text-neutral-300">/</span>
              <span className="text-xs font-mono text-sky-600 font-medium">
                {formatNumber(links.totalLinks)} URLs shared
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-neutral-900">Links</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
            <Link2 className="w-5 h-5" />
          </div>
        </div>

        {/* Top Domains */}
        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2.5">
            Top Domains Shared
          </div>
          {links.topDomains.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-2">No links found in export.</p>
          ) : (
            <div className="space-y-2">
              {links.topDomains.slice(0, 5).map((dom) => (
                <div
                  key={dom.domain}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F3] border border-neutral-200/80 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate text-neutral-800 font-medium">{dom.domain}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-neutral-200 font-semibold text-neutral-700">
                    {dom.count} {dom.count === 1 ? 'link' : 'links'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Links per Participant */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
            Shared By
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(links.linksPerParticipant).map(([name, count]) => {
              const color = colorMap.get(name) || '#6366F1';
              return (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F3] border border-neutral-200 text-xs font-sans"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-neutral-800">{name}:</span>
                  <span className="font-mono text-neutral-500 font-semibold">{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Media Card */}
      <Card variant="white">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
                ATTACHMENTS
              </span>
              <span className="text-neutral-300">/</span>
              <span className="text-xs font-mono text-purple-600 font-medium">
                {formatNumber(media.totalMedia)} attachments
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-neutral-900">
              Media References
            </h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
            <Image className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
          Photos, videos, voice notes, stickers, and documents flagged as{' '}
          <code className="text-neutral-800 font-mono bg-neutral-100 px-1 py-0.5 rounded">
            &lt;Media omitted&gt;
          </code>{' '}
          during WhatsApp export.
        </p>

        {/* Media count breakdown */}
        <div className="space-y-3">
          {Object.entries(media.mediaPerParticipant).map(([name, count]) => {
            const color = colorMap.get(name) || '#6366F1';
            const pct = media.totalMedia > 0 ? (count / media.totalMedia) * 100 : 0;
            return (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-neutral-900">{name}</span>
                  </div>
                  <span className="font-mono text-neutral-600">
                    <strong className="text-neutral-900">{count}</strong> media ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
          * Media files were not uploaded to maintain 100% privacy and lightweight performance.
        </div>
      </Card>
    </div>
  );
};
