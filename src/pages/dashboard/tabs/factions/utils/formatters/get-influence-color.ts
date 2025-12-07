import { FactionInfluence } from "@/types/faction-types";

/**
 * Returns color classes for faction influence badges
 * Influence values are stored in English but displayed via i18n
 */
export function getInfluenceColor(influence: FactionInfluence): string {
  switch (influence) {
    case "dominant":
      return "bg-destructive text-destructive-foreground";
    case "superior":
      return "bg-orange-500 text-white";
    case "high":
      return "bg-accent text-accent-foreground";
    case "medium":
      return "bg-primary text-primary-foreground";
    case "low":
      return "bg-secondary text-secondary-foreground";
    case "nonexistent":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}
