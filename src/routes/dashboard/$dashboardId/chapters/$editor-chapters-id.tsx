import { createFileRoute } from "@tanstack/react-router";

import { ChapterEditor } from "@/pages/dashboard/chapters/chapter-editor";

export const Route = createFileRoute("/dashboard/$dashboardId/chapters/$editor-chapters-id")({
  component: ChapterEditor,
});
