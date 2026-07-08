import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchVillaBySlug, fetchVillas, fetchExperiences } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { VillaCard } from "@/components/site/VillaCard";

export const Route = createFileRoute("/villas/$slug")({
  loader: async ({ params }) => {
    const villa = await fetchVillaBySlug(params.slug);
    if (!villa) throw notFound();
    return { villa };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Villa not found" }] };
    const { villa } = loaderData;
    return {
      meta: [
        { title: `${villa.name} · ${villa.location} — My Sardinian Villa` },
        { name: "description", content: villa.short_description ?? villa.description?.slice(0, 160) ?? villa.name },
        { property: "og:title", content: `${villa.name} · ${villa.location}` },
        { property: "og:description", content: villa.short_description ?? "" },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/villas/${params.slug}` },
        ...(villa.cover_image ? [{ property: "og:image", content: villa.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: `/villas/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: villa.name,
            description: villa.description,
            image: villa.cover_image,
            address: { "@type": "PostalAddress", addressLocality: villa.location, addressRegion: "Sardinia", addressCountry: "IT" },
            numberOfRooms: villa.bedrooms,
            priceRange: `From €${villa.price_from}/week`,
          }),
        },
      ],
    };
  },
  component: VillaDetail,
});

function VillaDetail() {
  const { t } = useTranslation();
  const { villa } = Route.useLoaderData();
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const relatedQ = useQuery({ queryKey: ["villas"], queryFn: fetchVillas });
  const expQ = useQuery({ queryKey: ["experiences"], queryFn: fetchExperiences });

  const related = (relatedQ.data ?? [])
    .filter((v) => v.slug !== villa.slug && (v.destination_slug === villa.destination_slug || v.tags.some((tag) => villa.tags.includes(tag))))
    .slice(0, 3);

  const gallery = villa.gallery.length > 0 ? villa.gallery : villa.cover_image ? [villa.cover_image] : [];

  return (
    <div>
      {/* Hero slider */}
      <section className="relative bg-black/5">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-stone-100">
          {gallery[galleryIdx] ? (
            <img src={gallery[galleryIdx]} alt={villa.name} className="w-full h-full object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        {gallery.length > 1 && (
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={() => setGalleryIdx((i) => (i === 0 ? gallery.length - 1 : i - 1))}
              className="bg-white/90 text-sea size-11 flex items-center justify-center hover:bg-white"
              aria-label="Previous"
            >←</button>
            <button
              onClick={() => setGalleryIdx((i) => (i + 1) % gallery.length)}
              className="bg-white/90 text-sea size-11 flex items-center justify-center hover:bg-white"
              aria-label="Next"
            >→</button>
          </div>
        )}
      </section>

      {/* Key facts */}
      <section className="border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 grid gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <span className="eyebrow">{villa.location}</span>
            <h1 className="font-serif text-4xl md:text-6xl text-sea leading-[1.05] mt-3">{villa.name}</h1>
            {villa.short_description && (
              <p className="text-olive/80 max-w-2xl mt-5">{villa.short_description}</p>
            )}
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-olive">
              <Fact label={t("villa.sleeps")} value={villa.sleeps} />
              <Fact label={t("villa.bedrooms")} value={villa.bedrooms} />
              <Fact label={t("villa.bathrooms")} value={villa.bathrooms} />
              {villa.beach_distance && <Fact label={t("villa.beachDistance")} value={villa.beach_distance} />}
              {villa.sea_view && <Fact label={t("villa.seaView")} value="✓" />}
              {villa.pool && <Fact label={t("villa.pool")} value="✓" />}
              {villa.air_conditioning && <Fact label={t("villa.ac")} value="✓" />}
            </div>
          </div>
          <div className="md:text-right space-y-3 md:min-w-[220px]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-olive/60">{t("villa.from")}</p>
            <p className="font-serif text-3xl text-clay">{formatPrice(villa.price_from)}<span className="text-base text-olive/70"> {t("villa.perWeek")}</span></p>
            <button
              onClick={() => setShowEnquiry(true)}
              className="bg-sea text-sand px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90"
            >
              {t("villa.enquire")}
            </button>
          </div>
        </div>
      </section>

      {/* Sectioned content */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-14">
        {villa.description && (
          <Block title={t("villa.overview")}>
            <p className="whitespace-pre-line">{villa.description}</p>
          </Block>
        )}
        {villa.amenities.length > 0 && (
          <Block title={t("villa.amenities")}>
            <ul className="grid sm:grid-cols-2 gap-y-2 text-olive">
              {villa.amenities.map((a: string) => (
                <li key={a} className="flex items-start gap-2"><span className="text-clay mt-1">·</span>{a}</li>
              ))}
            </ul>
          </Block>
        )}
        <Block title={t("villa.location")}>
          <p className="text-olive">
            {villa.location}. Approximate coordinates {villa.lat?.toFixed(3)}, {villa.lng?.toFixed(3)}.
            Exact address shared on booking.
          </p>
          {villa.lat && villa.lng && (
            <div className="mt-4 aspect-[16/9] w-full ring-1 ring-black/5 overflow-hidden">
              <iframe
                title={`Map of ${villa.location}`}
                loading="lazy"
                className="w-full h-full border-0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${villa.lng - 0.05}%2C${villa.lat - 0.03}%2C${villa.lng + 0.05}%2C${villa.lat + 0.03}&layer=mapnik&marker=${villa.lat}%2C${villa.lng}`}
              />
            </div>
          )}
        </Block>
        {villa.availability && (
          <Block title="Availability">
            <p className="text-olive">{villa.availability}</p>
            {villa.cin_code && <p className="text-xs text-olive/60 mt-3">CIN {villa.cin_code}</p>}
          </Block>
        )}
      </section>

      {/* Gallery */}
      {gallery.length > 1 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <span className="eyebrow block mb-6">Gallery</span>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.map((g: string, i: number) => (
              <button key={i} onClick={() => setLightbox(g)} className="aspect-square overflow-hidden bg-stone-100">
                <img src={g} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Suggested experiences */}
      {expQ.data && expQ.data.length > 0 && (
        <section className="bg-olive/5 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <span className="eyebrow">{t("villa.pairedExperiences")}</span>
            <h2 className="font-serif text-3xl text-sea mt-3 mb-10">Add to your stay</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expQ.data.slice(0, 3).map((e) => (
                <Link to="/experiences/$slug" params={{ slug: e.slug }} key={e.id} className="group block bg-white p-8 ring-1 ring-black/5">
                  <h3 className="font-serif text-2xl text-sea mb-2 group-hover:text-clay transition-colors">{e.title}</h3>
                  <p className="text-sm text-olive/80">{e.short_description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related villas */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl text-sea mb-10">{t("villa.related")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {related.map((v) => <VillaCard key={v.id} villa={v} />)}
          </div>
        </section>
      )}

      {/* Enquiry modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowEnquiry(false)}>
          <div className="bg-sand max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-10 ring-1 ring-black/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif text-3xl text-sea">{t("enquiry.title")}</h3>
                <p className="text-sm text-olive/80 mt-2">{t("enquiry.subtitle")}</p>
              </div>
              <button onClick={() => setShowEnquiry(false)} className="text-olive hover:text-clay text-xl" aria-label="Close">×</button>
            </div>
            <EnquiryForm villaSlug={villa.slug} villaName={villa.name} source={`villa:${villa.slug}`} />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      {/* Sticky mobile enquire */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-sand border-t border-black/10 p-4 z-30">
        <button
          onClick={() => setShowEnquiry(true)}
          className="w-full bg-clay text-sand py-3 text-[11px] font-medium uppercase tracking-[0.2em]"
        >
          {t("villa.enquire")} · {t("villa.from")} {formatPrice(villa.price_from)}
        </button>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.2em] text-olive/60">{label}</span>
      <span className="text-base text-ink mt-1">{value}</span>
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <span className="eyebrow block mb-4">{title}</span>
      <div className="text-olive leading-relaxed">{children}</div>
    </section>
  );
}
