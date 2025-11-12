import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { RegionDetail } from "@/pages/dashboard/tabs/world/region-detail";

const regionDetailSearchSchema = z.object({
  versionId: z.string().optional(),
});

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/world/$regionId/"
)({
  component: RegionDetail,
  validateSearch: regionDetailSearchSchema,
});
