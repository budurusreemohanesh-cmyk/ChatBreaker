import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2 } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <div className="bg-[#FAF8F3] border border-neutral-200/80 rounded-2xl p-5 my-6">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-neutral-900 tracking-tight">
              Your chat is 100% private & local-first
            </h4>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" /> Client-Side First
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            We analyze your exported conversation directly in your browser. Your raw messages never leave your device unless you explicitly opt to share or sync an aggregated report. No raw conversation text is ever permanently stored in a database or used for AI training.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5 text-neutral-400" /> Zero raw message logging
            </span>
            <span className="inline-flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5 text-neutral-400" /> Instant memory wipe on session reset
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
