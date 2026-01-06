export type DomainType =
  | "aquatic"
  | "terrestrial"
  | "aerial"
  | "underground"
  | "elevated"
  | "dimensional"
  | "spiritual"
  | "cosmic";

export type RaceType =
  | "Aquática"
  | "Terrestre"
  | "Voadora"
  | "Espacial"
  | "Espiritual";

export interface IRaceUIState {
  advancedSectionOpen?: boolean;
  sectionVisibility?: {
    relationships?: boolean;
    "chapter-metrics"?: boolean;
  };
  extraSectionsOpenState?: Record<string, boolean>;
}

export interface IRace {
  id: string;

  // Basic required fields
  name: string;
  domain: DomainType[];
  summary: string;

  // Optional basic fields
  image?: string;
  scientificName?: string;

  // Culture and Myths (all optional)
  alternativeNames?: string[];
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
  otherCommunication?: string; // Used when "Outro" is selected in communication
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

  // UI State (legacy - to be removed)
  fieldVisibility?: Record<string, boolean>; // DEPRECATED
  sectionVisibility?: Record<string, boolean>; // DEPRECATED - to be migrated to uiState

  // UI State (for persisting UI preferences)
  uiState?: IRaceUIState;

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
  aquatic: number;
  terrestrial: number;
  aerial: number;
  underground: number;
  elevated: number;
  dimensional: number;
  spiritual: number;
  cosmic: number;
}

// Legacy type alias for backwards compatibility
export type IRaceTypeStats = IDomainStats;
