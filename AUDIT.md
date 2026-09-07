# Awraq — Frontend / UX Audit

**Reviewer:** Senior Frontend Engineer (10 yrs, ed-tech & commerce)
**Date:** 2026-09-07
**Commit reviewed:** `78bee9a` (branch `arena/01a07b65-awraq`)
**Stack:** React 19 + Vite 6 + Tailwind v4 + i18next + lucide + motion (installed, unused)

---

## 0. How I tested

| What | Method |
|---|---|
| Runtime | `npm run dev` on :3000, walked every page & flow |
| Build | `vite build` → bundle analysis |
| Types | `tsc --noEmit` |
| Contrast | Computed WCAG ratios for every brand pairing (script) |
| Render bug | Reproduced the dashboard Notes loop in an isolated jsdom + React 19 harness |
| SEO/social | `curl` of served HTML + meta inspection |
| Code | Full read of all 36 source files (9,162 LOC) |

---

## 1. Verdict

**This is an impressive-looking prototype and a long way from a shippable product that takes money.**

The visual craft on the homepage is genuinely above average — the glassmorphic dark hero, the 3D icon set, the marquee, the depth work with `border-b-[6px]` "pressable" buttons. Someone with taste built this.

But the moment you leave the homepage, the illusion breaks. **The product you're selling doesn't exist in the UI.** There is no video player. Downloads point at `#`. The certificate can't be downloaded. The checkout takes a phone number and a fake 2-second timeout and grants lifetime access. And there are three different brand identities fighting each other across five pages.

The core issue: **the homepage was designed, everything else was assembled.**

### Scorecard

| Area | Score | One-line |
|---|---|---|
| Visual design (homepage) | **8/10** | Confident, modern, coherent |
| Visual design (app pages) | **4/10** | Three palettes, generic Tailwind defaults |
| Design system consistency | **3/10** | 175× cyan vs 55× blue vs emerald, no tokens enforced |
| Information architecture | **3/10** | No router, no URLs, everything is one scroll |
| User flow / conversion | **4/10** | Hidden pricing, no cart, auth wall before value |
| Accessibility | **2/10** | 1.9:1 contrast on the primary brand colour, zero dialog semantics |
| Performance | **5/10** | 529 kB single chunk, zero lazy images |
| i18n | **2/10** | Amharic switch does nothing on 80% of the site |
| Mobile | **6/10** | Thoughtful touch targets, but drawer & player have real problems |
| Code health | **4/10** | One confirmed infinite render loop, ~400 LOC dead code |
| Trust & commerce readiness | **2/10** | Placeholder testimonials, unbacked guarantee, no legal pages |

---

## 2. KEEP — don't let anyone talk you out of these

These are real assets. Preserve them while you fix everything else.

1. **The dark hero aesthetic.** `#0E0024` + fixed radial gradient wash + glass cards is a strong, differentiated look for the Ethiopian ed-tech market, which is a sea of white-and-blue Udemy clones. Keep it. *(Extend it — see §5.)*

2. **The "pressable" button treatment.** `border-b-[5px]` + `hover:translate-y-[3px]` + coloured glow shadow. It's tactile, it reads as clickable, it's consistent. This is the single best micro-interaction in the app. Systematise it as `<Button>`.

3. **The custom 3D icon set** (`ThreeDIcons.tsx`, 678 LOC of hand-built SVG). Massively better than another row of lucide outlines. This is brand equity — reuse it in the dashboard empty states, the player, and the course cards.

4. **`index.css` design tokens.** The `:root` / `[data-theme="dark"]` token layer is well-structured and complete. The problem isn't the tokens — it's that ~85% of components ignore them. The foundation is right.

5. **Mobile touch-target discipline.** `min-h-[48px]` on drawer CTAs, `w-11 h-11` icon buttons, the `font-size: 16px !important` on mobile inputs to stop iOS zoom, `env(safe-area-inset-*)`, `dvh` over `vh`. Someone actually knows mobile. Rare.

6. **Local payment methods as the primary path.** Telebirr / CBE Birr / Chapa, with card as an afterthought, is exactly right for Ethiopia. The logo-swatch selector is good UI.

7. **Free-course-first funnel.** `isFree` courses bypass auth entirely and drop you straight into the player (`App.tsx:236`). That's a smart, low-friction top-of-funnel. Keep it and lean harder into it.

