import { FilterRow, BADGE_COLORS } from "@/components/entity-list";
import { RACE_DOMAINS } from "@/components/modals/create-race-modal/constants/domains";

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
export function getDomainColorConfig(domain: DomainType) {
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

/**
 * Gets domain display data (icon and color config)
 */
export function getDomainDisplayData(domain: DomainType) {
  const domainData = RACE_DOMAINS.find((d) => d.label === domain);
  const colorConfig = getDomainColorConfig(domain);

  return {
    icon: domainData?.icon,
    colorConfig,
  };
}
