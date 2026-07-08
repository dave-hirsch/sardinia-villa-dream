import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchFeaturedVillas, fetchExperiences, fetchArticles } from "@/lib/content";
import { VillaCard } from "@/components/site/VillaCard";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/")({
  component: Home,
});

const HERO_IMG =
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=2000&q=80&auto=format&fit=crop";

function Home() {
  const { t } = useTranslation();
  const villas = useQuery({ queryKey: ["villas", "featured"], queryFn: fetchFeaturedVillas });
  const experiences = useQuery({ queryKey: ["experiences"], queryFn: fetchExperiences });
  const articles = useQuery({ queryKey: ["articles"], queryFn: fetchArticles });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Turquoise water and granite headland on the coast of southern Sardinia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end pb-32 md:pb-40">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white text-balance leading-[1.05] max-w-[20ch]">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-6 text-white/80 text-base md:text-lg max-w-md">{t("home.heroSubtitle")}</p>
          </div>
        </div>

        {/* Search overlay */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-5xl px-6">
          <SearchBar />
        </div>
      </section>

      {/* Featured villas */}
      <section className="pt-40 md:pt-48 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-wrap gap-6 justify-between items-end">
          <div className="space-y-3">
            <span className="eyebrow">{t("home.featuredEyebrow")}</span>
            <h2 className="font-serif text-3xl md:text-4xl text-sea text-balance">{t("home.featuredTitle")}</h2>
          </div>
          <Link to="/villas" className="text-[11px] font-medium uppercase tracking-[0.15em] border-b border-clay pb-1 text-clay">
            {t("home.featuredView")}
          </Link>
        </div>
        <div className="flex gap-8 overflow-x-auto px-6 pb-6 snap-x no-scrollbar">
          {villas.data?.map((v) => (
            <div key={v.id} className="flex-none w-[320px] md:w-[420px] snap-start">
              <VillaCard villa={v} />
            </div>
          ))}
          {!villas.data && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-none w-[320px] md:w-[420px] aspect-[3/4] bg-stone-100 animate-pulse" />
          ))}
        </div>
      </section>

      {/* Marion */}
      <section className="py-28 md:py-36 bg-olive/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&auto=format&fit=crop"
                alt="Marion, villa manager"
                className="aspect-[4/5] w-full object-cover ring-1 ring-black/5"
              />
              <div className="absolute -bottom-6 -right-6 bg-sand p-6 md:p-8 ring-1 ring-black/5 max-w-xs">
                <p className="font-serif text-base md:text-lg italic text-sea">
                  &ldquo;Every villa in the collection is one I know personally, and one I&rsquo;d send my closest friends to.&rdquo;
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <span className="eyebrow">{t("home.marionEyebrow")}</span>
              <h2 className="font-serif text-4xl md:text-5xl text-sea leading-[1.1] text-balance">
                {t("home.marionTitle")}
              </h2>
              <p className="text-olive leading-relaxed max-w-prose">
                Marion Hirsch, entrepreneur and real estate agent, has directed My Sardinian Villa since 2006.
                She is your point of contact for every stay — welcoming you on arrival and ensuring the villa
                meets all your needs. She is fluent in English, Italian, German and French.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-4 group pt-2"
              >
                <span className="bg-sea text-sand size-9 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">→</span>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-sea">
                  {t("home.marionRead")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 text-center mb-14">
          <span className="eyebrow">{t("home.expEyebrow")}</span>
          <h2 className="font-serif text-3xl md:text-4xl text-sea mt-4">{t("home.expTitle")}</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border-y border-black/5">
          {experiences.data?.slice(0, 6).map((e) => (
            <Link
              to="/experiences/$slug"
              params={{ slug: e.slug }}
              key={e.id}
              className="bg-sand p-10 md:p-12 text-center group"
            >
              <div className="mb-6 h-px w-8 bg-clay mx-auto group-hover:w-12 transition-all" />
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] mb-2 text-ink">{e.title}</h3>
              <p className="text-xs text-olive/70 leading-relaxed">{e.short_description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Guide */}
      <section className="py-28 md:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-14 flex-wrap gap-4">
            <h2 className="font-serif text-3xl md:text-4xl text-sea">{t("home.guideTitle")}</h2>
            <Link to="/guide" className="text-[11px] font-medium uppercase tracking-[0.15em] border-b border-clay pb-1 text-clay">
              {t("home.guideView")}
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {articles.data?.slice(0, 3).map((a) => (
              <Link to="/guide/$slug" params={{ slug: a.slug }} key={a.id} className="group block space-y-5">
                <div className="aspect-[4/3] overflow-hidden ring-1 ring-black/5 bg-stone-100">
                  {a.cover_image && (
                    <img src={a.cover_image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms]" />
                  )}
                </div>
                <h3 className="font-serif text-2xl text-sea leading-snug">{a.title}</h3>
                <p className="text-sm text-olive/80 leading-relaxed">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SearchBar() {
  const { t } = useTranslation();
  const cell = "flex-1 flex flex-col px-6 py-3 hover:bg-sand/50 transition-colors text-left";
  return (
    <form
      action="/villas"
      method="get"
      className="bg-white ring-1 ring-black/5 p-2 flex flex-col md:flex-row items-stretch gap-1 shadow-xl"
    >
      <label className={cell}>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-olive/60">{t("home.searchDestination")}</span>
        <input name="location" placeholder={t("home.searchAnywhere")} className="mt-1 text-sm font-medium bg-transparent focus:outline-none" />
      </label>
      <div className="w-px bg-black/5 hidden md:block my-2" />
      <label className={cell}>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-olive/60">{t("home.searchGuests")}</span>
        <input name="sleeps" type="number" min={1} placeholder="4" className="mt-1 text-sm font-medium bg-transparent focus:outline-none" />
      </label>
      <div className="w-px bg-black/5 hidden md:block my-2" />
      <label className={cell}>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-olive/60">{t("villa.bedrooms")}</span>
        <input name="bedrooms" type="number" min={1} placeholder="3" className="mt-1 text-sm font-medium bg-transparent focus:outline-none" />
      </label>
      <button type="submit" className="bg-sea text-sand px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90">
        {t("home.searchCta")}
      </button>
    </form>
  );
}

// prevent unused warning if formatPrice is referenced
export const _fmt = formatPrice;
