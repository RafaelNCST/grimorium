import { createFileRoute } from "@tanstack/react-router";

import { SpeciesDetail } from "@/pages/species-detail";

export const Route = createFileRoute(
  "/book/$bookId/world/$worldId/species/$speciesId"
)({
  component: SpeciesDetail,
});
