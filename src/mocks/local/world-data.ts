interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  worldId?: string;
  continentId?: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

interface StickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
}

export const mockWorldEntities: WorldEntity[] = [
  {
    id: "world1",
    name: "Aethermoor",
    type: "World",
    description:
      "Mundo principal onde se desenrola a história. Um reino de magia e mistério onde antigas magias ainda ecoam pelas terras.",
    age: "5000 anos",
    dominantOrganization: "Ordem dos Guardiões",
    image: "/api/placeholder/400/250",
  },
  {
    id: "continent1",
    name: "Continente Central",
    type: "Continent",
    description:
      "Continente principal de Aethermoor, rico em recursos mágicos e lar de diversas civilizações antigas.",
    worldId: "world1",
    age: "3000 anos",
    dominantOrganization: "Reino de Aethermoor",
    image: "/api/placeholder/400/250",
  },
  {
    id: "loc1",
    name: "Floresta das Lamentações",
    type: "Location",
    description:
      "Floresta sombria habitada por criaturas mágicas perigosas. As árvores sussurram segredos dos tempos antigos.",
    worldId: "world1",
    continentId: "continent1",
    classification: "Floresta Mágica",
    climate: "Frio e Úmido",
    location: "Norte do Continente Central",
    terrain: "Florestal",
    organizations: ["Culto das Sombras", "Guarda Florestal"],
    image: "/api/placeholder/400/250",
  },
];

export const mockWorlds = [
  { id: "world1", name: "Aethermoor" },
  { id: "world2", name: "Terra Sombria" },
  { id: "world3", name: "Reino Celestial" },
];

export const mockContinents = [
  { id: "continent1", name: "Continente Central", worldId: "world1" },
  { id: "continent2", name: "Terras do Norte", worldId: "world1" },
  { id: "continent3", name: "Ilhas do Sul", worldId: "world1" },
];

export const mockStickyNotes: StickyNote[] = [
  {
    id: "1",
    content: "Investigar a origem dos sussurros nas árvores",
    x: 20,
    y: 20,
    color: "bg-yellow-200",
  },
  {
    id: "2",
    content: "Conexão com o Culto das Sombras precisa ser explorada",
    x: 250,
    y: 80,
    color: "bg-blue-200",
  },
];

export const mockLinkedNotes = [
  {
    id: "note-1",
    name: "História Antiga de Aethermoor",
    content:
      "Detalhes sobre a fundação do mundo e os eventos que moldaram sua história ao longo dos milênios...",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-10"),
    linkCreatedAt: new Date("2024-01-07"),
  },
  {
    id: "note-2",
    name: "Geografia e Clima",
    content:
      "Análise detalhada dos biomas, sistemas climáticos e características geográficas do mundo...",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
    linkCreatedAt: new Date("2024-01-09"),
  },
];

// Export types for use in the component
export type { WorldEntity, StickyNote };
