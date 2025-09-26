import { createFileRoute } from "@tanstack/react-router";

import { FamilyTreePage } from "@/pages/family-tree";

export const Route = createFileRoute(
  "/book/$bookId/character/$characterId/family-tree"
)({
  component: FamilyTreePage,
});
