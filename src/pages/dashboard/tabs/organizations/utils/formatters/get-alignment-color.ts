import { OrganizationAlignment } from "@/types/organization-types";

export function getAlignmentColor(alignment: OrganizationAlignment): string {
  switch (alignment) {
    case "Bem":
      return "bg-success text-success-foreground";
    case "Caótico":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}
