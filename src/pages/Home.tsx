import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sparkles, Shield, BarChart3, Clock, Flame, Calendar, ArrowRight } from 'lucide-react';
import { Dropzone } from '@/components/upload/Dropzone';
import { PrivacyNotice } from '@/components/upload/PrivacyNotice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useChatStore } from '@/store/chatStore';

export const Home: React.FC = () => {
  const { loadSample } = useChatStore();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 shadow-soft text-xs font-mono font-medium text-neutral-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Local-First WhatsApp Conversation Analytics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-neutral-900 tracking-tight leading-[1.1]">
          Your conversation, <span className="italic font-normal">visualized.</span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 font-sans max-w-xl mx-auto leading-relaxed">
          Transform raw WhatsApp chat exports into an editorial conversation report and an interactive story. Zero media required, zero cloud storage by default.
        </p>
      </section>

      {/* Main Upload Box */}
      <section className="max-w-2xl mx-auto">
        <Dropzone />
        <PrivacyNotice />
      </section>

      {/* Editorial Feature Highlights */}
      <section className="pt-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-mono font-semibold tracking-wider text-neutral-500">
            METRICS THAT MATTER
          </span>
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mt-1">
            Built like an editorial publication.
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Not a generic admin dashboard. Every chart is tuned for intimacy, nuance, and visual beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="lavender" hoverEffect>
            <div className="w-9 h-9 rounded-2xl bg-purple-200/80 text-purple-800 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
              Share of Voice
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Donut breakdowns and individual dynamics. Discover who speaks most, who writes essays, and who sends quickfire one-liners.
            </p>
          </Card>

          <Card variant="green" hoverEffect>
            <div className="w-9 h-9 rounded-2xl bg-emerald-200/80 text-emerald-800 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
              GitHub Heatmap
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              A 365-day calendar grid detailing daily conversation density. Filter by year, view volume spikes, and click any date.
            </p>
          </Card>

          <Card variant="yellow" hoverEffect>
            <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-800 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
              Median Response Time
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Calculates realistic response speed using median values to eliminate distortions caused by long holidays or weekend breaks.
            </p>
          </Card>

          <Card variant="peach" hoverEffect>
            <div className="w-9 h-9 rounded-2xl bg-orange-200/80 text-orange-800 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
              Streaks & Gaps
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Track consecutive active days, current conversational momentum, and the longest periods of silence.
            </p>
          </Card>

          <Card variant="blue" hoverEffect>
            <div className="w-9 h-9 rounded-2xl bg-sky-200/80 text-sky-800 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
              Initiative & Starters
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Configurable 3-hour inactivity threshold to determine who takes the initiative to rekindle the conversation.
            </p>
          </Card>

          <Card variant="pink" hoverEffect>
            <div className="w-9 h-9 rounded-2xl bg-pink-200/80 text-pink-800 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
              Chat Wrapped
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              A Spotify Wrapped style full-screen animated story. Perfect for celebrating chat milestones, anniversaries, and friendships.
            </p>
          </Card>
        </div>
      </section>

      {/* Export How-to Guide */}
      <section className="bg-white border border-neutral-200/80 rounded-3xl p-8 max-w-3xl mx-auto shadow-soft">
        <h3 className="font-serif font-bold text-xl text-neutral-900 mb-4">
          How to export your chat from WhatsApp:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-600 leading-relaxed">
          <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200/60">
            <h4 className="font-semibold text-neutral-900 text-sm">📱 iPhone (iOS)</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-600 font-sans">
              <li>Open WhatsApp and tap the contact or group name at the top.</li>
              <li>Scroll to the bottom and tap <strong>Export Chat</strong>.</li>
              <li>Select <strong>Without Media</strong>.</li>
              <li>Save the exported <code>.txt</code> or <code>.zip</code> to your Files or AirDrop it.</li>
            </ol>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200/60">
            <h4 className="font-semibold text-neutral-900 text-sm">🤖 Android</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-600 font-sans">
              <li>Open the chat, tap the three dots (⋮) in the top-right corner.</li>
              <li>Tap <strong>More</strong> → <strong>Export chat</strong>.</li>
              <li>Choose <strong>Without media</strong>.</li>
              <li>Share or save the resulting <code>.txt</code> file to your device.</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
};
