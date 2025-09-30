import { createFileRoute } from "@tanstack/react-router";

import { ChaptersPage } from "@/pages/dashboard/chapters";

export const Route = createFileRoute("/dashboard/$dashboardId/chapter/chapters")({
  component: ChaptersPage,
});
