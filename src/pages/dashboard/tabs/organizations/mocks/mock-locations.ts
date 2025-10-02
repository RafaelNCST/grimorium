import { ILocation, IWorld, IContinent } from "@/types/organization-types";

export const MOCK_LOCATIONS: ILocation[] = [
  { id: "l1", name: "Cidadela da Luz", type: "Fortaleza" },
  { id: "l2", name: "Torre Sombria", type: "Torre" },
  { id: "l3", name: "Aldeia de Pedraverde", type: "Aldeia" },
  { id: "l4", name: "Floresta das Lamentações", type: "Floresta" },
  { id: "l5", name: "Postos Avançados", type: "Posto" },
];

export const MOCK_WORLDS: IWorld[] = [
  { id: "w1", name: "Aethermoor", type: "Mundo" },
];

export const MOCK_CONTINENTS: IContinent[] = [
  { id: "c1", name: "Continente Central", type: "Continente" },
  { id: "c2", name: "Terras Sombrias", type: "Continente" },
];
