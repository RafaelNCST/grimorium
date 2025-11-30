import { createFileRoute } from "@tanstack/react-router";

import { ChapterEditorNew } from "@/pages/dashboard/chapters/chapter-editor/index-new";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/chapters/$editor-chapters-id"
)({
  component: ChapterEditorNew,
});
