import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage, uploadImages, type StorageBucket } from "@/lib/storage";
import { toast } from "sonner";

/* ---------- shared helpers ---------- */

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.18em] text-olive/70">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-white border border-black/10 px-3 py-2 text-sm text-ink focus:outline-none focus:border-clay";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}
export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" {...props} className={inputCls} />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-[120px] font-sans`} />;
}
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 text-sm text-olive cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function csvToArray(v: string): string[] {
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}
export function arrayToCsv(a: string[] | null | undefined): string {
  return (a ?? []).join(", ");
}

/* ---------- image controls ---------- */

export function SingleImageInput({
  bucket, folder, value, onChange,
}: {
  bucket: StorageBucket; folder: string; value: string | null; onChange: (url: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <div className="aspect-[3/2] w-full max-w-sm bg-stone-100 ring-1 ring-black/5 overflow-hidden">
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-olive/50">No image</div>}
      </div>
      <div className="flex gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            try {
              const url = await uploadImage(bucket, f, folder);
              onChange(url);
              toast.success("Image uploaded");
            } catch (err) {
              toast.error((err as Error).message);
            } finally {
              setBusy(false);
              if (fileRef.current) fileRef.current.value = "";
            }
          }}
        />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
          className="text-[11px] uppercase tracking-[0.2em] border border-black/15 px-4 py-2 hover:border-clay hover:text-clay">
          {busy ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)}
            className="text-[11px] uppercase tracking-[0.2em] border border-black/15 px-4 py-2 hover:border-clay hover:text-clay">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export function MultiImageInput({
  bucket, folder, value, onChange,
}: {
  bucket: StorageBucket; folder: string; value: string[]; onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square bg-stone-100 ring-1 ring-black/5 overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100"
              >remove</button>
              {i > 0 && (
                <button type="button" onClick={() => {
                  const next = [...value];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }} className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100">←</button>
              )}
            </div>
          ))}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          if (!files.length) return;
          setBusy(true);
          try {
            const urls = await uploadImages(bucket, files, folder);
            onChange([...value, ...urls]);
            toast.success(`${urls.length} image(s) uploaded`);
          } catch (err) {
            toast.error((err as Error).message);
          } finally {
            setBusy(false);
            if (fileRef.current) fileRef.current.value = "";
          }
        }}
      />
      <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
        className="text-[11px] uppercase tracking-[0.2em] border border-black/15 px-4 py-2 hover:border-clay hover:text-clay">
        {busy ? "Uploading…" : "Add images"}
      </button>
    </div>
  );
}

/* ---------- shared CRUD hook ---------- */

type TableName = "villas" | "experiences" | "destinations" | "articles" | "enquiries";

export function useTable<T extends { id: string }>(table: TableName, orderBy = "created_at", asc = false) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: asc });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (row: Partial<T> & { id?: string }) => {
      const { data, error } = await supabase.from(table).upsert(row as never).select().single();
      if (error) throw error;
      return data as T;
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { ...q, upsert, remove };
}

/* ---------- list/edit shell ---------- */

export function AdminList<T extends { id: string; slug?: string }>({
  items, selectedId, onSelect, onNew, labelFor,
}: {
  items: T[]; selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  labelFor: (item: T) => string;
}) {
  return (
    <div className="border border-black/10 bg-white">
      <div className="px-3 py-2 border-b border-black/10 flex justify-between items-center">
        <span className="text-[11px] uppercase tracking-[0.2em] text-olive/70">{items.length} item{items.length === 1 ? "" : "s"}</span>
        <button onClick={onNew} className="text-[11px] uppercase tracking-[0.2em] text-clay hover:underline">+ New</button>
      </div>
      <ul className="max-h-[70vh] overflow-y-auto divide-y divide-black/5">
        {items.map((it) => (
          <li key={it.id}>
            <button onClick={() => onSelect(it.id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-olive/5 ${selectedId === it.id ? "bg-olive/10 text-clay" : "text-ink"}`}>
              {labelFor(it)}
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="px-3 py-6 text-xs text-olive/60">Nothing yet.</li>}
      </ul>
    </div>
  );
}

export function useDraft<T>(initial: T | null, deps: React.DependencyList) {
  const [draft, setDraft] = useState<T | null>(initial);
  useEffect(() => { setDraft(initial); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, deps);
  return [draft, setDraft] as const;
}
