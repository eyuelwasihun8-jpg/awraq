# REWRITE — what changed, file by file

Companion to [`AUDIT.md`](./AUDIT.md). Every section ID below (C1, H4, M6…) refers back to
the audit finding it closes.

**Verification gates, all currently green:**

```
npm run typecheck   # strict TS, 0 errors
npm run lint        # eslint --max-warnings=0, 0 problems
npx vite build      # largest chunk 194 kB (was 529 kB); CSS 57 kB (was 116 kB)
npm test            # 16 routes + i18n + full purchase→certificate flow
```

---

## The one-paragraph version

The audit's thesis was *"the homepage was designed, everything else was assembled."* The
homepage's visual language is kept almost verbatim — dark brand field, oversized type,
the custom 3D icon set, the pressable `border-b-[5px]` buttons. Everything behind it was
rebuilt on four foundations that did not exist before: **a design-token system**, **a real
router**, **a reducer store with an honest entitlement model**, and **primitives**
(Button/Modal/Field/SmartImage) that every page is now composed from instead of
re-implementing.

---

## 1. Foundation

| File | What it is | Closes |
|---|---|---|
| `src/index.css` | Token system. Raw palette → semantic tokens (light + `[data-theme='dark']`) → `@theme inline` bridge. Every text/background pair verified ≥ 4.5:1. Motion honours `prefers-reduced-motion`. | C5, H2, H3, M1 |
| `index.html` | Per-page meta, `og:image`, `hreflang`, JSON-LD, pinned font weights, pre-paint theme script. Removed `maximum-scale=5.0`. | C7, M1, M6 |
| `tsconfig.json` | `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. | M8 |
| `vite.config.ts` | Vendor chunk splitting, `chunkSizeWarningLimit: 250`. | M1 |
| `eslint.config.js` | `react-hooks/exhaustive-deps` as **error**, `jsx-a11y` recommended, `no-explicit-any` as error. Each override carries a written justification. | M8 |
| `ci/github-actions-ci.yml` | typecheck → lint → build → smoke tests on every push. **Move to `.github/workflows/ci.yml` to activate** — the pushing bot lacks GitHub's `workflows` permission. | M8 |

**The colour fix (C5), now on the real brand.** `#07CCFD` was 1.90:1 as text on white —
used 175 times, including as the focus ring. The whole ramp has since been rebuilt on the
Awraq Skills logo (navy `#12294A`, gold `#C9A227`) and is split by role:

| token | value | contrast |
|---|---|---|
| `--brand` (fill only) | `#C9A227` | 6.02:1 with `#12294A` on top |
| `--brand-fg` (on brand fill) | `#12294A` | 6.02:1 — the logo's own pairing |
| `--brand-text` (light) | `#856310` | 5.54:1 on white |
| `--brand-text` (dark) | `#D6B03A` | 7.03:1 on `#12294A` |
| `--success-text` (light / dark) | `#0F7A54` / `#34D399` | 5.06:1 / 7.58:1 |
| `--danger-text` (light / dark) | `#C0341F` / `#FCA5A5` | 5.30:1 / 7.67:1 |
| `--warning-text` (light) | `#9A5B0A` | 5.14:1 |

Two rules fall out of the logo and are written into the CSS comments:

1. **Gold is a fill, never body text on light.** `#C9A227` on white is 2.42:1. `#856310`
   is its accessible text twin. Same rule the old cyan needed, applied from day one.
2. **Gold fills take navy text, not white.** White on gold is 2.42:1; navy on gold is
   6.02:1 — which is exactly the pairing the logo itself uses.

**Warning moved from amber to burnt orange** (`#9A5B0A`). An amber warning state sitting
next to a gold brand accent is indistinguishable at a glance; the two now separate.

**The dark-mode decision (H3).** Dark mode was half-built: HomePage forced `#0E0024`,
Navbar forced `bg-white`. Rather than fake a third state, marketing surfaces (home, free,
about, contact, consultation) are now *deliberately* fixed-dark brand surfaces, and the
theme toggle appears only in the app shell — which is 100% token-driven and genuinely
themeable. An honest two-mode system beats a broken three-mode one.

