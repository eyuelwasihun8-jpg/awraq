import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { formatDate } from '../lib/format';
import { LEGAL_DOCUMENTS, type LegalSlug } from '../data/legal';
import { useLocalized } from '../lib/useLocalized';

/**
 * Legal pages.
 *
 * The footer linked Terms and Privacy to `href="#"` — a store taking payments
 * with no published terms, no privacy policy and no refund policy, while the
 * course pages advertised a "14-day money-back guarantee" that pointed
 * nowhere (AUDIT.md §H6). That is a consumer-protection problem, not a design
 * nitpick, and every payment provider will ask for these before approving a
 * merchant account.
 *
 * ⚠️  The text in `data/legal.ts` is a plain-language starting point, not
 * legal advice. Have it reviewed against Ethiopian consumer law before
 * launch.
 */
export default function LegalPage() {
  const { document: slug } = useParams<{ document: LegalSlug }>();
  const { t, i18n } = useTranslation();
  const { L, LArr } = useLocalized();

  const doc = slug ? LEGAL_DOCUMENTS[slug] : undefined;

  useDocumentMeta({
    title: doc ? t(`legal.${doc.id}`) : t('errors.notFoundTitle'),
    canonicalPath: doc ? `/legal/${doc.id}` : undefined,
  });

  if (!doc) return <Navigate to="/" replace />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
        {t(`legal.${doc.id}`)}
      </h1>
      <p className="mt-2 text-sm text-fg-subtle">
        {t('legal.lastUpdated', { date: formatDate(doc.updatedAt, i18n.language) })}
      </p>

      <div className="mt-10 space-y-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-extrabold text-fg">{L(section, 'heading')}</h2>
            <div className="mt-3 space-y-3">
              {LArr(section, 'paragraphs').map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-14 rounded-card border border-line bg-surface p-5 text-sm text-fg-muted">
        {t('legal.contactPrompt')}
      </p>
    </article>
  );
}
