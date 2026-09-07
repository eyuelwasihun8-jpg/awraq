import type { ReactNode } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { useStore } from '../store/StoreProvider';
import { getCourse } from '../data/catalog';
import { ButtonLink } from './ui/Button';
import { EmptyState } from './ui/primitives';

/**
 * Route guards.
 *
 * The previous implementation was a `useEffect` in App.tsx that watched
 * `currentPage` and reset it to 'home' when the user wasn't signed in. Two
 * problems: it ran AFTER the protected page had already rendered (so private
 * data flashed on screen first), and it discarded where the user was trying to
 * go, dumping them on the homepage instead of returning them after sign-in.
 *
 * These guards render before the page and preserve the intended destination.
 *
 * SECURITY: still client-side only, and still not access control. The real
 * system must gate the media/download endpoints server-side. See AUDIT.md §C4.
 */

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isSignedIn } = useStore();
  const location = useLocation();

  if (!isSignedIn) {
    // `replace` so the back button doesn't bounce between guard and login.
    return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />;
  }
  return <>{children}</>;
}

/** Requires an entitlement for the course in the `:slug` param. */
export function RequireCourseAccess({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { slug = '' } = useParams();
  const { owns, isSignedIn } = useStore();
  const location = useLocation();

  const course = getCourse(slug);
  if (!course) return <Navigate to="/courses" replace />;

  // Free courses are open to everyone — no account needed. This is the single
  // best conversion decision in the product and it is preserved deliberately.
  if (course.isFree) return <>{children}</>;

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (!owns(course.id)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <EmptyState
          icon={<Lock className="size-8" />}
          title={t('errors.noAccessTitle')}
          description={t('errors.noAccessBody')}
          action={<ButtonLink to={`/courses/${course.slug}`}>{t('course.enroll')}</ButtonLink>}
        />
      </div>
    );
  }

  return <>{children}</>;
}
