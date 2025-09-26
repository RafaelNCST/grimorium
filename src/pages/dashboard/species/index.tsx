import React, { useState } from "react";

import { useNavigate, useParams } from "@tanstack/react-router";

import { SpeciesView } from "./view";
import { useToast } from "@/hooks/use-toast";

interface IRace {
  id: string;
  name: string;
  description: string;
  history: string;
  type: "Aquática" | "Terrestre" | "Voadora" | "Espacial" | "Espiritual";
  physicalCharacteristics?: string;
  culture?: string;
  speciesId: string;
}

interface ISpecies {
  id: string;
  knownName: string;
  scientificName?: string;
  description: string;
  races: IRace[];
}

const typeColors = {
  Aquática: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Terrestre:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Voadora: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  Espacial:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Espiritual:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export function SpeciesTab() {
  const navigate = useNavigate();
  const { bookId, worldId } = useParams({
    from: "/book/$bookId/world/$worldId",
  });
  const { toast } = useToast();
  const [isCreateSpeciesOpen, setIsCreateSpeciesOpen] = useState(false);
  const [isCreateRaceOpen, setIsCreateRaceOpen] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");

  // Mock data - replace with actual data management
  const [species, setSpecies] = useState<ISpecies[]>([
    {
      id: "1",
      knownName: "Elfos",
      scientificName: "Homo elvensis",
      description:
        "Seres mágicos de longa vida com orelhas pontiagudas e grande afinidade com a natureza.",
      races: [
        {
          id: "1",
          name: "Elfos da Floresta",
          description: "Elfos que vivem em harmonia com as florestas antigas.",
          history:
            "Os Elfos da Floresta são os guardiões ancestrais das florestas sagradas...",
          type: "Terrestre",
          physicalCharacteristics:
            "Pele clara com tons esverdeados, cabelos longos...",
          culture:
            "Vivem em comunidades arbóreas, respeitando os ciclos naturais...",
          speciesId: "1",
        },
        {
          id: "2",
          name: "Elfos do Mar",
          description:
            "Elfos adaptados à vida aquática com habilidades marinhas.",
          history:
            "Descendentes dos primeiros elfos que migraram para os oceanos...",
          type: "Aquática",
          physicalCharacteristics: "Pele azulada, guelras funcionais...",
          culture:
            "Sociedade baseada na harmonia com as correntes oceânicas...",
          speciesId: "1",
        },
      ],
    },
    {
      id: "2",
      knownName: "Dragões",
      scientificName: "Draco magnus",
      description: "Criaturas ancestrais de grande poder mágico e sabedoria.",
      races: [
        {
          id: "3",
          name: "Dragão de Fogo",
          description: "Dragões que dominam o elemento fogo.",
          history: "Nascidos das chamas primordiais do mundo...",
          type: "Voadora",
          physicalCharacteristics: "Escamas vermelhas, hálito de fogo...",
          culture: "Territorialistas, vivem em cavernas vulcânicas...",
          speciesId: "2",
        },
      ],
    },
  ]);

  const handleCreateSpecies = (data: {
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
  };

  const handleCreateRace = (data: {
    name: string;
    description: string;
    history: string;
    type: IRace["type"];
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
        s.id === selectedSpeciesId ? { ...s, races: [...s.races, newRace] } : s
      )
    );

    toast({
      title: "Raça criada",
      description: `${data.name} foi criada com sucesso.`,
    });
  };

  const handleSpeciesClick = (speciesId: string) => {
    navigate({
      to: "/book/$bookId/world/$worldId/species/$speciesId",
      params: { bookId, worldId, speciesId },
    });
  };

  const handleRaceClick = (raceId: string) => {
    navigate({
      to: "/book/$bookId/world/$worldId/race/$raceId",
      params: { bookId, worldId, raceId },
    });
  };

  const openCreateRaceModal = (speciesId: string) => {
    setSelectedSpeciesId(speciesId);
    setIsCreateRaceOpen(true);
  };

  const calculateRaceTypeStats = () => {
    return {
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
    };
  };

  return (
    <SpeciesView
      species={species}
      isCreateSpeciesOpen={isCreateSpeciesOpen}
      isCreateRaceOpen={isCreateRaceOpen}
      typeColors={typeColors}
      raceTypeStats={calculateRaceTypeStats()}
      onSetIsCreateSpeciesOpen={setIsCreateSpeciesOpen}
      onSetIsCreateRaceOpen={setIsCreateRaceOpen}
      onCreateSpecies={handleCreateSpecies}
      onCreateRace={handleCreateRace}
      onSpeciesClick={handleSpeciesClick}
      onRaceClick={handleRaceClick}
      onOpenCreateRaceModal={openCreateRaceModal}
    />
  );
}