8. **The course player's information architecture.** Collapsible modules, per-module progress bars, lesson search, an Outline/Resources/Notes tab split, auto-expand-to-active-lesson. The *structure* is genuinely well thought through. It just needs real content behind it.

9. **Persisted notes per lesson** keyed by `awraq_notes_${courseId}`, surfaced in a searchable dashboard tab. This is a differentiating feature most competitors don't have.

10. **Amharic typography handling.** `Noto Sans Ethiopic`, `line-height: 1.55` for Ethiopic script, and a `.keep-latin` escape hatch for code/numerals. That's a level of care most teams skip. *(The content just needs to actually be translated.)*

---

## 3. CRITICAL — launch blockers

### 🔴 C1. Confirmed infinite render loop in the Student Dashboard

`src/pages/StudentDashboard.tsx:74–106`

```tsx
const myCourses = COURSES.filter(c => purchasedCourseIds.includes(c.id)); // new array EVERY render
...
useEffect(() => {
  if (activeTab === 'notes') { ...; setAllNotes(collected); }  // new array ref
}, [activeTab, myCourses]);                                     // ← re-fires forever
```

`myCourses` is recreated on every render, so the effect re-fires, `setAllNotes` produces a new array, which re-renders, which recreates `myCourses`…

**I reproduced this in an isolated React 19 harness. React throws `Maximum update depth exceeded` and the effect ran 200+ times in 500 ms before my safety valve stopped it.** In production this pegs a CPU core and freezes the tab the moment a paying student opens their Notes tab.

**Fix:** wrap `myCourses` in `useMemo(..., [purchaseHistory])`, or better, drop `myCourses` from the deps and depend on `purchaseHistory` directly.

---

### 🔴 C2. There is no video player

`src/pages/CoursePlayerPage.tsx:663–673`

```tsx
<button className="..." aria-label="Play video">   {/* no onClick */}
  <Play />
</button>
```

The "player" is `course.thumbnail` at `opacity-40` with a decorative play button. No `videoUrl` field is populated anywhere in `src/data/courses.ts`. **A student pays ETB 199, clicks play, and nothing happens.**

You cannot sell a video course without video playback. This is the #1 thing to build.

**Fix:** add `videoUrl` to the `Lesson` type (it already exists in `types.ts:37` — unused), and integrate a real player. For Ethiopian bandwidth, HLS with quality selection + a "download for offline" option would be a genuine competitive advantage.

---

### 🔴 C3. Downloadable resources download nothing

- `src/data/digitalProducts.ts:17–108` — **every single `url` is `'#'`.** Clicking "Download Resource" on a purchased product navigates to `#`.
- `src/pages/CoursePlayerPage.tsx:485–532` — the player's Resources tab is **three hardcoded fake files** ("Lesson Slides.pdf", "Worksheet.xlsx", "Additional Reading.pdf") shown identically for every lesson of every course, all `href="#"`.

You are literally selling files that don't exist.

---

### 🔴 C4. Checkout is theatre — no payment integration

`src/pages/CheckoutPage.tsx:32–39`

```tsx
setIsProcessing(true);
setTimeout(() => { setIsProcessing(false); setIsSuccess(true); }, 2000);
```

No Chapa API call, no webhook, no order verification, no idempotency, no receipt, no email. Entitlement is granted client-side and stored in `localStorage`.

**Security consequence:** anyone can unlock every course on the site with:
```js
localStorage.setItem('awraq_purchasedCourseIds', JSON.stringify(['masterclass', ...]))
```
There is no server. There is nothing to bypass — the client *is* the authority.

Related: the phone input accepts any string (`type="tel"`, no pattern, no length validation), and `+251` is a static prefix span rather than part of a validated field.

---

### 🔴 C5. Brand colour fails WCAG catastrophically

I computed every pairing:

| Pairing | Ratio | WCAG AA (4.5:1) |
|---|---|---|
| `#07CCFD` text on white | **1.90:1** | ❌ fails by 2.4× |
| `#07CCFD` text on `#FBFBFA` | **1.83:1** | ❌ |
| White text on `#07CCFD` | **1.90:1** | ❌ |
| `#20B486` (price!) on white | **2.65:1** | ❌ |
| `#3B82F6` on white | **3.68:1** | ❌ |
| `text-slate-400` on white | **2.54:1** | ❌ |
| `#0F172A` on `#07CCFD` (button) | 9.41:1 | ✅ |

`#07CCFD` appears **175 times**. It is used for: prices, active nav items, active filter chips, active player tabs, "Clear Search & Filters" links, category labels, instructor roles, and the entire focus-ring system.

