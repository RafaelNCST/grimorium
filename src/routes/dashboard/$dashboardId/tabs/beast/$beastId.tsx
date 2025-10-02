import { createFileRoute } from "@tanstack/react-router";

import { BeastDetail } from "@/pages/dashboard/tabs/bestiary/beast-detail";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/beast/$beastId"
)({
  component: BeastDetail,
});
