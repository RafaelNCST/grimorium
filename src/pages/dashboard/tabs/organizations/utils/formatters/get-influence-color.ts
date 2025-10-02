import { OrganizationInfluence } from "@/types/organization-types";

export function getInfluenceColor(influence: OrganizationInfluence): string {
  switch (influence) {
    case "Dominante":
      return "bg-destructive text-destructive-foreground";
    case "Alta":
      return "bg-accent text-accent-foreground";
    case "Média":
      return "bg-primary text-primary-foreground";
    case "Baixa":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}
