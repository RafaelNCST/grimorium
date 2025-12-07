import { IFaction } from "@/types/faction-types";

interface TotalByAlignment {
  good: number;
  neutral: number;
  chaotic: number;
}

export function calculateTotalByAlignment(
  factions: IFaction[]
): TotalByAlignment {
  return {
    good: factions.filter((f) => f.alignment === "good").length,
    neutral: factions.filter((f) => f.alignment === "neutral").length,
    chaotic: factions.filter((f) => f.alignment === "chaotic").length,
  };
}
