import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles, Shield, RefreshCw, Upload, BarChart3 } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analytics, clearData, loadSample } = useChatStore();

  const handleReset = () => {
    clearData();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F7F5EF]/85 border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                ChatBreaker
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Shield className="w-3 h-3" /> Private
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-sans tracking-wide hidden sm:block">
              Your conversation, visualized.
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {analytics ? (
            <>
              <Link to="/wrapped">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 text-white border-0 shadow-float"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-300 animate-pulse" />
                  Chat Wrapped
                </Button>
              </Link>

              {location.pathname !== '/dashboard' && (
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm">
                    <BarChart3 className="w-3.5 h-3.5 mr-1" /> Dashboard
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                title="Wipe conversation from memory"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1 text-neutral-500" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadSample('duo')}
                className="hidden sm:inline-flex"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" /> Demo Chat
              </Button>

              <Link to="/upload">
                <Button variant="primary" size="sm">
                  <Upload className="w-3.5 h-3.5 mr-1" /> Upload Chat
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
