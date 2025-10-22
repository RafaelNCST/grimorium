import { IFaction } from "@/types/faction-types";

interface FilterFactionsParams {
  factions: IFaction[];
  searchTerm: string;
  selectedAlignment: string;
  selectedWorld: string;
}

export function filterFactions({
  factions,
  searchTerm,
  selectedAlignment,
  selectedWorld,
}: FilterFactionsParams): IFaction[] {
  return factions.filter((faction) => {
    const matchesSearch =
      faction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faction.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAlignment =
      selectedAlignment === "all" || faction.alignment === selectedAlignment;

    const matchesWorld = selectedWorld === "all" || faction.world === selectedWorld;

    return matchesSearch && matchesAlignment && matchesWorld;
  });
}
