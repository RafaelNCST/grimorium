import { memo, useMemo } from "react";

import {
  Plus,
  BookOpen,
  Filter,
  Search as SearchIcon,
  GitBranch,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { CreatePlotArcModal } from "@/components/modals/create-plot-arc-modal";
import type { IPlotArc, PlotArcSize, PlotArcStatus } from "@/types/plot-types";

import { PlotArcCard } from "./components/plot-arc-card";
import { createPlotFilterRows } from "./helpers/filter-config";

interface PropsPlotView {
  arcs: IPlotArc[];
  filteredArcs: IPlotArc[];
  searchTerm: string;
  selectedStatuses: PlotArcStatus[];
  selectedSizes: PlotArcSize[];
  statusStats: Record<PlotArcStatus, number>;
  sizeStats: Record<PlotArcSize, number>;
  showCreateModal: boolean;
  isLoading: boolean;
  onSearchTermChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSizeFilterChange: (size: string) => void;
  onClearFilters: () => void;
  onShowCreateModalChange: (show: boolean) => void;
  onNavigateToArc: (arcId: string) => void;
  onNavigateToTimeline: () => void;
  onCreateArc: (arcData: Omit<IPlotArc, "id" | "progress" | "order">) => void;
}

const PlotViewComponent = function PlotView({
  arcs,
  filteredArcs,
  searchTerm,
  selectedStatuses,
  selectedSizes,
  statusStats,
  sizeStats,
  showCreateModal,
  isLoading,
  onSearchTermChange,
  onStatusFilterChange,
  onSizeFilterChange,
  onClearFilters,
  onShowCreateModalChange,
  onNavigateToArc,
  onNavigateToTimeline,
  onCreateArc,
}: PropsPlotView) {
  const { t } = useTranslation("plot");

  // Create filter rows
  const { statusRows, sizeRows } = useMemo(
    () => createPlotFilterRows(statusStats, sizeStats, t),
    [statusStats, sizeStats, t]
  );

  // Combine all selected filters
  const allSelectedFilters = useMemo(
    () => [...selectedStatuses, ...selectedSizes],
    [selectedStatuses, selectedSizes]
  );

  // Handle filter toggle (works for both statuses and sizes)
  const handleFilterToggle = (value: string) => {
    // Check if value is in status filters
    const isStatus = statusRows[0]?.items.some((item) => item.value === value);

    if (isStatus) {
      onStatusFilterChange(value);
    } else {
      onSizeFilterChange(value);
    }
  };

  // Determine which empty state to show
  const hasNoResults = filteredArcs.length === 0 && arcs.length > 0;
  const hasFilters = selectedStatuses.length > 0 || selectedSizes.length > 0;

  return (
    <>
      <EntityListLayout
        isLoading={isLoading}
        isEmpty={arcs.length === 0}
        emptyState={{
          icon: BookOpen,
          title: t("empty_state.no_arcs"),
          description: t("empty_state.no_arcs_description"),
        }}
        header={{
          title: t("page.title"),
          description: t("page.description"),
          primaryAction: {
            label: t("page.new_arc"),
            onClick: () => onShowCreateModalChange(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
          secondaryActions: [
            {
              label: t("page.visual_tree"),
              onClick: onNavigateToTimeline,
              variant: "secondary",
              icon: GitBranch,
            },
          ],
        }}
        filters={{
          totalCount: arcs.length,
          totalLabel: t("page.total_badge"),
          selectedFilters: allSelectedFilters,
          filterRows: [...statusRows, ...sizeRows],
          onFilterToggle: handleFilterToggle,
          onClearFilters,
        }}
        search={{
          value: searchTerm,
          onChange: onSearchTermChange,
          placeholder: t("page.search_placeholder"),
          maxWidth: "max-w-[50%]",
        }}
        showNoResultsState={hasNoResults}
        noResultsState={{
          icon: hasFilters ? Filter : SearchIcon,
          title: t("empty_state.no_results"),
          description: t("empty_state.no_results_description"),
        }}
      >
        <EntityCardList
          layout="vertical"
          items={filteredArcs}
          renderCard={(arc) => (
            <PlotArcCard key={arc.id} arc={arc} onClick={onNavigateToArc} />
          )}
        />
      </EntityListLayout>

      <CreatePlotArcModal
        open={showCreateModal}
        onOpenChange={onShowCreateModalChange}
        onCreateArc={onCreateArc}
        existingArcs={arcs}
      />
    </>
  );
};

export const PlotView = memo(PlotViewComponent);
