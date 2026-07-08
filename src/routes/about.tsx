import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Marion — My Sardinian Villa" },
      { name: "description", content: "Marion Hirsch has directed My Sardinian Villa since 2006, personally welcoming guests to every stay." },
      { property: "og:title", content: "About Marion" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&auto=format&fit=crop"
              alt="Marion Hirsch"
              className="w-full aspect-[4/5] object-cover ring-1 ring-black/5"
            />
          </div>
          <div className="space-y-8">
            <span className="eyebrow">Your host</span>
            <h1 className="font-serif text-4xl md:text-6xl text-sea leading-[1.05]">Marion Hirsch</h1>
            <div className="text-olive leading-[1.8] space-y-5">
              <p>
                Marion Hirsch, entrepreneur and real estate agent, has directed My Sardinian Villa since 2006.
                She is your point of contact for your stay — as villa manager she will welcome you upon your
                arrival and ensure that the villa meets all your needs.
              </p>
              <p>
                Every villa in the collection has been personally inspected. Marion lives on the island year-round,
                works with a small team of trusted housekeepers, chefs, drivers and skippers, and speaks with each
                family before their arrival.
              </p>
              <p>
                She is fluent in English, Italian, German and French.
              </p>
            </div>
            <div className="pt-6 border-t border-black/10 grid sm:grid-cols-3 gap-6 text-sm text-olive">
              <div>
                <p className="eyebrow mb-2">Since</p>
                <p>2006</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Based in</p>
                <p>Southern Sardinia, year-round</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Languages</p>
                <p>EN · IT · DE · FR</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
