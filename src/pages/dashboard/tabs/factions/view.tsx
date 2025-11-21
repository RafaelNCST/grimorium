import { memo, useMemo } from "react";

import { Plus, Users, Filter, Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { CreateFactionModal } from "@/components/modals/create-faction-modal/index";
import {
  type IFaction,
  type IFactionFormData,
  type FactionStatus,
  type FactionType,
} from "@/types/faction-types";

import { FactionCard } from "./components/faction-card";
import { createFactionFilterRows } from "./helpers/filter-config";

interface PropsFactionsView {
  bookId: string;
  factions: IFaction[];
  filteredFactions: IFaction[];
  searchTerm: string;
  selectedStatuses: string[];
  selectedTypes: string[];
  statusStats: Record<FactionStatus, number>;
  typeStats: Record<FactionType, number>;
  showCreateModal: boolean;
  onSearchTermChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onTypeFilterChange: (type: string) => void;
  onClearFilters: () => void;
  onShowCreateModalChange: (show: boolean) => void;
  onNavigateToFaction: (factionId: string) => void;
  onCreateFaction: (factionData: IFactionFormData) => void;
}

const FactionsViewComponent = function FactionsView({
  bookId,
  factions,
  filteredFactions,
  searchTerm,
  selectedStatuses,
  selectedTypes,
  statusStats,
  typeStats,
  showCreateModal,
  onSearchTermChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onClearFilters,
  onShowCreateModalChange,
  onNavigateToFaction,
  onCreateFaction,
}: PropsFactionsView) {
  const { t } = useTranslation(["factions", "create-faction"]);

  // Create filter rows
  const { statusRows, typeRows } = useMemo(
    () => createFactionFilterRows(statusStats, typeStats, t),
    [statusStats, typeStats, t]
  );

  // Combine all selected filters
  const allSelectedFilters = useMemo(
    () => [...selectedStatuses, ...selectedTypes],
    [selectedStatuses, selectedTypes]
  );

  // Handle filter toggle (works for both statuses and types)
  const handleFilterToggle = (value: string) => {
    // Check if value is in status filters
    const isStatus = statusRows[0]?.items.some((item) => item.value === value);

    if (isStatus) {
      onStatusFilterChange(value);
    } else {
      onTypeFilterChange(value);
    }
  };

  // Determine which empty state to show
  const hasNoResults =
    filteredFactions.length === 0 && factions.length > 0;
  const hasSearch = searchTerm.trim().length > 0;
  const hasFilters = selectedStatuses.length > 0 || selectedTypes.length > 0;

  return (
    <>
      <EntityListLayout
        isLoading={false}
        isEmpty={factions.length === 0}
        emptyState={{
          icon: Users,
          title: t("factions:empty_state.no_factions"),
          description: t("factions:empty_state.no_factions_description"),
        }}
        header={{
          title: t("factions:page.title"),
          description: t("factions:page.description"),
          primaryAction: {
            label: t("factions:page.new_faction"),
            onClick: () => onShowCreateModalChange(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
        }}
        filters={{
          totalCount: factions.length,
          totalLabel: t("factions:page.total_badge"),
          selectedFilters: allSelectedFilters,
          filterRows: [...statusRows, ...typeRows],
          onFilterToggle: handleFilterToggle,
          onClearFilters,
        }}
        search={{
          value: searchTerm,
          onChange: onSearchTermChange,
          placeholder: t("factions:page.search_placeholder"),
          maxWidth: "max-w-[50%]",
        }}
        showNoResultsState={hasNoResults}
        noResultsState={{
          icon: hasFilters ? Filter : SearchIcon,
          title: t("factions:empty_state.no_factions_found"),
          description: t("factions:empty_state.no_factions_found_description"),
        }}
      >
        <EntityCardList
          layout="vertical"
          items={filteredFactions}
          renderCard={(faction) => (
            <FactionCard
              key={faction.id}
              faction={faction}
              onClick={onNavigateToFaction}
            />
          )}
        />
      </EntityListLayout>

      <CreateFactionModal
        open={showCreateModal}
        onClose={() => onShowCreateModalChange(false)}
        onConfirm={onCreateFaction}
        bookId={bookId}
      />
    </>
  );
};

export const FactionsView = memo(FactionsViewComponent);
