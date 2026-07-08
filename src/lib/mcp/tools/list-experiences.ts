import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { publicSupabase } from "../supabase";

export default defineTool({
  name: "list_experiences",
  title: "List experiences",
  description: "List curated experiences (chef, boat, wine, etc.) offered alongside stays.",
  inputSchema: {
    category: z.string().optional().describe("Optional category filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category }) => {
    let q = publicSupabase()
      .from("experiences")
      .select("slug,title,category,short_description,image")
      .order("created_at");
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { experiences: data ?? [] },
    };
  },
});
