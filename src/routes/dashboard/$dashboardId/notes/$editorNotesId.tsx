import { createFileRoute } from "@tanstack/react-router";

import FileEditor from "@/pages/dashboard/notes/file-editor";

export const Route = createFileRoute("/dashboard/$dashboardId/notes/$editorNotesId")({
  component: FileEditor,
});
