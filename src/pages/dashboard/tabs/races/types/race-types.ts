export type DomainType =
  | "Aquático"
  | "Terrestre"
  | "Aéreo"
  | "Subterrâneo"
  | "Elevado"
  | "Dimensional"
  | "Espiritual"
  | "Cósmico";

export interface IRaceGroup {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  races: IRace[];
}

export interface IRace {
  id: string;
  groupId?: string;

  // Basic required fields
  name: string;
  domain: DomainType[];
  summary: string;

  // Optional basic fields
  image?: string;
  scientificName?: string;

  // Culture and Myths (all optional)
  alternativeNames?: string[];
  raceViews?: Array<{
    id: string;
    raceId: string;
    raceName: string;
    description: string;
  }>;
  culturalNotes?: string;

  // Appearance and Characteristics (all optional)
  generalAppearance?: string;
  lifeExpectancy?: string;
  averageHeight?: string;
  averageWeight?: string;
  specialPhysicalCharacteristics?: string;

  // Behaviors (all optional)
  habits?: string;
  reproductiveCycle?: string;
  otherReproductiveCycleDescription?: string;
  diet?: string;
  elementalDiet?: string;
  communication?: string[];
  moralTendency?: string;
  socialOrganization?: string;
  habitat?: string[];

  // Power (all optional)
  physicalCapacity?: string;
  specialCharacteristics?: string;
  weaknesses?: string;

  // Narrative (all optional)
  storyMotivation?: string;
  inspirations?: string;

  // Metadata
  fieldVisibility?: { [key: string]: boolean };

  // Legacy field for backwards compatibility
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

export interface IDomainStats {
  Aquático: number;
  Terrestre: number;
  Aéreo: number;
  Subterrâneo: number;
  Elevado: number;
  Dimensional: number;
  Espiritual: number;
  Cósmico: number;
}

// Legacy type alias for backwards compatibility
export type IRaceTypeStats = IDomainStats;
