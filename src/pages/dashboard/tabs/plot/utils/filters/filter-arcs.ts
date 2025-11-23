import { IPlotArc, PlotArcSize, PlotArcStatus } from "@/types/plot-types";

interface FilterArcsParams {
  arcs: IPlotArc[];
  searchTerm: string;
  selectedStatuses: PlotArcStatus[];
  selectedSizes: PlotArcSize[];
}

export function filterArcs({
  arcs,
  searchTerm,
  selectedStatuses,
  selectedSizes,
}: FilterArcsParams): IPlotArc[] {
  return arcs.filter((arc) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      arc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arc.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Multi-selection filter logic
    const hasStatusFilter = selectedStatuses.length > 0;
    const hasSizeFilter = selectedSizes.length > 0;

    let matchesFilters = true;

    if (hasStatusFilter && hasSizeFilter) {
      // Both filters active: arc must match at least one status AND at least one size
      const matchesStatus = selectedStatuses.includes(arc.status);
      const matchesSize = selectedSizes.includes(arc.size);
      matchesFilters = matchesStatus && matchesSize;
    } else if (hasStatusFilter) {
      // Only status filter active: arc must match at least one status (OR)
      matchesFilters = selectedStatuses.includes(arc.status);
    } else if (hasSizeFilter) {
      // Only size filter active: arc must match at least one size (OR)
      matchesFilters = selectedSizes.includes(arc.size);
    }
    // If no filters are active, matchesFilters remains true

    return matchesSearch && matchesFilters;
  });
}