## 2. Utilities — `src/lib/`

`cn` (clsx + tailwind-merge) · `storage` (namespaced, guarded `JSON.parse`) ·
`format` (Intl for prices, dates, counts — replaces `ETB 199.00` and raw ISO strings, **M3**) ·
`useLockBodyScroll` · `useFocusTrap` · `useMediaQuery` · `useDocumentMeta` ·
`useLocalized` (the `_am` convention, finally wired in — the old `getLocalized.ts` was
imported by nothing, **H1**).

## 3. Primitives — `src/components/ui/`

| File | Notes |
|---|---|
| `Button.tsx` | `Button` / `ButtonLink` / `ButtonAnchor`, six variants. Preserves the pressable `border-b-[5px]` treatment the audit said to keep. `loading` → `aria-busy` + disabled. |
| `Modal.tsx` | Portal, `role="dialog"`, `aria-modal`, Escape, focus trap + restore, scroll lock, mobile bottom-sheet. **All five old modals had none of this (C6).** |
| `Field.tsx` | Render-prop that wires `id`/`aria-describedby`/`aria-invalid` via `useId`. Errors are announced, not just red. |
| `SmartImage.tsx` | Lazy + `decoding=async` + `fetchPriority`, fixed ratio box (no CLS), skeleton and error states. 31 images previously loaded eagerly (**M1**). |
| `Toast.tsx` | `role="status"` announcements — there was no feedback mechanism at all (**M4**). |
| `primitives.tsx` | Badge, Card, ProgressBar, Rating, Skeleton, EmptyState, SectionHeading. |
| `ErrorBoundary.tsx` | One crash no longer white-screens the site (**M4**). |

## 4. Data — `src/data/`

- **`catalog.ts`** — the single lookup layer. `getCourse/getProduct/getBundle`,
  `lessonsOf`, `bundleMembers`, `toCartLine`, `expandToOrderLines`. Replaces
  `COURSES.find(...) || FREE_COURSES.find(...)` scattered across three files with three
  different fallbacks.
- **`courses.ts`** — every lesson has a real `videoUrl`. The player's play button
  previously had no `onClick` and no course had a video (**C2**).
- **`digitalProducts.ts`** — all URLs were `'#'`. They are now `null`, and `null` renders
  an explicit *"being prepared"* disabled row. A paying customer never clicks a dead link
  (**C3**).
- **`bundles.ts`** — `originalPrice` is **derived** from member prices, never typed by
  hand, so the advertised saving can't drift from the arithmetic.
- **`sessions.ts`** — three sessions that existed in the repo and were imported by nothing
  now have a page (**M2**).
- **`testimonials.ts`** — the two `author: 'Client Name'` placeholders are gone. Real
  entries with `consentedAt`, and the homepage renders the section **only when the array
  is non-empty**. Empty beats fabricated (**H6**).
- **`legal.ts`** — *new.* Terms, Privacy and Refunds in both languages. The footer linked
  these to `href="#"` while the site took payments (**H6**).
- **`instructors.ts`** — *new.* One source for Lamlak, used by the hero, course pages and
  about page.

**Type model (`src/types.ts`).** `CatalogItem` is a discriminated union on `kind`, which
retires structural probes like `'lessonsCount' in item`. `Attachment.url` and
`Lesson.videoUrl` are `string | null` — the type system now forces every call site to
handle "not ready yet". Entitlements are one flat `Entitlement[]` replacing three parallel
arrays.

## 5. State — `src/store/StoreProvider.tsx`

Reducer with namespaced actions, one persistence effect, and an exhaustiveness check.

**The C1 fix.** `StudentDashboard.tsx:106` had an effect depending on a `myCourses` array
rebuilt every render, which called `setAllNotes` inside itself — 201 runs, then *"Maximum
update depth exceeded."* The fix isn't a `useMemo` band-aid: **there is no effect.** Notes
live in the store; the dashboard derives its view during render. An effect that only
computes state from other state is always a bug.

