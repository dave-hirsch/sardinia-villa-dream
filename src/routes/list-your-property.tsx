import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/list-your-property")({
  head: () => ({
    meta: [
      { title: "List your property — My Sardinian Villa" },
      { name: "description", content: "Add your home to a small, personally managed collection of villas in southern Sardinia." },
      { property: "og:title", content: "List your property" },
      { property: "og:url", content: "/list-your-property" },
    ],
    links: [{ rel: "canonical", href: "/list-your-property" }],
  }),
  component: ListProperty,
});

function ListProperty() {
  const items = [
    { t: "A small, personally managed collection", b: "We keep the collection small — every home is personally inspected and matched to the right guests." },
    { t: "Tailored marketing", b: "Editorial photography, individual writing, and a page that reflects your home rather than a template." },
    { t: "Year-round local presence", b: "Marion lives on the island and works with a small team of trusted housekeepers, chefs and drivers." },
    { t: "Multilingual guest care", b: "Direct guest communication in English, Italian, German and French." },
  ];
  return (
    <div>
      <section className="pt-24 pb-14 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow">For owners</span>
          <h1 className="font-serif text-4xl md:text-6xl text-sea mt-3 max-w-3xl leading-[1.05]">List your villa with us</h1>
          <p className="text-olive/80 mt-4 max-w-xl">
            We work with a limited number of owners in the south of Sardinia. If your home might be a fit, get in touch —
            Marion will visit before we decide anything.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        {items.map((it) => (
          <div key={it.t} className="space-y-2">
            <h3 className="font-serif text-2xl text-sea">{it.t}</h3>
            <p className="text-olive/80 leading-relaxed">{it.b}</p>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <a
          href="mailto:marion@mysardinianvilla.com?subject=Listing enquiry"
          className="inline-block bg-sea text-sand px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90"
        >
          Email Marion
        </a>
      </section>
    </div>
  );
}
