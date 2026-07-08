import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/lib/content";

export const Route = createFileRoute("/guide/")({
  head: () => ({
    meta: [
      { title: "The Sardinia Guide — My Sardinian Villa" },
      { name: "description", content: "Notes on where to eat, swim, and drive in southern Sardinia." },
      { property: "og:title", content: "The Sardinia Guide" },
      { property: "og:url", content: "/guide" },
    ],
    links: [{ rel: "canonical", href: "/guide" }],
  }),
  component: GuideList,
});

function GuideList() {
  const { data } = useQuery({ queryKey: ["articles"], queryFn: fetchArticles });
  return (
    <div>
      <section className="pt-24 pb-14 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow">The Sardinia Guide</span>
          <h1 className="font-serif text-4xl md:text-6xl text-sea mt-3 max-w-3xl leading-[1.05]">Notes from the island</h1>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {data?.map((a) => (
          <Link to="/guide/$slug" params={{ slug: a.slug }} key={a.id} className="group block space-y-5">
            <div className="aspect-[4/3] overflow-hidden ring-1 ring-black/5 bg-stone-100">
              {a.cover_image && <img src={a.cover_image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms]" />}
            </div>
            <div>
              <h3 className="font-serif text-2xl text-sea leading-snug">{a.title}</h3>
              <p className="text-sm text-olive/80 leading-relaxed mt-2">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