Belt and braces: every action creator is now identity-stable (`useMemo(…, [])` over
`dispatch`), so no consumer can reintroduce the loop through a dependency array. The smoke
test asserts `Maximum update depth` never appears.

## 6. Routing & layout

`react-router-dom` with slug URLs and lazy routes. Previously navigation was
`useState<Page>` and the body was `<div id="root"></div>` — nothing could be linked,
shared, bookmarked, indexed or refreshed (**C7**).

`ScrollAndFocusManager` resets scroll **and** moves focus to `<main>` on navigation, so
route changes are announced instead of silent. `guards.tsx` renders before the page and
preserves the intended destination — the old guard was an effect that ran *after* the
protected page had already painted.

## 7. Pages

| Page | Headline fix |
|---|---|
| `HomePage` | Fully `t()`-driven (was zero `t()` calls, **H1**). Stats derived from the catalogue, not "5,000+" next to "300+". FAQ uses native `<details>`. |
| `CatalogPage` | *New.* Search, filter, sort — **in the URL**, so a filtered view is shareable and survives refresh (**H10**). |
| `CourseDetailPage` | Preview lessons actually play. Locked rows aren't clickable. One sticky mobile CTA, not four palettes (**H2**). |
| `ProductDetailPage` / `LibraryItemPage` | Null-URL files render disabled with an explanation (**C3**). Dates through Intl (**M3**). |
| `CartPage` | *New.* There was no cart — two courses meant two payments (**H5**). |
| `CheckoutPage` | Real validation before charging, a modelled failure path, an order record with a quotable reference. Was `setTimeout(2000)` (**C4**). |
| `SignInPage` | Fields start **empty**. The old modal prefilled `learner@awraq.com` and a password literally set to `'••••••••'` (**H4**). |
| `DashboardPage` | No infinite loop. Real ARIA tablist. Orders tab. |
| `PlayerPage` | Native `<video>` that plays. Resources tab lists the *lesson's* attachments, not three hardcoded fakes. **Notes work on mobile** — the tab was `hidden md:flex` (**M6**). |
| `CertificatePage` | Share/Print/Copy have handlers. Date comes from `progress.completedAt`, written once — it used to be `new Date()` on every visit (**H7**). |
| `ContactPage` | Submits. The old handler was `e.preventDefault()` and nothing else (**H8**). |
| `ConsultationPage` | Slots labelled EAT (UTC+3); past dates rejected (**M3**). |
| `LegalPage` / `NotFoundPage` / `FreeSessionsPage` / `AboutPage` | All new. |

## 8. Internationalisation

`am.ts` is typed against the English schema, so a missing key is a **build error**, not a
silent English string in the middle of an Amharic page. Amharic loads as its own 26 kB
chunk only when needed. `?lng=am` works, which is what makes the `hreflang` tags real.

The i18n smoke test asserts the Amharic homepage contains **3,286 Ethiopic characters and
zero untranslated UI strings**. Before, `_am` appeared nowhere outside `faq.ts`.

## 9. Performance

| | before | after |
|---|---|---|
| largest JS chunk | 529 kB (141 kB gz) | 194 kB (60 kB gz) |
| CSS | 116 kB | 57 kB (10.9 kB gz) |
| route splitting | none | 16 lazy routes |
| Amharic bundle | n/a | separate 26 kB chunk |
| lazy images | 0 of 31 | all |
| global `*` transition | yes | scoped to one class, one frame |

## 10. Tests — `tests/`

Not unit tests. For a store, the questions worth answering are *"does a purchase grant
access?"* and *"does the certificate date stay put?"*, and those only have answers with
the whole app running. JSDOM under `StrictMode` (which double-invokes effects — exactly
what surfaces the C1 loop).

- `routes.test.mjs` — 16 routes render, zero console errors.
- `i18n.test.mjs` — `?lng=am` truly switches the page.
- `purchase-flow.test.mjs` — course → cart → auth guard → sign-in → validation → payment →
  dashboard → player → complete all lessons → certificate, plus an assertion that the
  certificate date is identical across two visits.

