import { NormalizedMessage, ParserResult } from '@/types/chat';

/**
 * WhatsApp chat parser supporting both iOS bracketed and Android hyphenated formats,
 * 12-hour / 24-hour clocks, various date separators (/ or . or -), and multiline messages.
 */

// Regex patterns for matching message starts
// Format 1: [DD/MM/YY, HH:MM:SS AM/PM] Sender: Message or [DD/MM/YYYY, HH:MM:SS] Sender: Message (iOS)
const IOS_BRACKETED_REGEX = /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\]\s+([^:]+):\s*(.*)$/i;

// Format 2: DD/MM/YYYY, HH:MM - Sender: Message or DD/MM/YY, 10:32 pm - Sender: Message (Android / Standard)
// Handles various dash types: -, –, —
const STANDARD_REGEX = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\s*(?:-|–|—)\s*([^:]+):\s*(.*)$/i;

// Format 3: System messages (no sender colon)
const SYSTEM_BRACKETED_REGEX = /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\]\s+(.*)$/i;
const SYSTEM_STANDARD_REGEX = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\s*(?:-|–|—)\s*(.*)$/i;

const SYSTEM_PHRASES = [
  'messages and calls are end-to-end encrypted',
  'message was deleted',
  'deleted this message',
  'changed the group description',
  'changed the subject',
  'created group',
  'added',
  'left',
  'joined using this group\'s invite link',
  'security code changed',
  'you\'re now an admin',
  'changed their phone number',
  'disappearing messages',
];

const MEDIA_PHRASES = [
  '<media omitted>',
  'image omitted',
  'video omitted',
  'audio omitted',
  'document omitted',
  'sticker omitted',
  'contact card omitted',
  'gif omitted',
  'attached:',
];

export function isSystemMessage(sender: string, message: string): boolean {
  const combined = (sender + ' ' + message).toLowerCase();
  return SYSTEM_PHRASES.some((phrase) => combined.includes(phrase));
}

export function isMediaMessage(message: string): boolean {
  const lower = message.trim().toLowerCase();
  return MEDIA_PHRASES.some((phrase) => lower.includes(phrase));
}

/**
 * Determine date format heuristic (DD/MM vs MM/DD) based on first 100 date occurrences
 */
