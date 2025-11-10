import { createFileRoute } from "@tanstack/react-router";

import { RegionDetail } from "@/pages/dashboard/tabs/world/region-detail";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/world/$regionId/"
)({
  component: RegionDetail,
});
