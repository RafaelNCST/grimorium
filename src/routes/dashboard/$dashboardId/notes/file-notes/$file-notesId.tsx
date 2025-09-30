import { createFileRoute } from "@tanstack/react-router";

import { Notes } from "@/pages/dashboard/notes";

export const Route = createFileRoute("/dashboard/$dashboardId/notes/file-notes/$file-notesId")({
  component: Notes,
});
