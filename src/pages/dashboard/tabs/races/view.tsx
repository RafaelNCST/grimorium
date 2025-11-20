import { useState } from "react";

import { Plus, Users } from "lucide-react";

import { EntityListLayout } from "@/components/layouts";
import { CreateRaceGroupModal } from "@/components/modals/create-race-group-modal";
import type { RaceGroupFormSchema } from "@/components/modals/create-race-group-modal/use-race-group-validation";
import { CreateRaceModal } from "@/components/modals/create-race-modal";
import type { RaceFormSchema } from "@/components/modals/create-race-modal/hooks/use-race-validation";

import { AddRacesToGroupModal } from "./components/add-races-to-group-modal";
import { RaceCard } from "./components/race-card";
import { RaceGroupAccordion } from "./components/race-group-accordion";
import { createDomainFilterRows } from "./helpers/domain-filter-config";
import { IRace, IRaceGroup, DomainType } from "./types/race-types";

interface SpeciesViewProps {
  bookId: string;
  races: IRace[];
  allRaces: IRace[];
  raceGroups: IRaceGroup[];
  ungroupedRaces: IRace[];
  isLoading: boolean;
  isCreateRaceOpen: boolean;
  isCreateGroupOpen: boolean;
  isAddRacesModalOpen: boolean;
  groupInitialValues?: RaceGroupFormSchema;
  editingGroupId?: string | null;
  domainStats: Record<DomainType, number>;
  availableRaces: Array<{ id: string; name: string }>;
  racesAvailableForGroup: IRace[];
  selectedGroupForAddRaces: string | null;
  searchQuery: string;
  selectedDomains: DomainType[];
  groupInRemoveMode: string | null;
  onSetIsCreateRaceOpen: (open: boolean) => void;
  onSetIsCreateGroupOpen: (open: boolean) => void;
  onCreateRace: (data: RaceFormSchema) => void;
  onCreateGroup: (data: RaceGroupFormSchema) => void;
  onAddRacesToGroup: (groupId: string) => void;
  onConfirmAddRaces: (raceIds: string[]) => void;
  onCreateRaceInGroup: (groupId: string) => void;
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onToggleRemoveMode: (groupId: string) => void;
  onRemoveRaceFromGroup: (raceId: string) => void;
  onDropRaceInGroup: (
    raceId: string,
    sourceGroupId: string | null,
    targetGroupId: string | null
  ) => void;
  onRaceClick: (raceId: string) => void;
  onSearchChange: (query: string) => void;
  onDomainToggle: (domain: DomainType) => void;
  onClearFilters: () => void;
  onCloseAddRacesModal: () => void;
}

export function SpeciesView({
  bookId,
  races,
  allRaces,
  raceGroups,
  ungroupedRaces,
  isLoading,
  isCreateRaceOpen,
  isCreateGroupOpen,
  isAddRacesModalOpen,
  groupInitialValues,
  editingGroupId,
  domainStats,
  availableRaces,
  racesAvailableForGroup,
  selectedGroupForAddRaces,
  searchQuery,
  selectedDomains,
  groupInRemoveMode,
  onSetIsCreateRaceOpen,
  onSetIsCreateGroupOpen,
  onCreateRace,
  onCreateGroup,
  onAddRacesToGroup,
  onConfirmAddRaces,
  onCreateRaceInGroup,
  onEditGroup,
  onDeleteGroup,
  onToggleRemoveMode,
  onRemoveRaceFromGroup,
  onDropRaceInGroup,
  onRaceClick,
  onSearchChange,
  onDomainToggle,
  onClearFilters,
  onCloseAddRacesModal,
}: SpeciesViewProps) {
  const selectedGroup = raceGroups.find(
    (g) => g.id === selectedGroupForAddRaces
  );

  const [isUngroupedDragOver, setIsUngroupedDragOver] = useState(false);

  const handleUngroupedDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleUngroupedDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsUngroupedDragOver(true);
  };

  const handleUngroupedDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsUngroupedDragOver(false);
    }
  };

  const handleUngroupedDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsUngroupedDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { raceId, groupId: sourceGroupId } = data;

      // Only handle if dropping from a group (to ungroup)
      if (sourceGroupId && onDropRaceInGroup) {
        onDropRaceInGroup(raceId, sourceGroupId, null);
      }
    } catch (error) {
      console.error("Error parsing drag data:", error);
    }
  };

  // Configure filter rows
  const filterRows = createDomainFilterRows(domainStats);

  // Check if we have content to show
  const hasContent =
    raceGroups.length > 0 || ungroupedRaces.length > 0;

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
          secondaryActions: [
            {
              label: "Criar Grupo",
              onClick: () => onSetIsCreateGroupOpen(true),
              variant: "secondary",
              icon: Plus,
            },
          ],
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
        showNoResultsState={!hasContent}
      >
        {/* Custom content: Groups + Ungrouped races */}
        <div className="space-y-6 pb-6">
          {/* Race Groups */}
          {raceGroups.map((group) => (
            <RaceGroupAccordion
              key={group.id}
              group={group}
              onAddRacesToGroup={onAddRacesToGroup}
              onCreateRaceInGroup={onCreateRaceInGroup}
              onEditGroup={onEditGroup}
              onDeleteGroup={onDeleteGroup}
              onToggleRemoveMode={onToggleRemoveMode}
              onRaceClick={onRaceClick}
              onRemoveRaceFromGroup={onRemoveRaceFromGroup}
              isRemoveMode={groupInRemoveMode === group.id}
            />
          ))}

          {/* Ungrouped Races */}
          {ungroupedRaces.length > 0 && (
            <div
              className={`grid gap-4 rounded-lg transition-all ${
                isUngroupedDragOver
                  ? "bg-muted/50 border-2 border-dashed border-primary p-4"
                  : ""
              }`}
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(max(320px, calc((100% - 4rem) / 5)), 1fr))",
              }}
              onDragOver={handleUngroupedDragOver}
              onDragEnter={handleUngroupedDragEnter}
              onDragLeave={handleUngroupedDragLeave}
              onDrop={handleUngroupedDrop}
            >
              {ungroupedRaces.map((race) => (
                <RaceCard key={race.id} race={race} onClick={onRaceClick} />
              ))}
            </div>
          )}
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

      <CreateRaceGroupModal
        open={isCreateGroupOpen}
        onClose={() => onSetIsCreateGroupOpen(false)}
        onConfirm={onCreateGroup}
        initialValues={groupInitialValues}
        groupId={editingGroupId || undefined}
      />

      <AddRacesToGroupModal
        open={isAddRacesModalOpen}
        groupName={selectedGroup?.name || ""}
        availableRaces={racesAvailableForGroup}
        onClose={onCloseAddRacesModal}
        onConfirm={onConfirmAddRaces}
      />
    </>
  );
}
