/**
 * Number and string formatting helpers
 */

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export function formatPercentage(val: number, decimals: number = 1): string {
  if (isNaN(val)) return '0%';
  return `${val.toFixed(decimals)}%`;
}

// Curated pastel/editorial color palette for participants
export const PARTICIPANT_PALETTE = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#E11D48', // Rose
  '#3B82F6', // Blue
];

export function getParticipantColor(index: number): string {
  return PARTICIPANT_PALETTE[index % PARTICIPANT_PALETTE.length];
}

export function truncateText(text: string, maxLength: number = 120): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
