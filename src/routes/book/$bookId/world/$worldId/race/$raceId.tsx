import { createFileRoute } from "@tanstack/react-router";

import { RaceDetail } from "@/pages/race-detail";

export const Route = createFileRoute(
  "/book/$bookId/world/$worldId/race/$raceId"
)({
  component: RaceDetail,
});
