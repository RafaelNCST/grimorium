import { createFileRoute } from "@tanstack/react-router";

import { NoteDetailPage } from "@/pages/notes/note-detail";

export const Route = createFileRoute("/notes/$noteId")({
  component: NoteDetailPage,
});
