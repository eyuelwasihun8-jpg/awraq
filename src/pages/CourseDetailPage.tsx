import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Infinity as InfinityIcon,
  Lock,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';
import { getCourse, lessonCount, lessonsOf, toCartLine } from '../data/catalog';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatPrice } from '../lib/format';
import { useToast } from '../components/ui/Toast';
import { Button, ButtonLink } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { SmartImage, Avatar } from '../components/ui/SmartImage';
import { Badge, ProgressBar, Rating } from '../components/ui/primitives';
import { cn } from '../lib/cn';
import type { Lesson } from '../types';

/**
 * Course detail page.
 *
 * Fixes carried over from the audit:
 *
 * - A real URL (/courses/:slug), so a course can be shared, indexed and
 *   bookmarked, with Course JSON-LD attached (AUDIT.md §C7).
 * - Preview lessons actually play. The old "Preview" chips were decorative.
 * - Locked lessons say they are locked instead of pretending to be clickable.
 * - The CTA reflects real state: buy → in cart → owned → continue, driven by
 *   the store rather than three separate booleans that could disagree.
 * - The sticky mobile CTA is a single component with one visual treatment,
 *   replacing the old `accent` prop that produced four different palettes for
 *   the same button (§H2).
 */

export default function CourseDetailPage() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { L, LArr } = useLocalized();
  const { toast } = useToast();
  const { owns, cart, addToCart, enrollFree, progressFor, isSignedIn } = useStore();
  const [preview, setPreview] = useState<Lesson | null>(null);

  const course = getCourse(slug);

  // Hooks must run unconditionally, so compute safe values before the guard.
  const total = course ? lessonCount(course) : 0;
  const progress = course ? progressFor(course.id) : undefined;

  useDocumentMeta({
    title: course ? `${L(course, 'title')} — Awraq` : t('errors.notFoundTitle'),
    description: course ? L(course, 'summary') : undefined,
    canonicalPath: course ? `/courses/${course.slug}` : undefined,
    image: course?.thumbnail,
    jsonLd: course
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.summary,
          provider: { '@type': 'Organization', name: 'Awraq', url: 'https://awraq.et/' },
          inLanguage: ['am', 'en'],
          offers: {
            '@type': 'Offer',
            price: course.price,
            priceCurrency: 'ETB',
            availability: 'https://schema.org/InStock',
          },
        }
      : undefined,
  });

  if (!course) return <Navigate to="/courses" replace />;

  const owned = owns(course.id);
  const inCart = cart.some((line) => line.itemId === course.id);
  const done = progress?.completedLessonIds.length ?? 0;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const firstLesson = lessonsOf(course)[0];
  const resumeId = progress?.lastLessonId ?? firstLesson?.id;

  function handleAddToCart() {
    if (!course) return;
    addToCart(toCartLine(course));
    toast(t('course.addedToCart', { title: L(course, 'title') }), 'success');
  }

  function handleStartFree() {
    if (!course) return;
    enrollFree(course.id, 'course');
  }

  // ── Primary call to action ─────────────────────────────────
  const cta = owned ? (
    <ButtonLink
      to={`/learn/${course.slug}${resumeId ? `/${resumeId}` : ''}`}
      size="lg"
      fullWidth
      leadingIcon={<PlayCircle className="size-4" />}
    >
      {percent > 0 ? t('course.continue') : t('course.start')}
    </ButtonLink>
  ) : course.isFree ? (
    <ButtonLink
      to={`/learn/${course.slug}`}
      size="lg"
      fullWidth
      variant="success"
      leadingIcon={<PlayCircle className="size-4" />}
      onClick={handleStartFree}
    >
      {t('course.enrollFree')}
    </ButtonLink>
  ) : inCart ? (
    <ButtonLink to="/cart" size="lg" fullWidth variant="success">
      {t('course.goToCart')}
    </ButtonLink>
  ) : (
    <Button size="lg" fullWidth onClick={handleAddToCart}>
      {t('course.addToCart')}
    </Button>
  );

  const includes = [
    { Icon: PlayCircle, label: t('course.includesVideo', { count: total, duration: course.duration }) },
    { Icon: Download, label: t('course.includesResources') },
    ...(course.isFree
      ? [{ Icon: CheckCircle2, label: t('course.includesFree') }]
      : [
          { Icon: Award, label: t('course.includesCertificate') },
          { Icon: InfinityIcon, label: t('course.includesLifetime') },
        ]),
  ];

  return (
    <div className="pb-28 lg:pb-0">
      {/* Breadcrumb — real links, so users have an escape hatch that isn't
          history.back() (which could take them off the site entirely, §H9). */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-subtle">
          <li>
            <Link to="/" className="font-semibold hover:text-fg">
              {t('nav.home')}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link to="/courses" className="font-semibold hover:text-fg">
              {t('course.breadcrumb')}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li aria-current="page" className="font-semibold text-fg">
            {L(course, 'title')}
          </li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* ── Main column ───────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{L(course, 'category')}</Badge>
            <Badge tone="neutral">{course.level}</Badge>
            {course.isFree && <Badge tone="success">{t('common.free')}</Badge>}
          </div>

          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
            {L(course, 'title')}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-fg-muted">
            {L(course, 'summary')}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PlayCircle className="size-4" aria-hidden />
              {t('common.lessons', { count: total })}
            </span>
            <Rating value={course.rating} count={course.reviewsCount} />
          </div>

          <SmartImage
            src={course.thumbnail}
            alt=""
            ratio="16/9"
            priority
            wrapperClassName="mt-8 rounded-card border border-line"
          />

          {owned && total > 0 && (
            <div className="mt-6 rounded-card border border-line bg-surface p-5">
              <ProgressBar
                value={percent}
                label={t('course.progressLabel', { percent })}
                tone={percent === 100 ? 'success' : 'brand'}
              />
              <p className="mt-2 text-sm text-fg-muted">
                {t('player.lessonProgress', { completed: done, total })}
              </p>
            </div>
          )}

          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-fg">{t('course.aboutTitle')}</h2>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-fg-muted">
              {L(course, 'description')}
            </p>
          </section>

          {course.outcomes.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-extrabold text-fg">{t('course.outcomes')}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {LArr(course, 'outcomes').map((outcome) => (
                  <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success-text" aria-hidden />
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.requirements && course.requirements.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-extrabold text-fg">{t('course.requirements')}</h2>
              <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-relaxed text-fg-muted">
                {LArr(course, 'requirements').map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Curriculum ──────────────────────────────────── */}
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-fg">{t('course.curriculum')}</h2>
            <p className="mt-1.5 text-sm text-fg-muted">
              {t('course.curriculumSummary', {
                modules: course.modules.length,
                lessons: total,
                duration: course.duration,
              })}
            </p>

            <div className="mt-5 space-y-3">
              {course.modules.map((module, index) => (
                <details
                  key={module.id}
                  open={index === 0}
                  className="overflow-hidden rounded-card border border-line bg-surface"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none hover:bg-surface-2">
                    <span className="min-w-0">
                      <span className="block text-xs font-extrabold uppercase tracking-wide text-brand-text">
                        {t('player.moduleLabel', { number: index + 1 })}
                      </span>
                      <span className="mt-0.5 block text-sm font-extrabold text-fg">
                        {L(module, 'title')}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-fg-subtle">
                      {t('common.lessons', { count: module.lessons.length })}
                    </span>
                  </summary>

                  <ul className="border-t border-line">
                    {module.lessons.map((lesson) => {
                      const unlocked = owned || course.isFree || lesson.isPreview;
                      const playable = unlocked && Boolean(lesson.videoUrl);
                      return (
                        <li key={lesson.id} className="border-b border-line last:border-0">
                          <LessonRow
                            lesson={lesson}
                            title={L(lesson, 'title')}
                            unlocked={Boolean(unlocked)}
                            onPreview={
                              !owned && !course.isFree && lesson.isPreview && playable
                                ? () => setPreview(lesson)
                                : undefined
                            }
                            href={
                              owned || course.isFree
                                ? `/learn/${course.slug}/${lesson.id}`
                                : undefined
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          {/* ── Instructor ──────────────────────────────────── */}
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-fg">{t('course.instructor')}</h2>
            <div className="mt-4 flex gap-4 rounded-card border border-line bg-surface p-5">
              <Avatar src={course.instructor.avatar} alt="" size={64} />
              <div className="min-w-0">
                <p className="text-base font-extrabold text-fg">{L(course.instructor, 'name')}</p>
                <p className="text-sm text-fg-muted">{L(course.instructor, 'role')}</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {L(course.instructor, 'bio')}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Purchase panel ────────────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
              {owned ? (
                <p className="flex items-center gap-2 text-base font-extrabold text-success-text">
                  <CheckCircle2 className="size-5" aria-hidden />
                  {t('course.youOwnThis')}
                </p>
              ) : (
                <>
                  <p className="text-3xl font-extrabold text-fg">
                    {course.isFree ? t('common.free') : formatPrice(course.price, i18n.language)}
                  </p>
                  {!course.isFree && (
                    <p className="mt-1 text-sm text-fg-muted">{t('course.lifetimeAccess')}</p>
                  )}
                </>
              )}

              <div className="mt-5">{cta}</div>

              {!owned && !course.isFree && (
                <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-fg-subtle">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span>
                    {t('course.includesRefund')}{' '}
                    <Link to="/legal/refunds" className="font-bold text-brand-text underline">
                      {t('legal.refunds')}
                    </Link>
                  </span>
                </p>
              )}

              {!isSignedIn && !course.isFree && (
                <p className="mt-3 text-xs text-fg-subtle">{t('auth.guestNote')}</p>
              )}

              <ul className="mt-6 space-y-3 border-t border-line pt-5">
                {includes.map(({ Icon, label }) => (
                  <li key={label} className="flex gap-2.5 text-sm text-fg-muted">
                    <Icon className="mt-0.5 size-4 shrink-0 text-brand-text" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky mobile CTA — one treatment, not four. */}
      {!owned && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-3 backdrop-blur-xl safe-bottom lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-fg-muted">{L(course, 'title')}</p>
              <p className="text-lg font-extrabold leading-tight text-fg">
                {course.isFree ? t('common.free') : formatPrice(course.price, i18n.language)}
              </p>
            </div>
            <div className="w-40 shrink-0">{cta}</div>
          </div>
        </div>
      )}

      {/* Preview player */}
      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={preview ? L(preview, 'title') : ''}
        description={t('course.previewBadge')}
        size="xl"
      >
        {preview?.videoUrl && (
          <video
            key={preview.id}
            src={preview.videoUrl}
            poster={preview.posterUrl}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            className="aspect-video w-full rounded-control bg-black"
          >
            {(preview.captions ?? []).map((track) => (
              <track
                key={track.srcLang}
                kind="captions"
                src={track.src}
                srcLang={track.srcLang}
                label={track.label}
                default={track.default}
              />
            ))}
            {t('player.videoUnavailable')}
          </video>
        )}
      </Modal>
    </div>
  );
}

function LessonRow({
  lesson,
  title,
  unlocked,
  href,
  onPreview,
}: {
  lesson: Lesson;
  title: string;
  unlocked: boolean;
  href?: string;
  onPreview?: () => void;
}) {
  const { t } = useTranslation();

  const Icon = lesson.type === 'reading' ? FileText : PlayCircle;
  const body = (
    <>
      {unlocked ? (
        <Icon className="size-4 shrink-0 text-brand-text" aria-hidden />
      ) : (
        <Lock className="size-4 shrink-0 text-fg-subtle" aria-hidden />
      )}
      <span className={cn('min-w-0 flex-1 truncate text-sm', unlocked ? 'text-fg' : 'text-fg-subtle')}>
        {title}
      </span>
      {lesson.isPreview && !href && <Badge tone="success">{t('course.previewBadge')}</Badge>}
      <span className="shrink-0 text-xs font-semibold tabular-nums text-fg-subtle">
        {lesson.duration}
      </span>
    </>
  );

  const rowClass = 'flex w-full items-center gap-3 px-5 py-3.5 text-start transition-colors';

  if (href) {
    return (
      <Link to={href} className={cn(rowClass, 'hover:bg-surface-2')}>
        {body}
      </Link>
    );
  }
  if (onPreview) {
    return (
      <button type="button" onClick={onPreview} className={cn(rowClass, 'hover:bg-surface-2')}>
        {body}
      </button>
    );
  }
  // Locked: not a button, not a link. It communicates its state through the
  // padlock and the title attribute rather than baiting a click that does
  // nothing — which is what the old rows did.
  return (
    <div className={rowClass} title={t('course.lockedLesson')}>
      {body}
      <span className="sr-only">{t('course.lockedLesson')}</span>
    </div>
  );
}
