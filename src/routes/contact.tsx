import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — My Sardinian Villa" },
      { name: "description", content: "Send Marion an enquiry. Personally answered within 24 hours." },
      { property: "og:title", content: "Contact" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div>
      <section className="pt-24 pb-12 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow">Contact</span>
          <h1 className="font-serif text-4xl md:text-6xl text-sea mt-3 max-w-3xl leading-[1.05]">
            Marion will personally reply within 24 hours
          </h1>
          <p className="text-olive/80 mt-4 max-w-xl">
            Tell us a little about the stay you have in mind and we'll come back with a shortlist of villas that fit,
            plus any experiences to add.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_320px] gap-16">
        <div>
          <EnquiryForm source="contact" />
        </div>
        <aside className="space-y-8">
          <div>
            <span className="eyebrow block mb-3">By email</span>
            <a href="mailto:marion@mysardinianvilla.com" className="text-sea hover:text-clay">marion@mysardinianvilla.com</a>
          </div>
          <div>
            <span className="eyebrow block mb-3">On WhatsApp</span>
            <a
              href="https://wa.me/393000000000"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-90"
            >
              Chat with Marion
            </a>
          </div>
          <div>
            <span className="eyebrow block mb-3">Office</span>
            <p className="text-olive text-sm leading-relaxed">
              Southern Sardinia<br />Italy
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
