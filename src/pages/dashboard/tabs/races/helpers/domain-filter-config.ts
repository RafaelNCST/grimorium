import { TFunction } from "i18next";

import { FilterRow, BADGE_COLORS } from "@/components/entity-list";
import { getRaceDomains } from "@/components/modals/create-race-modal/constants/domains";

import { DomainType } from "../types/race-types";

/**
 * Creates filter configuration for race domains
 */
export function createDomainFilterRows(
  domainStats: Record<DomainType, number>,
  t: TFunction
): FilterRow<DomainType>[] {
  const domains: DomainType[] = [
    "aquatic",
    "terrestrial",
    "aerial",
    "underground",
    "elevated",
    "dimensional",
    "spiritual",
    "cosmic",
  ];

  const raceDomains = getRaceDomains(t);

  return [
    {
      id: "domains",
      items: domains.map((domain) => {
        const domainData = raceDomains.find((d) => d.value === domain);
        return {
          value: domain,
          label: domainData?.label || domain,
          count: domainStats[domain],
          icon: domainData?.icon,
          colorConfig: getDomainColorConfig(domain),
        };
      }),
    },
  ];
}

/**
 * Maps domain to its color configuration
 */
export function getDomainColorConfig(domain: DomainType) {
  const colorMap: Record<DomainType, keyof typeof BADGE_COLORS> = {
    aquatic: "blue",
    terrestrial: "green",
    aerial: "cyan",
    underground: "orange",
    elevated: "teal",
    dimensional: "purple",
    spiritual: "violet",
    cosmic: "indigo",
  };

  return BADGE_COLORS[colorMap[domain]];
}

/**
 * Gets domain display data (icon and color config)
 */
export function getDomainDisplayData(domain: DomainType, t: TFunction) {
  const raceDomains = getRaceDomains(t);
  const domainData = raceDomains.find((d) => d.value === domain);
  const colorConfig = getDomainColorConfig(domain);

  return {
    icon: domainData?.icon,
    colorConfig,
  };
}
