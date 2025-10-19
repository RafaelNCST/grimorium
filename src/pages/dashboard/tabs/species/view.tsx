import { Plus } from "lucide-react";

import { CreateRaceModal } from "@/components/modals/create-race-modal";
import { CreateSpeciesModal } from "@/components/modals/create-species-modal";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { EmptyState } from "./components/empty-state";
import { SpeciesCard } from "./components/species-card";
import { StatsBadges } from "./components/stats-badges";
import { ISpecies, IRaceTypeStats, RaceType } from "./types/species-types";

interface PropsSpeciesView {
  species: ISpecies[];
  isCreateSpeciesOpen: boolean;
  isCreateRaceOpen: boolean;
  raceTypeStats: IRaceTypeStats;
  onSetIsCreateSpeciesOpen: (open: boolean) => void;
  onSetIsCreateRaceOpen: (open: boolean) => void;
  onCreateSpecies: (data: {
    knownName: string;
    scientificName?: string;
    description: string;
  }) => void;
  onCreateRace: (data: {
    name: string;
    description: string;
    history: string;
    type: RaceType;
    physicalCharacteristics?: string;
    culture?: string;
  }) => void;
  onSpeciesClick: (speciesId: string) => void;
  onRaceClick: (raceId: string) => void;
  onOpenCreateRaceModal: (speciesId: string) => void;
}

export function SpeciesView({
  species,
  isCreateSpeciesOpen,
  isCreateRaceOpen,
  raceTypeStats,
  onSetIsCreateSpeciesOpen,
  onSetIsCreateRaceOpen,
  onCreateSpecies,
  onCreateRace,
  onSpeciesClick,
  onRaceClick,
  onOpenCreateRaceModal,
}: PropsSpeciesView) {
  return (
    <div
      className={
        species.length === 0
          ? "flex-1 h-full flex flex-col space-y-6"
          : "space-y-6"
      }
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Espécies</h2>
          <p className="text-muted-foreground">
            Gerencie as espécies, bestas e raças que habitam o seu mundo
          </p>
          {species.length > 0 && (
            <div className="mt-1">
              <StatsBadges
                totalSpecies={species.length}
                raceTypeStats={raceTypeStats}
              />
            </div>
          )}
        </div>
        <Button
          variant="magical"
          size="lg"
          onClick={() => onSetIsCreateSpeciesOpen(true)}
          className="animate-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Espécie
        </Button>
      </div>

      {species.length === 0 ? (
        <EmptyState />
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {species.map((speciesItem) => (
            <SpeciesCard
              key={speciesItem.id}
              species={speciesItem}
              onSpeciesClick={onSpeciesClick}
              onRaceClick={onRaceClick}
              onOpenCreateRaceModal={onOpenCreateRaceModal}
            />
          ))}
        </Accordion>
      )}

      <CreateSpeciesModal
        isOpen={isCreateSpeciesOpen}
        onClose={() => onSetIsCreateSpeciesOpen(false)}
        onSubmit={onCreateSpecies}
      />

      <CreateRaceModal
        isOpen={isCreateRaceOpen}
        onClose={() => onSetIsCreateRaceOpen(false)}
        onSubmit={onCreateRace}
      />
    </div>
  );
}
