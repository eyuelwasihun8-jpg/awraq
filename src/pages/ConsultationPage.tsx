import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { formatPrice } from '../lib/format';
import { cn } from '../lib/cn';
import { Button } from '../components/ui/Button';
import { Field, TextArea, TextInput } from '../components/ui/Field';

/**
 * Consultation booking.
 *
 * Fixes from the audit:
 *
 * - Time slots are labelled EAT (UTC+3). The old modal rendered slots from a
 *   UTC date, so an Addis customer booking "09:00" was actually booking noon
 *   (AUDIT.md §M3).
 * - The date input rejects past dates — the old one happily accepted last
 *   Tuesday.
 * - It's a page, not a modal, so the booking flow can be linked from an ad,
 *   an email or a WhatsApp message.
 *
 * ⚠️  Submission is local. Wire `submitBooking` to a real calendar/CRM before
 * launch, and confirm by email — a booking nobody receives is worse than no
 * booking form.
 */

const CONSULTATION_PRICE = 1500;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TOPICS = ['audit', 'copy', 'seo', 'general'] as const;
const SLOTS = ['morning', 'afternoon', 'evening'] as const;

type Topic = (typeof TOPICS)[number];
type Slot = (typeof SLOTS)[number];

/** Today in Addis Ababa (UTC+3), as YYYY-MM-DD, for the date input's `min`. */
function todayInEAT(): string {
  const now = new Date();
  const eat = new Date(now.getTime() + (3 * 60 + now.getTimezoneOffset()) * 60_000);
  return eat.toISOString().slice(0, 10);
}

export default function ConsultationPage() {
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState<Slot>('morning');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useDocumentMeta({
    title: t('consultation.title'),
    description: t('consultation.subtitle'),
    canonicalPath: '/consultation',
  });

  const minDate = todayInEAT();

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = t('auth.errorRequired');
    if (!EMAIL.test(email.trim())) next.email = t('auth.errorEmail');
    if (!date) next.date = t('auth.errorRequired');
    else if (date < minDate) next.date = t('consultation.dateInPast');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setSubmitting(true);
    // TODO(backend): POST { topic, name, email, business, date, slot, notes }
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    setStep(3);
  }

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <CalendarCheck className="mx-auto size-10 text-brand" aria-hidden />
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-white">
            {t('consultation.title')}
          </h1>
          <p className="mt-3 text-pretty text-base leading-relaxed text-white/70">
            {t('consultation.subtitle')}
          </p>
          <p className="mt-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-extrabold text-white">
            {t('consultation.price', { amount: formatPrice(CONSULTATION_PRICE, i18n.language) })}
          </p>
        </header>

        {step < 3 && (
          <p className="mt-10 text-center text-xs font-extrabold uppercase tracking-wide text-white/50">
            {t('consultation.step', { current: step, total: 2 })}
          </p>
        )}

        {/* Step 1 — topic */}
        {step === 1 && (
          <div className="mt-5">
            <h2 className="text-lg font-extrabold text-white">{t('consultation.chooseTopic')}</h2>
            <div role="radiogroup" aria-label={t('consultation.chooseTopic')} className="mt-5 space-y-3">
              {TOPICS.map((id) => {
                const active = topic === id;
                const label = t(`consultation.topic${id.charAt(0).toUpperCase()}${id.slice(1)}`);
                return (
                  <label
                    key={id}
                    htmlFor={`topic-${id}`}
                    aria-label={label}
                    className={cn(
                      'flex cursor-pointer gap-3 rounded-2xl border p-5 transition-colors',
                      active
                        ? 'border-brand bg-brand/10'
                        : 'border-white/10 bg-white/5 hover:border-white/25',
                    )}
                  >
                    <input
                      id={`topic-${id}`}
                      type="radio"
                      name="topic"
                      value={id}
                      checked={active}
                      onChange={() => setTopic(id)}
                      className="mt-1 size-4 accent-[var(--gold-500)]"
                    />
                    <span>
                      <span className="block text-sm font-extrabold text-white">{label}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/60">
                        {t(`consultation.topic${id.charAt(0).toUpperCase()}${id.slice(1)}Body`)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            <Button
              size="lg"
              fullWidth
              className="mt-7"
              disabled={topic === null}
              onClick={() => setStep(2)}
            >
              {t('common.next')}
            </Button>
          </div>
        )}

        {/* Step 2 — details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} noValidate className="mt-5">
            <h2 className="text-lg font-extrabold text-white">{t('consultation.yourDetails')}</h2>

            <div className="mt-5 space-y-5">
              <Field label={t('consultation.name')} error={errors.name} required>
                {(props) => (
                  <TextInput
                    {...props}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </Field>

              <Field label={t('consultation.email')} error={errors.email} required>
                {(props) => (
                  <TextInput
                    {...props}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </Field>

              <Field label={t('consultation.business')}>
                {(props) => (
                  <TextInput
                    {...props}
                    placeholder={t('consultation.businessPlaceholder')}
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                  />
                )}
              </Field>

              <Field label={t('consultation.preferredDate')} error={errors.date} required>
                {(props) => (
                  <TextInput
                    {...props}
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                )}
              </Field>

              <fieldset>
                <legend className="mb-2 text-sm font-extrabold text-white">
                  {t('consultation.timeSlot')}
                </legend>
                <div className="space-y-2">
                  {SLOTS.map((id) => (
                    <label
                      key={id}
                      htmlFor={`slot-${id}`}
                      aria-label={t(`consultation.time${id.charAt(0).toUpperCase()}${id.slice(1)}`)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-control border px-4 py-3 transition-colors',
                        slot === id
                          ? 'border-brand bg-brand/10'
                          : 'border-white/10 bg-white/5 hover:border-white/25',
                      )}
                    >
                      <input
                        id={`slot-${id}`}
                        type="radio"
                        name="slot"
                        value={id}
                        checked={slot === id}
                        onChange={() => setSlot(id)}
                        className="size-4 accent-[var(--gold-500)]"
                      />
                      <Clock className="size-4 shrink-0 text-white/50" aria-hidden />
                      <span className="text-sm font-bold text-white">
                        {t(`consultation.time${id.charAt(0).toUpperCase()}${id.slice(1)}`)}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/50">{t('consultation.timezoneNote')}</p>
              </fieldset>

              <Field label={t('consultation.notes')}>
                {(props) => (
                  <TextArea
                    {...props}
                    rows={4}
                    placeholder={t('consultation.notesPlaceholder')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                )}
              </Field>
            </div>

            <div className="mt-7 flex gap-3">
              <Button type="button" variant="onDark" size="lg" onClick={() => setStep(1)}>
                {t('consultation.back')}
              </Button>
              <Button type="submit" size="lg" loading={submitting} className="flex-1">
                {submitting ? t('consultation.submitting') : t('consultation.submit')}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3 — confirmation */}
        {step === 3 && (
          <div className="animate-scale-in mt-10 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/20">
              <CheckCircle2 className="size-8 text-success" aria-hidden />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-white">
              {t('consultation.successTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
              {t('consultation.successBody', { name: name.trim(), email: email.trim() })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
