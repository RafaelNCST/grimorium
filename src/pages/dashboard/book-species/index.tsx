import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useToast } from "@/hooks/use-toast";

import { BookSpeciesView } from "./view";

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
  worldId: string;
  worldName: string;
  races: IRace[];
}

interface BookSpeciesTabProps {
  bookId: string;
}

export function BookSpeciesTab({ bookId }: BookSpeciesTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
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
      worldId: "world1",
      worldName: "Aethermoor",
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
      worldId: "world1",
      worldName: "Aethermoor",
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

  const filteredSpecies = species.filter(
    (s) =>
      s.knownName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.worldName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSpecies = (data: {
    knownName: string;
    scientificName?: string;
    description: string;
  }) => {
    const newSpecies: ISpecies = {
      id: Date.now().toString(),
      ...data,
      worldId: "world1", // Default world for now
      worldName: "Aethermoor",
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

  const handleSpeciesClick = (speciesId: string, worldId: string) => {
    navigate({
      to: "/book/$bookId/world/$worldId/species/$speciesId",
      params: { bookId, worldId, speciesId },
    });
  };

  const handleRaceClick = (raceId: string, worldId: string) => {
    navigate({
      to: "/book/$bookId/world/$worldId/race/$raceId",
      params: { bookId, worldId, raceId },
    });
  };

  const openCreateRaceModal = (speciesId: string) => {
    setSelectedSpeciesId(speciesId);
    setIsCreateRaceOpen(true);
  };

  // Statistics
  const totalSpecies = species.length;

  return (
    <BookSpeciesView
      bookId={bookId}
      species={species}
      filteredSpecies={filteredSpecies}
      searchTerm={searchTerm}
      isCreateSpeciesOpen={isCreateSpeciesOpen}
      isCreateRaceOpen={isCreateRaceOpen}
      totalSpecies={totalSpecies}
      onSearchTermChange={setSearchTerm}
      onCreateSpeciesOpenChange={setIsCreateSpeciesOpen}
      onCreateRaceOpenChange={setIsCreateRaceOpen}
      onCreateSpecies={handleCreateSpecies}
      onCreateRace={handleCreateRace}
      onSpeciesClick={handleSpeciesClick}
      onRaceClick={handleRaceClick}
      onOpenCreateRaceModal={openCreateRaceModal}
    />
  );
}