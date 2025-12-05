import { createFileRoute } from "@tanstack/react-router";

import { FactionSuperViewPage } from "@/pages/dashboard/super-views/faction-super-view";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/super-views/faction/$factionId"
)({
  component: FactionSuperViewPage,
});
