import { createFileRoute } from "@tanstack/react-router";

import { PlotTimeline } from "@/pages/dashboard/tabs/plot/plot-timeline";

export const Route = createFileRoute("/dashboard/$dashboardId/plot/plot-timeline/plot-timeline")({
  component: PlotTimeline,
});
