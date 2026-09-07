import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ChevronRight, FileText, Layers, PlayCircle } from 'lucide-react';
import { bundleMembers, getBundle, lessonCount, toCartLine } from '../data/catalog';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatPrice } from '../lib/format';
import { useToast } from '../components/ui/Toast';
import { Button, ButtonLink } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { Badge } from '../components/ui/primitives';

/**
 * Bundle detail page.
 *
 * The saving is computed from the member items, never hand-typed. The old data
 * carried an `originalPrice` literal that had drifted out of sync with the
 * course prices, so the page advertised a discount that did not match the
 * arithmetic — the kind of error that costs you the sale AND the trust.
 */
export default function BundleDetailPage() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();
  const { toast } = useToast();
  const { owns, cart, addToCart } = useStore();

  const bundle = getBundle(slug);

  useDocumentMeta({
    title: bundle ? `${L(bundle, 'title')} — Awraq` : t('errors.notFoundTitle'),
    description: bundle ? L(bundle, 'summary') : undefined,
    canonicalPath: bundle ? `/bundles/${bundle.slug}` : undefined,
    image: bundle?.thumbnail,
  });

  if (!bundle) return <Navigate to="/courses" replace />;

  const { courses, products } = bundleMembers(bundle);
  const owned = owns(bundle.id);
  const inCart = cart.some((line) => line.itemId === bundle.id);
  const saving = bundle.originalPrice - bundle.price;
  const percent = Math.round((saving / bundle.originalPrice) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-subtle">
          <li>
            <Link to="/" className="font-semibold hover:text-fg">
              {t('nav.home')}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link to="/courses" className="font-semibold hover:text-fg">
              {t('bundle.breadcrumb')}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li aria-current="page" className="font-semibold text-fg">
            {L(bundle, 'title')}
          </li>
        </ol>
      </nav>

      <header className="grid gap-8 md:grid-cols-2 md:items-center">
        <SmartImage
          src={bundle.thumbnail}
          alt=""
          ratio="16/9"
          priority
          wrapperClassName="rounded-card border border-line"
        />
        <div>
          <Badge tone="warning" icon={<Layers className="size-3" />}>
            {t('common.savePercent', { percent })}
          </Badge>
          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            {L(bundle, 'title')}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-fg-muted">{L(bundle, 'summary')}</p>
        </div>
      </header>

      {/* Price breakdown — shown as arithmetic, not as a claim. */}
      <section className="mt-10 rounded-card border border-line bg-surface p-6">
        <dl className="space-y-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-fg-muted">{t('bundle.totalValue')}</dt>
            <dd className="text-sm font-semibold text-fg-subtle line-through">
              {formatPrice(bundle.originalPrice, i18n.language)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-bold text-success-text">
              {t('bundle.youSave', { amount: formatPrice(saving, i18n.language) })}
            </dt>
            <dd className="text-sm font-extrabold text-success-text">−{percent}%</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <dt className="text-base font-extrabold text-fg">{t('bundle.bundlePrice')}</dt>
            <dd className="text-3xl font-extrabold text-fg">
              {formatPrice(bundle.price, i18n.language)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          {owned ? (
            <ButtonLink to="/dashboard" size="lg" fullWidth variant="success">
              {t('bundle.owned')}
            </ButtonLink>
          ) : inCart ? (
            <ButtonLink to="/cart" size="lg" fullWidth variant="success">
              {t('course.goToCart')}
            </ButtonLink>
          ) : (
            <Button
              size="lg"
              fullWidth
              onClick={() => {
                addToCart(toCartLine(bundle));
                toast(t('course.addedToCart', { title: L(bundle, 'title') }), 'success');
              }}
            >
              {t('bundle.buy')}
            </Button>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-extrabold text-fg">{t('bundle.includes')}</h2>

        {courses.length > 0 && (
          <>
            <h3 className="mt-6 text-xs font-extrabold uppercase tracking-wide text-fg-muted">
              {t('bundle.coursesIncluded')}
            </h3>
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {courses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <SmartImage
                      src={course.thumbnail}
                      alt=""
                      ratio="16/9"
                      wrapperClassName="w-24 shrink-0 rounded-lg"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-fg">
                        {L(course, 'title')}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-subtle">
                        <PlayCircle className="size-3.5" aria-hidden />
                        {t('common.lessons', { count: lessonCount(course) })} · {course.duration}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-fg-subtle">
                      {formatPrice(course.price, i18n.language)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {products.length > 0 && (
          <>
            <h3 className="mt-8 text-xs font-extrabold uppercase tracking-wide text-fg-muted">
              {t('bundle.resourcesIncluded')}
            </h3>
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/resources/${product.slug}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <FileText className="size-5 shrink-0 text-brand-text" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-fg">
                        {L(product, 'title')}
                      </span>
                      <span className="mt-0.5 block text-xs text-fg-subtle">
                        {t('product.fileCount', { count: product.files.length })}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-fg-subtle">
                      {formatPrice(product.price, i18n.language)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-6 flex items-center gap-2 text-sm text-fg-muted">
          <CheckCircle2 className="size-4 shrink-0 text-success-text" aria-hidden />
          {t('course.includesLifetime')}
        </p>
      </section>
    </div>
  );
}
