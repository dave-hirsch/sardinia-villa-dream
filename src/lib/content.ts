import { supabase } from "@/integrations/supabase/client";

export type Villa = {
  id: string;
  slug: string;
  name: string;
  location: string;
  destination_slug: string | null;
  bedrooms: number;
  sleeps: number;
  bathrooms: number;
  price_from: number;
  short_description: string | null;
  description: string | null;
  amenities: string[];
  tags: string[];
  pool: boolean;
  sea_view: boolean;
  air_conditioning: boolean;
  beach_distance: string | null;
  gallery: string[];
  cover_image: string | null;
  lat: number | null;
  lng: number | null;
  cin_code: string | null;
  availability: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured: boolean;
  created_at: string;
};

export type Experience = {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string | null;
  description: string | null;
  image: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

export type Destination = {
  id: string;
  slug: string;
  name: string;
  intro: string | null;
  tips: string | null;
  cover_image: string | null;
  gallery: string[];
  meta_title: string | null;
  meta_description: string | null;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  destination_slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string;
};

export async function fetchVillas(): Promise<Villa[]> {
  const { data, error } = await supabase.from("villas").select("*").order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Villa[];
}
export async function fetchFeaturedVillas(): Promise<Villa[]> {
  const { data, error } = await supabase.from("villas").select("*").eq("featured", true).order("created_at", { ascending: false }).limit(6);
  if (error) throw error;
  return (data ?? []) as Villa[];
}
export async function fetchVillaBySlug(slug: string): Promise<Villa | null> {
  const { data, error } = await supabase.from("villas").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as Villa | null) ?? null;
}
export async function fetchExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase.from("experiences").select("*").order("created_at");
  if (error) throw error;
  return (data ?? []) as Experience[];
}
export async function fetchExperienceBySlug(slug: string): Promise<Experience | null> {
  const { data, error } = await supabase.from("experiences").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as Experience | null) ?? null;
}
export async function fetchDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase.from("destinations").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Destination[];
}
export async function fetchDestinationBySlug(slug: string): Promise<Destination | null> {
  const { data, error } = await supabase.from("destinations").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as Destination | null) ?? null;
}
export async function fetchVillasByDestination(slug: string): Promise<Villa[]> {
  const { data, error } = await supabase.from("villas").select("*").eq("destination_slug", slug).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Villa[];
}
export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase.from("articles").select("*").order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Article[];
}
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as Article | null) ?? null;
}
