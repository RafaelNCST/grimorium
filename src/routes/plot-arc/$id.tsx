import { createFileRoute } from "@tanstack/react-router";

import { PlotArcDetail } from "@/pages/plot-arc-detail";

export const Route = createFileRoute("/plot-arc/$id")({
  component: PlotArcDetail,
});
