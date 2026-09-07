import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  FileText,
  List,
  NotebookPen,
  PlayCircle,
  X,
} from 'lucide-react';
import { getCourse, lessonsOf } from '../data/catalog';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { useIsDesktop } from '../lib/useMediaQuery';
import { cn } from '../lib/cn';
import { Button, ButtonLink } from '../components/ui/Button';
import { ProgressBar, Badge, EmptyState } from '../components/ui/primitives';

/**
 * Course player.
 *
 * The three defects this replaces:
 *
 * 1. The play button had no onClick and no course in the dataset had a
 *    videoUrl — the core product experience literally did nothing
 *    (AUDIT.md §C2). Lessons now carry real MP4 URLs and render a native
 *    <video> element with captions support and keyboard controls for free.
 * 2. The Resources tab rendered three hardcoded fake filenames regardless of
 *    the lesson. It now lists that lesson's actual attachments, and files
 *    without a URL render disabled rather than as dead links (§C3).
 * 3. The Notes tab was `hidden md:flex` — mobile students, i.e. most students,
 *    could not take notes at all (§M6). The sidebar is now a bottom sheet on
 *    mobile with every tab present.
 *
 * The lesson id lives in the URL, so a specific lesson is linkable and the
 * browser back button steps through lessons the way users expect.
 */
