import { Language } from '../types';

const BANGLA_DIGITS: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts English digits (0-9) in any string or number to Bangla digits (০-৯)
 */
export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => BANGLA_DIGITS[digit] || digit);
}

/**
 * Formats a number with commas and converts to Bangla digits if language is 'bn'
 */
export function formatNumber(
  num: number | string,
  lang: Language,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);

  const formatted = n.toLocaleString('en-US', options);
  if (lang === 'bn') {
    return toBanglaDigits(formatted);
  }
  return formatted;
}

/**
 * Formats currency (preserves the $ sign as requested)
 */
export function formatCurrency(
  amount: number | string,
  lang: Language,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  const formatted = formatNumber(amount, lang, options);
  return `$${formatted}`;
}

/**
 * Formats dates using Intl.DateTimeFormat with bn-BD or en-US
 */
export function formatDate(
  dateInput: string | Date,
  lang: Language,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput.includes('T') ? dateInput : `${dateInput}T00:00:00`) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats time string (e.g. "08:00 AM" -> "০৮:০০ পূর্বাহ্ণ" or Bangla digits)
 */
export function formatTime(timeStr: string, lang: Language): string {
  if (lang !== 'bn') return timeStr;
  
  return timeStr
    .replace('AM', 'পূর্বাহ্ণ')
    .replace('PM', 'অপরাহ্ন')
    .replace(/[0-9]/g, (d) => BANGLA_DIGITS[d] || d);
}

/**
 * Plural helper that handles English and Bangla plurals correctly
 * Fixes the "1 groups" bug:
 * 1 -> "1 group" / "১টি গ্রুপ"
 * 2 -> "2 groups" / "২টি গ্রুপ"
 */
export function formatPlural(
  count: number,
  singularEn: string,
  pluralEn: string,
  lang: Language,
  banglaWordOrSuffix?: string
): string {
  if (lang === 'bn') {
    if (!banglaWordOrSuffix) {
      return `${toBanglaDigits(count)}টি`;
    }
    if (banglaWordOrSuffix.startsWith('টি') || banglaWordOrSuffix.startsWith('জন')) {
      return `${toBanglaDigits(count)}${banglaWordOrSuffix}`;
    }
    return `${toBanglaDigits(count)}টি ${banglaWordOrSuffix}`;
  }
  return `${count} ${count === 1 ? singularEn : pluralEn}`;
}
