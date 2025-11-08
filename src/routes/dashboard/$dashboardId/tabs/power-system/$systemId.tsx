import { createFileRoute, useParams } from "@tanstack/react-router";

import { PowerSystemDetail } from "@/pages/dashboard/tabs/power-system/system-detail";

const PowerSystemDetailPage = () => {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/power-system/$systemId",
  });

  return <PowerSystemDetail bookId={dashboardId} />;
};

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/power-system/$systemId"
)({
  component: PowerSystemDetailPage,
});
