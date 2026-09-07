import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, CreditCard, Lock, Smartphone } from 'lucide-react';
import { useStore } from '../store/StoreProvider';
import { expandToOrderLines, getItem } from '../data/catalog';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useLocalized } from '../lib/useLocalized';
import { formatPrice } from '../lib/format';
import { cn } from '../lib/cn';
import type { Order, PaymentMethod } from '../types';
import { Button, ButtonLink } from '../components/ui/Button';
import { Field, TextInput } from '../components/ui/Field';
import { SmartImage } from '../components/ui/SmartImage';

/**
 * Checkout.
 *
 * What the old flow did: `setTimeout(() => setPurchased(true), 2000)`. No
 * validation, no failure path, no order record, no receipt, and the "payment
 * method" radio group had no effect on anything (AUDIT.md §C4).
 *
 * What this does:
 *
 * - Validates the phone number and email BEFORE charging, with errors bound to
 *   their inputs via aria-describedby.
 * - Requires an explicit terms acceptance that links to real policy pages.
 * - Models a failure path. Payments fail — Telebirr times out, balances are
 *   short — and a checkout that cannot fail will ship a UI that cannot explain
 *   the failure.
 * - Writes an Order with a reference the customer can quote in a support
 *   message, and grants entitlements from the order rather than from a
 *   free-floating boolean.
 *
 * ⚠️  STILL A SIMULATION. `payForCart` resolves locally; entitlements live in
 * localStorage and are trivially forgeable. Before launch this must post to a
 * server that (a) creates the order, (b) redirects to the Chapa/Telebirr
 * gateway, (c) grants entitlements only on the verified provider webhook, and
 * (d) gates media/download URLs behind that grant.
 */

const METHODS: { id: PaymentMethod; icon: typeof Smartphone; needsPhone: boolean }[] = [
  { id: 'telebirr', icon: Smartphone, needsPhone: true },
  { id: 'cbe', icon: Smartphone, needsPhone: true },
  { id: 'chapa', icon: CreditCard, needsPhone: false },
];

