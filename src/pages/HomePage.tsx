import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatCount } from '../lib/format';
import { allBundles, allCourses, allProducts } from '../data/catalog';
import { FREE_SESSIONS } from '../data/sessions';
import { FAQ_ITEMS } from '../data/faq';
import { TESTIMONIALS } from '../data/testimonials';
import { INSTRUCTORS } from '../data/instructors';
import { BundleCard, CourseCard, ProductCard } from '../components/CatalogCards';
import { ButtonLink } from '../components/ui/Button';
import { Badge, SectionHeading } from '../components/ui/primitives';
import { Avatar, SmartImage } from '../components/ui/SmartImage';
import {
  Analytics3DIcon,
  Copywriting3DIcon,
  Email3DIcon,
  SEO3DIcon,
  Social3DIcon,
  Strategy3DIcon,
} from '../components/ThreeDIcons';

/**
 * Homepage.
 *
 * The audit's verdict was that the homepage was the one designed surface, so
 * the visual language is preserved: dark brand field, oversized type, the
 * custom 3D icon set, the pressable button treatment.
 *
 * What changed is everything underneath it:
 *
 * - Every string goes through `t()`. The old HomePage had zero t() calls, so
 *   switching to Amharic changed the nav and nothing else (AUDIT.md §H1).
 * - The stats are real counts derived from the catalogue, not "5,000+ students"
 *   next to a "300+" a screen away (§H6).
 * - Testimonials render only if the array is non-empty, and the array now holds
 *   attributed quotes instead of two identical "Client Name" placeholders (§H6).
 * - The catalogue sections show a curated slice and link to the real catalogue
 *   pages, instead of dumping the entire dataset into an unfilterable grid with
 *   no pagination (§H10).
 * - The contact form moved to /contact, where it has real validation and real
 *   submit feedback. It used to be a `preventDefault()` with no handler (§H8).
 */

