export type RaceType =
  | "Aquática"
  | "Terrestre"
  | "Voadora"
  | "Espacial"
  | "Espiritual";

export interface IRace {
  id: string;
  name: string;
  description: string;
  history: string;
  type: RaceType;
  physicalCharacteristics?: string;
  culture?: string;
  speciesId: string;
}

export interface ISpecies {
  id: string;
  knownName: string;
  scientificName?: string;
  description: string;
  races: IRace[];
}

export interface IRaceWithSpeciesName extends IRace {
  speciesName: string;
}

export interface IRaceTypeStats {
  Aquática: number;
  Terrestre: number;
  Voadora: number;
  Espacial: number;
  Espiritual: number;
}
