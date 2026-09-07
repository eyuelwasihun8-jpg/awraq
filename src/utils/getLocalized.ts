/**
 * Safe localizer — works even if i18n isn't loaded yet
 */
export function getLocalized(en: string, am?: string): string {
  try {
    const lang = document.documentElement.lang || localStorage.getItem('awraq_language') || 'en';
    return lang === 'am' && am ? am : en;
  } catch {
    return en;
  }
}

export function getLocalizedArray(en: string[], am?: string[]): string[] {
  try {
    const lang = document.documentElement.lang || localStorage.getItem('awraq_language') || 'en';
    return lang === 'am' && am && am.length > 0 ? am : en;
  } catch {
    return en;
  }
}