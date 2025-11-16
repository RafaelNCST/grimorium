import { Plus, Search, Network } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { CreateRegionModal } from "@/components/modals/create-region-modal";

import { HierarchyManagerModal } from "./components/hierarchy-manager-modal";
import { RegionCard } from "./components/region-card";
import { createScaleFilterRows } from "./helpers/scale-filter-config";
import {
  IRegion,
  IRegionWithChildren,
  RegionScale,
  IRegionFormData,
} from "./types/region-types";

interface WorldViewProps {
  bookId: string;
  regions: IRegion[];
  allRegions: IRegion[];
  hierarchy: IRegionWithChildren[];
  isLoading: boolean;
  searchQuery: string;
  selectedScales: RegionScale[];
  scaleStats: {
    local: number;
    continental: number;
    planetary: number;
    galactic: number;
    universal: number;
    multiversal: number;
  };
  regionMap: Map<string, IRegion>;
  showCreateModal: boolean;
  showHierarchyModal: boolean;
  characters: Array<{ id: string; name: string }>;
  factions: Array<{ id: string; name: string }>;
  races: Array<{ id: string; name: string }>;
  items: Array<{ id: string; name: string }>;
  onSearchChange: (query: string) => void;
  onScaleToggle: (scale: RegionScale) => void;
  onCreateRegion: (data: IRegionFormData) => void;
  onRegionClick: (regionId: string) => void;
  onShowCreateModal: (show: boolean) => void;
  onShowHierarchyModal: (show: boolean) => void;
  onRefreshRegions: () => void;
}

export function WorldView({
  bookId,
  regions,
  allRegions,
  hierarchy,
  isLoading,
  searchQuery,
  selectedScales,
  scaleStats,
  regionMap,
  showCreateModal,
  showHierarchyModal,
  characters,
  factions,
  races,
  items,
  onSearchChange,
  onScaleToggle,
  onCreateRegion,
  onRegionClick,
  onShowCreateModal,
  onShowHierarchyModal,
  onRefreshRegions,
}: WorldViewProps) {
  const { t } = useTranslation("world");

  // Configure filter rows
  const filterRows = createScaleFilterRows(scaleStats, t);

  return (
    <>
      <EntityListLayout
        isLoading={isLoading}
        loadingText="Loading regions..."
        isEmpty={allRegions.length === 0}
        emptyState={{
          icon: Network,
          title: t("empty_state.title"),
          description: t("empty_state.description"),
        }}
        header={{
          title: t("title"),
          description: t("description"),
          primaryAction: {
            label: t("new_region_button"),
            onClick: () => onShowCreateModal(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
          secondaryActions: [
            {
              label: t("manage_hierarchy_button"),
              onClick: () => onShowHierarchyModal(true),
              variant: "secondary",
              icon: Network,
            },
          ],
        }}
        filters={{
          totalCount: allRegions.length,
          totalLabel: t("filters.all"),
          selectedFilters: selectedScales,
          filterRows,
          onFilterToggle: onScaleToggle,
          onClearFilters: () => {
            // Clear all selected scales
            selectedScales.forEach((scale) => onScaleToggle(scale));
          },
        }}
        search={{
          value: searchQuery,
          onChange: onSearchChange,
          placeholder: t("search_placeholder"),
        }}
        showNoResultsState={regions.length === 0}
        noResultsState={{
          icon: Search,
          title: t("not_found"),
          description: "Try adjusting your search or filters",
        }}
      >
        <EntityCardList
          items={regions}
          renderCard={(region) => {
            const parentRegion = region.parentId
              ? regionMap.get(region.parentId)
              : undefined;

            return (
              <RegionCard
                key={region.id}
                region={region}
                onClick={onRegionClick}
                parentRegion={parentRegion}
              />
            );
          }}
          gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
          gap={4}
        />
      </EntityListLayout>

      {/* Modals */}
      <CreateRegionModal
        open={showCreateModal}
        onOpenChange={onShowCreateModal}
        onConfirm={onCreateRegion}
        availableRegions={allRegions}
        bookId={bookId}
        characters={characters}
        factions={factions}
        races={races}
        items={items}
      />

      <HierarchyManagerModal
        open={showHierarchyModal}
        onOpenChange={onShowHierarchyModal}
        regions={hierarchy}
        onRefresh={onRefreshRegions}
      />
    </>
  );
}
