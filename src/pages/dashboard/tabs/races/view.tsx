import { Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityListLayout } from "@/components/layouts";
import { CreateRaceModal } from "@/components/modals/create-race-modal";
import type { RaceFormSchema } from "@/components/modals/create-race-modal/hooks/use-race-validation";

import { RaceCard } from "./components/race-card";
import { createDomainFilterRows } from "./helpers/domain-filter-config";
import { IRace, DomainType } from "./types/race-types";

interface SpeciesViewProps {
  bookId: string;
  races: IRace[];
  allRaces: IRace[];
  isLoading: boolean;
  isCreateRaceOpen: boolean;
  domainStats: Record<DomainType, number>;
  availableRaces: Array<{ id: string; name: string }>;
  searchQuery: string;
  selectedDomains: DomainType[];
  onSetIsCreateRaceOpen: (open: boolean) => void;
  onCreateRace: (data: RaceFormSchema) => void;
  onRaceClick: (raceId: string) => void;
  onSearchChange: (query: string) => void;
  onDomainToggle: (domain: DomainType) => void;
  onClearFilters: () => void;
}

export function SpeciesView({
  bookId,
  races,
  allRaces,
  isLoading,
  isCreateRaceOpen,
  domainStats,
  availableRaces,
  searchQuery,
  selectedDomains,
  onSetIsCreateRaceOpen,
  onCreateRace,
  onRaceClick,
  onSearchChange,
  onDomainToggle,
  onClearFilters,
}: SpeciesViewProps) {
  const { t } = useTranslation(["loading", "empty-states", "dialogs", "races"]);

  // Configure filter rows
  const filterRows = createDomainFilterRows(domainStats, t);

  return (
    <>
      <EntityListLayout
        isLoading={isLoading}
        loadingText={t("loading:loading_races")}
        isEmpty={allRaces.length === 0}
        emptyState={{
          icon: Users,
          title: t("empty-states:entity_search.no_race"),
          description: t("dialogs:create_race.empty_state_description"),
        }}
        header={{
          title: t("races:title"),
          description: t("races:description"),
          primaryAction: {
            label: t("races:new_race_button"),
            onClick: () => onSetIsCreateRaceOpen(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
        }}
        filters={{
          totalCount: allRaces.length,
          totalLabel: t("races:filters.total"),
          selectedFilters: selectedDomains,
          filterRows,
          onFilterToggle: onDomainToggle,
          onClearFilters,
        }}
        search={{
          value: searchQuery,
          onChange: onSearchChange,
          placeholder: t("races:search_placeholder"),
          maxWidth: "max-w-[50%]",
        }}
        showNoResultsState={races.length === 0 && allRaces.length > 0}
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(max(320px, calc((100% - 4rem) / 5)), 1fr))",
          }}
        >
          {races.map((race) => (
            <RaceCard key={race.id} race={race} onClick={onRaceClick} />
          ))}
        </div>
      </EntityListLayout>

      {/* Modals */}
      <CreateRaceModal
        open={isCreateRaceOpen}
        onClose={() => onSetIsCreateRaceOpen(false)}
        onConfirm={onCreateRace}
        availableRaces={availableRaces}
        bookId={bookId}
      />
    </>
  );
}
