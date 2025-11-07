import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PowerInstanceView } from "@/pages/dashboard/tabs/power-system/components/power-instance-view";

export const Route = createFileRoute(
  "/dashboard/$dashboardId/tabs/character/$characterId/power/$linkId"
)({
  component: PowerInstance,
});

function PowerInstance() {
  const { dashboardId, characterId, linkId } = Route.useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/character/$characterId",
      params: { dashboardId, characterId },
    });
  };

  return <PowerInstanceView linkId={linkId} onBack={handleBack} />;
}
