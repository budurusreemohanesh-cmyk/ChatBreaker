import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Download, Calendar, Users, Clock, Share2, Check, FileDown } from 'lucide-react';
import { ConversationAnalytics } from '@/types/chat';
import { formatDate, formatDurationDays } from '@/utils/date';
import { formatNumber } from '@/utils/formatting';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DashboardHeaderProps {
  analytics: ConversationAnalytics;
  fileName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ analytics, fileName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { overview, participants } = analytics;

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const dashboardElement = document.getElementById('dashboard-content');
      if (!dashboardElement) return;

      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F7F5EF',
      });

      const link = document.createElement('a');
      link.download = `ChatBreaker-${overview.startDate}-to-${overview.endDate}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export PNG', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const dashboardElement = document.getElementById('dashboard-content');
      if (!dashboardElement) return;

      const canvas = await html2canvas(dashboardElement, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#F7F5EF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ChatBreaker-Report-${overview.startDate}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pb-8 border-b border-neutral-200/80 mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        {/* Title and Participants */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono font-semibold text-neutral-500">
              YOUR CONVERSATION
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs text-neutral-500 font-mono truncate max-w-xs">
              {fileName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight leading-tight">
            {participants.length <= 2
              ? participants.map((p) => p.name).join(' & ')
              : `${participants[0]?.name}, ${participants[1]?.name} & ${participants.length - 2} others`}
          </h1>

          {/* Participant Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {participants.map((p) => (
              <span
                key={p.name}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-neutral-200 shadow-sm"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-neutral-800">{p.name}</span>
                <span className="text-neutral-400 font-mono text-[11px]">
                  ({p.percentage}%)
                </span>
              </span>
            ))}
          </div>

          {/* Period Details */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 pt-2 font-mono">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>
                {formatDate(overview.startDate)} — {formatDate(overview.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formatDurationDays(overview.durationDays)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>{overview.totalParticipants} participants</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
          <Link to="/wrapped">
            <Button
              variant="primary"
              className="bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 text-white border-0 shadow-float hover:opacity-95"
            >
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
              Chat Wrapped
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportPNG}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-1.5 text-neutral-600" />
            <span>Export PNG</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <FileDown className="w-4 h-4 mr-1.5 text-neutral-600" />
            <span>Export PDF</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleShare}
            title="Copy Report Link"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4 text-neutral-600" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
