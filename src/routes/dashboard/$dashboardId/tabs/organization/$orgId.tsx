import { createFileRoute } from "@tanstack/react-router";

import { FactionDetail } from "@/pages/dashboard/tabs/factions/faction-detail";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/organization/$orgId"
)({
  component: FactionDetail,
});
