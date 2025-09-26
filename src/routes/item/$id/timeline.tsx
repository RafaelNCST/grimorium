import { createFileRoute } from "@tanstack/react-router";

import ItemTimeline from "@/pages/item-timeline";

export const Route = createFileRoute("/item/$id/timeline")({
  component: ItemTimeline,
});
