import { useEffect } from 'react';

interface Meta {
  title: string;
  description?: string;
  /** Path only, e.g. "/courses/seo-basics". Origin is added automatically. */
  canonicalPath?: string;
  image?: string;
  /** Emit `noindex` for pages that must never appear in search (checkout, player). */
  noIndex?: boolean;
  /** JSON-LD object injected as a <script type="application/ld+json"> tag. */
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'Awraq';
const MANAGED = 'data-managed-meta';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(`${selector}[${MANAGED}]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][${MANAGED}]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Per-route document metadata.
 *
 * The previous build had a single static <title> in index.html, so every page,
 * every course and every shared link presented as "Awraq — Master Digital
 * Marketing". Browser history, bookmarks, and social cards were all identical
 * and useless.
 *
 * This is deliberately dependency-free (no react-helmet): the whole surface is
 * five tags, and the moment this app is prerendered these values come from the
 * route loader instead.
 */
export function useDocumentMeta({
  title,
  description,
  canonicalPath,
  image,
  noIndex,
  jsonLd,
}: Meta): void {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description });
      upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: description,
      });
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });

    if (image) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    }

    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    });

    if (canonicalPath) {
      upsertLink('canonical', new URL(canonicalPath, window.location.origin).toString());
      upsertMeta('meta[property="og:url"]', {
        property: 'og:url',
        content: new URL(canonicalPath, window.location.origin).toString(),
      });
    }

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MANAGED, '');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
    };
  }, [title, description, canonicalPath, image, noIndex, jsonLd]);
}