**On a light background, your brand colour is functionally invisible to anyone with low vision, and difficult for everyone else in daylight on a phone — which is how most of your Ethiopian audience will use this.**

Note the one thing that *works*: dark text on a cyan fill (9.41:1). Cyan is a great **fill** colour and a terrible **text** colour.

**Fix:** introduce `--color-brand-primary-text: #0284A8` (or similar, ≥4.5:1) for text/icon use, keep `#07CCFD` for fills, glows, and dark backgrounds only. This is a find-and-replace with judgement, not a redesign.

---

### 🔴 C6. Zero accessible dialog semantics — app-wide

```
grep -rn 'role="dialog"|aria-modal|Escape|onKeyDown' src  →  0 results
```

Across **five modals** (SignIn, Consultation, Video, ProductDetail, ArticleDetail) and the course preview overlay:

- No `role="dialog"` / `aria-modal="true"` / `aria-labelledby`
- **No Escape-to-close** — the single most expected interaction in any modal
- No focus trap — Tab escapes into the page behind the overlay
- No focus restoration to the trigger on close
- Backdrop click-to-close relies on `stopPropagation`, so a mouse-down inside + mouse-up on the backdrop closes the dialog and destroys form input

Screen-reader users are announced nothing. Keyboard users are stranded. This alone would fail any procurement or accessibility review.

---

### 🔴 C7. No router — the entire site is one URL

`App.tsx` drives navigation with `useState<Page>` + manual `history.pushState`. Consequences:

- **You cannot link to a course.** No `/courses/complete-digital-marketing-masterclass`. Every share, every ad, every WhatsApp forward, every email lands on the homepage. For a course business, this is a revenue problem, not a technical one.
- **Zero SEO.** I curled the served HTML — the body is `<div id="root"></div>`. Google sees an empty page. You have `slug` fields sitting unused in `types.ts:57`.
- **Social previews are broken.** `twitter:card` is `summary_large_image` with **no `og:image` defined**. Shared links render as a grey box.
- **Refresh mid-flow dumps you home.** Refresh during checkout → homepage. Refresh in the player → homepage.
- No canonical, no `hreflang` for en/am, no sitemap, no `robots.txt`.
- `/favicon.svg` **404s** (no `public/` directory exists) — the SPA fallback quietly serves `index.html`, so you get a broken favicon in every tab.

**Fix:** React Router (or TanStack Router) with real paths, plus prerendering (`vite-plugin-ssg` or move to Next/Remix) for at least `/`, `/courses`, and each course/product detail page.

---

## 4. HIGH — UX & conversion damage

### 🟠 H1. Amharic is a lie

- **`HomePage.tsx` contains exactly 0 `t()` calls.** Your entire landing page — hero, value props, 8 skill areas, course cards, resources, about, testimonials, FAQ, contact — is hardcoded English.
- `CheckoutPage`, `CoursePlayerPage`, `CertificatePage`, `BundlePage`, `DigitalProductPage`, `ResourceAccessPage`: **0 `t()` calls each.**
- `src/data/*.ts`: **zero `_am` fields** on any course, product, or bundle (only `faq.ts` has them).
- `src/utils/getLocalized.ts` exists, is well written, and is **never imported anywhere.**

Switching to አማርኛ changes the nav, the footer, parts of the course detail page, and the font. Everything else stays English. You're advertising bilingual (`index.html` `og:locale:alternate`) and delivering monolingual.

Given your market, this is the **highest-ROI fix on this list after C2**. The infrastructure is 90% built; it just needs to be wired up and the content written.

---

### 🟠 H2. Three brand identities in one product

| Surface | Primary | Secondary |
|---|---|---|
| Navbar, Homepage, Player accents | Cyan `#07CCFD` | Pink/Yellow/Purple |
| Checkout, SignIn, Certificate, Resource pages | Blue `#3B82F6` | — |
| Consultation modal | Dark green `#064E3B` → `#047857` | Emerald |
| Prices & success states | Emerald `#20B486` | — |
| `index.html` `::selection` | Emerald `#10B981` on `#064E3B` | — |

The user journey is: **cyan** homepage → **blue** course page CTA → **blue** checkout → **cyan** dashboard → **green** consultation modal. It reads like three different companies, and it actively undermines trust at the exact moment money changes hands.

`MobileStickyCTA.tsx` even has a four-way `accent` prop (`blue | green | purple | cyan`) — the inconsistency is *encoded into a component API*.

