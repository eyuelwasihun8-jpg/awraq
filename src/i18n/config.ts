import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';
import { am } from './locales/am';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'am'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'awraq_language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Set the HTML lang attribute on initial load
document.documentElement.lang = i18n.language;

// Update HTML lang whenever language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;