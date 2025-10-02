import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useToast } from "@/hooks/use-toast";

import { MOCK_SPECIES } from "./mocks/mock-species";
import { ISpecies, IRace, IRaceTypeStats, RaceType } from "./types/species-types";
import { SpeciesView } from "./view";

interface PropsSpeciesTab {
  bookId: string;
}

export function SpeciesTab({ bookId }: PropsSpeciesTab) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [species, setSpecies] = useState<ISpecies[]>(MOCK_SPECIES);
  const [isCreateSpeciesOpen, setIsCreateSpeciesOpen] = useState(false);
  const [isCreateRaceOpen, setIsCreateRaceOpen] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");

  const raceTypeStats = useMemo<IRaceTypeStats>(
    () => ({
      Aquática: species.reduce(
        (sum, s) => sum + s.races.filter((r) => r.type === "Aquática").length,
        0
      ),
      Terrestre: species.reduce(
        (sum, s) => sum + s.races.filter((r) => r.type === "Terrestre").length,
        0
      ),
      Voadora: species.reduce(
        (sum, s) => sum + s.races.filter((r) => r.type === "Voadora").length,
        0
      ),
      Espacial: species.reduce(
        (sum, s) => sum + s.races.filter((r) => r.type === "Espacial").length,
        0
      ),
      Espiritual: species.reduce(
        (sum, s) => sum + s.races.filter((r) => r.type === "Espiritual").length,
        0
      ),
    }),
    [species]
  );

  const handleCreateSpecies = useCallback(
    (data: {
      knownName: string;
      scientificName?: string;
      description: string;
    }) => {
      const newSpecies: ISpecies = {
        id: Date.now().toString(),
        ...data,
        races: [],
      };
      setSpecies([...species, newSpecies]);
      toast({
        title: "Espécie criada",
        description: `${data.knownName} foi criada com sucesso.`,
      });
    },
    [species, toast]
  );

  const handleCreateRace = useCallback(
    (data: {
      name: string;
      description: string;
      history: string;
      type: RaceType;
      physicalCharacteristics?: string;
      culture?: string;
    }) => {
      const newRace: IRace = {
        id: Date.now().toString(),
        ...data,
        speciesId: selectedSpeciesId,
      };

      setSpecies(
        species.map((s) =>
          s.id === selectedSpeciesId
            ? { ...s, races: [...s.races, newRace] }
            : s
        )
      );

      toast({
        title: "Raça criada",
        description: `${data.name} foi criada com sucesso.`,
      });
    },
    [species, selectedSpeciesId, toast]
  );

  const handleSpeciesClick = useCallback(
    (speciesId: string) => {
      const worldId = "world1";
      const speciesUrl = `/book/${bookId}/world/${worldId}/species/${speciesId}`;
      window.location.href = speciesUrl;
    },
    [bookId]
  );

  const handleRaceClick = useCallback(
    (raceId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/race/$raceId",
        params: { dashboardId: bookId, raceId },
      });
    },
    [navigate, bookId]
  );

  const handleOpenCreateRaceModal = useCallback((speciesId: string) => {
    setSelectedSpeciesId(speciesId);
    setIsCreateRaceOpen(true);
  }, []);

  const handleSetIsCreateSpeciesOpen = useCallback((open: boolean) => {
    setIsCreateSpeciesOpen(open);
  }, []);

  const handleSetIsCreateRaceOpen = useCallback((open: boolean) => {
    setIsCreateRaceOpen(open);
  }, []);

  return (
    <SpeciesView
      species={species}
      isCreateSpeciesOpen={isCreateSpeciesOpen}
      isCreateRaceOpen={isCreateRaceOpen}
      raceTypeStats={raceTypeStats}
      onSetIsCreateSpeciesOpen={handleSetIsCreateSpeciesOpen}
      onSetIsCreateRaceOpen={handleSetIsCreateRaceOpen}
      onCreateSpecies={handleCreateSpecies}
      onCreateRace={handleCreateRace}
      onSpeciesClick={handleSpeciesClick}
      onRaceClick={handleRaceClick}
      onOpenCreateRaceModal={handleOpenCreateRaceModal}
    />
  );
}
