import { Beast } from "@/mocks/local/beast-data";

export function getUniqueRaces(beasts: Beast[]): string[] {
  return Array.from(new Set(beasts.map((beast) => beast.race).filter(Boolean)));
}
