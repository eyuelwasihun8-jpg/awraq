import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatPrice } from '../lib/format';
import { getItem } from '../data/catalog';
import { ButtonLink } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { EmptyState } from '../components/ui/primitives';

/**
 * Cart.
 *
 * There was no cart. Each item had its own "Buy now" that jumped straight into
 * a single-item checkout, which made a two-course purchase two separate
 * payments and made bundles the only way to buy more than one thing
 * (AUDIT.md §H5). For a store selling ~10 SKUs at ETB 99–449, that is directly
 * lost revenue.
 */
export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();
  const { cart, cartTotal, removeFromCart, owns } = useStore();

  useDocumentMeta({ title: t('cart.title'), noIndex: true });

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={<ShoppingCart className="size-8" />}
          title={t('cart.empty')}
          description={t('cart.emptyBody')}
          action={<ButtonLink to="/courses">{t('cart.browse')}</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">{t('cart.title')}</h1>
      <p className="mt-2 text-sm text-fg-muted">{t('cart.itemCount', { count: cart.length })}</p>

      <ul className="mt-8 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
        {cart.map((line) => {
          const item = getItem(line.itemId);
          const alreadyOwned = owns(line.itemId);
          const href =
            line.kind === 'course'
              ? `/courses/${item?.slug}`
              : line.kind === 'product'
                ? `/resources/${item?.slug}`
                : `/bundles/${item?.slug}`;

          return (
            <li key={line.itemId} className="flex items-center gap-4 p-4 sm:p-5">
              <SmartImage
                src={line.thumbnail}
                alt=""
                ratio="16/9"
                wrapperClassName="w-24 shrink-0 rounded-lg sm:w-32"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={href}
                  className="block truncate text-sm font-extrabold text-fg hover:text-brand-text sm:text-base"
                >
                  {L(line, 'title')}
                </Link>
                {alreadyOwned && (
                  <p className="mt-1 text-xs font-bold text-warning-text">
                    {t('cart.alreadyOwned')}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-sm font-extrabold text-fg sm:text-base">
                {formatPrice(line.unitPrice, i18n.language)}
              </span>
              <button
                type="button"
                onClick={() => removeFromCart(line.itemId)}
                className="grid size-10 shrink-0 place-items-center rounded-control text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger-text"
                aria-label={t('cart.remove', { title: line.title })}
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-card border border-line bg-surface p-6">
        <dl className="space-y-2">
          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-fg-muted">{t('cart.subtotal')}</dt>
            <dd className="text-sm font-semibold text-fg">
              {formatPrice(cartTotal, i18n.language)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <dt className="text-base font-extrabold text-fg">{t('cart.total')}</dt>
            <dd className="text-2xl font-extrabold text-fg">
              {formatPrice(cartTotal, i18n.language)}
            </dd>
          </div>
        </dl>

        <ButtonLink to="/checkout" size="lg" fullWidth className="mt-6">
          {t('cart.checkout')}
        </ButtonLink>

        <ButtonLink to="/courses" variant="ghost" fullWidth className="mt-2">
          {t('cart.keepBrowsing')}
        </ButtonLink>
      </div>
    </div>
  );
}
