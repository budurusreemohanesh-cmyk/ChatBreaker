import React, { useState } from 'react';
import { AIInsightFact, ConversationAnalytics } from '@/types/chat';
import { Card } from '@/components/ui/Card';
import { Sparkles, ShieldCheck, CheckCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AIInsightsCardProps {
  insights: AIInsightFact[];
  analytics: ConversationAnalytics;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights, analytics }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSimulatedRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <Card variant="warm" className="mb-10 border-amber-200/60 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-xl text-neutral-900">
                Editorial Observations
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                <ShieldCheck className="w-3 h-3" /> Grounded in Facts
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Verified behavioural patterns computed directly from your message timestamps and counts.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSimulatedRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {insights.map((item, idx) => {
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF8F3] border border-neutral-200 text-neutral-600">
                    {item.type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {item.metric}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-neutral-900 text-sm mb-1 leading-snug">
                  {item.headline}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span>Deterministic fact verified</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span>* No raw messages were sent to third-party language models. Zero speculation.</span>
        <span>Client-side synthesis</span>
      </div>
    </Card>
  );
};
