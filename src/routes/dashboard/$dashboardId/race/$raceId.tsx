import { createFileRoute } from "@tanstack/react-router";

import { RaceDetail } from "@/pages/dashboard/tabs/species/race-detail";

export const Route = createFileRoute("/dashboard/$dashboardId/race/$raceId")({
  component: RaceDetail,
});
