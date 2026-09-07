import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, PlayCircle, Sparkles } from 'lucide-react';
import { FREE_SESSIONS } from '../data/sessions';
import { allCourses } from '../data/catalog';
import { INSTRUCTORS } from '../data/instructors';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatCount } from '../lib/format';
import { CourseCard } from '../components/CatalogCards';
import { ButtonLink } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { SmartImage } from '../components/ui/SmartImage';
import { Badge, SectionHeading } from '../components/ui/primitives';
import type { FreeSession } from '../types';

/**
 * Free sessions.
 *
 * `data/sessions.ts` existed in the old codebase and was imported by nothing —
 * three fully-written recorded sessions with real YouTube ids sitting unused
 * while the homepage's "Free Sessions" nav item scrolled to the wrong element
 * (AUDIT.md §H9, §M2). This page gives them a home.
 *
 * The YouTube iframe is only mounted after the user clicks. Embedding three
 * iframes on load costs roughly 900 kB of third-party JavaScript and sets
 * tracking cookies before consent — on a page whose entire job is to be a
 * frictionless first impression.
 */
export default function FreeSessionsPage() {
  const { t, i18n } = useTranslation();
  const { L, LArr } = useLocalized();
  const [playing, setPlaying] = useState<FreeSession | null>(null);

  const freeCourses = allCourses().filter((c) => c.isFree);

  useDocumentMeta({
    title: t('free.metaTitle'),
    description: t('free.metaDescription'),
    canonicalPath: '/free',
  });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <Badge tone="onDark" icon={<Sparkles className="size-3.5" />}>
            {t('common.free')}
          </Badge>
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t('free.title')}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            {t('free.lead')}
          </p>
        </header>

        {/* Recorded sessions */}
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FREE_SESSIONS.map((session) => (
            <li key={session.id} id={session.slug} className="marketing-glass overflow-hidden rounded-card scroll-mt-24">
              <button
                type="button"
                onClick={() => setPlaying(session)}
                className="group relative block w-full text-start"
                aria-label={`${t('free.watch')}: ${L(session, 'title')}`}
              >
                <SmartImage src={session.thumbnail} alt="" ratio="16/9" />
                <span className="absolute inset-0 grid place-items-center bg-black/45 transition-colors group-hover:bg-black/25">
                  <PlayCircle className="size-16 text-white drop-shadow-lg transition-transform group-hover:scale-110" aria-hidden />
                </span>
                <span className="absolute end-3 top-3">
                  <Badge tone="onDark" icon={<Clock className="size-3" />}>
                    {session.duration}
                  </Badge>
                </span>
              </button>

              <div className="p-5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-brand">
                  {L(session, 'category')}
                </p>
                <h2 className="mt-1.5 text-base font-extrabold text-white">
                  {L(session, 'title')}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {L(session, 'description')}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                  {LArr(session, 'takeaways').map((takeaway) => (
                    <li key={takeaway} className="flex gap-2 text-xs leading-relaxed text-white/70">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand" aria-hidden />
                      {takeaway}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-white/40">
                  {t('free.watchCount', { count: session.watchCount, formatted: formatCount(session.watchCount, i18n.language) })}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Free courses */}
        {freeCourses.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-16">
            <SectionHeading
              onDark
              align="start"
              title={t('free.coursesTitle')}
              description={t('free.coursesLead')}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {freeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Next step */}
        <section className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{t('free.nextTitle')}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
            {t('free.nextBody', { name: INSTRUCTORS.lamlak.name })}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/courses" size="lg">
              {t('home.heroPrimaryCta')}
            </ButtonLink>
            <ButtonLink to="/consultation" size="lg" variant="onDark">
              {t('nav.bookConsultation')}
            </ButtonLink>
          </div>
        </section>
      </div>

      <Modal
        open={playing !== null}
        onClose={() => setPlaying(null)}
        title={playing ? L(playing, 'title') : ''}
        size="xl"
      >
        {playing && (
          <iframe
            // youtube-nocookie: no tracking cookie until the user chooses to play.
            src={`https://www.youtube-nocookie.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
            title={L(playing, 'title')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-control border-0 bg-black"
          />
        )}
      </Modal>
    </div>
  );
}
