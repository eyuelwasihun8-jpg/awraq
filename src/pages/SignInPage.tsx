import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useStore } from '../store/StoreProvider';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { Button } from '../components/ui/Button';
import { Field, TextInput } from '../components/ui/Field';
import { BrandLogo } from '../components/BrandLogo';

/**
 * Sign in / sign up.
 *
 * The old modal shipped with `useState('learner@awraq.com')` and a password
 * state whose literal value was the string '••••••••' (AUDIT.md §H4). Anyone
 * opening the site saw someone else's email prefilled in a login box — which
 * reads as a data leak even though it wasn't one, and it is the single fastest
 * way to lose a first-time visitor's trust.
 *
 * Fields start empty, validation is real, the password is togglable, and the
 * user is returned to wherever the guard interrupted them.
 *
 * ⚠️  There is no auth backend. `signIn` writes a local user record. Wire this
 * to a real identity provider before launch; do not ship this as-is.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignInPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  useDocumentMeta({
    title: mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle'),
    noIndex: true,
  });

  function validate() {
    const next: Record<string, string> = {};
    if (mode === 'signup' && name.trim().length < 2) next.name = t('auth.errorRequired');
    if (!EMAIL.test(email.trim())) next.email = t('auth.errorEmail');
    if (password.length < 8) next.password = t('auth.errorPassword');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setSubmitting(true);
    signIn({
      fullName: mode === 'signup' ? name.trim() : email.trim().split('@')[0],
      email: email.trim(),
    });
    navigate(from, { replace: true });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="text-center">
        <Link to="/" className="inline-block">
          <BrandLogo size="lg" />
        </Link>
        <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-fg">
          {mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle')}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {mode === 'signin' ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
        {mode === 'signup' && (
          <Field label={t('auth.fullName')} error={errors.name} required>
            {(props) => (
              <TextInput
                {...props}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </Field>
        )}

        <Field label={t('auth.email')} error={errors.email} required>
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

        <Field
          label={t('auth.password')}
          hint={mode === 'signup' ? t('auth.passwordHint') : undefined}
          error={errors.password}
          required
        >
          {(props) => (
            <div className="relative">
              <TextInput
                {...props}
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pe-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-control text-fg-subtle transition-colors hover:text-fg"
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          )}
        </Field>

        {mode === 'signin' && (
          <div className="text-end">
            <Link to="/contact" className="text-sm font-bold text-brand-text underline">
              {t('auth.forgotPassword')}
            </Link>
          </div>
        )}

        {mode === 'signup' && (
          <p className="text-xs leading-relaxed text-fg-muted">
            <Trans
              i18nKey="auth.acceptTerms"
              components={{
                1: <Link to="/legal/terms" className="font-bold text-brand-text underline" />,
                3: <Link to="/legal/privacy" className="font-bold text-brand-text underline" />,
              }}
            />
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={submitting}
          leadingIcon={<LogIn className="size-4" />}
        >
          {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-fg-muted">
        {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setErrors({});
          }}
          className="font-extrabold text-brand-text underline"
        >
          {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
        </button>
      </p>

      <p className="mt-4 text-center text-xs text-fg-subtle">{t('auth.guestNote')}</p>
    </div>
  );
}
