import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Enquiry = {
  id: string; created_at: string; name: string; email: string; phone: string | null;
  date_from: string | null; date_to: string | null; flexible_dates: boolean;
  adults: number; children: number; villa_slug: string | null; source: string | null;
  services_needed: string[]; message: string | null; status: string;
  preferred_area: string | null; budget: number | null;
};

function fmt(d: string | null) { return d ? new Date(d).toLocaleDateString() : "—"; }

export function EnquiriesAdmin() {
  const q = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Enquiry[];
    },
  });

  if (q.isLoading) return <p className="text-olive/70 text-sm">Loading…</p>;
  if (q.error) return <p className="text-red-700 text-sm">{(q.error as Error).message}</p>;
  const items = q.data ?? [];
  if (items.length === 0) return <p className="text-olive/70 text-sm">No enquiries yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((e) => (
        <details key={e.id} className="bg-white ring-1 ring-black/10 open:ring-clay/40">
          <summary className="cursor-pointer px-4 py-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto] items-center list-none">
            <div>
              <div className="font-serif text-lg text-sea">{e.name}</div>
              <div className="text-xs text-olive/70">{e.email}{e.phone ? ` · ${e.phone}` : ""}</div>
            </div>
            <div className="text-xs text-olive">
              {fmt(e.date_from)} → {fmt(e.date_to)}{e.flexible_dates ? " · flexible" : ""}
              <div className="text-olive/70">{e.villa_slug ? `Villa: ${e.villa_slug}` : "General"}{e.source ? ` · ${e.source}` : ""}</div>
            </div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-olive/60 sm:text-right">
              {new Date(e.created_at).toLocaleString()}
            </div>
          </summary>
          <div className="px-4 pb-4 pt-2 border-t border-black/5 grid gap-3 text-sm text-olive">
            <div><span className="text-olive/60">Guests: </span>{e.adults} adult(s), {e.children} child(ren)</div>
            {e.preferred_area && <div><span className="text-olive/60">Preferred area: </span>{e.preferred_area}</div>}
            {e.budget != null && <div><span className="text-olive/60">Budget: </span>€{e.budget}</div>}
            {e.services_needed.length > 0 && <div><span className="text-olive/60">Services: </span>{e.services_needed.join(", ")}</div>}
            {e.message && <div className="whitespace-pre-line bg-olive/5 p-3">{e.message}</div>}
            <div className="text-xs text-olive/60">Status: {e.status}</div>
          </div>
        </details>
      ))}
    </div>
  );
}
