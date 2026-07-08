import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { publicSupabase } from "../supabase";

export default defineTool({
  name: "list_villas",
  title: "List villas",
  description:
    "List private villas in the My Sardinian Villa collection. Optionally filter by destination slug or featured only.",
  inputSchema: {
    destination_slug: z
      .string()
      .optional()
      .describe("Filter by destination slug (e.g. 'costa-smeralda')."),
    featured_only: z.boolean().optional().describe("Only return featured villas."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ destination_slug, featured_only, limit }) => {
    let q = publicSupabase()
      .from("villas")
      .select(
        "slug,name,location,destination_slug,bedrooms,sleeps,bathrooms,price_from,short_description,pool,sea_view,featured,cover_image",
      )
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (destination_slug) q = q.eq("destination_slug", destination_slug);
    if (featured_only) q = q.eq("featured", true);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { villas: data ?? [] },
    };
  },
});
