import { FilterRow, BADGE_COLORS } from "@/components/entity-list";

import { DomainType } from "../types/race-types";

/**
 * Creates filter configuration for race domains
 */
export function createDomainFilterRows(
  domainStats: Record<DomainType, number>
): FilterRow<DomainType>[] {
  const domains: DomainType[] = [
    "Aquático",
    "Terrestre",
    "Aéreo",
    "Subterrâneo",
    "Elevado",
    "Dimensional",
    "Espiritual",
    "Cósmico",
  ];

  return [
    {
      id: "domains",
      items: domains.map((domain) => ({
        value: domain,
        label: domain,
        count: domainStats[domain],
        colorConfig: getDomainColorConfig(domain),
      })),
    },
  ];
}

/**
 * Maps domain to its color configuration
 */
function getDomainColorConfig(domain: DomainType) {
  const colorMap: Record<DomainType, keyof typeof BADGE_COLORS> = {
    Aquático: "blue",
    Terrestre: "green",
    Aéreo: "cyan",
    Subterrâneo: "orange",
    Elevado: "teal",
    Dimensional: "purple",
    Espiritual: "violet",
    Cósmico: "indigo",
  };

  return BADGE_COLORS[colorMap[domain]];
}
