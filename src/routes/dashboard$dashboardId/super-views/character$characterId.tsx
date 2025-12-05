import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CharacterSuperViewPage } from "@/pages/dashboard/super-views/character-super-view";

const searchSchema = z.object({
  from: z.string().optional(),
});

export const Route = createFileRoute(
  "/dashboard$dashboardId/super-views/character$characterId"
)({
  component: CharacterSuperViewPage,
  validateSearch: searchSchema,
});
