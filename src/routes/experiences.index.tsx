import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchExperiences } from "@/lib/content";

export const Route = createFileRoute("/experiences/")({
  head: () => ({
    meta: [
      { title: "Experiences — My Sardinian Villa" },
      { name: "description", content: "Private chef, boat trips, winery tours and more — arranged around your stay." },
      { property: "og:title", content: "Experiences" },
      { property: "og:url", content: "/experiences" },
    ],
    links: [{ rel: "canonical", href: "/experiences" }],
  }),
  component: ExperiencesList,
});

function ExperiencesList() {
  const { data } = useQuery({ queryKey: ["experiences"], queryFn: fetchExperiences });
  return (
    <div>
      <section className="pt-24 pb-14 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow">Beyond the villa</span>
          <h1 className="font-serif text-4xl md:text-6xl text-sea mt-3 max-w-3xl leading-[1.05]">Experiences we can arrange</h1>
          <p className="text-olive/80 mt-4 max-w-xl">Everything below is booked through Marion — one point of contact for the whole stay.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {data?.map((e) => (
          <Link to="/experiences/$slug" params={{ slug: e.slug }} key={e.id} className="group block space-y-4">
            <div className="aspect-[4/5] overflow-hidden ring-1 ring-black/5 bg-stone-100">
              {e.image && <img src={e.image} alt={e.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms]" />}
            </div>
            <div>
              <span className="eyebrow">{e.category}</span>
              <h3 className="font-serif text-2xl text-sea mt-2">{e.title}</h3>
              <p className="text-sm text-olive/80 leading-relaxed mt-2">{e.short_description}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
