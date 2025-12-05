import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ItemSuperViewPage } from "@/pages/dashboard/super-views/item-super-view";

const searchSchema = z.object({
  from: z.string().optional(),
});

export const Route = createFileRoute(
  "/dashboard$dashboardId/super-views/item$itemId"
)({
  component: ItemSuperViewPage,
  validateSearch: searchSchema,
});
