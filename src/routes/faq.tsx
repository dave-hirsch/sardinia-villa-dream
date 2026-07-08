import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — My Sardinian Villa" },
      { name: "description", content: "Common questions about booking, payment and travel in southern Sardinia." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQ,
});

const items = [
  { q: "How do bookings work?", a: "Send an enquiry — Marion replies personally within 24 hours to confirm availability and put together a proposal. There's no online booking engine." },
  { q: "How are payments handled?", a: "A booking is confirmed by a deposit (usually 30%) and the balance is due 60 days before arrival. Payment is by bank transfer to a European IBAN." },
  { q: "Are pets welcome?", a: "It depends on the villa — a few in the collection welcome dogs. Let Marion know when you enquire." },
  { q: "Is there a minimum stay?", a: "Most villas are booked by the week, Saturday to Saturday, in high season. Shorter stays are sometimes possible outside July and August." },
  { q: "When should we visit?", a: "Late May, June, September and early October are our favourite months — warm sea, quieter beaches, softer light." },
  { q: "Do you organise transfers?", a: "Yes — a dedicated driver can meet you at Cagliari or Olbia airport. See our Experiences page." },
];

function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <span className="eyebrow">FAQ</span>
      <h1 className="font-serif text-4xl md:text-5xl text-sea mt-3 mb-12">Common questions</h1>
      <dl className="divide-y divide-black/10">
        {items.map((it) => (
          <div key={it.q} className="py-8">
            <dt className="font-serif text-2xl text-sea mb-3">{it.q}</dt>
            <dd className="text-olive leading-relaxed">{it.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
