import { createFileRoute } from "@tanstack/react-router";

import { CharacterDetail } from "@/pages/dashboard/tabs/characters/character-detail";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/character/$characterId/"
)({
  component: CharacterDetail,
});
