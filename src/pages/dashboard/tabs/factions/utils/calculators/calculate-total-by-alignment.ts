import { IFaction } from "@/types/faction-types";

interface TotalByAlignment {
  bem: number;
  neutro: number;
  caotico: number;
}

export function calculateTotalByAlignment(
  factions: IFaction[]
): TotalByAlignment {
  return {
    bem: factions.filter((f) => f.alignment === "Bem").length,
    neutro: factions.filter((f) => f.alignment === "Neutro").length,
    caotico: factions.filter((f) => f.alignment === "Caótico").length,
  };
}
