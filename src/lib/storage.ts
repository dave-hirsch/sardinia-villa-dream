import { supabase } from "@/integrations/supabase/client";

// Buckets are private (workspace policy blocks public buckets), so we
// mint a long-lived signed URL after upload and store that.
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

export type StorageBucket = "villa-photos" | "content-photos";

function extFromName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

export async function uploadImage(bucket: StorageBucket, file: File, folder = ""): Promise<string> {
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "").slice(0, 60);
  const key = `${safeFolder ? safeFolder + "/" : ""}${crypto.randomUUID()}${extFromName(file.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(key, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(key, SIGNED_URL_TTL);
  if (signErr || !data) throw signErr ?? new Error("Failed to sign URL");
  return data.signedUrl;
}

export async function uploadImages(bucket: StorageBucket, files: File[], folder = ""): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) urls.push(await uploadImage(bucket, f, folder));
  return urls;
}
