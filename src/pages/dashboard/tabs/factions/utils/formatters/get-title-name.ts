import { IFaction } from "@/types/faction-types";

export function getTitleName(titleId: string, faction: IFaction): string {
  const title = faction.titles.find((t) => t.id === titleId);
  return title?.name || "Membro";
}
