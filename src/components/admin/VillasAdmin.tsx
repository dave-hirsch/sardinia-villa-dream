import { useState, useMemo } from "react";
import type { Villa } from "@/lib/content";
import {
  AdminList, Field, TextInput, NumberInput, TextArea, Toggle,
  SingleImageInput, MultiImageInput, useTable, arrayToCsv, csvToArray, useDraft,
} from "./AdminShared";

const empty = (): Partial<Villa> => ({
  slug: "", name: "", location: "", destination_slug: "",
  bedrooms: 0, bathrooms: 0, sleeps: 0, price_from: 0,
  short_description: "", description: "",
  amenities: [], tags: [], gallery: [],
  pool: false, sea_view: false, air_conditioning: false, featured: false,
  cover_image: null, beach_distance: "", cin_code: "",
});

export function VillasAdmin() {
  const t = useTable<Villa>("villas", "featured", false);
  const items = t.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const source = useMemo<Partial<Villa> | null>(() => {
    if (creating) return empty();
    return items.find((v) => v.id === selectedId) ?? null;
  }, [creating, items, selectedId]);

  const [draft, setDraft] = useDraft<Partial<Villa> | null>(source, [source?.id, creating]);

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <AdminList
        items={items}
        selectedId={creating ? null : selectedId}
        onSelect={(id) => { setCreating(false); setSelectedId(id); }}
        onNew={() => { setCreating(true); setSelectedId(null); }}
        labelFor={(v) => `${v.featured ? "★ " : ""}${v.name}`}
      />

      {draft ? (
        <div className="bg-white ring-1 ring-black/10 p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><TextInput value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Slug"><TextInput value={draft.slug ?? ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></Field>
            <Field label="Location"><TextInput value={draft.location ?? ""} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></Field>
            <Field label="Destination slug"><TextInput value={draft.destination_slug ?? ""} onChange={(e) => setDraft({ ...draft, destination_slug: e.target.value })} /></Field>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <Field label="Bedrooms"><NumberInput value={draft.bedrooms ?? 0} onChange={(e) => setDraft({ ...draft, bedrooms: Number(e.target.value) })} /></Field>
            <Field label="Bathrooms"><NumberInput value={draft.bathrooms ?? 0} onChange={(e) => setDraft({ ...draft, bathrooms: Number(e.target.value) })} /></Field>
            <Field label="Sleeps"><NumberInput value={draft.sleeps ?? 0} onChange={(e) => setDraft({ ...draft, sleeps: Number(e.target.value) })} /></Field>
            <Field label="Price from (€/wk)"><NumberInput value={draft.price_from ?? 0} onChange={(e) => setDraft({ ...draft, price_from: Number(e.target.value) })} /></Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Beach distance"><TextInput value={draft.beach_distance ?? ""} onChange={(e) => setDraft({ ...draft, beach_distance: e.target.value })} /></Field>
            <Field label="CIN code"><TextInput value={draft.cin_code ?? ""} onChange={(e) => setDraft({ ...draft, cin_code: e.target.value })} /></Field>
          </div>

          <Field label="Short description"><TextArea rows={2} value={draft.short_description ?? ""} onChange={(e) => setDraft({ ...draft, short_description: e.target.value })} /></Field>
          <Field label="Description"><TextArea rows={7} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>

          <Field label="Amenities (comma-separated)">
            <TextInput value={arrayToCsv(draft.amenities)} onChange={(e) => setDraft({ ...draft, amenities: csvToArray(e.target.value) })} />
          </Field>
          <Field label="Tags (comma-separated)">
            <TextInput value={arrayToCsv(draft.tags)} onChange={(e) => setDraft({ ...draft, tags: csvToArray(e.target.value) })} />
          </Field>

          <div className="flex flex-wrap gap-6">
            <Toggle checked={!!draft.pool} onChange={(v) => setDraft({ ...draft, pool: v })} label="Pool" />
            <Toggle checked={!!draft.sea_view} onChange={(v) => setDraft({ ...draft, sea_view: v })} label="Sea view" />
            <Toggle checked={!!draft.air_conditioning} onChange={(v) => setDraft({ ...draft, air_conditioning: v })} label="Air conditioning" />
            <Toggle checked={!!draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} label="Featured" />
          </div>

          <Field label="Cover image">
            <SingleImageInput bucket="villa-photos" folder={draft.slug || "villa"} value={draft.cover_image ?? null}
              onChange={(url) => setDraft({ ...draft, cover_image: url })} />
          </Field>

          <Field label="Gallery">
            <MultiImageInput bucket="villa-photos" folder={draft.slug || "villa"} value={draft.gallery ?? []}
              onChange={(urls) => setDraft({ ...draft, gallery: urls })} />
          </Field>

          <div className="flex justify-between items-center pt-4 border-t border-black/10">
            <div>
              {!creating && draft.id && (
                <button onClick={() => {
                  if (!confirm("Delete this villa?")) return;
                  t.remove.mutate(draft.id!, { onSuccess: () => { setSelectedId(null); setDraft(null); } });
                }} className="text-[11px] uppercase tracking-[0.2em] text-red-700 hover:underline">Delete</button>
              )}
            </div>
            <button disabled={t.upsert.isPending}
              onClick={() => t.upsert.mutate(draft, {
                onSuccess: (saved) => { setCreating(false); setSelectedId(saved.id); },
              })}
              className="bg-sea text-sand px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] hover:bg-sea/90 disabled:opacity-60">
              {t.upsert.isPending ? "Saving…" : "Save villa"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/60 ring-1 ring-black/5 p-10 text-sm text-olive/70">Select a villa or create a new one.</div>
      )}
    </div>
  );
}
