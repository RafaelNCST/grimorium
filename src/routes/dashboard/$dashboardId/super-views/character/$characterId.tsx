import { createFileRoute } from "@tanstack/react-router";

import { CharacterSuperViewPage } from "@/pages/dashboard/super-views/character-super-view";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/super-views/character/$characterId"
)({
  component: CharacterSuperViewPage,
});
