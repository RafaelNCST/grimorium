import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { RaceSuperViewPage } from "@/pages/dashboard/super-views/race-super-view";

const searchSchema = z.object({
  from: z.string().optional(),
});

export const Route = createFileRoute(
  "/dashboard/$dashboardId/super-views/race/$raceId"
)({
  component: RaceSuperViewPage,
  validateSearch: searchSchema,
});
