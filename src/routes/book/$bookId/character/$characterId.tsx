import { createFileRoute } from "@tanstack/react-router";

import { CharacterDetail } from "@/pages/character-detail";

export const Route = createFileRoute("/book/$bookId/character/$characterId")({
  component: CharacterDetail,
});
