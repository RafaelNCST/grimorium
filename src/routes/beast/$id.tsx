import { createFileRoute } from "@tanstack/react-router";

import { BeastDetail } from "@/pages/beast-detail";

export const Route = createFileRoute("/beast/$id")({
  component: BeastDetail,
});
