import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/dashboard$dashboardId/super-views/region$regionId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello &quot;/dashboard$dashboardId/super-views/region$regionId&quot;!
    </div>
  );
}
