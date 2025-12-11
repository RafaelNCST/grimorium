import { createFileRoute } from "@tanstack/react-router";

import { EntityGalleryPage } from "@/pages/gallery/entity-gallery";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/gallery/entity/$entityType/$entityId"
)({
  component: EntityGalleryPage,
  validateSearch: (search: Record<string, unknown>) => ({
    entityName: (search.entityName as string) || "",
  }),
});