const SKILLS = [
  { key: 'strategy', Icon: Strategy3DIcon },
  { key: 'copywriting', Icon: Copywriting3DIcon },
  { key: 'seo', Icon: SEO3DIcon },
  { key: 'social', Icon: Social3DIcon },
  { key: 'email', Icon: Email3DIcon },
  { key: 'analytics', Icon: Analytics3DIcon },
] as const;

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();

  const courses = useMemo(() => allCourses(), []);
  const products = useMemo(() => allProducts(), []);
  const bundles = useMemo(() => allBundles(), []);

  const freeCourses = useMemo(() => courses.filter((c) => c.isFree), [courses]);
  const paidCourses = useMemo(() => courses.filter((c) => !c.isFree), [courses]);

  // Derived, not invented. If the catalogue grows, the number grows with it.
  const catalogueSize = courses.length + products.length;

  useDocumentMeta({
    title: t('home.metaTitle'),
    description: t('home.metaDescription'),
    canonicalPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Awraq',
      url: 'https://awraq.et/',
      description: t('home.metaDescription'),
      areaServed: 'ET',
      availableLanguage: ['am', 'en'],
    },
  });

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Decorative field. aria-hidden and pointer-events-none so it never
            intercepts a click or gets announced. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 start-1/4 size-[38rem] rounded-full bg-gold/15 blur-[140px]" />
          <div className="absolute -bottom-52 end-0 size-[32rem] rounded-full bg-ink-raised blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Badge tone="onDark" icon={<Sparkles className="size-3.5" />}>
                {t('home.eyebrow')}
              </Badge>

              <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t('home.heroTitle')}{' '}
                <span className="text-brand">{t('home.heroTitleAccent')}</span>
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                {t('home.heroBody')}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/courses" size="lg" trailingIcon={<ArrowRight className="size-4" />}>
                  {t('home.heroPrimaryCta')}
                </ButtonLink>
                <ButtonLink
                  to="/free"
                  size="lg"
                  variant="onDark"
                  leadingIcon={<PlayCircle className="size-4" />}
                >
                  {t('home.heroSecondaryCta')}
                </ButtonLink>
              </div>

              <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/50">
                <ShieldCheck className="size-4 shrink-0" aria-hidden />
                {t('home.heroNote')}
              </p>
            </div>

            {/* Instructor panel. The old hero showed a stock photo of a
                Western office; the person actually teaching the courses is a
                stronger trust signal than any stock image (§M7). */}
            <div className="relative">
              <div className="marketing-glass rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <SmartImage
                    src={INSTRUCTORS.lamlak.avatar}
                    alt=""
                    ratio="1/1"
                    priority
                    wrapperClassName="size-16 shrink-0 rounded-full sm:size-20"
                    className="rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="text-lg font-extrabold text-white">{INSTRUCTORS.lamlak.name}</p>
                    <p className="text-sm text-white/60">{L(INSTRUCTORS.lamlak, 'role')}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/70">
                  {L(INSTRUCTORS.lamlak, 'bio')}
                </p>

                <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {[
                    { value: formatCount(catalogueSize, i18n.language), label: t('home.stats.courses') },
                    { value: `${INSTRUCTORS.lamlak.yearsExperience}+`, label: t('home.stats.experience') },
                    { value: '2', label: t('home.stats.languages') },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <span className="block text-2xl font-extrabold text-brand">{stat.value}</span>
                        <span className="mt-0.5 block text-xs font-semibold text-white/50">
                          {stat.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three ways to learn ────────────────────────────── */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            onDark
            title={t('home.ways.title')}
            description={t('home.ways.description')}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                to: '/courses',
                title: t('home.ways.selfPaced'),
                body: t('home.ways.selfPacedBody'),
                cta: t('home.ways.selfPacedCta'),
                Icon: Strategy3DIcon,
              },
              {
                to: '/free',
                title: t('home.ways.sessions'),
                body: t('home.ways.sessionsBody'),
                cta: t('home.ways.sessionsCta'),
                Icon: Social3DIcon,
              },
              {
                to: '/consultation',
                title: t('home.ways.coaching'),
                body: t('home.ways.coachingBody'),
                cta: t('home.ways.coachingCta'),
                Icon: Analytics3DIcon,
              },
            ].map(({ to, title, body, cta, Icon }) => (
              <Link
                key={to}
                to={to}
                className="marketing-glass group flex flex-col rounded-2xl p-7 transition-colors hover:bg-white/10"
              >
                <Icon size={64} />
                <h3 className="mt-5 text-lg font-extrabold text-white">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand">
                  {cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────── */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            onDark
            title={t('home.skills.title')}
            description={t('home.skills.description')}
          />
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {SKILLS.map(({ key, Icon }) => (
              <li
                key={key}
                className="marketing-glass flex flex-col items-center gap-3 rounded-2xl px-4 py-6 text-center"
              >
                <Icon size={56} />
                <span className="text-sm font-extrabold text-white">{t(`home.skills.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Start free ─────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-ink-deep py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            onDark
            align="start"
            eyebrow={t('common.free')}
            title={t('home.freeSection.title')}
            description={t('home.freeSection.description')}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freeCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {FREE_SESSIONS.slice(0, 1).map((session) => (
              <Link
                key={session.id}
                to={`/free#${session.slug}`}
                className="marketing-glass group flex flex-col overflow-hidden rounded-card"
              >
                <div className="relative">
                  <SmartImage src={session.thumbnail} alt="" ratio="16/9" />
                  <span className="absolute inset-0 grid place-items-center bg-black/40 transition-colors group-hover:bg-black/25">
                    <PlayCircle className="size-14 text-white drop-shadow-lg" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-brand">
                    {t('home.freeSection.recordedSession')}
                  </p>
                  <h3 className="mt-1.5 text-base font-extrabold text-white">
                    {L(session, 'title')}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-white/60">
                    {L(session, 'description')}
                  </p>
                  <span className="mt-4 text-sm font-extrabold text-brand group-hover:underline">
                    {t('home.freeSection.watchAll', { count: FREE_SESSIONS.length })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses ────────────────────────────────────────── */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              onDark
              align="start"
              title={t('home.coursesSection.title')}
              description={t('home.coursesSection.description')}
              className="max-w-xl"
            />
            <ButtonLink
              to="/courses"
              variant="onDark"
              trailingIcon={<ArrowRight className="size-4" />}
            >
              {t('common.viewAll')}
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paidCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bundles ────────────────────────────────────────── */}
      {bundles.length > 0 && (
        <section className="border-t border-white/10 bg-ink-deep py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              onDark
              title={t('home.bundlesSection.title')}
              description={t('home.bundlesSection.description')}
            />
            <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
              {bundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Resources ──────────────────────────────────────── */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              onDark
              align="start"
              title={t('home.resourcesSection.title')}
              description={t('home.resourcesSection.description')}
              className="max-w-xl"
            />
            <ButtonLink
              to="/resources"
              variant="onDark"
              trailingIcon={<ArrowRight className="size-4" />}
            >
              {t('common.viewAll')}
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — only when we actually have them ─── */}
      {TESTIMONIALS.length > 0 && (
        <section className="border-t border-white/10 bg-ink-deep py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading onDark title={t('home.testimonials.title')} />
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <li key={item.id} className="marketing-glass rounded-2xl p-7">
                  <figure className="flex h-full flex-col">
                    <blockquote className="flex-1 text-sm leading-relaxed text-white/80">
                      “{L(item, 'quote')}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                      <Avatar src={item.avatarUrl} alt="" size={44} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-white">{item.author}</p>
                        <p className="truncate text-xs text-white/50">{L(item, 'role')}</p>
                      </div>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            onDark
            title={t('home.faq.title')}
            description={t('home.faq.description')}
          />
          <div className="mt-10 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <FaqRow key={item.id} question={L(item, 'question')} answer={L(item, 'answer')} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t('home.finalCta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/60">
            {t('home.finalCta.body')}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/free" size="lg" trailingIcon={<ArrowRight className="size-4" />}>
              {t('home.finalCta.primary')}
            </ButtonLink>
            <ButtonLink
              to="/consultation"
              size="lg"
              variant="onDark"
              leadingIcon={<CalendarCheck className="size-4" />}
            >
              {t('home.finalCta.secondary')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * FAQ row.
 *
 * Native <details>/<summary>: keyboard-operable, screen-reader-announced and
 * findable by the browser's in-page search, for zero JS. The old accordion was
 * a `<div onClick>` with the answer removed from the DOM entirely.
 */
function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="marketing-glass group rounded-2xl px-5 open:bg-white/10"
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-start text-base font-extrabold text-white marker:content-none">
        {question}
        <ChevronDown
          className={`size-5 shrink-0 text-brand transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </summary>
      <p className="pb-5 text-sm leading-relaxed text-white/70">{answer}</p>
    </details>
  );
}
