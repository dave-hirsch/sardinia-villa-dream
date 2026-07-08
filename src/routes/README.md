# My Sardinian Villa — content guide

This v1 ships a polished frontend with content stored in Lovable Cloud.

## Data model

Four content tables you can edit (via Cloud → Table editor):

- **villas** — every property in the collection. `featured=true` shows on the home page.
- **experiences** — private chef, boat trips, transfers, etc.
- **destinations** — Chia, Villasimius, Pula, Costa Rei…
- **articles** — Sardinia Guide blog posts.
- **enquiries** — form submissions from the site. Only admins can read.

## Adding a new villa

Insert a row into `villas` with:

- `slug` — URL-safe identifier, e.g. `villa-cala-bianca`
- `name`, `location`, `destination_slug` (must match a `destinations.slug`)
- `bedrooms`, `sleeps`, `bathrooms`, `price_from` (weekly €)
- `short_description` (1–2 sentences), `description` (long)
- `amenities` (Postgres array of strings)
- `tags` — free labels like `Beachfront`, `Family`
- `pool`, `sea_view`, `air_conditioning` booleans
- `beach_distance` (free text, e.g. `500 m`)
- `cover_image` and `gallery` (array of URLs)
- `lat`, `lng` for the approximate map
- `cin_code`, `availability` (free text)
- `featured` — set true to appear on the home page carousel

## Enquiries

Submissions land in `enquiries`. To read them, sign in as an admin user
(create a row in `user_roles` for that user with role `admin` — full admin
UI ships in v2).

## Translations

UI strings live in `src/i18n/locales/{en,de,it,fr}.json`. English is the
canonical source; the three other files are stubs and fall back to English
until translated.
