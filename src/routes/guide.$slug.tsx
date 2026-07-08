import { createFileRoute, notFound } from "@tanstack/react-router";
import { fetchArticleBySlug } from "@/lib/content";

export const Route = createFileRoute("/guide/$slug")({
  loader: async ({ params }) => {
    const article = await fetchArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Article not found" }] };
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} — My Sardinian Villa` },
        { name: "description", content: article.excerpt ?? "" },
        { property: "og:title", content: article.title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/guide/${params.slug}` },
        ...(article.cover_image ? [{ property: "og:image", content: article.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: `/guide/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            image: article.cover_image,
            datePublished: article.published_at,
            description: article.excerpt,
          }),
        },
      ],
    };
  },
  component: ArticleDetail,
});

function ArticleDetail() {
  const { article } = Route.useLoaderData();
  return (
    <div>
      {article.cover_image && (
        <div className="aspect-[21/9] overflow-hidden">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <span className="eyebrow">Sardinia Guide</span>
        <h1 className="font-serif text-4xl md:text-6xl text-sea leading-[1.05] mt-3">{article.title}</h1>
        {article.excerpt && <p className="text-olive/80 text-lg mt-6 leading-relaxed">{article.excerpt}</p>}
        {article.content && (
          <div className="mt-10 text-olive leading-[1.8] whitespace-pre-line text-base">{article.content}</div>
        )}
      </article>
    </div>
  );
}
