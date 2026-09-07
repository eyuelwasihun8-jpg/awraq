import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Award,
  BookOpen,
  FileText,
  NotebookPen,
  Receipt,
  Search,
  Trash2,
} from 'lucide-react';
import { useStore } from '../store/StoreProvider';
import { getCourse, getItem, getProduct, lessonCount, lessonsOf } from '../data/catalog';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatDate, formatPrice } from '../lib/format';
import { cn } from '../lib/cn';
import { useToast } from '../components/ui/Toast';
import { ButtonLink } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { Badge, EmptyState, ProgressBar } from '../components/ui/primitives';

/**
 * Student dashboard.
 *
 * This page contained the app's one hard crash: an effect that depended on a
 * `myCourses` array rebuilt on every render and then called `setAllNotes`
 * inside itself, producing "Maximum update depth exceeded" after ~200 passes
 * (AUDIT.md §C1).
 *
 * The fix is not a `useMemo` band-aid on the old effect — it is that there is
 * no effect. Notes already live in the store. Deriving a view of them during
 * render is correct, cheap and cannot loop. An effect that only computes state
 * from other state is always a bug.
 *
 * Tab state is in the URL hash-free `useState` here deliberately: unlike the
 * catalogue filters, which people share, dashboard tabs are private and
 * ephemeral.
 */

type Tab = 'courses' | 'resources' | 'certificates' | 'notes' | 'orders';

