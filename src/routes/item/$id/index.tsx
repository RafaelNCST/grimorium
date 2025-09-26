import { createFileRoute } from "@tanstack/react-router";

import ItemDetail from "@/pages/item-detail";

export const Route = createFileRoute("/item/$id/")({
  component: ItemDetail,
});
