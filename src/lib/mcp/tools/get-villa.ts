import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { publicSupabase } from "../supabase";

export default defineTool({
  name: "get_villa",
  title: "Get villa details",
  description: "Fetch the full details of a single villa by its slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Villa slug, e.g. 'villa-smeralda'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const { data, error } = await publicSupabase()
      .from("villas")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data)
      return { content: [{ type: "text", text: `No villa with slug '${slug}'` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { villa: data },
    };
  },
});
