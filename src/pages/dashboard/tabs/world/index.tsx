import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { WorldView } from "./view";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  bookId: string;
  // Specific to Location
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  livingEntities?: string[];
  // Specific to World/Continent
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

interface PropsWorldTab {
  bookId: string;
}

// Mock data structure - in real app this would be from state management
const getWorldEntitiesForBook = (bookId: string): WorldEntity[] => [
  {
    id: "world1",
    bookId,
    name: "Aethermoor",
    type: "World",
    description:
      "Mundo principal onde se desenrola a história. Um reino de magia e mistério.",
    age: "5000 anos",
    dominantOrganization: "Ordem dos Guardiões",
    image: "/api/placeholder/300/200",
  },
  {
    id: "continent1",
    bookId,
    name: "Continente Central",
    type: "Continent",
    description:
      "Continente principal de Aethermoor, rico em recursos mágicos.",
    parentId: "world1",
    age: "3000 anos",
    dominantOrganization: "Reino de Aethermoor",
    image: "/api/placeholder/300/200",
  },
  {
    id: "continent2",
    bookId,
    name: "Terras Sombrias",
    type: "Continent",
    description:
      "Continente corrompido pelas trevas, lar do Culto das Sombras.",
    parentId: "world1",
    age: "2000 anos",
    dominantOrganization: "Culto das Sombras",
    image: "/api/placeholder/300/200",
  },
  {
    id: "continent3",
    bookId,
    name: "Ilhas Flutuantes",
    type: "Continent",
    description:
      "Continente mágico que flutua nas nuvens, sem ligação com mundos terrestres.",
    age: "1500 anos",
    image: "/api/placeholder/300/200",
  },
  {
    id: "loc1",
    bookId,
    name: "Floresta das Lamentações",
    type: "Location",
    description: "Floresta sombria habitada por criaturas mágicas perigosas.",
    parentId: "continent1",
    classification: "Floresta Mágica",
    climate: "Frio e Úmido",
    location: "Norte do Continente Central",
    terrain: "Florestal",
    organizations: ["Culto das Sombras", "Guarda Florestal"],
    livingEntities: [
      "Lobos Sombrios",
      "Espíritos da Floresta",
      "Dríades Corrompidas",
      "Unicórnios das Trevas",
      "Ents Ancestrais",
    ],
    image: "/api/placeholder/300/200",
  },
  {
    id: "loc2",
    bookId,
    name: "Aldeia de Pedraverde",
    type: "Location",
    description: "Pequena aldeia de mineradores anões nas montanhas.",
    parentId: "continent1",
    classification: "Assentamento",
    climate: "Montanhoso",
    location: "Sul do Continente Central",
    terrain: "Rochoso",
    organizations: ["Guilda dos Artífices"],
    livingEntities: ["Anões", "Águias Gigantes", "Cabras Montanhesas"],
    image: "/api/placeholder/300/200",
  },
  {
    id: "loc3",
    bookId,
    name: "Torre de Cristal",
    type: "Location",
    description:
      "Antiga torre dos magos, agora em ruínas. Contém segredos sobre magia antiga.",
    classification: "Ruína Mágica",
    climate: "Temperado",
    terrain: "Planície",
    organizations: [],
    livingEntities: ["Constructos de Cristal", "Wisp de Energia"],
    image: "/api/placeholder/300/200",
  },
  {
    id: "loc4",
    bookId,
    name: "Cidade Flutuante de Nimbus",
    type: "Location",
    description:
      "Capital das Ilhas Flutuantes, cidade mágica suspensa nas nuvens.",
    parentId: "continent3",
    classification: "Cidade",
    climate: "Aéreo e Fresco",
    location: "Centro das Ilhas Flutuantes",
    terrain: "Aéreo",
    organizations: ["Conselho dos Ventos", "Guarda Celestial"],
    livingEntities: [
      "Humanos Alados",
      "Pégasos",
      "Elementais do Ar",
      "Fênix Menores",
    ],
    image: "/api/placeholder/300/200",
  },
];

