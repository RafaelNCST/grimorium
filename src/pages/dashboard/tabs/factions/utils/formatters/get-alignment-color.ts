import { FactionAlignment } from "@/types/faction-types";

/**
 * Returns color classes for faction alignment badges
 * Alignment values are stored in English but displayed via i18n
 */
export function getAlignmentColor(alignment: FactionAlignment): string {
  switch (alignment) {
    case "good":
      return "bg-success text-success-foreground";
    case "chaotic":
      return "bg-destructive text-destructive-foreground";
    case "neutral":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}
