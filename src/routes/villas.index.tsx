import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchVillas } from "@/lib/content";
import { VillaCard } from "@/components/site/VillaCard";
import { z } from "zod";

const searchSchema = z.object({
  location: z.string().optional(),
  sleeps: z.coerce.number().int().optional(),
  bedrooms: z.coerce.number().int().optional(),
  sort: z.enum(["newest", "priceLow", "priceHigh", "bedrooms"]).optional(),
  pool: z.coerce.boolean().optional(),
  seaView: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/villas/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "The villas — My Sardinian Villa" },
      { name: "description", content: "Browse our small collection of private villas across southern Sardinia." },
      { property: "og:title", content: "Villas — My Sardinian Villa" },
      { property: "og:url", content: "/villas" },
    ],
    links: [{ rel: "canonical", href: "/villas" }],
  }),
  component: VillasList,
});

function VillasList() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const villasQ = useQuery({ queryKey: ["villas"], queryFn: fetchVillas });

  const [pool, setPool] = useState(search.pool ?? false);
  const [seaView, setSeaView] = useState(search.seaView ?? false);

  const filtered = useMemo(() => {
    if (!villasQ.data) return [];
    let items = [...villasQ.data];
    if (search.location) {
      const q = search.location.toLowerCase();
      items = items.filter((v) => v.location.toLowerCase().includes(q) || (v.destination_slug ?? "").includes(q));
    }
    if (search.sleeps) items = items.filter((v) => v.sleeps >= search.sleeps!);
    if (search.bedrooms) items = items.filter((v) => v.bedrooms >= search.bedrooms!);
    if (pool) items = items.filter((v) => v.pool);
    if (seaView) items = items.filter((v) => v.sea_view);
    switch (search.sort) {
      case "priceLow": items.sort((a, b) => a.price_from - b.price_from); break;
      case "priceHigh": items.sort((a, b) => b.price_from - a.price_from); break;
      case "bedrooms": items.sort((a, b) => b.bedrooms - a.bedrooms); break;
      default: items.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
    }
    return items;
  }, [villasQ.data, search, pool, seaView]);

  const updateSort = (sort: NonNullable<typeof search.sort>) =>
    navigate({ search: (s: z.infer<typeof searchSchema>) => ({ ...s, sort }), replace: true });

  const clear = () => navigate({ search: {}, replace: true });

  return (
    <div>
      <section className="pt-24 pb-12 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow">{t("nav.villas")}</span>
          <h1 className="font-serif text-4xl md:text-6xl text-sea mt-3 max-w-3xl leading-[1.05]">{t("villas.title")}</h1>
          <p className="text-olive/80 mt-4 max-w-xl">{t("villas.subtitle")}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <span className="eyebrow block mb-3">{t("villas.filters")}</span>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-olive cursor-pointer">
                <input type="checkbox" checked={pool} onChange={(e) => setPool(e.target.checked)} className="accent-clay" />
                {t("villa.pool")}
              </label>
              <label className="flex items-center gap-2 text-sm text-olive cursor-pointer">
                <input type="checkbox" checked={seaView} onChange={(e) => setSeaView(e.target.checked)} className="accent-clay" />
                {t("villa.seaView")}
              </label>
            </div>
          </div>

          <div>
            <span className="eyebrow block mb-3">Sort</span>
            <div className="space-y-2">
              {(["newest", "priceLow", "priceHigh", "bedrooms"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateSort(s)}
                  className={
                    "block text-left text-sm transition-colors " +
                    (search.sort === s ? "text-clay" : "text-olive hover:text-sea")
                  }
                >
                  {s === "newest" && t("villas.sortNewest")}
                  {s === "priceLow" && t("villas.sortPriceLow")}
                  {s === "priceHigh" && t("villas.sortPriceHigh")}
                  {s === "bedrooms" && t("villas.sortBedrooms")}
                </button>
              ))}
            </div>
          </div>

          <button onClick={clear} className="text-[11px] font-medium uppercase tracking-[0.2em] text-clay border-b border-clay pb-0.5">
            {t("villas.clear")}
          </button>
        </aside>

        <div>
          {filtered.length === 0 && villasQ.data && (
            <p className="text-olive/70 py-16 text-center">{t("villas.empty")}</p>
          )}
          <div className="grid sm:grid-cols-2 gap-10">
            {filtered.map((v) => (
              <VillaCard key={v.id} villa={v} aspect="aspect-[4/5]" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
