import { createFileRoute } from "@tanstack/react-router";

import { ChaptersPage } from "@/pages/chapters";

export const Route = createFileRoute("/book/$bookId/chapters")({
  component: ChaptersPage,
});
