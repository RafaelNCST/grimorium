import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard$dashboardId/super-views/region$regionId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard$dashboardId/super-views/region$regionId"!</div>
}
