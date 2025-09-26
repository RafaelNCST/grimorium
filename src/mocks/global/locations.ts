export interface Location {
  id: string;
  name: string;
  type: string;
}

export const mockLocations: Location[] = [
  { id: "1", name: "Vila Pedraverde", type: "vila" },
  { id: "2", name: "Capital Elaria", type: "cidade" },
  { id: "3", name: "Porto Dourado", type: "cidade" },
  { id: "4", name: "Floresta Sombria", type: "floresta" },
  { id: "5", name: "Montanhas do Norte", type: "montanha" },
  { id: "6", name: "Vale Encantado", type: "vale" },
];
