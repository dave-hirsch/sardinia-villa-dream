import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { publicSupabase } from "../supabase";

export default defineTool({
  name: "submit_enquiry",
  title: "Submit an enquiry",
  description:
    "Send a booking enquiry to Marion. She personally replies within 24 hours. Only submit with the caller's explicit confirmation of the details.",
  inputSchema: {
    name: z.string().min(1).max(200),
    email: z.string().email().max(320),
    phone: z.string().max(50).optional(),
    date_from: z.string().optional().describe("ISO date YYYY-MM-DD"),
    date_to: z.string().optional().describe("ISO date YYYY-MM-DD"),
    flexible_dates: z.boolean().optional(),
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(30).optional(),
    budget: z.number().int().min(0).max(1_000_000).optional(),
    preferred_area: z.string().max(200).optional(),
    villa_slug: z.string().max(200).optional(),
    services_needed: z.array(z.string().max(80)).optional(),
    message: z.string().max(4000).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input) => {
    const { error } = await publicSupabase().from("enquiries").insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      date_from: input.date_from ?? null,
      date_to: input.date_to ?? null,
      flexible_dates: input.flexible_dates ?? false,
      adults: input.adults,
      children: input.children ?? 0,
      budget: input.budget ?? null,
      preferred_area: input.preferred_area ?? null,
      villa_slug: input.villa_slug ?? null,
      services_needed: input.services_needed ?? [],
      message: input.message ?? null,
      source: "mcp",
    });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [
        { type: "text", text: "Enquiry received. Marion will reply within 24 hours." },
      ],
    };
  },
});
