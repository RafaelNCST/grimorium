import { useTranslation } from "react-i18next";
import { Plus, Search, Network, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import {
  EntityListHeader,
  EntitySearchBar,
  EntityFilterBadges,
} from "@/components/entity-list";
import { CreateRegionModal } from "@/components/modals/create-region-modal";
import { HierarchyManagerModal } from "./components/hierarchy-manager-modal";
import { RegionCard } from "./components/region-card";
import { createScaleFilterRows } from "./helpers/scale-filter-config";
import { IRegion, IRegionWithChildren, RegionScale, IRegionFormData } from "./types/region-types";

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading regions...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (allRegions.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <EntityListHeader
          title={t("title")}
          description={t("description")}
          primaryAction={{
            label: t("new_region_button"),
            onClick: () => onShowCreateModal(true),
            variant: "magical",
            size: "lg",
            icon: Plus,
            className: "animate-glow",
          }}
        />

        <EmptyState
          icon={Network}
          title={t("empty_state.title")}
          description={t("empty_state.description")}
        />

        <CreateRegionModal
          open={showCreateModal}
          onOpenChange={onShowCreateModal}
          onConfirm={onCreateRegion}
          availableRegions={allRegions}
          characters={characters}
          factions={factions}
          races={races}
          items={items}
        />
      </div>
    );
  }

  // Configure filter rows
  const filterRows = createScaleFilterRows(scaleStats, t);

  return (
    <div className="space-y-6">
      {/* Header with integrated filters */}
      <EntityListHeader
        title={t("title")}
        description={t("description")}
        primaryAction={{
          label: t("new_region_button"),
          onClick: () => onShowCreateModal(true),
          variant: "magical",
          icon: Plus,
          className: "animate-glow",
        }}
        secondaryActions={[
          {
            label: t("manage_hierarchy_button"),
            onClick: () => onShowHierarchyModal(true),
            variant: "outline",
            icon: Network,
          },
        ]}
      >
        {/* Scale Filter Badges */}
        <EntityFilterBadges
          totalCount={allRegions.length}
          totalLabel={t("filters.all")}
          selectedFilters={selectedScales}
          filterRows={filterRows}
          onFilterToggle={onScaleToggle}
          onClearFilters={() => {
            // Clear all selected scales
            selectedScales.forEach((scale) => onScaleToggle(scale));
          }}
        />
      </EntityListHeader>

      {/* Search Bar */}
      <EntitySearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t("search_placeholder")}
      />

      {/* Regions Grid */}
      {regions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {regions.map((region) => {
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
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title={t("not_found")}
          description="Try adjusting your search or filters"
        />
      )}

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
    </div>
  );
}