**Fix:** pick one primary. Given the homepage is your best work, pick cyan (with the accessible text variant from C5). Reserve green for success/owned states only. Delete the `accent` prop.

---

### 🟠 H3. Dark mode is half-built and visibly broken

You shipped a full dual-theme token system, a `ThemeProvider`, and a toggle in the navbar. Then:

- `HomePage.tsx:172` hardcodes `bg-[#0E0024]` — the homepage is **always dark**, in both themes. The toggle does nothing there.
- `Navbar.tsx:110` hardcodes `bg-white` — the nav is **always light**.
- `CertificatePage.tsx:22` and `ResourceAccessPage.tsx:21` hardcode `bg-[#F8FAFC]`.
- `CoursePlayerPage.tsx`: 57 hardcoded slate/white classes — the sidebar is `bg-white` regardless of theme.

Hardcoded-colour counts per file: Player 57, Home 46, CourseDetail 26, Navbar 26, Consultation 24, Dashboard 21…

**Net result:** a user in dark mode scrolls a dark homepage, hits a permanently white navbar, clicks a course, and lands on a light page. The toggle is a broken promise.

**Decide:** either (a) commit to dark-only for marketing + light for the app and **remove the toggle**, or (b) do the token migration properly. Option (a) is honest and takes an hour. Option (b) is a week. Do not ship the current state.

---

### 🟠 H4. Auth wall before value

`App.tsx:243–248` — clicking "Enroll Now" on a paid course opens the SignIn modal *before* checkout. Classic conversion killer: you're asking for commitment before the user has seen a price breakdown or a payment option.

Worse, the modal is prefilled with demo credentials:

```tsx
const [email, setEmail] = useState('learner@awraq.com');   // SignInModal.tsx:19
const [password, setPassword] = useState('••••••••');       // :20  ← literal bullets!
```

A real user who taps "Sign In" without editing submits the literal string `••••••••` as a password. This will ship if nobody catches it.

Also missing from auth: no OAuth (Google/Facebook — both huge in Ethiopia), no phone-number auth (arguably *more* relevant than email here), no password strength meter, no show/hide password toggle, no error states at all, no "forgot password" destination (`href="#forgot"` goes nowhere), no terms-acceptance checkbox on signup.

**Fix:** guest checkout, or collect email at the *payment* step. Add Google + phone auth.

---

### 🟠 H5. No cart, no multi-item purchase

You sell courses, digital products, **and bundles** — and there is no cart. A user who wants two templates must complete two entire checkouts.

The bundle system compensates (`App.tsx:277–330` fans a bundle purchase out into individual entitlements — good logic), but it's a rigid substitute for a cart. There's also no upsell/cross-sell at checkout, no "customers also bought", and no coupon field.

---

### 🟠 H6. Placeholder content in production copy

`HomePage.tsx:817–818`:
```tsx
{ quote: '...', author: 'Client Name', role: 'Business Owner' },
{ quote: '...', author: 'Client Name', role: 'Freelancer' }
```

**Two testimonials, both attributed to "Client Name", with 5 stars.** Nothing destroys trust faster on a page asking for money. Meanwhile `src/data/testimonials.ts` exists with real structure and is **never imported**.

More credibility problems:
- Hero says **"300+ Students Taught"** (`HomePage.tsx:116`). SignIn modal says **"Join 5,000+ students"** twice (`SignInModal.tsx:92, 130`). Pick one. 16× discrepancies get noticed.
- Courses claim `rating: 4.9, reviewsCount: 384` — there is **no review UI anywhere**. Unverifiable social proof.
- "Trusted By" marquee shows 6 client logos with no context, case study, or link.
- **"14-Day Money-Back Guarantee"** (`CourseDetailPage.tsx:515`) with **no refund policy page anywhere**. In some jurisdictions that's an unenforceable claim; everywhere it's a support nightmare.
- Footer "Terms" → `href="#terms"`. "Privacy" → `href="#privacy"`. **Neither page exists.** You cannot legally take payments without these.

---

### 🟠 H7. The certificate is decorative

`CertificatePage.tsx:35–43` — "Share" and "Download PDF" are `<button>` elements **with no `onClick`**. They do nothing.

The certificate also has:
- No verification ID or public verify URL — it's unverifiable, therefore worthless to a job applicant
- No QR code
- No LinkedIn "Add to Profile" deep link (the single highest-value action for a certificate, and free marketing for you)
- `completionDate` is `new Date()` — **today's date, every time you open it**, not the actual completion date
- Awarded to nobody — there's no student name field anywhere in the app

