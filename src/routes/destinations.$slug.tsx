import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDestinationBySlug, fetchVillasByDestination, fetchArticles } from "@/lib/content";
import { VillaCard } from "@/components/site/VillaCard";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";


export const Route = createFileRoute("/destinations/$slug")({
  loader: async ({ params }) => {
    const destination = await fetchDestinationBySlug(params.slug);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Destination not found" }] };
    const { destination } = loaderData;
    return {
      meta: [
        { title: `${destination.name} — My Sardinian Villa` },
        { name: "description", content: destination.intro?.slice(0, 160) ?? "" },
        { property: "og:title", content: destination.name },
        { property: "og:url", content: `/destinations/${params.slug}` },
        ...(destination.cover_image ? [{ property: "og:image", content: destination.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: `/destinations/${params.slug}` }],
    };
  },
  component: DestinationDetail,
});

function DestinationDetail() {
  const { destination } = Route.useLoaderData();
  const villas = useQuery({ queryKey: ["villas", "by-dest", destination.slug], queryFn: () => fetchVillasByDestination(destination.slug) });
  const articles = useQuery({ queryKey: ["articles"], queryFn: fetchArticles });
  const related = (articles.data ?? []).filter((a) => a.destination_slug === destination.slug);

  return (
    <div>
      <div className="aspect-[21/9] overflow-hidden">
        {destination.cover_image ? (
          <img src={destination.cover_image} alt={destination.name} className="w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <span className="eyebrow">Destination</span>
        <h1 className="font-serif text-4xl md:text-6xl text-sea leading-[1.05] mt-3">{destination.name}</h1>
        <p className="text-olive/80 leading-relaxed mt-6 max-w-2xl text-lg">{destination.intro}</p>
      </section>

      {villas.data && villas.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-black/5">
          <h2 className="font-serif text-3xl text-sea mb-10">Villas in {destination.name}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {villas.data.map((v) => <VillaCard key={v.id} villa={v} />)}
          </div>
        </section>
      )}

      {destination.tips && (
        <section className="bg-olive/5 py-16">
          <div className="max-w-3xl mx-auto px-6">
            <span className="eyebrow">Local tips</span>
            <p className="mt-4 text-olive leading-relaxed whitespace-pre-line">{destination.tips}</p>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-serif text-3xl text-sea mb-10">Read next</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {related.map((a) => (
              <Link to="/guide/$slug" params={{ slug: a.slug }} key={a.id} className="group block space-y-4">
                <div className="aspect-[4/3] overflow-hidden ring-1 ring-black/5 bg-stone-100">
                  {a.cover_image && <img src={a.cover_image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />}
                </div>
                <h3 className="font-serif text-xl text-sea">{a.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
