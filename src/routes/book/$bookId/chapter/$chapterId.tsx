import { createFileRoute } from "@tanstack/react-router";

import { ChapterEditor } from "@/pages/chapter-editor";

export const Route = createFileRoute("/book/$bookId/chapter/$chapterId")({
  component: ChapterEditor,
});
