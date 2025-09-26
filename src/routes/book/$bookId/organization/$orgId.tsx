import { createFileRoute } from "@tanstack/react-router";

import { OrganizationDetail } from "@/pages/organization-detail";

export const Route = createFileRoute("/book/$bookId/organization/$orgId")({
  component: OrganizationDetail,
});
