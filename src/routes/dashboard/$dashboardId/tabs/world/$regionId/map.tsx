import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { RegionMapPage } from "@/pages/dashboard/tabs/world/region-map";

const mapSearchSchema = z.object({
  versionId: z.string().optional(),
});

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/world/$regionId/map"
)({
  component: RegionMapPage,
  validateSearch: mapSearchSchema,
});
