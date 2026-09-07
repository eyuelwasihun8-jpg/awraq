import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'am', label: 'አማርኛ', short: 'አማ' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

/**
 * Amharic is loaded on demand.
 *
 * The Amharic bundle is ~30 kB of Ge'ez text. Shipping it to every English
 * visitor is 30 kB they will never read, on connections where that matters.
 * English ships in the entry chunk; Amharic arrives as its own chunk the first
 * time it is needed.
 */
const LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  am: () => import('./locales/am').then((m) => m.am),
};

const loaded = new Set<string>(['en']);

export async function loadLanguage(code: string): Promise<void> {
  const base = code.split('-')[0];
  if (loaded.has(base) || !LOADERS[base]) return;
  const bundle = await LOADERS[base]();
  i18n.addResourceBundle(base, 'translation', bundle, true, true);
  loaded.add(base);
}

/** Change language, fetching its bundle first so nothing flashes in English. */
export async function changeLanguage(code: string): Promise<void> {
  await loadLanguage(code);
  await i18n.changeLanguage(code);
}

/**
 * Keep <html lang> in sync.
 *
 * This drives the Ethiopic font stack and the relaxed line-height in
 * index.css, and tells screen readers which pronunciation rules to use —
 * reading Amharic with an English voice is unintelligible.
 */
function syncDocumentLanguage(lng: string) {
  document.documentElement.lang = lng.split('-')[0];
  document.documentElement.dir = 'ltr'; // both supported languages are LTR
}

export async function initI18n(): Promise<typeof i18n> {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: { en: { translation: en } },
      fallbackLng: 'en',
      supportedLngs: ['en', 'am'],
      // Strip regional subtags so `am-ET` and `en-GB` resolve to our bundles.
      load: 'languageOnly',
      nonExplicitSupportedLngs: true,
      detection: {
        // `querystring` first so a shared ?lng=am link opens in Amharic —
        // this is what makes the hreflang alternates in index.html meaningful.
        order: ['querystring', 'localStorage', 'navigator'],
        lookupQuerystring: 'lng',
        lookupLocalStorage: 'awraq.language',
        caches: ['localStorage'],
      },
      interpolation: { escapeValue: false },
      returnNull: false,
    });

  // If the visitor's stored/browser language is Amharic, fetch it before the
  // first paint rather than rendering English and swapping.
  await loadLanguage(i18n.language);

  syncDocumentLanguage(i18n.language);
  i18n.on('languageChanged', syncDocumentLanguage);

  return i18n;
}

export default i18n;
