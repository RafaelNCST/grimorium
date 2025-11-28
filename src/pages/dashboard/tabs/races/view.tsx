import { Plus, Users } from "lucide-react";

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
  // Configure filter rows
  const filterRows = createDomainFilterRows(domainStats);

  return (
    <>
      <EntityListLayout
        isLoading={isLoading}
        loadingText="Carregando raças..."
        isEmpty={allRaces.length === 0}
        emptyState={{
          icon: Users,
          title: "Nenhuma raça criada",
          description: "Crie sua primeira raça clicando no botão 'Nova Raça'",
        }}
        header={{
          title: "Raças",
          description:
            "Gerencie as raças, bestas e espécies que habitam o seu mundo",
          primaryAction: {
            label: "Nova Raça",
            onClick: () => onSetIsCreateRaceOpen(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
        }}
        filters={{
          totalCount: allRaces.length,
          totalLabel: "Total",
          selectedFilters: selectedDomains,
          filterRows,
          onFilterToggle: onDomainToggle,
          onClearFilters,
        }}
        search={{
          value: searchQuery,
          onChange: onSearchChange,
          placeholder: "Buscar raça por nome...",
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
