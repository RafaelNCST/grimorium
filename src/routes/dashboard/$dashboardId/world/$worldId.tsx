import { createFileRoute } from "@tanstack/react-router";

import { WorldDetail } from "@/pages/dashboard/tabs/world/world-detail";

export const Route = createFileRoute("/dashboard/$dashboardId/world/$worldId")({
  component: WorldDetail,
});
