import React from 'react';
import { ShieldCheck, Heart, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-200/80 bg-[#FAF8F3]/60 py-10 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-neutral-900 text-lg">ChatBreaker</span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs text-neutral-500">Your conversation, visualized.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side Private</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-500">
              <Terminal className="w-3.5 h-3.5" />
              <span>FastAPI & Vite Local Engine</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2">
          <p>© {new Date().getFullYear()} ChatBreaker. Crafted with editorial care.</p>
          <p className="flex items-center gap-1">
            Zero raw chat storage <span className="text-neutral-300">|</span> Local browser first
          </p>
        </div>
      </div>
    </footer>
  );
};
