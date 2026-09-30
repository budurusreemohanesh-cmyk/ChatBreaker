import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/Button';

export const Dropzone: React.FC = () => {
  const navigate = useNavigate();
  const { loadChat, loadSample, isAnalyzing, error } = useChatStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stage, setStage] = useState<'idle' | 'parsing' | 'analyzing' | 'ready'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      alert('Please upload a valid .txt WhatsApp chat export.');
      return;
    }

    setSelectedFile(file);
    setStage('parsing');

    try {
      const text = await file.text();
      setStage('analyzing');
      // small delay to show progress state smoothly
      await new Promise((r) => setTimeout(r, 450));
      await loadChat(text, file.name);
      setStage('ready');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setStage('idle');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleSampleClick = (type: 'duo' | 'group') => {
    setStage('parsing');
    setTimeout(() => {
      setStage('analyzing');
      setTimeout(() => {
        loadSample(type);
        setStage('ready');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }, 400);
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        className="hidden"
        onChange={onFileSelect}
      />

      {/* Drop Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-neutral-900 bg-neutral-100/80 scale-[1.01]'
            : 'border-neutral-300 hover:border-neutral-500 bg-white/70 hover:bg-white'
        } shadow-soft`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {stage === 'idle' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 transition-transform duration-200 group-hover:scale-105">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-900">
                  Drop your WhatsApp chat here
                </h3>
                <p className="text-sm text-neutral-500 max-w-md mx-auto">
                  Export your chat without media and upload the .txt file.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" /> Browse File (.txt)
                </Button>
              </div>
            </>
          )}

          {stage === 'parsing' && (
            <div className="py-6 space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-neutral-900 animate-spin mx-auto" />
              <p className="text-base font-medium text-neutral-800">
                Parsing WhatsApp messages...
              </p>
              {selectedFile && (
                <span className="text-xs text-neutral-500 font-mono">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>
          )}

          {stage === 'analyzing' && (
            <div className="py-6 space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin mx-auto" />
              <p className="text-base font-medium text-neutral-800">
                Analyzing your conversation...
              </p>
              <p className="text-xs text-neutral-500">
                Calculating reply speeds, streaks, rhythm, and word frequencies...
              </p>
            </div>
          )}

          {stage === 'ready' && (
            <div className="py-6 space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-lg font-semibold text-neutral-900">
                Your conversation is ready.
              </p>
              <p className="text-xs text-neutral-500">Taking you to the dashboard...</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-left">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-sm">Parsing notice</p>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Quick Try Samples */}
      <div className="mt-8 pt-6 border-t border-neutral-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Don't have an export handy? Try a demo chat:
          </span>
          <span className="text-xs text-neutral-400">100% Client-Side</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSampleClick('duo')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-soft transition-all text-left group"
          >
            <div>
              <div className="flex items-center gap-1.5 font-medium text-sm text-neutral-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Paula & Liam (Duo)
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Coffee plans, design talk, rapid replies, emojis
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-neutral-900 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleSampleClick('group')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-soft transition-all text-left group"
          >
            <div>
              <div className="flex items-center gap-1.5 font-medium text-sm text-neutral-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Product Launch (Group)
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Multi-participant team, iOS bracketed format
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-neutral-900 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
