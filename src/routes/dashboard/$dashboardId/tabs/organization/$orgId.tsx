import { createFileRoute } from "@tanstack/react-router";

import { OrganizationDetail } from "@/pages/dashboard/tabs/organizations/organization-detail";

export const Route = createFileRoute("/dashboard/$dashboardId/tabs/organization/$orgId")({
  component: OrganizationDetail,
});
