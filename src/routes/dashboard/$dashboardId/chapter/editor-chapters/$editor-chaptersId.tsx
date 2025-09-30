import { createFileRoute } from "@tanstack/react-router";

import { ChapterEditor } from "@/pages/dashboard/chapters/chapter-editor";

export const Route = createFileRoute("/dashboard/$dashboardId/chapter/editor-chapters/$editor-chaptersId")({
  component: ChapterEditor,
});
