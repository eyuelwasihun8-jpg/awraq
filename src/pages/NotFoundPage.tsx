import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { ButtonLink } from '../components/ui/Button';

/**
 * 404.
 *
 * The old app had no notion of an unknown route — `currentPage` simply fell
 * through to the homepage, so a mistyped or dead link silently pretended to
 * work (AUDIT.md §M4). This page says what happened and offers two ways
 * forward.
 */
export default function NotFoundPage() {
  const { t } = useTranslation();

  useDocumentMeta({ title: t('errors.notFoundTitle'), noIndex: true });

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center sm:px-6">
      <div className="grid size-16 place-items-center rounded-full bg-brand-soft">
        <Compass className="size-8 text-brand-text" aria-hidden />
      </div>
      <p className="mt-6 text-5xl font-extrabold tabular-nums text-fg-subtle">404</p>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-fg">
        {t('errors.notFoundTitle')}
      </h1>
      <p className="mt-2 text-base text-fg-muted">{t('errors.notFoundBody')}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/" size="lg">
          {t('errors.goHome')}
        </ButtonLink>
        <ButtonLink to="/courses" size="lg" variant="secondary">
          {t('errors.browseCourses')}
        </ButtonLink>
      </div>
    </div>
  );
}
