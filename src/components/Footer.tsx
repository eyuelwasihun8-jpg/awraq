import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Mail, Send, Youtube } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

/**
 * Footer.
 *
 * The legal column previously linked to `#terms` and `#privacy` — anchors to
 * pages that did not exist. You cannot take payments without published terms,
 * a privacy policy and a refund policy, so all three are now real routes
 * (AUDIT.md §H6).
 */
export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: t('footer.learn'),
      links: [
        { to: '/courses', label: t('nav.courses') },
        { to: '/resources', label: t('nav.resources') },
        { to: '/free', label: t('nav.freeSessions') },
      ],
    },
    {
      heading: t('footer.company'),
      links: [
        { to: '/about', label: t('nav.about') },
        { to: '/consultation', label: t('nav.bookConsultation') },
        { to: '/contact', label: t('nav.contact') },
      ],
    },
    {
      heading: t('footer.legal'),
      links: [
        { to: '/legal/terms', label: t('legal.terms') },
        { to: '/legal/privacy', label: t('legal.privacy') },
        { to: '/legal/refunds', label: t('legal.refunds') },
      ],
    },
  ];

  const socials = [
    { href: 'https://t.me/awraq', label: 'Telegram', Icon: Send },
    { href: 'https://facebook.com/awraq', label: 'Facebook', Icon: Facebook },
    { href: 'https://youtube.com/@awraq', label: 'YouTube', Icon: Youtube },
    { href: 'https://linkedin.com/company/awraq', label: 'LinkedIn', Icon: Linkedin },
  ];

  return (
    <footer className="border-t border-white/10 bg-ink-deep text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandLogo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t('footer.blurb')}
            </p>
            <a
              href="mailto:hello@awraq.et"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-brand"
            >
              <Mail className="size-4" aria-hidden />
              hello@awraq.et
            </a>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="md:col-span-2">
              <h2 className="text-sm font-extrabold text-white">{column.heading}</h2>
              <ul className="mt-3 space-y-1">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-10 items-center text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-1">
            <h2 className="text-sm font-extrabold text-white">{t('footer.social')}</h2>
            <ul className="mt-3 flex gap-1.5 md:flex-col md:gap-1">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-10 place-items-center rounded-control text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>{t('footer.rights', { year })}</p>
          <p>{t('footer.builtIn')}</p>
        </div>
      </div>
    </footer>
  );
}
