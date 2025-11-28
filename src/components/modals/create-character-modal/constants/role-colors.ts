import { CharacterRole } from "@/types/character-types";

/**
 * Base card colors for role picker (neutral state)
 */
export const ROLE_BASE_COLOR = "bg-card text-muted-foreground border-border";

/**
 * Hover colors for role picker cards
 */
export const ROLE_HOVER_COLOR: Record<CharacterRole, string> = {
  protagonist: "hover:bg-yellow-500/10 hover:border-yellow-500/20",
  antagonist: "hover:bg-orange-500/10 hover:border-orange-500/20",
  villain: "hover:bg-red-500/10 hover:border-red-500/20",
  secondary: "hover:bg-blue-500/10 hover:border-blue-500/20",
  extra: "hover:bg-gray-500/10 hover:border-gray-500/20",
};

/**
 * Active colors for role picker cards (with ring)
 */
export const ROLE_ACTIVE_COLOR: Record<CharacterRole, string> = {
  protagonist:
    "bg-yellow-500/20 border-yellow-500/30 ring-2 ring-yellow-500/50",
  antagonist: "bg-orange-500/20 border-orange-500/30 ring-2 ring-orange-500/50",
  villain: "bg-red-500/20 border-red-500/30 ring-2 ring-red-500/50",
  secondary: "bg-blue-500/20 border-blue-500/30 ring-2 ring-blue-500/50",
  extra: "bg-gray-500/20 border-gray-500/30 ring-2 ring-gray-500/50",
};
