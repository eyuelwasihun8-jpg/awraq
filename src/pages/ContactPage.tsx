import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Field, TextArea, TextInput } from '../components/ui/Field';

/**
 * Contact.
 *
 * The old contact form's submit handler was, in full:
 *
 *   const handleSubmit = (e) => { e.preventDefault(); };
 *
 * The user typed a message, pressed Send, and absolutely nothing happened —
 * no request, no confirmation, no error (AUDIT.md §H8). On a page selling
 * courses, that is a silently lost customer every time.
 *
 * This version validates, shows pending/success/error states, and posts to a
 * single well-named function. `submitContactForm` is the one place to swap in
 * the real endpoint — and it fails loudly rather than pretending to succeed.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * TODO(backend): POST to /api/contact.
 *
 * Deliberately not faked with a resolved promise: a stub that always succeeds
 * trains you to trust a path that has never been exercised. This throws until
 * a real endpoint exists, so the failure UI is the one you actually see in
 * development.
 */
async function submitContactForm(payload: ContactPayload): Promise<void> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}`);
}

export default function ContactPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [values, setValues] = useState<ContactPayload>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  useDocumentMeta({
    title: t('home.contact.title'),
    description: t('home.contact.description'),
    canonicalPath: '/contact',
  });

  function set<K extends keyof ContactPayload>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = t('auth.errorRequired');
    if (!EMAIL.test(values.email.trim())) next.email = t('auth.errorEmail');
    if (values.message.trim().length < 10) next.message = t('contact.messageTooShort');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === 'sending') return;
    if (!validate()) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus('sending');
    try {
      await submitContactForm(values);
      setStatus('sent');
      setValues({ name: '', email: '', subject: '', message: '' });
      toast(t('home.contact.success'), 'success');
    } catch {
      setStatus('failed');
      toast(t('home.contact.error'), 'error');
    }
  }

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t('home.contact.title')}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-white/70">
            {t('home.contact.description')}
          </p>

          <ul className="mt-10 space-y-4">
            <li>
              <a
                href="mailto:hello@awraq.et"
                className="marketing-glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:bg-white/10"
              >
                <Mail className="size-5 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="block text-sm font-extrabold text-white">
                    {t('contact.emailUs')}
                  </span>
                  <span className="block text-sm text-white/60">hello@awraq.et</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://t.me/awraq"
                target="_blank"
                rel="noopener noreferrer"
                className="marketing-glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:bg-white/10"
              >
                <Send className="size-5 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="block text-sm font-extrabold text-white">
                    {t('contact.telegram')}
                  </span>
                  <span className="block text-sm text-white/60">@awraq</span>
                </span>
              </a>
            </li>
            <li className="marketing-glass flex items-center gap-4 rounded-2xl p-5">
              <MessageCircle className="size-5 shrink-0 text-brand" aria-hidden />
              <span>
                <span className="block text-sm font-extrabold text-white">
                  {t('contact.responseTime')}
                </span>
                <span className="block text-sm text-white/60">{t('contact.responseBody')}</span>
              </span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} noValidate className="marketing-glass rounded-3xl p-6 sm:p-8">
          <div className="space-y-5">
            <Field label={t('home.contact.name')} error={errors.name} required>
              {(props) => (
                <TextInput
                  {...props}
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              )}
            </Field>

            <Field label={t('home.contact.email')} error={errors.email} required>
              {(props) => (
                <TextInput
                  {...props}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              )}
            </Field>

            <Field label={t('home.contact.subject')}>
              {(props) => (
                <TextInput
                  {...props}
                  value={values.subject}
                  onChange={(e) => set('subject', e.target.value)}
                />
              )}
            </Field>

            <Field label={t('home.contact.message')} error={errors.message} required>
              {(props) => (
                <TextArea
                  {...props}
                  rows={5}
                  placeholder={t('home.contact.messagePlaceholder')}
                  value={values.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              )}
            </Field>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={status === 'sending'}
            className="mt-7"
            leadingIcon={<Send className="size-4" />}
          >
            {status === 'sending' ? t('home.contact.sending') : t('home.contact.submit')}
          </Button>

          {/* Status is announced, not just coloured. */}
          <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm">
            {status === 'sent' && (
              <span className="font-bold text-success-text">{t('home.contact.success')}</span>
            )}
            {status === 'failed' && (
              <span className="font-bold text-danger-text">{t('home.contact.error')}</span>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
