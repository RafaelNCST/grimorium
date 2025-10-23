import { IFaction, FactionType } from "@/types/faction-types";

export function calculateTotalByType(
  factions: IFaction[]
): Record<FactionType, number> {
  const totals: Record<FactionType, number> = {
    commercial: 0,
    military: 0,
    magical: 0,
    religious: 0,
    cult: 0,
    tribal: 0,
    racial: 0,
    governmental: 0,
    academic: 0,
    royalty: 0,
    mercenary: 0,
  };

  factions.forEach((faction) => {
    totals[faction.factionType] = (totals[faction.factionType] || 0) + 1;
  });

  return totals;
}
