/**
 * Locale-aware formatting.
 *
 * Previously prices were rendered with `ETB ${n.toFixed(2)}` in nine different
 * files, producing "ETB 199.00". Ethiopian Birr is not quoted with cents in
 * retail, and hardcoding the symbol means Amharic users see a Latin string
 * glued to Ethiopic text. All of that is centralised here.
 */

type Lang = 'en' | 'am';

const LOCALE: Record<Lang, string> = {
  en: 'en-ET',
  am: 'am-ET',
};

function resolveLocale(lang?: string): string {
  const key = (lang ?? document.documentElement.lang ?? 'en').slice(0, 2) as Lang;
  return LOCALE[key] ?? LOCALE.en;
}

/**
 * Format a price in Ethiopian Birr.
 * Whole birr by default — `ETB 199`, not `ETB 199.00`.
 */
export function formatPrice(amount: number, lang?: string): string {
  const locale = resolveLocale(lang);
  const hasFraction = Math.round(amount * 100) % 100 !== 0;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `ETB ${amount.toFixed(hasFraction ? 2 : 0)}`;
  }
}

export function formatDate(
  value: string | number | Date,
  lang?: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  try {
    return new Intl.DateTimeFormat(resolveLocale(lang), options).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** Compact relative time — "2 days ago". Used in the notes list. */
export function formatRelative(value: string | number | Date, lang?: string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = date.getTime() - Date.now();
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000_000],
    ['month', 2_592_000_000],
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];

  try {
    const rtf = new Intl.RelativeTimeFormat(resolveLocale(lang), { numeric: 'auto' });
    for (const [unit, ms] of units) {
      if (Math.abs(diffMs) >= ms) return rtf.format(Math.round(diffMs / ms), unit);
    }
    return rtf.format(0, 'minute');
  } catch {
    return formatDate(date, lang);
  }
}

/** "14 hr 30 mins" → total minutes. Used for schema.org and sorting. */
export function parseDurationToMinutes(duration: string): number {
  const hours = /(\d+)\s*hr/i.exec(duration)?.[1];
  const mins = /(\d+)\s*min/i.exec(duration)?.[1];
  return (Number(hours ?? 0) * 60) + Number(mins ?? 0);
}

/** "12:45" → seconds. Lesson durations use mm:ss. */
export function parseLessonDuration(duration = '0:00'): number {
  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

export function formatPercent(value: number, lang?: string): string {
  try {
    return new Intl.NumberFormat(resolveLocale(lang), {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(value / 100);
  } catch {
    return `${Math.round(value)}%`;
  }
}

export function formatCount(value: number, lang?: string): string {
  try {
    return new Intl.NumberFormat(resolveLocale(lang)).format(value);
  } catch {
    return String(value);
  }
}
