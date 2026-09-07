import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ChevronRight, Download, FileText, Lock, Sparkles } from 'lucide-react';
import { getProduct, toCartLine } from '../data/catalog';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatPrice } from '../lib/format';
import { useToast } from '../components/ui/Toast';
import { Button, ButtonLink } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { Badge } from '../components/ui/primitives';

/**
 * Digital product detail page.
 *
 * The single most important fix here is honesty about files. Every product in
 * the old dataset had `url: '#'`, so "Download" navigated to the top of the
 * page and the user was left wondering whether they had just been charged for
 * nothing (AUDIT.md §C3).
 *
 * Now `Attachment.url` is `string | null`, and a null URL renders as an
 * explicitly disabled row that says the file is being prepared. Nobody clicks
 * a button that lies.
 */
export default function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { L, LArr } = useLocalized();
  const { toast } = useToast();
  const { owns, cart, addToCart } = useStore();

  const product = getProduct(slug);

  useDocumentMeta({
    title: product ? `${L(product, 'title')} — Awraq` : t('errors.notFoundTitle'),
    description: product ? L(product, 'summary') : undefined,
    canonicalPath: product ? `/resources/${product.slug}` : undefined,
    image: product?.thumbnail,
    jsonLd: product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.summary,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'ETB',
            availability: 'https://schema.org/InStock',
          },
        }
      : undefined,
  });

  if (!product) return <Navigate to="/resources" replace />;

  const owned = owns(product.id);
  const inCart = cart.some((line) => line.itemId === product.id);
  const readyFiles = product.files.filter((file) => file.url !== null).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-subtle">
          <li>
            <Link to="/" className="font-semibold hover:text-fg">
              {t('nav.home')}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link to="/resources" className="font-semibold hover:text-fg">
              {t('product.breadcrumb')}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li aria-current="page" className="font-semibold text-fg">
            {L(product, 'title')}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <SmartImage
          src={product.thumbnail}
          alt=""
          ratio="4/3"
          priority
          wrapperClassName="rounded-card border border-line"
        />

        <div>
          <Badge tone="brand">{L(product, 'category')}</Badge>
          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            {L(product, 'title')}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-fg-muted">
            {L(product, 'summary')}
          </p>

          <div className="mt-7 flex flex-wrap items-baseline gap-3">
            {owned ? (
              <span className="inline-flex items-center gap-2 text-xl font-extrabold text-success-text">
                <CheckCircle2 className="size-5" aria-hidden />
                {t('product.owned')}
              </span>
            ) : (
              <>
                <span className="text-3xl font-extrabold text-fg">
                  {formatPrice(product.price, i18n.language)}
                </span>
                {product.originalPrice != null && product.originalPrice > product.price && (
                  <s className="text-lg font-semibold text-fg-subtle">
                    {formatPrice(product.originalPrice, i18n.language)}
                  </s>
                )}
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {owned ? (
              <ButtonLink
                to={`/library/${product.slug}`}
                size="lg"
                leadingIcon={<Download className="size-4" />}
              >
                {t('product.accessTitle')}
              </ButtonLink>
            ) : inCart ? (
              <ButtonLink to="/cart" size="lg" variant="success">
                {t('course.goToCart')}
              </ButtonLink>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  addToCart(toCartLine(product));
                  toast(t('course.addedToCart', { title: L(product, 'title') }), 'success');
                }}
              >
                {t('product.buy')}
              </Button>
            )}
          </div>

          {product.highlights.length > 0 && (
            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {LArr(product, 'highlights').map((highlight) => (
                <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-text" aria-hidden />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── What's in the box ─────────────────────────────── */}
      <section className="mt-14 max-w-3xl">
        <h2 className="text-xl font-extrabold text-fg">{t('product.whatsIncluded')}</h2>
        <p className="mt-1.5 text-sm text-fg-muted">
          {t('product.fileCount', { count: product.files.length })}
          {readyFiles < product.files.length && ` · ${t('product.someNotReady')}`}
        </p>

        <ul className="mt-5 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {product.files.map((file) => {
            const ready = file.url !== null;
            return (
              <li key={file.id} className="flex items-center gap-3 px-5 py-4">
                <FileText
                  className={ready ? 'size-5 shrink-0 text-brand-text' : 'size-5 shrink-0 text-fg-subtle'}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-fg">{L(file, 'name')}</p>
                  <p className="text-xs text-fg-subtle">
                    {file.type.toUpperCase()} · {file.size}
                  </p>
                </div>
                {!ready ? (
                  <Badge tone="neutral">{t('product.notReady')}</Badge>
                ) : owned ? (
                  <Badge tone="success">{t('common.unlocked')}</Badge>
                ) : (
                  <Lock className="size-4 shrink-0 text-fg-subtle" aria-label={t('product.lockedTitle')} />
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