function inferDateFormat(lines: string[]): 'DMY' | 'MDY' {
  let firstPartOver12 = 0;
  let secondPartOver12 = 0;

  for (let i = 0; i < Math.min(lines.length, 300); i++) {
    const line = lines[i];
    const match = line.match(/^\[?(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
    if (match) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      if (p1 > 12) firstPartOver12++;
      if (p2 > 12) secondPartOver12++;
    }
  }

  // If first part is > 12, it must be DD/MM (DMY)
  // If second part is > 12, it must be MM/DD (MDY)
  if (secondPartOver12 > 0 && firstPartOver12 === 0) {
    return 'MDY';
  }
  return 'DMY'; // Default to DMY widely used internationally and in WhatsApp exports
}

/**
 * Normalize date string to YYYY-MM-DD
 */
export function normalizeDate(dateStr: string, format: 'DMY' | 'MDY'): { date: string; year: number; month: number; day: number } | null {
  const parts = dateStr.split(/[./-]/);
  if (parts.length !== 3) return null;

  let day: number;
  let month: number;
  let year: number;

  const rawYear = parseInt(parts[2], 10);
  year = rawYear < 100 ? (rawYear > 50 ? 1900 + rawYear : 2000 + rawYear) : rawYear;

  if (format === 'MDY') {
    month = parseInt(parts[0], 10);
    day = parseInt(parts[1], 10);
  } else {
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  }

  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return { date: `${year}-${mm}-${dd}`, year, month, day };
}

/**
 * Normalize time string to 24h format and extract hour
 */
export function normalizeTime(timeStr: string): { hour: number; minute: number; second: number; time24: string } | null {
  // Normalize unicode spaces like narrow non-breaking space \u202f
  const clean = timeStr.replace(/[\u202f\u00a0]/g, ' ').trim().toLowerCase();
  const is12Hour = clean.includes('am') || clean.includes('pm');
  const isPM = clean.includes('pm');
  const isAM = clean.includes('am');

  const numbersOnly = clean.replace(/[ap]m/g, '').trim();
  const parts = numbersOnly.split(':').map((p) => parseInt(p, 10));

  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return null;
  }

  let hour = parts[0];
  const minute = parts[1];
  const second = parts.length > 2 && !isNaN(parts[2]) ? parts[2] : 0;

  if (is12Hour) {
    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const ss = String(second).padStart(2, '0');

  return { hour, minute, second, time24: `${hh}:${mm}:${ss}` };
}

/**
 * Parse raw WhatsApp export text into normalized messages
 */
export function parseWhatsAppChat(rawText: string): ParserResult {
  if (!rawText || !rawText.trim()) {
    return {
      messages: [],
      totalParsed: 0,
      systemMessageCount: 0,
      errorsCount: 0,
      detectedFormat: 'empty',
    };
  }

  // Remove BOM if present
  const sanitized = rawText.replace(/^\uFEFF/, '');
  const lines = sanitized.split(/\r?\n/);
  const dateFormat = inferDateFormat(lines);

  const messages: NormalizedMessage[] = [];
  let currentMsg: Partial<NormalizedMessage> | null = null;
  let systemMessageCount = 0;
  let errorsCount = 0;
  let detectedFormat = 'Standard / Android';
  let messageCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line && !currentMsg) continue;

    // Check Format 1 (iOS Bracketed)
    let match = line.match(IOS_BRACKETED_REGEX);
    let isIOS = false;

    if (match) {
      detectedFormat = 'iOS Bracketed';
      isIOS = true;
    } else {
      // Check Format 2 (Standard Android / Web)
      match = line.match(STANDARD_REGEX);
    }

    if (match) {
      // Save previous pending message
      if (currentMsg && currentMsg.sender && currentMsg.timestamp) {
        messages.push(finalizeMessage(currentMsg as NormalizedMessage));
        currentMsg = null;
      }

      const [, rawDate, rawTime, rawSender, rawContent] = match;
      const parsedDate = normalizeDate(rawDate, dateFormat);
      const parsedTime = normalizeTime(rawTime);

      if (!parsedDate || !parsedTime) {
        errorsCount++;
        continue;
      }

      const sender = rawSender.trim();
      const content = rawContent || '';

      // Check if it's a system message masquerading as user
      if (isSystemMessage(sender, content)) {
        systemMessageCount++;
        continue;
      }

      const timestamp = `${parsedDate.date}T${parsedTime.time24}`;
      messageCounter++;

      currentMsg = {
        id: `msg-${messageCounter}-${Date.now().toString(36)}`,
        timestamp,
        date: parsedDate.date,
        hour: parsedTime.hour,
        sender,
        message: content,
        isMedia: isMediaMessage(content),
      };
      continue;
    }

    // Check if it's a system notification line (without a sender)
    const sysMatch = line.match(SYSTEM_BRACKETED_REGEX) || line.match(SYSTEM_STANDARD_REGEX);
    if (sysMatch) {
      if (currentMsg && currentMsg.sender && currentMsg.timestamp) {
        messages.push(finalizeMessage(currentMsg as NormalizedMessage));
        currentMsg = null;
      }
      systemMessageCount++;
      continue;
    }

    // Otherwise, this line is a continuation of a multiline message
    if (currentMsg) {
      currentMsg.message = (currentMsg.message || '') + '\n' + line;
      if (isMediaMessage(currentMsg.message)) {
        currentMsg.isMedia = true;
      }
    }
  }

  // Push final message
  if (currentMsg && currentMsg.sender && currentMsg.timestamp) {
    messages.push(finalizeMessage(currentMsg as NormalizedMessage));
  }

  return {
    messages,
    totalParsed: messages.length,
    systemMessageCount,
    errorsCount,
    detectedFormat,
  };
}

function finalizeMessage(msg: NormalizedMessage): NormalizedMessage {
  const text = msg.message || '';
  const trimmed = text.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean) : [];
  
  return {
    ...msg,
    wordCount: words.length,
    characterCount: trimmed.length,
  };
}