For a paid course, the certificate is a major part of perceived value. Right now it's a screenshot.

---

### 🟠 H8. Contact form is a no-op

`HomePage.tsx:883`:
```tsx
<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
```

Four fields, a "Send Message" button, and **nothing happens**. No submit handler, no success state, no error state, no validation, no `required`, no loading state. A prospective customer types a question, hits send, and gets total silence. They assume you're dead.

The fields also have no `id`/`htmlFor` pairing, no `name` attributes, and no `autocomplete` — so labels aren't associated (a11y failure) and browser autofill won't work.

Same class of problem in `ConsultationModal`: `handleSubmit` just flips `setIsSubmitted(true)` (`:72–75`). The success screen promises "Lamlak will email you within 24 hours" — no email is ever sent. And no price is shown for a 1-on-1 consultation anywhere, which will kill that funnel by itself.

---

### 🟠 H9. Navigation bugs

1. **Wrong scroll target.** `Navbar.tsx:181` — the Explore dropdown's "Free Sessions" scrolls to `#learning` ("Choose How You Learn"), but the free sessions section is `#free-learning`. Users land on the wrong section.
2. **Scrollspy blind spot.** `Navbar.tsx:38` tracks `['home','learning','courses','resources','about','contact']` and omits `free-learning`. Scrolling through that entire section leaves "Learning" incorrectly highlighted.
3. **Search doesn't search.** `Navbar.tsx:96–101` — the search form ignores `searchQuery` entirely and just scrolls to `#courses`. The course/resource sections *have* working local search — the nav search should feed into it.
4. **Scroll handler runs unthrottled** on every scroll event and does 6 × `getBoundingClientRect()` (forced layout) per frame. Use `IntersectionObserver`.
5. **Timing-based navigation.** `Navbar.tsx:89` and `Footer.tsx:17` use `setTimeout(..., 150)` / `100` to wait for the homepage to mount before scrolling. On a slow device this misses and the user lands at the top with no explanation.
6. **`window.history.back()` used for "Back" buttons** (`CheckoutPage.tsx:84`, `CoursePlayerPage.tsx:207`). If the user deep-linked or the entry was replaced, this exits your site.

---

### 🟠 H10. Course discovery doesn't scale past ~12 items

The catalogue is a flat grid on the homepage with category chips and a text search. Missing everything a real course marketplace needs:

- No sort (price, popularity, newest, rating, duration)
- No filters for level / duration / language / price range — despite `level` existing on every course
- No pagination or infinite scroll
- No "free" filter (free courses live in an entirely separate section, so `FREE_COURSES` never appear in the main grid)
- No results count ("Showing 6 of 24")
- No skeleton/loading states anywhere in the app
- No recently-viewed or "continue where you left off" on the homepage for returning users
- Filter state isn't in the URL, so a filtered view can't be shared or bookmarked (a symptom of C7)

---

## 5. MEDIUM — polish & craft

### 🟡 M1. Performance

```
dist/assets/index-*.js   529 kB │ gzip: 141 kB   ← single chunk, no splitting
dist/assets/index-*.css  116 kB │ gzip:  17 kB
```

- **Zero code splitting.** The course player, certificate, dashboard, and checkout all ship to a first-time visitor who only wants to read the homepage. `React.lazy` on the 8 page components would cut initial JS roughly in half.
- **Zero lazy-loaded images.** 31 `<img>` tags, **0 with `loading="lazy"`**, 0 with `width`/`height`, 0 with `srcset`. The homepage alone loads ~20 Unsplash/Cloudinary images at full resolution on first paint. On a 3G connection in Addis this page is brutal. Every image is also a guaranteed CLS contributor.
- **No `<link rel="preload">` for the LCP hero image**, which is a 550px Cloudinary PNG.
- **Fonts loaded twice** — `index.html:36` links Noto Sans Ethiopic, and `index.css:5` `@import`s it again. The `@import` also triggers the build warning about import ordering. The Latin fonts request weight range `300..800` for two families (Fraunces has an optical-size axis too) — that's a lot of variable font bytes for a page that mostly uses 700/900.
- **A global CSS transition on every element:**
  ```css
  *, *::before, *::after { transition: background-color .3s, border-color .3s, color .3s, box-shadow .3s; }
  ```
  This forces the compositor to consider thousands of nodes and makes every hover feel laggy. Scope it to a `.theme-transition` class on `<html>` toggled only during a theme switch.
