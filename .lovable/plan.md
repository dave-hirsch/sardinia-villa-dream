
# My Sardinian Villa — v1 Plan

Polished frontend for a curated collection of Sardinian villas, with enquiries stored in the database and emailed to Marion. Admin CMS and full DE/IT/FR translations come in v2.

## Design direction

Mediterranean minimal, editorial feel. I'll generate 3 rendered directions to pick from before building. Guardrails:

- **Palette:** warm off-white background (#FAF7F1 sand), deep sea (#1E4E6B azure), terracotta accent (#C86B4A), muted olive text (#4A5344), charcoal (#1F2422).
- **Type:** refined serif for headings (Cormorant Garamond or Fraunces), clean humanist sans for body (Inter or Figtree). Loaded via @fontsource.
- **Photography-forward:** big edge-to-edge villa/landscape imagery, generous whitespace, thin rules, small caps micro-labels. No stock-photo card grids.
- **Copy rules:** never use "ultra luxury", "exclusive", "authentic", "boutique", "concierge", "barefoot luxury".

## Pages & routes

Public routes under TanStack file-based routing:

- `/` — hero image, overlay search bar (destination, dates, guests, bedrooms), Marion intro, featured villas carousel (5), experiences strip, CTA to villas.
- `/villas` — grid + filter sidebar (location, bedrooms, sleeps, price, beach distance, pool, sea view, AC), sort (price, bedrooms, newest), tag badges, top search bar.
- `/villas/$slug` — image slider, key facts, sectioned description (Overview, Bedrooms, Amenities, Outdoor, Location, Services on request), gallery lightbox, approximate map, sticky enquiry button opening a modal form, suggested experiences, related villas.
- `/experiences` + `/experiences/$slug` — grid and detail pages, each detail links to enquiry form pre-selecting that experience.
- `/destinations` + `/destinations/$slug` — intro, villas in destination, tips, gallery, related guide articles.
- `/guide` + `/guide/$slug` — blog index and article pages with related content.
- `/about` — Marion's page using her real bio.
- `/list-your-property` — benefits + contact form for owners.
- `/contact` — 2-step enquiry form.
- `/privacy`, `/faq` — legal + FAQ.
- 404 via existing root notFoundComponent.

Each leaf route sets its own `head()` with title, description, og:title, og:description, canonical, og:url. Villa pages include `LodgingBusiness` JSON-LD; articles include `Article` JSON-LD. Sitewide Organization JSON-LD in `__root.tsx`.

## Data (Lovable Cloud / Supabase)

Tables in `public` with RLS + grants:

- `villas` — all fields from the spec + `meta_title`, `meta_description`, `created_at`. Public `SELECT` to `anon`.
- `experiences`, `destinations`, `articles` — same shape as spec, public `SELECT` to `anon`.
- `destination_villas` — join table (destination_id, villa_id).
- `enquiries` — all fields from spec + `created_at`, `status`. Public `INSERT` to `anon`; `SELECT` only to `authenticated` with an admin role check (via `user_roles` table + `has_role` security-definer function — set up for v2 admin UI, no login surface yet).
- `user_roles` + `app_role` enum — seeded now so v2 admin work drops in cleanly.

Seed migration inserts ~6 realistic Sardinian villas (Chia, Villasimius, Pula, Costa Rei, Teulada), ~6 experiences (Private Chef, Boat Trip, Winery Tour, Babysitting, Cleaning, Airport Transfer), 4 destinations, 3 guide articles. Unsplash Sardinia URLs for photography.

## Enquiries flow

- Contact form and villa modal write to `enquiries` via the anon key + INSERT policy.
- On successful insert, call a `createServerFn` that sends Marion an email via Lovable's built-in email infrastructure (`email_domain--setup_email_infra` + a `new-enquiry` React Email template). No WhatsApp automation — Contact page shows a prominent `wa.me/` click-to-chat link and Marion's email.
- Zod validation on both client and server; honeypot field.

## i18n

- Install `i18next` + `react-i18next` + `i18next-browser-languagedetector`.
- Language switcher in the header (EN / DE / IT / FR). Default EN.
- v1 ships full English strings in `src/i18n/locales/en.json` and stub files for `de.json`, `it.json`, `fr.json` (structure mirrored, values fall back to English until translated). This is the "translations ready" deliverable — real translations land in v2.
- Villa/experience/destination/article bodies stay in the DB in English for v1; schema keeps a translation path open for v2 (jsonb `translations` column planned but not implemented now to avoid dead complexity).

## Global UI

- Sticky translucent header with logo wordmark, nav, language switcher.
- Footer with nav, contact, socials, legal links.
- Cookie consent banner (EU-compliant, granular for analytics) — analytics scripts (GA4, Meta Pixel) only load after consent. Env-var-driven IDs; left blank until Marion provides them.
- Responsive at 375 / 768 / 1280 / 1920.

## What's explicitly out of v1

- Admin CMS (v2 — will use `_authenticated` routes + `user_roles`).
- Real DE/IT/FR translations (structure ready, strings pending).
- Booking engine, wishlist, payments, WhatsApp automation.
- Real availability calendars.

## Technical notes

- TanStack Start + file-based routing under `src/routes/`.
- TanStack Query for all reads: `ensureQueryData` in loader + `useSuspenseQuery` in component, using the server publishable Supabase client for SSR-safe public reads.
- Enquiry insert uses the browser Supabase client.
- Images: generate a small set of hero/landscape artwork under `src/assets/` where Unsplash won't cover the composition; use responsive `<img>` with proper `alt`, width/height, and `loading="lazy"` below the fold.
- Fonts via `@fontsource/*` imported in `src/start.ts` (or root), tokens defined in `src/styles.css` per the design system rules.

## Build order

1. Enable Lovable Cloud, run schema + seed migration, set up email infra.
2. Generate 3 design directions, confirm pick.
3. Design tokens, fonts, header/footer, cookie banner, i18n scaffold.
4. Home, Villas list, Villa detail (+ enquiry modal + email send).
5. Experiences, Destinations, Guide.
6. About Marion, List Your Property, Contact, Privacy, FAQ.
7. SEO head/JSON-LD sweep, responsive QA, Playwright smoke test of the enquiry flow.
