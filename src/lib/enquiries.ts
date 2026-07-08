import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(200),
  email: z.string().trim().email("Please enter a valid email").max(320),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  date_from: z.string().optional().or(z.literal("")),
  date_to: z.string().optional().or(z.literal("")),
  flexible_dates: z.boolean().default(false),
  adults: z.coerce.number().int().min(1).max(30),
  children: z.coerce.number().int().min(0).max(30),
  budget: z.coerce.number().int().min(0).max(1_000_000).optional().or(z.literal("")),
  preferred_area: z.string().max(200).optional().or(z.literal("")),
  villa_slug: z.string().max(200).optional().or(z.literal("")),
  services_needed: z.array(z.string().max(80)).default([]),
  message: z.string().max(4000).optional().or(z.literal("")),
  // Honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export async function submitEnquiry(input: EnquiryInput, source: string) {
  const parsed = enquirySchema.parse(input);
  if (parsed.website) return; // honeypot triggered — silently drop

  const payload = {
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone || null,
    date_from: parsed.date_from || null,
    date_to: parsed.date_to || null,
    flexible_dates: parsed.flexible_dates,
    adults: parsed.adults,
    children: parsed.children,
    budget: parsed.budget ? Number(parsed.budget) : null,
    preferred_area: parsed.preferred_area || null,
    villa_slug: parsed.villa_slug || null,
    services_needed: parsed.services_needed,
    message: parsed.message || null,
    source,
  };

  const { error } = await supabase.from("enquiries").insert(payload);
  if (error) throw error;
}
