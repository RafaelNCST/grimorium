import { FactionAlignment } from "@/types/faction-types";

export function getAlignmentColor(alignment: FactionAlignment): string {
  switch (alignment) {
    case "Bem":
      return "bg-success text-success-foreground";
    case "Caótico":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}
