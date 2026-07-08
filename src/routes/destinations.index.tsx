import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDestinations } from "@/lib/content";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Destinations — My Sardinian Villa" },
      { name: "description", content: "The corners of southern Sardinia we know best." },
      { property: "og:title", content: "Destinations" },
      { property: "og:url", content: "/destinations" },
    ],
    links: [{ rel: "canonical", href: "/destinations" }],
  }),
  component: DestinationsList,
});

function DestinationsList() {
  const { data } = useQuery({ queryKey: ["destinations"], queryFn: fetchDestinations });
  return (
    <div>
      <section className="pt-24 pb-14 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow">The south</span>
          <h1 className="font-serif text-4xl md:text-6xl text-sea mt-3 max-w-3xl leading-[1.05]">Where we work</h1>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-10">
        {data?.map((d) => (
          <Link to="/destinations/$slug" params={{ slug: d.slug }} key={d.id} className="group block space-y-4">
            <div className="aspect-[4/3] overflow-hidden ring-1 ring-black/5 bg-stone-100">
              {d.cover_image && <img src={d.cover_image} alt={d.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms]" />}
            </div>
            <div>
              <h3 className="font-serif text-3xl text-sea">{d.name}</h3>
              <p className="text-sm text-olive/80 leading-relaxed mt-2">{d.intro}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
