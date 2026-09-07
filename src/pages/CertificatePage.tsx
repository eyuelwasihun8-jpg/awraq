import { useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, Copy, Printer, Share2 } from 'lucide-react';
import { getCourse } from '../data/catalog';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatDate } from '../lib/format';
import { useToast } from '../components/ui/Toast';
import { Button, ButtonLink } from '../components/ui/Button';
import { EmptyState } from '../components/ui/primitives';

/**
 * Certificate.
 *
 * Two fixes, both about credibility:
 *
 * 1. The Share and Download buttons had no onClick — three prominent controls
 *    that did nothing (AUDIT.md §H7). Print now uses the browser's own print
 *    pipeline (with a print stylesheet), Share uses the Web Share API with a
 *    clipboard fallback, and the verification link is copyable.
 * 2. `completionDate = new Date()` was recomputed on every visit, so the
 *    certificate showed a different date each time you opened it. The date now
 *    comes from `progress.completedAt`, written once when the last lesson was
 *    marked complete. A certificate whose date changes is worthless.
 *
 * The certificate id is derived deterministically from the course and user, so
 * it is stable and quotable.
 */
export default function CertificatePage() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();
  const { toast } = useToast();
  const { user, owns, progressFor } = useStore();
  const sheetRef = useRef<HTMLDivElement>(null);

  const course = getCourse(slug);

  useDocumentMeta({ title: t('certificate.title'), noIndex: true });

  if (!course) return <Navigate to="/dashboard" replace />;

  const progress = progressFor(course.id);
  const eligible = owns(course.id) && Boolean(progress?.completedAt);

  if (!eligible) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <EmptyState
          icon={<Award className="size-8" />}
          title={t('dashboard.emptyCertificates')}
          description={t('dashboard.emptyCertificatesBody')}
          action={
            <ButtonLink to={`/learn/${course.slug}`}>{t('course.continue')}</ButtonLink>
          }
        />
      </div>
    );
  }

  // Deterministic, human-quotable id. A real deployment issues this
  // server-side and stores it against the enrolment.
  const certificateId = `AWQ-${course.id.slice(0, 4).toUpperCase()}-${(user?.id ?? 'guest')
    .slice(-6)
    .toUpperCase()}`;
  const verifyUrl = `https://awraq.et/verify/${certificateId}`;
  const issued = formatDate(progress!.completedAt!, i18n.language);

  async function share() {
    const payload = {
      title: t('certificate.title'),
      text: `${user?.fullName} — ${L(course!, 'title')}`,
      url: verifyUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(verifyUrl);
      toast(t('certificate.linkCopied'), 'success');
    } catch {
      // AbortError when the user dismisses the share sheet — not an error.
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      toast(t('certificate.linkCopied'), 'success');
    } catch {
      toast(t('errors.genericTitle'), 'error');
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Controls — hidden when printing */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <ButtonLink to="/dashboard" variant="ghost">
          {t('certificate.backToDashboard')}
        </ButtonLink>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={copyLink} leadingIcon={<Copy className="size-4" />}>
            {t('certificate.copyLink')}
          </Button>
          <Button variant="secondary" onClick={share} leadingIcon={<Share2 className="size-4" />}>
            {t('certificate.share')}
          </Button>
          <Button onClick={() => window.print()} leadingIcon={<Printer className="size-4" />}>
            {t('certificate.print')}
          </Button>
        </div>
      </div>

      {/* The certificate itself */}
      <div
        ref={sheetRef}
        className="relative overflow-hidden rounded-card border-4 border-brand bg-white p-8 text-center text-slate-900 shadow-xl sm:p-14 print:border-2 print:shadow-none"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #0E0024 0 2px, transparent 2px 14px)',
          }}
        />

        <div className="relative">
          <Award className="mx-auto size-14 text-[#0E7490]" aria-hidden />
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.3em] text-slate-500">
            {t('certificate.title')}
          </p>

          <p className="mt-10 text-sm text-slate-500">{t('certificate.presentedTo')}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {user?.fullName}
          </p>

          <p className="mt-8 text-sm text-slate-500">{t('certificate.hasCompleted')}</p>
          <p className="mt-2 text-xl font-extrabold sm:text-2xl">{L(course, 'title')}</p>
          <p className="mt-1 text-sm text-slate-500">
            {course.duration} · {course.level}
          </p>

          <div className="mx-auto mt-12 grid max-w-lg gap-6 border-t border-slate-200 pt-8 text-sm sm:grid-cols-2">
            <div>
              <p className="font-extrabold">{t('certificate.signature')}</p>
              <p className="mt-1 text-xs text-slate-500">{t('certificate.issuedOn', { date: issued })}</p>
            </div>
            <div>
              <p className="font-mono text-xs font-extrabold">{certificateId}</p>
              <p className="mt-1 text-xs text-slate-500">{t('certificate.verifyAt')}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-fg-subtle print:hidden">
        {t('certificate.certificateId')}: <span className="font-mono">{certificateId}</span>
      </p>
    </div>
  );
}
