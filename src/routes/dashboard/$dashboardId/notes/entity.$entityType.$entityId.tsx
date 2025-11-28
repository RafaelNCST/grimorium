import { createFileRoute } from "@tanstack/react-router";

import { EntityNotesPage } from "@/pages/notes/entity-notes";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/notes/entity/$entityType/$entityId"
)({
  component: EntityNotesPage,
});