const TABS: { id: Tab; icon: typeof BookOpen }[] = [
  { id: 'courses', icon: BookOpen },
  { id: 'resources', icon: FileText },
  { id: 'certificates', icon: Award },
  { id: 'notes', icon: NotebookPen },
  { id: 'orders', icon: Receipt },
];

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();
  const { toast } = useToast();
  const { user, entitlements, orders, notes, progress, deleteNote } = useStore();

  const [tab, setTab] = useState<Tab>('courses');
  const [noteQuery, setNoteQuery] = useState('');

  useDocumentMeta({ title: t('dashboard.title'), noIndex: true });

  // ── Derived data. All plain render-time computation. ──────
  const myCourses = useMemo(
    () =>
      entitlements
        .filter((e) => e.kind === 'course')
        .map((e) => getCourse(e.itemId))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [entitlements],
  );

  const myProducts = useMemo(
    () =>
      entitlements
        .filter((e) => e.kind === 'product')
        .map((e) => getProduct(e.itemId))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [entitlements],
  );

  const courseStats = useMemo(
    () =>
      myCourses.map((course) => {
        const total = lessonCount(course);
        const done = progress[course.id]?.completedLessonIds.length ?? 0;
        return {
          course,
          total,
          done,
          percent: total > 0 ? Math.round((done / total) * 100) : 0,
          resumeId: progress[course.id]?.lastLessonId ?? lessonsOf(course)[0]?.id,
        };
      }),
    [myCourses, progress],
  );

  const completed = courseStats.filter((s) => s.percent === 100);
  const inProgress = courseStats.filter((s) => s.percent > 0 && s.percent < 100);
  const resume = inProgress.sort((a, b) => b.percent - a.percent)[0];

  // Notes joined to their course/lesson titles at render time — no effect,
  // no duplicated state, no loop.
  const noteRows = useMemo(() => {
    const needle = noteQuery.trim().toLowerCase();
    return notes
      .map((note) => {
        const course = getCourse(note.courseId);
        const lesson = course ? lessonsOf(course).find((l) => l.id === note.lessonId) : undefined;
        return { note, course, lesson };
      })
      .filter((row) => row.course && row.lesson)
      .filter((row) =>
        needle
          ? [row.note.body, row.course?.title, row.lesson?.title]
              .filter(Boolean)
              .some((field) => (field as string).toLowerCase().includes(needle))
          : true,
      )
      .sort((a, b) => b.note.updatedAt - a.note.updatedAt);
  }, [notes, noteQuery]);

  const stats = [
    { label: t('dashboard.stats.inProgress'), value: inProgress.length },
    { label: t('dashboard.stats.completed'), value: completed.length },
    { label: t('dashboard.stats.resources'), value: myProducts.length },
    { label: t('dashboard.stats.certificates'), value: completed.length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-fg">{t('dashboard.title')}</h1>
        <p className="mt-2 text-base text-fg-muted">
          {courseStats.length > 0
            ? t('dashboard.greeting', { name: user?.fullName ?? '' })
            : t('dashboard.greetingNew', { name: user?.fullName ?? '' })}
        </p>
      </header>

      {/* Resume card — the highest-value thing on this page, so it is first
          and it is one click. */}
      {resume && (
        <section className="mt-8 overflow-hidden rounded-card border border-line bg-surface">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <SmartImage
              src={resume.course.thumbnail}
              alt=""
              ratio="16/9"
              wrapperClassName="w-full shrink-0 rounded-control sm:w-56"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand-text">
                {t('dashboard.continueLearning')}
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-fg">{L(resume.course, 'title')}</h2>
              <div className="mt-3 max-w-md">
                <ProgressBar
                  value={resume.percent}
                  label={t('course.progressLabel', { percent: resume.percent })}
                  size="sm"
                />
                <p className="mt-1.5 text-xs text-fg-subtle">
                  {t('player.lessonProgress', { completed: resume.done, total: resume.total })}
                </p>
              </div>
            </div>
            <ButtonLink
              to={`/learn/${resume.course.slug}${resume.resumeId ? `/${resume.resumeId}` : ''}`}
              size="lg"
              className="shrink-0"
            >
              {t('course.continue')}
            </ButtonLink>
          </div>
        </section>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-card border border-line bg-surface p-5">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-fg-muted">
              {stat.label}
            </dt>
            <dd className="mt-1 text-3xl font-extrabold tabular-nums text-fg">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {/* ── Tabs. Real ARIA tablist with roving focus. ──────── */}
      <div className="mt-10 border-b border-line">
        <div role="tablist" aria-label={t('dashboard.title')} className="hide-scrollbar -mb-px flex gap-1 overflow-x-auto">
          {TABS.map(({ id, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={active}
                aria-controls={`panel-${id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={(e) => {
                  const index = TABS.findIndex((x) => x.id === tab);
                  if (e.key === 'ArrowRight') setTab(TABS[(index + 1) % TABS.length].id);
                  if (e.key === 'ArrowLeft') setTab(TABS[(index - 1 + TABS.length) % TABS.length].id);
                }}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-extrabold transition-colors',
                  active
                    ? 'border-brand text-brand-text'
                    : 'border-transparent text-fg-muted hover:text-fg',
                )}
              >
                <Icon className="size-4" aria-hidden />
                {t(`dashboard.tabs.${id}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="mt-8 outline-none">
        {/* Courses */}
        {tab === 'courses' &&
          (courseStats.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="size-8" />}
              title={t('dashboard.emptyCourses')}
              description={t('dashboard.emptyCoursesBody')}
              action={<ButtonLink to="/courses">{t('cart.browse')}</ButtonLink>}
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courseStats.map(({ course, percent, done, total, resumeId }) => (
                <li
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-card border border-line bg-surface"
                >
                  <SmartImage src={course.thumbnail} alt="" ratio="16/9" />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-sm font-extrabold text-fg">{L(course, 'title')}</h3>
                    <div className="mt-3">
                      <ProgressBar
                        value={percent}
                        size="sm"
                        tone={percent === 100 ? 'success' : 'brand'}
                        label={t('course.progressLabel', { percent })}
                      />
                      <p className="mt-1.5 text-xs text-fg-subtle">
                        {t('player.lessonProgress', { completed: done, total })}
                      </p>
                    </div>
                    <div className="mt-auto flex gap-2 pt-4">
                      <ButtonLink
                        to={`/learn/${course.slug}${resumeId ? `/${resumeId}` : ''}`}
                        size="sm"
                        className="flex-1"
                      >
                        {percent === 100 ? t('course.review') : t('course.continue')}
                      </ButtonLink>
                      {percent === 100 && !course.isFree && (
                        <ButtonLink to={`/certificate/${course.slug}`} size="sm" variant="secondary">
                          <Award className="size-4" aria-hidden />
                          <span className="sr-only">{t('dashboard.viewCertificate')}</span>
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ))}

        {/* Resources */}
        {tab === 'resources' &&
          (myProducts.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-8" />}
              title={t('dashboard.emptyResources')}
              description={t('dashboard.emptyResourcesBody')}
              action={<ButtonLink to="/resources">{t('cart.browse')}</ButtonLink>}
            />
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {myProducts.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/library/${product.slug}`}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-2"
                  >
                    <SmartImage
                      src={product.thumbnail}
                      alt=""
                      ratio="4/3"
                      wrapperClassName="w-20 shrink-0 rounded-lg"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-fg">
                        {L(product, 'title')}
                      </span>
                      <span className="mt-0.5 block text-xs text-fg-subtle">
                        {t('product.fileCount', { count: product.files.length })}
                      </span>
                    </span>
                    <Badge tone="success">{t('common.unlocked')}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ))}

        {/* Certificates */}
        {tab === 'certificates' &&
          (completed.filter((s) => !s.course.isFree).length === 0 ? (
            <EmptyState
              icon={<Award className="size-8" />}
              title={t('dashboard.emptyCertificates')}
              description={t('dashboard.emptyCertificatesBody')}
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {completed
                .filter((s) => !s.course.isFree)
                .map(({ course }) => (
                  <li
                    key={course.id}
                    className="rounded-card border border-line bg-surface p-5 text-center"
                  >
                    <Award className="mx-auto size-10 text-brand-text" aria-hidden />
                    <h3 className="mt-3 text-sm font-extrabold text-fg">{L(course, 'title')}</h3>
                    <p className="mt-1 text-xs text-fg-subtle">
                      {progress[course.id]?.completedAt
                        ? formatDate(progress[course.id].completedAt!, i18n.language)
                        : ''}
                    </p>
                    <ButtonLink
                      to={`/certificate/${course.slug}`}
                      size="sm"
                      variant="secondary"
                      fullWidth
                      className="mt-4"
                    >
                      {t('dashboard.viewCertificate')}
                    </ButtonLink>
                  </li>
                ))}
            </ul>
          ))}

        {/* Notes */}
        {tab === 'notes' && (
          <>
            {notes.length > 0 && (
              <div className="relative mb-6 max-w-sm">
                <label htmlFor="note-search" className="sr-only">
                  {t('dashboard.searchNotes')}
                </label>
                <Search
                  className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
                  aria-hidden
                />
                <input
                  id="note-search"
                  type="search"
                  value={noteQuery}
                  onChange={(e) => setNoteQuery(e.target.value)}
                  placeholder={t('dashboard.searchNotes')}
                  className="h-11 w-full rounded-control border border-line bg-surface ps-9 pe-4 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            )}

            {noteRows.length === 0 ? (
              <EmptyState
                icon={<NotebookPen className="size-8" />}
                title={t('dashboard.emptyNotes')}
                description={t('dashboard.emptyNotesBody')}
              />
            ) : (
              <ul className="space-y-4">
                {noteRows.map(({ note, course, lesson }) => (
                  <li
                    key={`${note.courseId}-${note.lessonId}`}
                    className="rounded-card border border-line bg-surface p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs font-bold text-fg-muted">
                        {t('dashboard.noteFrom', {
                          course: L(course!, 'title'),
                          lesson: L(lesson!, 'title'),
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          deleteNote(note.courseId, note.lessonId);
                          toast(t('dashboard.noteDeleted'), 'info');
                        }}
                        className="grid size-9 shrink-0 place-items-center rounded-control text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger-text"
                        aria-label={t('dashboard.deleteNote')}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg">
                      {note.body}
                    </p>
                    <Link
                      to={`/learn/${course!.slug}/${note.lessonId}`}
                      className="mt-3 inline-block text-sm font-bold text-brand-text underline"
                    >
                      {t('dashboard.openLesson')}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Orders */}
        {tab === 'orders' &&
          (orders.length === 0 ? (
            <EmptyState icon={<Receipt className="size-8" />} title={t('dashboard.emptyOrders')} />
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="rounded-card border border-line bg-surface p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="font-mono text-sm font-extrabold text-fg">{order.id}</p>
                    <p className="text-sm text-fg-muted">
                      {formatDate(order.placedAt, i18n.language)}
                    </p>
                  </div>
                  <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                    {order.lines.map((line) => (
                      <li
                        key={line.itemId}
                        className="flex items-baseline justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 truncate text-fg-muted">
                          {L(line, 'title')}
                          {line.pricePaid === 0 && (
                            <span className="ms-2 text-xs text-fg-subtle">
                              ({t('dashboard.includedInBundle')})
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 font-semibold text-fg">
                          {line.pricePaid === 0
                            ? '—'
                            : formatPrice(line.pricePaid, i18n.language)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                    <span className="text-sm font-extrabold text-fg">
                      {t('dashboard.orderTotal')}
                    </span>
                    <span className="text-lg font-extrabold text-fg">
                      {formatPrice(order.total, i18n.language)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ))}
      </div>

      {/* Recommendations — only items the learner does not already own. */}
      <Recommendations ownedIds={entitlements.map((e) => e.itemId)} />
    </div>
  );
}

function Recommendations({ ownedIds }: { ownedIds: string[] }) {
  const { t } = useTranslation();
  const { L } = useLocalized();

  // A stable primitive key: the array identity changes on every render, the
  // joined string only changes when the entitlements actually change.
  const ownedKey = ownedIds.join(',');

  const suggestions = useMemo(() => {
    if (!ownedKey) return [];
    const owned = new Set(ownedKey.split(','));
    return ['masterclass', 'seo-course', 'social-course']
      .map(getItem)
      .filter((item): item is NonNullable<typeof item> => item !== undefined && !owned.has(item.id))
      .slice(0, 3);
  }, [ownedKey]);

  if (suggestions.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="text-xl font-extrabold text-fg">{t('dashboard.recommended')}</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {suggestions.map((item) => (
          <li key={item.id}>
            <Link
              to={item.kind === 'course' ? `/courses/${item.slug}` : `/resources/${item.slug}`}
              className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:bg-surface-2"
            >
              <SmartImage
                src={item.thumbnail}
                alt=""
                ratio="16/9"
                wrapperClassName="w-20 shrink-0 rounded-lg"
              />
              <span className="min-w-0 truncate text-sm font-extrabold text-fg">
                {L(item, 'title')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
