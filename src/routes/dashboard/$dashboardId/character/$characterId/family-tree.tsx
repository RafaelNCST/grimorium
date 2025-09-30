import { createFileRoute } from "@tanstack/react-router";

import { FamilyTreePage } from "@/pages/dashboard/tabs/characters/character-detail/family-tree";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/character/$characterId/family-tree"
)({
  component: FamilyTreePage,
});
