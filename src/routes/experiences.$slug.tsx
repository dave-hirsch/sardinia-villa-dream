import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchExperienceBySlug } from "@/lib/content";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";


export const Route = createFileRoute("/experiences/$slug")({
  loader: async ({ params }) => {
    const experience = await fetchExperienceBySlug(params.slug);
    if (!experience) throw notFound();
    return { experience };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Experience not found" }] };
    const { experience } = loaderData;
    return {
      meta: [
        { title: `${experience.title} — My Sardinian Villa` },
        { name: "description", content: experience.short_description ?? "" },
        { property: "og:title", content: experience.title },
        { property: "og:url", content: `/experiences/${params.slug}` },
        ...(experience.image ? [{ property: "og:image", content: experience.image }] : []),
      ],
      links: [{ rel: "canonical", href: `/experiences/${params.slug}` }],
    };
  },
  component: ExperienceDetail,
});

function ExperienceDetail() {
  const { experience } = Route.useLoaderData();
  return (
    <div>
      <div className="aspect-[21/9] overflow-hidden">
        {experience.image ? (
          <img src={experience.image} alt={experience.title} className="w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <span className="eyebrow">{experience.category}</span>
        <h1 className="font-serif text-4xl md:text-6xl text-sea leading-[1.05] mt-3">{experience.title}</h1>
        {experience.description && (
          <div className="prose mt-8 text-olive leading-relaxed whitespace-pre-line">
            {experience.description}
          </div>
        )}
        <div className="mt-12 pt-8 border-t border-black/10">
          <Link to="/contact" className="inline-block bg-sea text-sand px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90">
            Enquire about this experience
          </Link>
        </div>
      </article>
    </div>
  );
}
