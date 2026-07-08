import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/admin-auth";
import { toast } from "sonner";
import { VillasAdmin } from "@/components/admin/VillasAdmin";
import { ExperiencesAdmin } from "@/components/admin/ExperiencesAdmin";
import { DestinationsAdmin } from "@/components/admin/DestinationsAdmin";
import { ArticlesAdmin } from "@/components/admin/ArticlesAdmin";
import { EnquiriesAdmin } from "@/components/admin/EnquiriesAdmin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — My Sardinian Villa" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const TABS = [
  { id: "villas", label: "Villas" },
  { id: "experiences", label: "Experiences" },
  { id: "destinations", label: "Destinations" },
  { id: "articles", label: "Articles" },
  { id: "enquiries", label: "Enquiries" },
] as const;

type TabId = typeof TABS[number]["id"];

function AdminPage() {
  const auth = useAdminAuth();
  const [tab, setTab] = useState<TabId>("villas");

  if (auth.status === "loading") {
    return <Shell><p className="text-olive/70 text-sm">Loading…</p></Shell>;
  }
  if (auth.status === "signed-out") {
    return <Shell><SignInCard /></Shell>;
  }
  if (auth.status === "not-admin") {
    return (
      <Shell>
        <div className="bg-white ring-1 ring-black/10 p-8 max-w-md">
          <h2 className="font-serif text-2xl text-sea mb-2">Not authorised</h2>
          <p className="text-sm text-olive/80">
            You're signed in as <strong>{auth.email}</strong>, but this account isn't an admin.
            Ask an existing admin to grant you the <code>admin</code> role.
          </p>
          <button onClick={() => supabase.auth.signOut()}
            className="mt-6 text-[11px] uppercase tracking-[0.2em] border border-black/15 px-4 py-2 hover:border-clay hover:text-clay">
            Sign out
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <nav className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`text-[11px] uppercase tracking-[0.2em] px-4 py-2 border ${
                tab === t.id ? "bg-sea text-sand border-sea" : "border-black/10 text-olive hover:border-clay hover:text-clay"
              }`}>{t.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-xs text-olive/70">
          <span>{auth.email}</span>
          <button onClick={() => supabase.auth.signOut()} className="text-[11px] uppercase tracking-[0.2em] hover:text-clay">Sign out</button>
        </div>
      </div>

      {tab === "villas" && <VillasAdmin />}
      {tab === "experiences" && <ExperiencesAdmin />}
      {tab === "destinations" && <DestinationsAdmin />}
      {tab === "articles" && <ArticlesAdmin />}
      {tab === "enquiries" && <EnquiriesAdmin />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="font-serif text-4xl md:text-5xl text-sea mt-2">Content</h1>
          </div>
          <a href="/" className="text-[11px] uppercase tracking-[0.2em] text-olive hover:text-clay">← Site</a>
        </div>
        {children}
      </div>
    </div>
  );
}

function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setBusy(false);
        if (error) toast.error(error.message);
      }}
      className="bg-white ring-1 ring-black/10 p-8 max-w-sm space-y-4"
    >
      <h2 className="font-serif text-2xl text-sea">Sign in</h2>
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.18em] text-olive/70">Email</span>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-clay" />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.18em] text-olive/70">Password</span>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-clay" />
      </label>
      <button disabled={busy} className="w-full bg-sea text-sand py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90 disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