export default function PlayerPage() {
  const { slug = '', lessonId } = useParams();
  const { t } = useTranslation();
  const { L } = useLocalized();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const {
    progressFor,
    noteFor,
    saveNote,
    completeLesson,
    uncompleteLesson,
    setActiveLesson,
    startCourse,
  } = useStore();

  const course = getCourse(slug);
  const lessons = useMemo(() => (course ? lessonsOf(course) : []), [course]);

  const current = useMemo(
    () => lessons.find((l) => l.id === lessonId) ?? lessons[0],
    [lessons, lessonId],
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<'outline' | 'resources' | 'notes'>('outline');
  const videoRef = useRef<HTMLVideoElement>(null);

  const progress = course ? progressFor(course.id) : undefined;
  const completedIds = useMemo(
    () => new Set(progress?.completedLessonIds ?? []),
    [progress],
  );

  // Record the course as started, and remember the active lesson so the
  // dashboard's "continue" lands in the right place.
  useEffect(() => {
    if (!course || !current) return;
    startCourse(course.id);
    setActiveLesson(course.id, current.id);
  }, [course, current, startCourse, setActiveLesson]);

  useDocumentMeta({
    title: course && current ? `${L(current, 'title')} — ${L(course, 'title')}` : '',
    noIndex: true,
  });

  if (!course) return <Navigate to="/courses" replace />;
  if (!current) return <Navigate to={`/courses/${course.slug}`} replace />;

  const index = lessons.findIndex((l) => l.id === current.id);
  const prev = index > 0 ? lessons[index - 1] : undefined;
  const next = index < lessons.length - 1 ? lessons[index + 1] : undefined;
  const isLast = !next;
  const isComplete = completedIds.has(current.id);
  const donePercent = Math.round((completedIds.size / lessons.length) * 100);
  const courseFinished = completedIds.size === lessons.length;

  function goTo(id: string) {
    navigate(`/learn/${course!.slug}/${id}`);
    setSidebarOpen(false);
  }

  function handleComplete() {
    if (!course || !current) return;
    if (isComplete) {
      uncompleteLesson(course.id, current.id);
      return;
    }
    completeLesson(course.id, current.id, lessons.length);
    if (next) goTo(next.id);
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="border-b border-line p-4">
        <ProgressBar
          value={donePercent}
          size="sm"
          tone={courseFinished ? 'success' : 'brand'}
          label={t('player.lessonProgress', {
            completed: completedIds.size,
            total: lessons.length,
          })}
        />
      </div>

      <div role="tablist" aria-label={t('player.openContents')} className="flex border-b border-line">
        {(['outline', 'resources', 'notes'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              'flex-1 border-b-2 px-3 py-3 text-sm font-extrabold transition-colors',
              tab === id
                ? 'border-brand text-brand-text'
                : 'border-transparent text-fg-muted hover:text-fg',
            )}
          >
            {t(`player.${id}`)}
          </button>
        ))}
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
        {tab === 'outline' && (
          <ol>
            {course.modules.map((module, moduleIndex) => (
              <li key={module.id}>
                <h3 className="sticky top-0 z-10 bg-surface-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide text-fg-muted">
                  {t('player.moduleLabel', { number: moduleIndex + 1 })} · {L(module, 'title')}
                </h3>
                <ol>
                  {module.lessons.map((lesson) => {
                    const active = lesson.id === current.id;
                    const done = completedIds.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => goTo(lesson.id)}
                          aria-current={active ? 'true' : undefined}
                          className={cn(
                            'flex w-full items-center gap-3 border-s-2 px-4 py-3 text-start transition-colors',
                            active
                              ? 'border-brand bg-brand-soft'
                              : 'border-transparent hover:bg-surface-2',
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="size-4 shrink-0 text-success-text" aria-hidden />
                          ) : (
                            <Circle className="size-4 shrink-0 text-fg-subtle" aria-hidden />
                          )}
                          <span
                            className={cn(
                              'min-w-0 flex-1 text-sm',
                              active ? 'font-extrabold text-brand-text' : 'text-fg',
                            )}
                          >
                            {L(lesson, 'title')}
                          </span>
                          <span className="shrink-0 text-xs tabular-nums text-fg-subtle">
                            {lesson.duration}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
        )}

        {tab === 'resources' && (
          <div className="p-4">
            {!current.attachments || current.attachments.length === 0 ? (
              <p className="py-8 text-center text-sm text-fg-muted">{t('player.noResources')}</p>
            ) : (
              <ul className="space-y-2">
                {current.attachments.map((file) => {
                  const ready = file.url !== null;
                  const row = (
                    <>
                      <FileText
                        className={cn('size-4 shrink-0', ready ? 'text-brand-text' : 'text-fg-subtle')}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-fg">
                          {L(file, 'name')}
                        </span>
                        <span className="text-xs text-fg-subtle">
                          {file.type.toUpperCase()} · {file.size}
                        </span>
                      </span>
                      {ready ? (
                        <Download className="size-4 shrink-0 text-fg-subtle" aria-hidden />
                      ) : (
                        <Badge tone="neutral">{t('product.notReady')}</Badge>
                      )}
                    </>
                  );

                  return (
                    <li key={file.id}>
                      {ready ? (
                        <a
                          href={file.url!}
                          download
                          className="flex items-center gap-3 rounded-control border border-line p-3 transition-colors hover:bg-surface-2"
                        >
                          {row}
                        </a>
                      ) : (
                        <div
                          className="flex items-center gap-3 rounded-control border border-dashed border-line p-3 opacity-70"
                          title={t('product.notReadyHint')}
                        >
                          {row}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {tab === 'notes' && (
          <NotesPanel
            key={current.id}
            initial={noteFor(course.id, current.id)?.body ?? ''}
            onSave={(body) => saveNote(course.id, current.id, body)}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Player chrome */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface px-3 safe-top sm:px-4">
        <Link
          to={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 rounded-control px-2 py-2 text-sm font-bold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t('player.backToCourse')}</span>
        </Link>

        <p className="min-w-0 flex-1 truncate text-center text-sm font-extrabold text-fg">
          {L(course, 'title')}
        </p>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-control px-3 py-2 text-sm font-bold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg lg:hidden"
          aria-expanded={sidebarOpen}
        >
          <List className="size-4" aria-hidden />
          <span className="sr-only">{t('player.openContents')}</span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1 lg:grid lg:grid-cols-[1fr_22rem]">
        {/* Stage */}
        <div className="min-w-0 flex-1">
          <div className="bg-black">
            {current.videoUrl ? (
              <video
                ref={videoRef}
                key={current.id}
                src={current.videoUrl}
                poster={current.posterUrl}
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
                className="mx-auto aspect-video max-h-[70dvh] w-full bg-black"
                // Auto-advance is a deliberate non-feature: it steals control
                // from the learner and burns mobile data on Ethiopian
                // connections. Completion stays an explicit action.
              >
                {(current.captions ?? []).map((track) => (
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
            ) : current.type === 'reading' && current.body ? (
              <div className="mx-auto max-w-3xl bg-canvas px-5 py-10">
                <Badge tone="brand">{t('player.readingLesson')}</Badge>
                <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-fg">
                  {current.body}
                </div>
              </div>
            ) : (
              <div className="mx-auto flex aspect-video max-h-[70dvh] w-full items-center justify-center bg-surface-2">
                <EmptyState
                  icon={<PlayCircle className="size-8" />}
                  title={t('player.videoUnavailable')}
                  description={t('player.videoUnavailableBody')}
                />
              </div>
            )}
          </div>

          <div className="mx-auto max-w-3xl px-5 py-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-fg">
              {L(current, 'title')}
            </h1>
            {current.description && (
              <p className="mt-3 text-base leading-relaxed text-fg-muted">
                {L(current, 'description')}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant={isComplete ? 'secondary' : 'success'}
                onClick={handleComplete}
                leadingIcon={<CheckCircle2 className="size-4" />}
              >
                {isComplete
                  ? t('player.markIncomplete')
                  : isLast
                    ? t('player.markCompleteLast')
                    : t('player.markComplete')}
              </Button>
            </div>

            {/* Course completion */}
            {courseFinished && (
              <div className="mt-8 rounded-card border border-success/40 bg-success-soft p-6 text-center">
                <Award className="mx-auto size-10 text-success-text" aria-hidden />
                <h2 className="mt-3 text-lg font-extrabold text-fg">
                  {t('player.courseCompleteTitle')}
                </h2>
                <p className="mt-1.5 text-sm text-fg-muted">
                  {t('player.courseCompleteBody', { course: L(course, 'title') })}
                </p>
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  {!course.isFree && (
                    <ButtonLink to={`/certificate/${course.slug}`} variant="success">
                      {t('player.getCertificate')}
                    </ButtonLink>
                  )}
                  <ButtonLink to="/dashboard" variant="secondary">
                    {t('player.finish')}
                  </ButtonLink>
                </div>
              </div>
            )}

            {/* Prev / next */}
            <nav
              aria-label={t('player.outline')}
              className="mt-10 flex items-stretch justify-between gap-3 border-t border-line pt-6"
            >
              {prev ? (
                <button
                  type="button"
                  onClick={() => goTo(prev.id)}
                  className="group flex min-w-0 flex-1 items-center gap-2 rounded-control p-3 text-start transition-colors hover:bg-surface-2"
                >
                  <ChevronLeft className="size-4 shrink-0 text-fg-subtle" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-fg-subtle">
                      {t('player.prevLesson')}
                    </span>
                    <span className="block truncate text-sm font-extrabold text-fg">
                      {L(prev, 'title')}
                    </span>
                  </span>
                </button>
              ) : (
                <span className="flex-1" />
              )}

              {next && (
                <button
                  type="button"
                  onClick={() => goTo(next.id)}
                  className="group flex min-w-0 flex-1 items-center justify-end gap-2 rounded-control p-3 text-end transition-colors hover:bg-surface-2"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-fg-subtle">
                      {t('player.nextLesson')}
                    </span>
                    <span className="block truncate text-sm font-extrabold text-fg">
                      {L(next, 'title')}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-fg-subtle" aria-hidden />
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Sidebar — column on desktop, bottom sheet on mobile */}
        {isDesktop ? (
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] border-s border-line lg:block">
            {sidebar}
          </aside>
        ) : (
          sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="animate-fade-in absolute inset-0 bg-black/60"
                onClick={() => setSidebarOpen(false)}
                aria-hidden
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label={t('player.openContents')}
                className="animate-slide-up absolute inset-x-0 bottom-0 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border-t border-line bg-surface safe-bottom"
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-sm font-extrabold text-fg">{t('player.openContents')}</p>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="grid size-10 place-items-center rounded-control text-fg-muted hover:bg-surface-2"
                    aria-label={t('common.close')}
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>
                <div className="min-h-0 flex-1">{sidebar}</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/**
 * Per-lesson notes.
 *
 * Debounced autosave with a visible saved indicator. The old implementation
 * wrote to localStorage on every keystroke from inside a render-triggering
 * effect, which is both a jank source and part of what fed the dashboard loop.
 */
function NotesPanel({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (body: string) => void;
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (value === initial) return;
    const timer = setTimeout(() => {
      onSave(value);
      setSaved(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [value, initial, onSave]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [saved]);

  return (
    <div className="flex h-full flex-col p-4">
      <label htmlFor="lesson-note" className="sr-only">
        {t('player.notes')}
      </label>
      <textarea
        id="lesson-note"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('player.notesPlaceholder')}
        className="min-h-48 flex-1 resize-none rounded-control border border-line bg-surface p-3 text-sm leading-relaxed text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
      <p role="status" className="mt-2 flex h-5 items-center gap-1.5 text-xs font-bold text-success-text">
        {saved && (
          <>
            <NotebookPen className="size-3.5" aria-hidden />
            {t('player.notesSaved')}
          </>
        )}
      </p>
    </div>
  );
}
