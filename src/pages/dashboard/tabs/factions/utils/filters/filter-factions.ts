import { IFaction } from "@/types/faction-types";

interface FilterFactionsParams {
  factions: IFaction[];
  searchTerm: string;
  selectedStatuses: string[];
  selectedTypes: string[];
}

export function filterFactions({
  factions,
  searchTerm,
  selectedStatuses,
  selectedTypes,
}: FilterFactionsParams): IFaction[] {
  return factions.filter((faction) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      faction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faction.summary.toLowerCase().includes(searchTerm.toLowerCase());

    // Multi-selection filter logic
    const hasStatusFilter = selectedStatuses.length > 0;
    const hasTypeFilter = selectedTypes.length > 0;

    let matchesFilters = true;

    if (hasStatusFilter && hasTypeFilter) {
      // Both filters active: faction must match at least one status AND at least one type
      const matchesStatus = selectedStatuses.includes(faction.status);
      const matchesType = selectedTypes.includes(faction.factionType);
      matchesFilters = matchesStatus && matchesType;
    } else if (hasStatusFilter) {
      // Only status filter active: faction must match at least one status (OR)
      matchesFilters = selectedStatuses.includes(faction.status);
    } else if (hasTypeFilter) {
      // Only type filter active: faction must match at least one type (OR)
      matchesFilters = selectedTypes.includes(faction.factionType);
    }
    // If no filters are active, matchesFilters remains true

    return matchesSearch && matchesFilters;
  });
}
