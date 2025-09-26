import { createFileRoute } from "@tanstack/react-router";

import { WorldDetail } from "@/pages/world-detail";

export const Route = createFileRoute("/book/$bookId/world/$worldId")({
  component: WorldDetail,
});
