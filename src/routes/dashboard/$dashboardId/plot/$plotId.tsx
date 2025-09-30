import { createFileRoute } from "@tanstack/react-router";

import { PlotArcDetail } from "@/pages/dashboard/tabs/plot/plot-detail";

export const Route = createFileRoute("/dashboard/$dashboardId/plot/$plotId")({
  component: PlotArcDetail,
});
