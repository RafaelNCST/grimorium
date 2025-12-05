import { createFileRoute } from "@tanstack/react-router";

import { ItemSuperViewPage } from "@/pages/dashboard/super-views/item-super-view";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/super-views/item/$itemId"
)({
  component: ItemSuperViewPage,
});
