import { ConversationAnalytics } from '@/types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ReportResponse {
  id: string;
  title: string;
  createdAt: string;
  analytics: ConversationAnalytics;
}

export const api = {
  async checkHealth(): Promise<{ status: string; version: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Backend server is unreachable');
    return res.json();
  },

  async uploadChat(file: File, thresholdHours: number = 3): Promise<ConversationAnalytics> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('threshold_hours', thresholdHours.toString());

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to upload chat' }));
      throw new Error(err.detail || 'Failed to process WhatsApp export on server');
    }

    return res.json();
  },

  async saveReport(title: string, analytics: ConversationAnalytics): Promise<ReportResponse> {
    const res = await fetch(`${API_BASE_URL}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, analytics }),
    });

    if (!res.ok) {
      throw new Error('Failed to save report to server');
    }

    return res.json();
  },

  async getReport(id: string): Promise<ReportResponse> {
    const res = await fetch(`${API_BASE_URL}/report/${id}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },
};
