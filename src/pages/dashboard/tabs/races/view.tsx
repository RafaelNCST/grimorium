import { useState } from "react";
import { Filter, Plus, Search, SearchX, Users } from "lucide-react";

import { CreateRaceModal } from "@/components/modals/create-race-modal";
import { CreateRaceGroupModal } from "@/components/modals/create-race-group-modal";
import { DOMAIN_CONSTANT } from "@/components/modals/create-race-modal/constants/domains";
import type { RaceFormSchema } from "@/components/modals/create-race-modal/hooks/use-race-validation";
import type { RaceGroupFormSchema } from "@/components/modals/create-race-group-modal/use-race-group-validation";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RaceCard } from "./components/race-card";
import { RaceGroupAccordion } from "./components/race-group-accordion";
import { AddRacesToGroupModal } from "./components/add-races-to-group-modal";
import { IRace, IRaceGroup, IRaceTypeStats } from "./types/species-types";

interface PropsSpeciesView {
  races: IRace[];
  raceGroups: IRaceGroup[];
  ungroupedRaces: IRace[];
  isCreateRaceOpen: boolean;
  isCreateGroupOpen: boolean;
  isAddRacesModalOpen: boolean;
  groupInitialValues?: RaceGroupFormSchema;
  editingGroupId?: string | null;
  raceTypeStats: IRaceTypeStats;
  availableRaces: Array<{ id: string; name: string }>;
  racesAvailableForGroup: IRace[];
  selectedGroupForAddRaces: string | null;
  searchTerm: string;
  selectedDomains: string[];
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
  onDropRaceInGroup: (raceId: string, sourceGroupId: string | null, targetGroupId: string | null) => void;
  onRaceClick: (raceId: string) => void;
  onSearchTermChange: (term: string) => void;
  onDomainFilterChange: (domain: string) => void;
  onClearFilters: () => void;
  onCloseAddRacesModal: () => void;
}

export function SpeciesView({
  races,
  raceGroups,
  ungroupedRaces,
  isCreateRaceOpen,
  isCreateGroupOpen,
  isAddRacesModalOpen,
  groupInitialValues,
  editingGroupId,
  raceTypeStats,
  availableRaces,
  racesAvailableForGroup,
  selectedGroupForAddRaces,
  searchTerm,
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
  onSearchTermChange,
  onDomainFilterChange,
  onClearFilters,
  onCloseAddRacesModal,
}: PropsSpeciesView) {
  const totalRaces = races.length;
  const hasGroups = raceGroups.length > 0;
  const hasUngroupedRaces = ungroupedRaces.length > 0;
  const hasContent = hasGroups || hasUngroupedRaces;

  const selectedGroup = raceGroups.find((g) => g.id === selectedGroupForAddRaces);

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

  return (
    <div className="flex-1 h-full flex flex-col space-y-6">
      {/* Header with stats and action buttons */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Raças</h2>
          <p className="text-muted-foreground">
            Gerencie as raças, bestas e espécies que habitam o seu mundo
          </p>
          {totalRaces > 0 && (
            <div className="flex items-center gap-4 mt-2">
              <Badge
                className={`cursor-pointer border transition-colors ${
                  selectedDomains.length === 0
                    ? "!bg-primary !text-white !border-primary"
                    : "bg-background text-foreground border-border hover:!bg-primary hover:!text-white hover:!border-primary"
                }`}
                onClick={onClearFilters}
              >
                {totalRaces} Total
              </Badge>
              {DOMAIN_CONSTANT.map((domain) => {
                const count = raceTypeStats[domain.value as keyof IRaceTypeStats];
                const isSelected = selectedDomains.includes(domain.value);
                const DomainIcon = domain.icon;

                const colorMap: Record<string, { active: string; base: string; hover: string }> = {
                  'Aquático': {
                    active: '!bg-blue-500 !text-white !border-blue-500',
                    base: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
                    hover: 'hover:!bg-blue-500 hover:!text-white hover:!border-blue-500'
                  },
                  'Terrestre': {
                    active: '!bg-green-600 !text-white !border-green-600',
                    base: 'bg-green-600/10 border-green-600/30 text-green-700 dark:text-green-400',
                    hover: 'hover:!bg-green-600 hover:!text-white hover:!border-green-600'
                  },
                  'Aéreo': {
                    active: '!bg-cyan-500 !text-white !border-cyan-500',
                    base: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
                    hover: 'hover:!bg-cyan-500 hover:!text-white hover:!border-cyan-500'
                  },
                  'Subterrâneo': {
                    active: '!bg-orange-600 !text-white !border-orange-600',
                    base: 'bg-orange-600/10 border-orange-600/30 text-orange-700 dark:text-orange-400',
                    hover: 'hover:!bg-orange-600 hover:!text-white hover:!border-orange-600'
                  },
                  'Elevado': {
                    active: '!bg-sky-500 !text-white !border-sky-500',
                    base: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
                    hover: 'hover:!bg-sky-500 hover:!text-white hover:!border-sky-500'
                  },
                  'Dimensional': {
                    active: '!bg-purple-500 !text-white !border-purple-500',
                    base: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
                    hover: 'hover:!bg-purple-500 hover:!text-white hover:!border-purple-500'
                  },
                  'Espiritual': {
                    active: '!bg-violet-500 !text-white !border-violet-500',
                    base: 'bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400',
                    hover: 'hover:!bg-violet-500 hover:!text-white hover:!border-violet-500'
                  },
                  'Cósmico': {
                    active: '!bg-indigo-500 !text-white !border-indigo-500',
                    base: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
                    hover: 'hover:!bg-indigo-500 hover:!text-white hover:!border-indigo-500'
                  }
                };

                const colors = colorMap[domain.value] || colorMap['Aquático'];

                return (
                  <Badge
                    key={domain.value}
                    className={`cursor-pointer border transition-colors ${
                      isSelected
                        ? colors.active
                        : `${colors.base} ${colors.hover}`
                    }`}
                    onClick={() => onDomainFilterChange(domain.value)}
                  >
                    <DomainIcon className="w-3.5 h-3.5 mr-1.5" />
                    {count} {domain.label}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="magical"
            size="lg"
            onClick={() => onSetIsCreateGroupOpen(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Grupo
          </Button>
          <Button
            variant="magical"
            size="lg"
            onClick={() => onSetIsCreateRaceOpen(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Raça
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {totalRaces > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar raça por nome..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Content */}
      {totalRaces === 0 && raceGroups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhuma raça criada"
          description="Crie sua primeira raça clicando no botão 'Nova Raça'"
        />
      ) : !hasContent ? (
        <div className="flex-1 flex">
          <EmptyState
            icon={selectedDomains.length > 0 ? Filter : SearchX}
            title={
              selectedDomains.length > 0
                ? "Nenhuma raça encontrada com esses filtros"
                : "Nenhuma raça encontrada"
            }
            description={
              selectedDomains.length > 0
                ? "Tente remover alguns filtros para ver mais resultados"
                : "Tente buscar por outro nome"
            }
          />
        </div>
      ) : (
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
          {hasUngroupedRaces && (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg transition-all ${
                isUngroupedDragOver
                  ? "bg-muted/50 border-2 border-dashed border-primary p-4"
                  : ""
              }`}
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
      )}

      {/* Modals */}
      <CreateRaceModal
        open={isCreateRaceOpen}
        onClose={() => onSetIsCreateRaceOpen(false)}
        onConfirm={onCreateRace}
        availableRaces={availableRaces}
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
    </div>
  );
}
