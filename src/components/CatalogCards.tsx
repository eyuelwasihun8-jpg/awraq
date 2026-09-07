import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, Layers, PlayCircle } from 'lucide-react';
import type { Bundle, Course, DigitalProduct } from '../types';
import { formatPrice } from '../lib/format';
import { useLocalized } from '../lib/useLocalized';
import { lessonCount } from '../data/catalog';
import { useStore } from '../store/StoreProvider';
import { SmartImage } from './ui/SmartImage';
import { Badge, Card, ProgressBar, Rating } from './ui/primitives';

/**
 * Catalogue cards.
 *
 * Three things this fixes:
 *
 * 1. The whole card is a single <Link>, so it's one tab stop with one
 *    accessible name. The old cards were `<div onClick>` with a nested button,
 *    which keyboard users could not reach at all (AUDIT.md §M6).
 * 2. Prices go through Intl. The old cards printed `ETB {price}.00`, which is
 *    neither the Ethiopian convention nor correct in Amharic (§M3).
 * 3. Ratings render only when there are reviews. Every card previously showed
 *    a hardcoded 4.9 with a review count that did not exist (§H6).
 */

function PriceTag({
  price,
  originalPrice,
  isFree,
  owned,
}: {
  price: number;
  originalPrice?: number;
  isFree?: boolean;
  owned?: boolean;
}) {
  const { t, i18n } = useTranslation();

  if (owned) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-success-text">
        <CheckCircle2 className="size-4" aria-hidden />
        {t('common.owned')}
      </span>
    );
  }
  if (isFree || price === 0) {
    return <span className="text-lg font-extrabold text-success-text">{t('common.free')}</span>;
  }
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-lg font-extrabold text-fg">{formatPrice(price, i18n.language)}</span>
      {originalPrice != null && originalPrice > price && (
        <s className="text-sm font-semibold text-fg-subtle">
          {formatPrice(originalPrice, i18n.language)}
        </s>
      )}
    </span>
  );
}

export function CourseCard({ course, priority = false }: { course: Course; priority?: boolean }) {
  const { t } = useTranslation();
  const { L } = useLocalized();
  const { owns, progressFor } = useStore();

  const owned = owns(course.id);
  const progress = progressFor(course.id);
  const total = lessonCount(course);
  const done = progress?.completedLessonIds.length ?? 0;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card as="article" interactive className="group flex flex-col">
      <Link
        to={`/courses/${course.slug}`}
        className="flex flex-1 flex-col rounded-card focus-visible:outline-none"
      >
        <div className="relative">
          <SmartImage
            src={course.thumbnail}
            alt=""
            ratio="16/9"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
            wrapperClassName="rounded-t-card"
          />
          <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
            {course.isFree ? (
              <Badge tone="success">{t('common.free')}</Badge>
            ) : course.isPopular ? (
              <Badge tone="brand">{t('common.popular')}</Badge>
            ) : (
              <span />
            )}
            <Badge tone="onDark" icon={<Clock className="size-3" />}>
              {course.duration}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-brand-text">
            {L(course, 'category')}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-base font-extrabold leading-snug text-fg">
            {L(course, 'title')}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
            {L(course, 'summary')}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <PlayCircle className="size-3.5" aria-hidden />
              {t('common.lessons', { count: total })}
            </span>
            <span>{course.level}</span>
            <Rating value={course.rating} count={course.reviewsCount} />
          </div>

          <div className="mt-auto pt-4">
            {owned && total > 0 ? (
              <ProgressBar
                value={percent}
                size="sm"
                label={t('course.progressLabel', { percent })}
              />
            ) : null}
            <div className="mt-3 flex items-center justify-between gap-3">
              <PriceTag price={course.price} isFree={course.isFree} owned={owned} />
              <span className="text-sm font-extrabold text-brand-text group-hover:underline">
                {owned ? t('course.continue') : course.isFree ? t('course.start') : t('common.view')}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function ProductCard({ product }: { product: DigitalProduct }) {
  const { t } = useTranslation();
  const { L } = useLocalized();
  const { owns } = useStore();
  const owned = owns(product.id);

  return (
    <Card as="article" interactive className="group flex flex-col">
      <Link
        to={`/resources/${product.slug}`}
        className="flex flex-1 flex-col rounded-card focus-visible:outline-none"
      >
        <SmartImage
          src={product.thumbnail}
          alt=""
          ratio="4/3"
          wrapperClassName="rounded-t-card"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-brand-text">
            {L(product, 'category')}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-base font-extrabold leading-snug text-fg">
            {L(product, 'title')}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
            {L(product, 'summary')}
          </p>
          <p className="mt-3 text-xs font-semibold text-fg-subtle">
            {t('product.fileCount', { count: product.files.length })}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <PriceTag price={product.price} originalPrice={product.originalPrice} owned={owned} />
            <span className="text-sm font-extrabold text-brand-text group-hover:underline">
              {owned ? t('product.download') : t('common.view')}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();
  const { owns } = useStore();

  const owned = owns(bundle.id);
  const saving = bundle.originalPrice - bundle.price;
  const percent = Math.round((saving / bundle.originalPrice) * 100);

  return (
    <Card as="article" interactive className="group flex flex-col">
      <Link
        to={`/bundles/${bundle.slug}`}
        className="flex flex-1 flex-col rounded-card focus-visible:outline-none"
      >
        <div className="relative">
          <SmartImage
            src={bundle.thumbnail}
            alt=""
            ratio="16/9"
            wrapperClassName="rounded-t-card"
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute start-3 top-3">
            <Badge tone="warning" icon={<Layers className="size-3" />}>
              {t('common.savePercent', { percent })}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-base font-extrabold leading-snug text-fg">{L(bundle, 'title')}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
            {L(bundle, 'summary')}
          </p>
          <p className="mt-3 text-xs font-semibold text-fg-subtle">
            {t('bundle.itemCount', {
              courses: bundle.courseIds.length,
              resources: bundle.productIds.length,
            })}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <PriceTag price={bundle.price} originalPrice={bundle.originalPrice} owned={owned} />
            <span className="text-sm font-extrabold text-brand-text group-hover:underline">
              {t('common.view')}
            </span>
          </div>
        </div>
      </Link>
      <p className="sr-only">{t('bundle.youSave', { amount: formatPrice(saving, i18n.language) })}</p>
    </Card>
  );
}