/** Ethiopian mobile: 09xxxxxxxx / 07xxxxxxxx / +2519xxxxxxxx, spaces allowed. */
const ETHIOPIAN_MOBILE = /^(?:\+?251|0)?(?:9|7)\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { L } = useLocalized();
  const navigate = useNavigate();
  const { cart, cartTotal, user, payForCart, checkoutStatus, resetCheckout } = useStore();

  const [method, setMethod] = useState<PaymentMethod>('telebirr');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<Order | null>(null);

  useDocumentMeta({ title: t('checkout.title'), noIndex: true });

  const selected = METHODS.find((m) => m.id === method)!;
  const processing = checkoutStatus === 'processing';

  // Empty cart and no completed order → nothing to pay for.
  if (cart.length === 0 && !order) return <Navigate to="/cart" replace />;

  function validate() {
    const next: Record<string, string> = {};
    if (selected.needsPhone && !ETHIOPIAN_MOBILE.test(phone.replace(/[\s-]/g, ''))) {
      next.phone = t('checkout.phoneInvalid');
    }
    if (!EMAIL.test(email.trim())) next.email = t('checkout.emailInvalid');
    if (!accepted) next.terms = t('checkout.termsRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (processing) return;
    if (!validate()) {
      // Move focus to the first invalid control so the error is discoverable
      // without sight. A silent red border is not an error message.
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const placed = await payForCart(method, expandToOrderLines);
    if (placed) setOrder(placed);
  }

  // ── Success ────────────────────────────────────────────────
  if (order) {
    const firstCourse = order.lines.find((line) => line.kind === 'course');
    const firstProduct = order.lines.find((line) => line.kind === 'product');
    const courseSlug = firstCourse ? getItem(firstCourse.itemId)?.slug : undefined;
    const productSlug = firstProduct ? getItem(firstProduct.itemId)?.slug : undefined;

    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <div className="animate-scale-in mx-auto grid size-16 place-items-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-8 text-success-text" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-fg">
          {t('checkout.successTitle')}
        </h1>
        <p className="mt-2 text-base text-fg-muted">
          {t('checkout.successBody', { email: email.trim() })}
        </p>

        <p className="mx-auto mt-6 inline-block rounded-control bg-surface-2 px-4 py-2 text-sm text-fg-muted">
          {t('checkout.orderRef')}:{' '}
          <span className="font-mono font-extrabold tabular-nums text-fg">{order.id}</span>
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {courseSlug && (
            <ButtonLink to={`/learn/${courseSlug}`} size="lg">
              {t('checkout.startCourse')}
            </ButtonLink>
          )}
          {!courseSlug && productSlug && (
            <ButtonLink to={`/library/${productSlug}`} size="lg">
              {t('checkout.downloadFiles')}
            </ButtonLink>
          )}
          <ButtonLink to="/dashboard" variant="secondary" size="lg">
            {t('checkout.goToLibrary')}
          </ButtonLink>
        </div>

        <p className="mt-6 text-xs text-fg-subtle">{t('checkout.refundNote')}</p>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">{t('checkout.title')}</h1>
      <p className="mt-2 text-sm text-fg-muted">{t('checkout.subtitle')}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3">
          {checkoutStatus === 'failed' && (
            <div
              role="alert"
              className="mb-6 flex gap-3 rounded-card border border-danger/40 bg-danger-soft p-4"
            >
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger-text" aria-hidden />
              <div>
                <p className="text-sm font-extrabold text-danger-text">
                  {t('checkout.failedTitle')}
                </p>
                <p className="mt-1 text-sm text-fg-muted">{t('checkout.failedBody')}</p>
              </div>
            </div>
          )}

          <fieldset disabled={processing} className="contents">
            <legend className="sr-only">{t('checkout.paymentMethod')}</legend>

            <h2 className="text-base font-extrabold text-fg">{t('checkout.paymentMethod')}</h2>
            <div
              role="radiogroup"
              aria-label={t('checkout.paymentMethod')}
              className="mt-3 space-y-2.5"
            >
              {METHODS.map(({ id, icon: Icon }) => {
                const active = method === id;
                return (
                  <label
                    key={id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors',
                      active
                        ? 'border-brand bg-brand-soft'
                        : 'border-line bg-surface hover:border-brand/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={id}
                      checked={active}
                      onChange={() => {
                        setMethod(id);
                        resetCheckout();
                      }}
                      className="mt-0.5 size-4 accent-[var(--gold-500)]"
                    />
                    <Icon
                      className={cn('mt-0.5 size-5 shrink-0', active ? 'text-brand-text' : 'text-fg-subtle')}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-fg">
                        {t(`checkout.${id}`)}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-fg-muted">
                        {t(`checkout.${id}Hint`)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-8 space-y-5">
              {selected.needsPhone && (
                <Field
                  label={t('checkout.phoneLabel')}
                  hint={t('checkout.phoneHint', { method: t(`checkout.${method}`) })}
                  error={errors.phone}
                  required
                >
                  {(props) => (
                    <TextInput
                      {...props}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      prefix="+251"
                      placeholder="911 234 567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  )}
                </Field>
              )}

              <Field label={t('checkout.emailLabel')} error={errors.email} required>
                {(props) => (
                  <TextInput
                    {...props}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </Field>

              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    aria-invalid={Boolean(errors.terms)}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                    className="mt-0.5 size-4 shrink-0 accent-[var(--gold-500)]"
                  />
                  <span className="text-sm leading-relaxed text-fg-muted">
                    <Trans
                      i18nKey="checkout.terms"
                      components={{
                        1: <Link to="/legal/terms" className="font-bold text-brand-text underline" />,
                        3: <Link to="/legal/refunds" className="font-bold text-brand-text underline" />,
                      }}
                    />
                  </span>
                </label>
                {errors.terms && (
                  <p id="terms-error" role="alert" className="mt-1.5 text-sm font-semibold text-danger-text">
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={processing}
            className="mt-8"
            leadingIcon={<Lock className="size-4" />}
          >
            {processing
              ? t('checkout.processing')
              : t('checkout.pay', { amount: formatPrice(cartTotal, i18n.language) })}
          </Button>

          {processing && (
            <p role="status" className="mt-3 text-center text-sm text-fg-muted">
              {t('checkout.processingHint')}
            </p>
          )}
        </form>

        {/* ── Order summary ───────────────────────────────── */}
        <aside className="lg:col-span-2">
          <div className="rounded-card border border-line bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="text-base font-extrabold text-fg">{t('checkout.orderSummary')}</h2>

            <ul className="mt-4 space-y-3">
              {cart.map((line) => (
                <li key={line.itemId} className="flex items-center gap-3">
                  <SmartImage
                    src={line.thumbnail}
                    alt=""
                    ratio="16/9"
                    wrapperClassName="w-16 shrink-0 rounded-md"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-fg">
                    {L(line, 'title')}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-fg-muted">
                    {formatPrice(line.unitPrice, i18n.language)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 border-t border-line pt-4">
              <div className="flex items-baseline justify-between">
                <dt className="text-base font-extrabold text-fg">{t('cart.total')}</dt>
                <dd className="text-2xl font-extrabold text-fg">
                  {formatPrice(cartTotal, i18n.language)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="mt-4 text-sm font-bold text-brand-text underline"
            >
              {t('common.back')}
            </button>

            <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-fg-subtle">
              <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              {t('checkout.securedBy')} Chapa · Telebirr · CBE Birr
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
