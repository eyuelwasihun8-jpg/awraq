import { useTranslation } from 'react-i18next';
import { CheckCircle2, Languages, MapPin, Target } from 'lucide-react';
import { INSTRUCTORS } from '../data/instructors';
import { allCourses, allProducts } from '../data/catalog';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { ButtonLink } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { SectionHeading } from '../components/ui/primitives';

/**
 * About.
 *
 * The old homepage had a two-paragraph "About" block that never mentioned who
 * teaches the courses, that the material is bilingual, or that payment works
 * with local methods — the three things a first-time Ethiopian visitor most
 * needs to know (AUDIT.md §M7). Those points now have a page.
 */
export default function AboutPage() {
  const { t } = useTranslation();
  const { L } = useLocalized();
  const instructor = INSTRUCTORS.lamlak;

  useDocumentMeta({
    title: t('about.metaTitle'),
    description: t('about.metaDescription'),
    canonicalPath: '/about',
  });

  const principles = [
    { Icon: Target, title: t('about.p1Title'), body: t('about.p1Body') },
    { Icon: Languages, title: t('about.p2Title'), body: t('about.p2Body') },
    { Icon: MapPin, title: t('about.p3Title'), body: t('about.p3Body') },
  ];

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand">
            {t('home.about.eyebrow')}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t('about.title')}
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            {t('about.lead')}
          </p>
        </header>

        {/* Instructor */}
        <section className="marketing-glass mt-14 rounded-3xl p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <SmartImage
              src={instructor.avatar}
              alt=""
              ratio="1/1"
              priority
              wrapperClassName="size-28 shrink-0 rounded-2xl"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-white">{L(instructor, 'name')}</h2>
              <p className="mt-1 text-sm font-bold text-brand">{L(instructor, 'role')}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">{L(instructor, 'bio')}</p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="mt-16">
          <SectionHeading onDark align="start" title={t('about.principlesTitle')} />
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {principles.map(({ Icon, title, body }) => (
              <li key={title} className="marketing-glass rounded-2xl p-6">
                <Icon className="size-7 text-brand" aria-hidden />
                <h3 className="mt-4 text-base font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* What you get */}
        <section className="mt-16">
          <SectionHeading onDark align="start" title={t('about.promiseTitle')} />
          <ul className="mt-6 space-y-3">
            {[
              t('about.promise1'),
              t('about.promise2'),
              t('about.promise3'),
              t('about.promise4'),
            ].map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-white/70">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-white/50">
            {t('about.catalogueNote', {
              courses: allCourses().length,
              resources: allProducts().length,
            })}
          </p>
        </section>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/courses" size="lg">
            {t('home.heroPrimaryCta')}
          </ButtonLink>
          <ButtonLink to="/contact" size="lg" variant="onDark">
            {t('nav.contact')}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
