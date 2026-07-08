import { useState, useMemo } from "react";
import type { Article } from "@/lib/content";
import { AdminList, Field, TextInput, TextArea, SingleImageInput, useTable, useDraft } from "./AdminShared";

const empty = (): Partial<Article> => ({
  slug: "", title: "", excerpt: "", content: "", cover_image: null,
  destination_slug: "", meta_title: "", meta_description: "",
});

export function ArticlesAdmin() {
  const t = useTable<Article>("articles", "published_at", false);
  const items = t.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const source = useMemo<Partial<Article> | null>(() => {
    if (creating) return empty();
    return items.find((v) => v.id === selectedId) ?? null;
  }, [creating, items, selectedId]);
  const [draft, setDraft] = useDraft<Partial<Article> | null>(source, [source?.id, creating]);

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
            <Field label="Destination slug"><TextInput value={draft.destination_slug ?? ""} onChange={(e) => setDraft({ ...draft, destination_slug: e.target.value })} /></Field>
          </div>
          <Field label="Excerpt"><TextArea rows={2} value={draft.excerpt ?? ""} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></Field>
          <Field label="Content"><TextArea rows={12} value={draft.content ?? ""} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></Field>
          <Field label="Cover image">
            <SingleImageInput bucket="content-photos" folder={`articles/${draft.slug || "new"}`}
              value={draft.cover_image ?? null} onChange={(url) => setDraft({ ...draft, cover_image: url })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Meta title"><TextInput value={draft.meta_title ?? ""} onChange={(e) => setDraft({ ...draft, meta_title: e.target.value })} /></Field>
            <Field label="Meta description"><TextInput value={draft.meta_description ?? ""} onChange={(e) => setDraft({ ...draft, meta_description: e.target.value })} /></Field>
          </div>
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
      ) : <div className="bg-white/60 ring-1 ring-black/5 p-10 text-sm text-olive/70">Select an article.</div>}
    </div>
  );
}
