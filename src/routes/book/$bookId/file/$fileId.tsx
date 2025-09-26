import { createFileRoute } from "@tanstack/react-router";

import FileEditor from "@/pages/file-editor";

export const Route = createFileRoute("/book/$bookId/file/$fileId")({
  component: FileEditor,
});
