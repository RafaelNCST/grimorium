import { createFileRoute } from "@tanstack/react-router";

import ItemTimeline from "@/pages/dashboard/tabs/items/item-detail/item-timeline";

export const Route = createFileRoute("/dashboard/$dashboardId/tabs/item/$itemId/timeline")({
  component: ItemTimeline,
});
