import { createFileRoute } from "@tanstack/react-router";

import { Notes } from "@/pages/dashboard/notes";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/notes/$fileNotesId"
)({
  component: Notes,
});
