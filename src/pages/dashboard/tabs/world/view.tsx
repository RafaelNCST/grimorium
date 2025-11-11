import { useTranslation } from "react-i18next";
import { Plus, Search, Network, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { CreateRegionModal } from "@/components/modals/create-region-modal";
import { HierarchyManagerModal } from "./components/hierarchy-manager-modal";
import { RegionCard } from "./components/region-card";
import { ScaleFilterBadges } from "./components/scale-filter-badges";
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
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <Button
            variant="magical"
            size="lg"
            onClick={() => onShowCreateModal(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("new_region_button")}
          </Button>
        </div>

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onShowHierarchyModal(true)}
          >
            <Network className="w-4 h-4 mr-2" />
            {t("manage_hierarchy_button")}
          </Button>
          <Button
            variant="magical"
            onClick={() => onShowCreateModal(true)}
            className="animate-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("new_region_button")}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Scale Filter Badges */}
      <ScaleFilterBadges
        totalRegions={allRegions.length}
        scaleStats={scaleStats}
        selectedScales={selectedScales}
        onScaleToggle={onScaleToggle}
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
