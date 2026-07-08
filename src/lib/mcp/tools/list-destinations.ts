import { defineTool } from "@lovable.dev/mcp-js";
import { publicSupabase } from "../supabase";

export default defineTool({
  name: "list_destinations",
  title: "List destinations",
  description: "List the southern Sardinia destinations covered by the collection.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { data, error } = await publicSupabase()
      .from("destinations")
      .select("slug,name,intro,cover_image")
      .order("name");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { destinations: data ?? [] },
    };
  },
});
