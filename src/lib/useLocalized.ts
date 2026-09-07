import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Content localisation for data that lives in `src/data/*`.
 *
 * UI chrome ("Sign in", "Add to cart") goes through i18next `t()`. Catalogue
 * content (course titles, module names, file descriptions) can't — it's data,
 * not a fixed key set, and it changes when the CMS changes.
 *
 * The convention is a parallel `_am` field on the record:
 *
 *   { title: 'SEO Basics', title_am: 'የSEO መሠረታዊ ነገሮች' }
 *
 * `L(course, 'title')` returns the right one for the active language and falls
 * back to English when a translation is missing, so a partially translated
 * catalogue degrades gracefully instead of rendering blanks.
 *
 * (The previous codebase shipped a `getLocalized` helper with this exact
 * intent — it was never imported anywhere, and no data file had a single `_am`
 * field. This version is wired in and typed.)
 */

/** Keys of T that have a matching `${K}_am` sibling. */
type LocalizableKey<T> = {
  [K in keyof T & string]-?: NonNullable<T[K]> extends string
    ? `${K}_am` extends keyof T
      ? K
      : never
    : never;
}[keyof T & string];

export function useLocalized() {
  const { i18n } = useTranslation();
  const isAmharic = i18n.language?.startsWith('am') ?? false;

  /** Localise a string field. */
  const L = useCallback(
    <T extends object, K extends LocalizableKey<T>>(record: T, key: K): string => {
      const base = (record[key] as unknown as string | undefined) ?? '';
      if (!isAmharic) return base;
      const translated = (record as Record<string, unknown>)[`${key}_am`] as string | undefined;
      return translated && translated.trim().length > 0 ? translated : base;
    },
    [isAmharic],
  );

  /** Localise a string[] field (e.g. course highlights). */
  const LArr = useCallback(
    <T extends object>(record: T, key: keyof T & string): string[] => {
      const bag = record as Record<string, unknown>;
      const base = (bag[key] as string[] | undefined) ?? [];
      if (!isAmharic) return base;
      const translated = bag[`${key}_am`] as string[] | undefined;
      return translated && translated.length > 0 ? translated : base;
    },
    [isAmharic],
  );

  return { L, LArr, isAmharic, lang: i18n.language };
}
