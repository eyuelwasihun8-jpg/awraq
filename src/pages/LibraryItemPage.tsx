import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, FileText, Lock } from 'lucide-react';
import { getProduct } from '../data/catalog';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatDate } from '../lib/format';
import { ButtonLink } from '../components/ui/Button';
import { Badge, EmptyState } from '../components/ui/primitives';

/**
 * Purchased-resource download page.
 *
 * The old version printed the purchase date as a raw ISO string
 * ("2025-03-14T09:22:11.482Z") straight into the UI (AUDIT.md §M3), and every
 * download link pointed at '#'.
 *
 * Files with no URL now render as a clearly disabled row that explains itself,
 * so a paying customer is never left clicking a link that goes nowhere.
 */
export default function LibraryItemPage() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();
  const { owns, entitlements } = useStore();

  const product = getProduct(slug);

  useDocumentMeta({ title: product ? L(product, 'title') : '', noIndex: true });

  if (!product) return <Navigate to="/resources" replace />;

  if (!owns(product.id)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24">
        <EmptyState
          icon={<Lock className="size-8" />}
          title={t('product.lockedTitle')}
          description={t('product.lockedBody')}
          action={<ButtonLink to={`/resources/${product.slug}`}>{t('product.buy')}</ButtonLink>}
        />
      </div>
    );
  }

  const grant = entitlements.find((e) => e.itemId === product.id);
  const ready = product.files.filter((f) => f.url !== null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">{t('product.accessTitle')}</h1>
      <p className="mt-2 text-base text-fg-muted">{t('product.accessDescription')}</p>

      <div className="mt-8 rounded-card border border-line bg-surface p-6">
        <h2 className="text-lg font-extrabold text-fg">{L(product, 'title')}</h2>
        {grant && (
          <p className="mt-1 text-sm text-fg-subtle">
            {t('product.purchasedOn', { date: formatDate(grant.grantedAt, i18n.language) })}
          </p>
        )}

        <ul className="mt-6 divide-y divide-line border-t border-line">
          {product.files.map((file) => {
            const available = file.url !== null;
            return (
              <li key={file.id} className="flex items-center gap-3 py-4">
                <FileText
                  className={available ? 'size-5 shrink-0 text-brand-text' : 'size-5 shrink-0 text-fg-subtle'}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-fg">{L(file, 'name')}</p>
                  <p className="text-xs text-fg-subtle">
                    {file.type.toUpperCase()} · {file.size}
                  </p>
                  {!available && (
                    <p className="mt-1 text-xs text-fg-muted">{t('product.notReadyHint')}</p>
                  )}
                </div>
                {available ? (
                  <a
                    href={file.url!}
                    download
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-control bg-brand px-4 text-sm font-extrabold text-brand-fg transition-colors hover:bg-brand-hover"
                  >
                    <Download className="size-4" aria-hidden />
                    {t('product.download')}
                  </a>
                ) : (
                  <Badge tone="neutral">{t('product.notReady')}</Badge>
                )}
              </li>
            );
          })}
        </ul>

        {ready.length === 0 && (
          <p className="mt-4 rounded-control bg-warning-soft p-4 text-sm text-warning-text">
            {t('product.notReadyHint')}
          </p>
        )}
      </div>

      <ButtonLink to="/dashboard" variant="ghost" className="mt-6">
        {t('certificate.backToDashboard')}
      </ButtonLink>
    </div>
  );
}
