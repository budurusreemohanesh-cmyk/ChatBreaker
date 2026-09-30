/**
 * Date formatting and manipulation utilities for ChatBreaker
 */

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + (dateStr.length === 7 ? '-01T00:00:00' : 'T00:00:00'));
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

export function formatDurationDays(days: number): string {
  if (days < 30) return `${days} day${days === 1 ? '' : 's'}`;
  const months = Math.floor(days / 30.4);
  const remDays = Math.round(days % 30.4);
  if (months < 12) {
    return remDays > 0 ? `${months} mo, ${remDays} d` : `${months} month${months === 1 ? '' : 's'}`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} years`;
}

export function formatMinutes(minutes: number | null): string {
  if (minutes === null || isNaN(minutes)) return 'N/A';
  if (minutes < 1) {
    const sec = Math.max(1, Math.round(minutes * 60));
    return `${sec} sec`;
  }
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMin = Math.round(minutes % 60);
  if (hours < 24) {
    return remainingMin > 0 ? `${hours}h ${remainingMin}m` : `${hours}h`;
  }
  const days = (minutes / (60 * 24)).toFixed(1);
  return `${days} days`;
}
