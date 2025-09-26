import { createFileRoute } from "@tanstack/react-router";

import { PlotTimeline } from "@/pages/plot-timeline";

export const Route = createFileRoute("/plot-timeline")({
  component: PlotTimeline,
});
