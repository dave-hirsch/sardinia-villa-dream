import { useState, useMemo } from "react";
import type { Experience } from "@/lib/content";
import { AdminList, Field, TextInput, TextArea, SingleImageInput, useTable, useDraft } from "./AdminShared";

const empty = (): Partial<Experience> => ({
  slug: "", title: "", category: "", short_description: "", description: "", image: null,
});

export function ExperiencesAdmin() {
  const t = useTable<Experience>("experiences", "created_at", true);
  const items = t.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const source = useMemo<Partial<Experience> | null>(() => {
    if (creating) return empty();
    return items.find((v) => v.id === selectedId) ?? null;
  }, [creating, items, selectedId]);
  const [draft, setDraft] = useDraft<Partial<Experience> | null>(source, [source?.id, creating]);

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <AdminList items={items} selectedId={creating ? null : selectedId}
        onSelect={(id) => { setCreating(false); setSelectedId(id); }}
        onNew={() => { setCreating(true); setSelectedId(null); }}
        labelFor={(v) => v.title} />

      {draft ? (
        <div className="bg-white ring-1 ring-black/10 p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title"><TextInput value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Slug"><TextInput value={draft.slug ?? ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></Field>
            <Field label="Category"><TextInput value={draft.category ?? ""} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
          </div>
          <Field label="Short description"><TextArea rows={2} value={draft.short_description ?? ""} onChange={(e) => setDraft({ ...draft, short_description: e.target.value })} /></Field>
          <Field label="Description"><TextArea rows={7} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <Field label="Cover image">
            <SingleImageInput bucket="content-photos" folder={`experiences/${draft.slug || "new"}`}
              value={draft.image ?? null} onChange={(url) => setDraft({ ...draft, image: url })} />
          </Field>
          <div className="flex justify-between items-center pt-4 border-t border-black/10">
            {!creating && draft.id ? (
              <button onClick={() => { if (confirm("Delete?")) t.remove.mutate(draft.id!, { onSuccess: () => { setSelectedId(null); setDraft(null); } }); }}
                className="text-[11px] uppercase tracking-[0.2em] text-red-700 hover:underline">Delete</button>
            ) : <span />}
            <button disabled={t.upsert.isPending}
              onClick={() => t.upsert.mutate(draft, { onSuccess: (saved) => { setCreating(false); setSelectedId(saved.id); } })}
              className="bg-sea text-sand px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] hover:bg-sea/90 disabled:opacity-60">
              {t.upsert.isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : <div className="bg-white/60 ring-1 ring-black/5 p-10 text-sm text-olive/70">Select an experience.</div>}
    </div>
  );
}
