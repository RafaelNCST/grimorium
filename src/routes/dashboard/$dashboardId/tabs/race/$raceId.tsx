import { createFileRoute } from "@tanstack/react-router";

import { RaceDetail } from "@/pages/dashboard/tabs/races/race-detail";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/race/$raceId"
)({
  component: RaceDetail,
});