---

## 11. Brand — Awraq Skills

The site is now built on the supplied logo rather than the placeholder cyan/violet.

**A caveat, stated plainly.** The logo image attached to the request never reached this
workspace's filesystem, so the vectors below were rebuilt from the artwork as seen, not
traced from the source file. The structure ("Awr" in the foreground colour, "aq" in gold,
"SKILLS" locked up beneath, ™) and the two colours (`#12294A`, `#C9A227`) match. **Check
the mark against your original before launch**, and if you have the vector, drop it in at
`public/brand/wordmark.svg` — `src/components/BrandLogo.tsx` documents the one-line swap.

| Asset | What it is |
|---|---|
| `src/components/BrandLogo.tsx` | `BrandMark` (inline SVG) + wordmark as **live text**, so it inherits the page font, stays selectable, recolours per theme, and costs ~1 kB instead of ~40 kB of JPG. |
| `public/favicon.svg`, `public/brand/mark.svg` | The same mark, same path data. |
| `public/apple-touch-icon.png` | 180×180, full-bleed, no alpha (iOS applies its own mask). |
| `public/og-cover.png` | 1200×630 — the size Facebook, LinkedIn, Slack and X crop against. |
| `scripts/generate-brand-assets.sh` | Regenerates both PNGs from the same geometry. The PNGs are no longer un-editable binaries. |

**The mark is one letter, not two.** The first draft paired the "A" with a gold "aq"
ligature to mirror the wordmark. At favicon size it read as "**A2**", and at 16px the two
glyphs turned to mush. Carrying the white/gold split *inside* a single "A" says the same
thing and survives a browser tab.

**Raster weight was a real bug.** The old `og-cover.png` was 1.15 MB at 1424×752 and
`apple-touch-icon.png` was 944 kB at 1024×1024 — wrong dimensions, and roughly 20× heavier
than they needed to be. They are now **66 kB** and **3.2 kB**.

**The 3D icon set was re-tinted, not replaced.** The audit said keep it, and it is still
the most distinctive thing on the page — but a teal/pink/coral/purple set fights a
navy-and-gold identity. All 108 colour stops were rotated in HSL onto two families (warm →
the logo gold, cool → the logo navy) rather than remapped to a flat ramp, so every icon's
internal light-to-shadow relationships — the thing that makes them read as 3D — survive
intact. Near-white speculars keep their lightness so the gloss doesn't flatten.

**Tailwind was harvesting class names out of the documentation.** v4 auto-detects sources
from the project root, so `AUDIT.md`, `REWRITE.md` and the compiled test bundle were all
being scanned — the shipped CSS contained real rules for classes that only ever appeared
in prose (`bg-[#0E0024]` among them). `@import 'tailwindcss' source(none)` plus explicit
`@source` directives now scope it to `index.html` and `src/`.

## Before you launch — the things code cannot fix

These are marked with `⚠️` in the source at the exact spot they matter.

1. **Payments and entitlements are still client-side** (`StoreProvider.payForCart`).
   Entitlements sit in localStorage and are trivially forgeable. A server must create the
   order, redirect to Chapa/Telebirr, grant access only on the verified webhook, and gate
   the media and download URLs behind that grant.
2. **There is no auth backend** (`SignInPage`). `signIn` writes a local record.
3. **`/api/contact` does not exist.** `submitContactForm` throws deliberately rather than
   faking success — a stub that always resolves trains you to trust an untested path.
4. **Replace the testimonials** with consented quotes, or delete them; the section hides
   itself when the array is empty.
5. **Have the legal text reviewed.** It is a plain-language skeleton, not legal advice.
6. **Author the captions.** `CaptionTrack` support is wired through the player; no `.vtt`
   files exist yet.
7. **Upload the real product files.** Every `url: null` currently renders as
   "being prepared" — which is honest, but it is not a shippable catalogue.
