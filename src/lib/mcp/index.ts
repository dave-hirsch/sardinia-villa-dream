import { defineMcp } from "@lovable.dev/mcp-js";
import listVillas from "./tools/list-villas";
import getVilla from "./tools/get-villa";
import listDestinations from "./tools/list-destinations";
import listExperiences from "./tools/list-experiences";
import submitEnquiry from "./tools/submit-enquiry";

export default defineMcp({
  name: "my-sardinian-villa",
  title: "My Sardinian Villa",
  version: "0.1.0",
  instructions:
    "Tools for the My Sardinian Villa collection — private villas across southern Sardinia. Use `list_destinations`, `list_villas`, and `get_villa` to browse the collection, `list_experiences` for add-on services (private chef, boat trips, winery tours), and `submit_enquiry` to send a booking enquiry to Marion (personal reply within 24 hours).",
  tools: [listDestinations, listVillas, getVilla, listExperiences, submitEnquiry],
});
