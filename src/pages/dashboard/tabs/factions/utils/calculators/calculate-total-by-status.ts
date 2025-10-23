import { IFaction, FactionStatus } from "@/types/faction-types";

export function calculateTotalByStatus(
  factions: IFaction[]
): Record<FactionStatus, number> {
  const totals: Record<FactionStatus, number> = {
    active: 0,
    weakened: 0,
    dissolved: 0,
    reformed: 0,
    apex: 0,
  };

  factions.forEach((faction) => {
    totals[faction.status] = (totals[faction.status] || 0) + 1;
  });

  return totals;
}
