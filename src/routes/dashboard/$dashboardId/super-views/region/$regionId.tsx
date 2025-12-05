import { createFileRoute } from "@tanstack/react-router";

import { RegionSuperViewPage } from "@/pages/dashboard/super-views/region-super-view";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/super-views/region/$regionId"
)({
  component: RegionSuperViewPage,
});