- **`animate-marquee` runs infinitely**, off-screen, forever — a permanent main-thread/compositor cost. Pause with `IntersectionObserver`.
- **`prefers-reduced-motion` is never respected.** You have a bouncing hero card, a marquee, blur-heavy hover glows, and translate-on-hover everywhere. Vestibular-disorder users will suffer.
- **Heavy blur stacking:** four fixed `blur-[120px]` radial gradients + `backdrop-blur-xl` on dozens of cards. On mid-range Android this drops scroll to ~30fps. Test on a real Tecno/Infinix device.
- **`motion` (framer-motion, ~50 kB) is a dependency and is never imported.** Same for `@google/genai`, `express`, `dotenv`, `@types/express`, `tsx`, and `autoprefixer` (Tailwind v4 doesn't need it). Drop them.

### 🟡 M2. ~400 LOC of dead code

Never imported anywhere:
- `components/VideoModal.tsx` (169 LOC)
- `components/ArticleDetailModal.tsx` (158 LOC)
- `components/ProductDetailModal.tsx` (125 LOC)
- `data/testimonials.ts`, `data/sessions.ts` (183 LOC of *good* data, unused)
- `utils/getLocalized.ts` (19 LOC)

Meanwhile `HomePage.tsx:933` re-declares `@keyframes marquee` and `.hide-scrollbar` in a `dangerouslySetInnerHTML` `<style>` block — **both already exist in `index.css`**. Duplicate CSS shipped twice.

`data/sessions.ts` has real `videoEmbedId`s (`f02mOEt11OQ`, `e-ORhEE9VVg`) and `VideoModal` knows how to play them. The free-sessions video feature is **90% built and simply not wired up.** That's a quick win.

### 🟡 M3. Formatting & locale

- **Prices render as `ETB 199.00`** everywhere. Ethiopian Birr is not commonly quoted with cents in retail. Use `Intl.NumberFormat('am-ET', { style:'currency', currency:'ETB' })` → `ETB 199`. And you'll want Ethiopic numerals as an option for the Amharic locale.
- **`ResourceAccessPage.tsx:57`: `Purchased on: {purchaseDate}`** renders the **raw ISO string** — `Purchased on: 2026-09-07T10:25:31.442Z`. The dashboard formats the same field correctly (`:662`, `:892`), so this is just an oversight.
- **Consultation time slots are in UTC** (`ConsultationModal.tsx:31`: `"Morning (09:00 - 12:00 UTC)"`). Ethiopia is UTC+3. Worse, Ethiopia commonly uses a **6-hour-offset local clock**. Show EAT, and consider showing both conventions.
- Dates use `toLocaleDateString('en-US')` hardcoded — should follow the active locale, and ideally offer the Ethiopian calendar.

### 🟡 M4. Missing states, everywhere

No loading skeletons. No error boundaries (one bad render white-screens the whole app). No 404 view — `App.tsx:379` silently falls back to `HomePage` for unknown routes, so a typo'd URL shows the homepage instead of telling the user anything. No offline handling. No toast/notification system — every confirmation is a full-screen takeover.

Empty states are text-only where you have a beautiful 3D icon set sitting right there.

### 🟡 M5. Smaller a11y issues beyond C5/C6

- **`<h1>` used twice on one page** in the player (`CoursePlayerPage.tsx:215` course title, then `:695` `<h2>` lesson title) — and the homepage's section headings jump around the hierarchy.
- **7 dead `href="#"` links** — these are keyboard-focusable and announced as links to screen readers but do nothing.
- **7 `<div onClick>` handlers** (course cards, skill cards, learning-way cards) — not keyboard-focusable, not announced as interactive, no Enter/Space handling. Wrap in `<button>` or add `role`/`tabIndex`/`onKeyDown`.
- **No skip-to-content link** — keyboard users tab through the entire nav on every page.
- **Icon-only buttons missing labels:** the mobile sidebar close in the player (`:290`) has no `aria-label`.
- **`aria-current` is never used** for active nav items — the visual highlight isn't conveyed non-visually.
- **Form inputs have no `id`/`htmlFor`** in the contact form and several others.
- **`maximum-scale=5.0`** in the viewport meta caps pinch-zoom. Remove the cap entirely.
- **Focus indicator is `outline: 2px solid var(--color-brand-primary)`** — which is the 1.9:1 cyan. The focus ring itself is nearly invisible on white.

### 🟡 M6. Mobile-specific

- **Mobile drawer positioning is fragile:** `Navbar.tsx:339` sets `top: 'max(3.5rem, calc(3.5rem + env(safe-area-inset-top)))'` on the backdrop while the panel below uses `absolute w-full … mt-[1px]` inside a `fixed` header. The two will desync when the navbar changes height on scroll (`py-3` → `py-2.5`) — expect a visible seam or gap mid-scroll.
- **The drawer is `max-h-[min(85dvh, calc(100dvh-4rem))] overflow-y-auto`** with nav + search + language + theme + 2 CTAs stacked. On a small phone in landscape this becomes a cramped scroll-within-scroll.
- **The player's Notes tab is `hidden md:flex`** — mobile students cannot take notes at all. Notes are one of your best features; hiding them on the dominant device is a strange call. Use a bottom sheet.
- **The player hides prev/next arrows behind `opacity-0 group-hover:opacity-100`** — `:hover` doesn't exist on touch. Mobile users can only navigate lessons via the drawer.
- **The homepage's fixed radial gradients + `backdrop-blur-xl`** are the single biggest mobile-scroll performance risk in the codebase.
- **Two separate hamburger buttons** (`sm:hidden` and `hidden sm:flex lg:hidden`) render the same drawer with duplicated markup — merge them.

### 🟡 M7. Content & copy

- Hero: **"Master Digital Marketing"** — generic. It says nothing about *who it's for*, *what outcome*, or *why Awraq*. Compare: "Learn digital marketing in Amharic — and get your first paying client in 90 days." Your actual differentiators (Amharic, local payments, 1-on-1 access to Lamlak, plain-language teaching) are **completely absent from the hero.**
- **"Awraq" (አውራቅ) is never explained.** New visitors don't know what the brand means or that it's Ethiopian.
- **Two competing primary CTAs** in the hero ("Start Learning" and "Book a Consultation") with near-equal weight. Pick one primary.
- Section headings are all generic ("What You Can Learn", "Choose How You Learn", "Learn Skills You Can Actually Use") — and #2 and #5 say roughly the same thing in different words.
- **The page is ~15 sections long** with the course catalogue buried at #7. Most visitors will never scroll that far. Move courses to #3.
- **The instructor bio is the same hardcoded sentence for every course** (`CourseDetailPage.tsx:410`) even though `Course.instructor.bio` exists in the type.
- Free courses use "Start Learning"; paid courses use "View Course" / "Enroll Now" / "Continue Learning" — three CTA vocabularies for one concept.

### 🟡 M8. Code health

- **`tsc --noEmit` passes**, but `strict` mode's value is undercut by `handleOpenItemDetail(item: any, ...)` in `App.tsx:216` — the central navigation function is untyped.
- **All state in one 526-line `App.tsx`** with 8 `useState` + 5 `useEffect` persistence hooks. Every `localStorage` write is a separate effect. Extract to a reducer or Zustand.
- **`localStorage` reads are unguarded** — `JSON.parse` on corrupted data throws during the `useState` initializer and white-screens the app on load with no recovery path.
- **Route protection is client-side and trivially bypassed** (`App.tsx:159–176`) — as noted in C4, there's no server to protect anything.
- No tests. No ESLint config (the code has `// eslint-disable-next-line` comments for a linter that isn't installed). No CI. No Prettier.
- `README.md` is still the unmodified Google AI Studio template, complete with a Gemini banner image and instructions to set `GEMINI_API_KEY` — for an app that makes no AI calls.

---

## 6. Flow-by-flow walkthrough

### Flow A — First-time visitor → paid course
```
Homepage (dark, cyan)
  → scroll ~7 sections to reach courses          ⚠️ too deep
  → click card                                    ⚠️ URL never changes
  → Course Detail (light, BLUE CTA)               ⚠️ brand whiplash
  → "Watch Free Preview"                          ⚠️ modal has no Escape
  → "Enroll Now"
  → SignIn modal, prefilled fake creds            🔴 auth wall + shipping bug
  → auto-redirect to Checkout (blue)
  → phone number, no validation
  → 2s fake spinner                               🔴 no real payment
  → Success → Dashboard (cyan)                    ⚠️ third palette
  → "Start Learning" → Player (dark navy)         ⚠️ fourth palette
  → click Play                                    🔴 NOTHING HAPPENS
```
**Result: user paid and received nothing.** Also: no order confirmation, no receipt, no email, and refreshing at any step returns them to the homepage.

### Flow B — Returning student
```
Homepage → Sign In → Dashboard
  → "Notes" tab                                   🔴 INFINITE LOOP, tab freezes
  → "Certificates" tab → certificate
  → "Download PDF"                                🔴 dead button
```

### Flow C — Digital product
```
Resources section → product → Buy → Checkout → Resource Access
  → "Purchased on: 2026-09-07T10:25:31.442Z"      ⚠️ raw ISO string
  → "Download Resource" → href="#"                🔴 downloads nothing
```

### Flow D — Amharic speaker
```
Click አማርኛ
  → nav + footer translate
  → the entire homepage stays English             🔴 the product is not bilingual
  → all course titles/descriptions stay English
  → checkout stays English
```

### Flow E — Keyboard / screen-reader user
```
Tab into page → no skip link, 20+ tab stops through nav
  → reach a course card → it's a <div>, not focusable   🔴 unreachable
  → open any modal → no announcement, no focus trap     🔴 stranded
  → Escape → nothing                                     🔴
```

---

## 7. Prioritised roadmap

### Sprint 0 — Stop the bleeding (2–3 days)
1. Fix the dashboard infinite loop (**C1**) — 5 minutes, highest severity/effort ratio in the codebase
2. Remove the prefilled `••••••••` password and demo email (**H4**) — 2 minutes
3. Replace "Client Name" testimonials with real ones or delete the section (**H6**) — 30 minutes
4. Reconcile 300+ vs 5,000+ students (**H6**)
5. Fix the raw ISO purchase date (**M3**)
6. Wire the contact form and consultation form to a real endpoint (Formspree/Resend is fine day one) (**H8**)
7. Fix the `#learning` / `#free-learning` scroll target (**H9**)
8. Add `loading="lazy"` + `width`/`height` to all 31 images (**M1**) — ~1 hour, big mobile win
9. Delete unused deps and the 400 LOC of dead components (**M2**)
10. Add a `public/favicon.svg` (**C7**)

### Sprint 1 — Make it real (2–3 weeks)
11. **Real video playback** (**C2**) — nothing else matters until this exists
12. **Real Chapa integration + a backend** with webhook verification and server-side entitlements (**C4**)
13. **Real file storage** with signed, expiring download URLs (**C3**)
14. **React Router + real URLs + prerendering** (**C7**)
15. Terms, Privacy, and Refund Policy pages (**H6**)
16. Order confirmation emails + receipts

### Sprint 2 — Make it usable (1–2 weeks)
17. **Accessible-contrast brand text colour** and a global sweep (**C5**)
18. **Modal primitive** with `role="dialog"`, Escape, focus trap, focus restore — one component, five call sites (**C6**)
19. **Pick one brand palette** and migrate every hardcoded hex to tokens (**H2**)
20. **Decide on dark mode** — commit or remove (**H3**)
21. Keyboard-accessible cards, skip link, `aria-current`, focus rings (**M5**)
22. Loading skeletons, error boundary, 404 page, toast system (**M4**)

### Sprint 3 — Make it convert (1–2 weeks)
23. **Full Amharic translation** — wire `getLocalized`, add `_am` to all data, `t()` the homepage (**H1**)
24. Cart + multi-item checkout (**H5**)
25. Guest checkout / defer auth (**H4**), plus Google + phone auth
26. Verifiable certificates with IDs, QR, and LinkedIn deep link (**H7**)
27. Rewrite the hero around your actual differentiators (**M7**)
28. Sort/filter/pagination on the catalogue (**H10**)
29. Code splitting, font consolidation, remove the global `*` transition (**M1**)

---

## 8. Closing note

You have a designer's eye and a real feel for mobile. The homepage would not look out of place next to a well-funded product, and the 3D icons and pressable-button system are things most teams never bother to build.

What's missing is the **discipline layer**: one palette instead of three, one token system actually enforced, real URLs, real data behind the UI, and a keyboard/screen-reader pass. Those are learnable and mostly mechanical.

The one thing I'd internalise: **every fake element you ship is a trust withdrawal.** A play button that does nothing, a download that goes to `#`, a "Client Name" testimonial, a guarantee with no policy — individually small, collectively they tell a paying customer that nothing on this site is real. In a market where people are already cautious about paying online, that's the difference between a business and a portfolio piece.

Fix C1 today. Build C2 next. Everything else follows.