export function WorldTab({ bookId }: PropsWorldTab) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showCreateWorldModal, setShowCreateWorldModal] = useState(false);
  const [showCreateContinentModal, setShowCreateContinentModal] =
    useState(false);
  const [showCreateLocationModal, setShowCreateLocationModal] = useState(false);

  const [mockWorldEntities, setMockWorldEntities] = useState(() =>
    getWorldEntitiesForBook(bookId)
  );

  const handleCreateWorld = () => {
    setShowCreateWorldModal(true);
  };

  const handleCreateContinent = () => {
    setShowCreateContinentModal(true);
  };

  const handleCreateLocation = () => {
    setShowCreateLocationModal(true);
  };

  const handleWorldCreated = (newWorld: any) => {
    setMockWorldEntities((prev) => [...prev, newWorld]);
  };

  const handleContinentCreated = (newContinent: any) => {
    setMockWorldEntities((prev) => [...prev, newContinent]);
  };

  const handleLocationCreated = (newLocation: any) => {
    setMockWorldEntities((prev) => [...prev, newLocation]);
  };

  const worlds = mockWorldEntities.filter((e) => e.type === "World");
  const continents = mockWorldEntities.filter((e) => e.type === "Continent");
  const locations = mockWorldEntities.filter((e) => e.type === "Location");

  const getEntityIcon = (type: string, classification?: string) =>
    // This will be implemented in view component
    ({ type, classification });
  const getTypeColor = (type: string) => {
    switch (type) {
      case "World":
        return "bg-primary text-primary-foreground";
      case "Continent":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getParentName = (parentId?: string) => {
    if (!parentId) return "";
    const parent = mockWorldEntities.find((e) => e.id === parentId);
    return parent?.name || "";
  };

  const getFilteredEntities = (typeFilter?: string) => {
    let entities = mockWorldEntities;

    if (typeFilter && typeFilter !== "all") {
      entities = entities.filter((e) => e.type === typeFilter);
    }

    return entities.filter((entity) => {
      const matchesSearch =
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredWorlds = getFilteredEntities("World");
  const filteredContinents = getFilteredEntities("Continent");
  const filteredLocations = getFilteredEntities("Location");

  // Statistics
  const totalWorlds = worlds.length;
  const totalContinents = continents.length;
  const totalLocations = locations.length;

  const handleEntityClick = (entity: WorldEntity) => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/world/$worldId",
      params: { dashboardId: bookId, worldId: entity.id },
    });
  };

  return (
    <WorldView
      bookId={bookId}
      searchTerm={searchTerm}
      mockWorldEntities={mockWorldEntities}
      showCreateWorldModal={showCreateWorldModal}
      showCreateContinentModal={showCreateContinentModal}
      showCreateLocationModal={showCreateLocationModal}
      worlds={worlds}
      continents={continents}
      locations={locations}
      filteredWorlds={filteredWorlds}
      filteredContinents={filteredContinents}
      filteredLocations={filteredLocations}
      totalWorlds={totalWorlds}
      totalContinents={totalContinents}
      totalLocations={totalLocations}
      onSetSearchTerm={setSearchTerm}
      onSetShowCreateWorldModal={setShowCreateWorldModal}
      onSetShowCreateContinentModal={setShowCreateContinentModal}
      onSetShowCreateLocationModal={setShowCreateLocationModal}
      onCreateWorld={handleCreateWorld}
      onCreateContinent={handleCreateContinent}
      onCreateLocation={handleCreateLocation}
      onWorldCreated={handleWorldCreated}
      onContinentCreated={handleContinentCreated}
      onLocationCreated={handleLocationCreated}
      onEntityClick={handleEntityClick}
      getTypeColor={getTypeColor}
      getParentName={getParentName}
    />
  );
}
