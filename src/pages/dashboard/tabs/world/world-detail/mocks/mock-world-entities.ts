import { IWorldDetailEntity } from "../types/world-detail-types";

export const MOCK_WORLD_DETAIL_ENTITIES: IWorldDetailEntity[] = [
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
