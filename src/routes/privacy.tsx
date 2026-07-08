import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — My Sardinian Villa" },
      { name: "description", content: "How we handle your personal data." },
      { property: "og:url", content: "/privacy" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-20 space-y-6 text-olive leading-relaxed">
      <h1 className="font-serif text-4xl md:text-5xl text-sea">Privacy Policy</h1>
      <p className="text-sm text-olive/60">Last updated: {new Date().toLocaleDateString()}</p>
      <p>This privacy policy describes how My Sardinian Villa collects, uses and stores personal data submitted via our website in compliance with the EU General Data Protection Regulation (Regulation 2016/679) and Italian Legislative Decree 196/2003 as amended.</p>
      <h2 className="font-serif text-2xl text-sea pt-6">Data we collect</h2>
      <p>Contact information (name, email, phone), stay preferences (dates, party size, budget, preferred area) and any details you choose to share in an enquiry.</p>
      <h2 className="font-serif text-2xl text-sea pt-6">How we use it</h2>
      <p>Only to reply to your enquiry and, if a booking follows, to organise your stay. We do not sell, rent or share your data with third parties for marketing.</p>
      <h2 className="font-serif text-2xl text-sea pt-6">Cookies</h2>
      <p>We use a small set of cookies to remember your language and cookie preference. Analytics scripts are loaded only after explicit consent.</p>
      <h2 className="font-serif text-2xl text-sea pt-6">Your rights</h2>
      <p>You may request access, correction or deletion of your data at any time by emailing marion@mysardinianvilla.com.</p>
    </article>
  );
}
