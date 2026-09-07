import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { parseDurationToMinutes } from '../lib/format';
import {
  allBundles,
  allCourses,
  allProducts,
  courseCategories,
  lessonCount,
  productCategories,
} from '../data/catalog';
import type { Course, DigitalProduct } from '../types';
import { BundleCard, CourseCard, ProductCard } from '../components/CatalogCards';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { EmptyState } from '../components/ui/primitives';
import { cn } from '../lib/cn';

/**
 * Catalogue page — /courses and /resources.
 *
 * The old build had no catalogue page at all: everything lived in one
 * homepage grid with no search, no filter, no sort and no pagination
 * (AUDIT.md §H10).
 *
 * Filter state lives in the URL, not useState. That means a filtered view is
 * shareable and survives refresh and the back button — the single most useful
 * property of a catalogue, and the one a `useState` implementation can never
 * have.
 */

type Sort = 'popular' | 'newest' | 'priceAsc' | 'priceDesc' | 'durationAsc';

const SORTS: Sort[] = ['popular', 'newest', 'priceAsc', 'priceDesc', 'durationAsc'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;

export default function CatalogPage({ mode }: { mode: 'courses' | 'resources' }) {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();

  const query = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const level = params.get('level') ?? '';
  const sort = (params.get('sort') as Sort) ?? 'popular';

  const isCourses = mode === 'courses';
  const categories = useMemo(
    () => (isCourses ? courseCategories() : productCategories()),
    [isCourses],
  );

  /** Mutate one query param while preserving the rest. Empty removes the key. */
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    // `replace` keeps the back button useful: filtering is not navigation.
    setParams(next, { replace: true });
  }

  const source = useMemo<(Course | DigitalProduct)[]>(
    () => (isCourses ? allCourses() : allProducts()),
    [isCourses],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = source.filter((item) => {
      if (category && item.category !== category) return false;
      if (level && item.kind === 'course' && item.level !== level) return false;
      if (!needle) return true;
      // Search title + summary in both languages, so an Amharic query finds an
      // English-titled course and vice versa.
      return [item.title, item.title_am, item.summary, item.summary_am, item.category]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(needle));
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        break;
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'durationAsc':
        sorted.sort((a, b) => {
          const dur = (x: Course | DigitalProduct) =>
            x.kind === 'course' ? parseDurationToMinutes(x.duration) : 0;
          return dur(a) - dur(b);
        });
        break;
      default:
        // "Popular": flagged items first, then bigger courses, then price.
        sorted.sort((a, b) => {
          const flag = (x: Course | DigitalProduct) =>
            x.kind === 'course' && x.isPopular ? 0 : 1;
          if (flag(a) !== flag(b)) return flag(a) - flag(b);
          const size = (x: Course | DigitalProduct) =>
            x.kind === 'course' ? lessonCount(x) : x.files.length;
          return size(b) - size(a);
        });
    }
    return sorted;
  }, [source, query, category, level, sort]);

  const bundles = useMemo(() => (isCourses ? allBundles() : []), [isCourses]);
  const hasFilters = Boolean(query || category || level);

  useDocumentMeta({
    title: isCourses ? t('catalog.coursesTitle') : t('catalog.resourcesTitle'),
    description: isCourses ? t('catalog.coursesMeta') : t('catalog.resourcesMeta'),
    canonicalPath: isCourses ? '/courses' : '/resources',
    // Filtered permutations are duplicate content; only the clean URL is indexed.
    noIndex: hasFilters,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          {isCourses ? t('catalog.coursesTitle') : t('catalog.resourcesTitle')}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">
          {isCourses ? t('catalog.coursesLead') : t('catalog.resourcesLead')}
        </p>
      </header>

      {/* Filters */}
      <section aria-label={t('catalog.filters')} className="mt-9">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-52 flex-1">
            <label
              htmlFor="catalog-search"
              className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-fg-muted"
            >
              {t('catalog.search')}
            </label>
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder={
                isCourses
                  ? t('home.coursesSection.searchPlaceholder')
                  : t('home.resourcesSection.searchPlaceholder')
              }
              className="h-11 w-full rounded-control border border-line bg-surface px-4 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {isCourses && (
            <div className="w-40">
              <label
                htmlFor="catalog-level"
                className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-fg-muted"
              >
                {t('home.coursesSection.filterLevel')}
              </label>
              <Select
                id="catalog-level"
                value={level}
                onChange={(e) => setParam('level', e.target.value)}
              >
                <option value="">{t('home.coursesSection.allLevels')}</option>
                {LEVELS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="w-48">
            <label
              htmlFor="catalog-sort"
              className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-fg-muted"
            >
              {t('home.coursesSection.sortBy')}
            </label>
            <Select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
            >
              {SORTS.map((value) => (
                <option key={value} value={value}>
                  {t(`home.coursesSection.sort.${value}`)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Category chips — real radio semantics, so arrow keys work and the
            selection is announced. The old chips were styled divs. */}
        {categories.length > 1 && (
          <div
            role="radiogroup"
            aria-label={t('home.coursesSection.allCategories')}
            className="mt-4 flex flex-wrap gap-2"
          >
            {['', ...categories].map((value) => {
              const active = category === value;
              return (
                <button
                  key={value || 'all'}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setParam('category', value)}
                  className={cn(
                    'h-9 rounded-full border px-4 text-sm font-bold transition-colors',
                    active
                      ? 'border-brand bg-brand-soft text-brand-text'
                      : 'border-line bg-surface text-fg-muted hover:border-brand/40 hover:text-fg',
                  )}
                >
                  {value || t('home.coursesSection.allCategories')}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Result count — announced politely so filtering is perceivable to
          screen-reader users, who otherwise get no feedback at all. */}
      <p role="status" aria-live="polite" className="mt-6 text-sm font-semibold text-fg-muted">
        {t('common.showing', { count: results.length, total: source.length })}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="ms-2 align-middle"
            leadingIcon={<SlidersHorizontal className="size-3.5" />}
            onClick={() => setParams(new URLSearchParams(), { replace: true })}
          >
            {t('common.clearFilters')}
          </Button>
        )}
      </p>

      {results.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={<SearchX className="size-8" />}
          title={
            isCourses ? t('home.coursesSection.empty') : t('home.resourcesSection.empty')
          }
          description={t('catalog.emptyHint')}
          action={
            <Button
              variant="secondary"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              {t('common.clearFilters')}
            </Button>
          }
        />
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item, index) =>
            item.kind === 'course' ? (
              <li key={item.id}>
                <CourseCard course={item} priority={index < 3} />
              </li>
            ) : (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ),
          )}
        </ul>
      )}

      {bundles.length > 0 && !hasFilters && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-fg">
            {t('home.bundlesSection.title')}
          </h2>
          <p className="mt-2 text-sm text-fg-muted">{t('home.bundlesSection.description')}</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {bundles.map((bundle) => (
              <li key={bundle.id}>
                <BundleCard bundle={bundle} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
