export interface ICharacterRelationship {
  id: string;
  characterId: string;
  type:
    | "friend"
    | "rival"
    | "mentor"
    | "apprentice"
    | "enemy"
    | "love_interest"
    | "ally"
    | "acquaintance"
    | "leader"
    | "subordinate"
    | "family_love"
    | "romantic_relationship"
    | "best_friend"
    | "hatred"
    | "neutral"
    | "devotion";
  intensity: number; // 1-10
  description?: string; // Optional description (max 200 characters)
}

export interface ICharacterFamily {
  grandparents: string[];  // Avós
  parents: string[];       // Pais (substitui father/mother)
  spouses: string[];       // Cônjuges (substitui spouse)
  unclesAunts: string[];   // Tios
  cousins: string[];       // Primos
  children: string[];      // Filhos
  siblings: string[];      // Irmãos
  halfSiblings: string[];  // Meio-irmãos
}

export interface IFieldVisibility {
  [fieldName: string]: boolean; // true = visível, false = oculto
}

export interface ICharacter {
  id: string;
  name: string;
  role: string;
  age?: string;
  gender?: string;
  description: string;
  image?: string;

  // Appearance
  height?: string;
  skinTone?: string;
  skinToneColor?: string;
  weight?: string;
  physicalType?: string;
  hair?: string;
  eyes?: string;
  face?: string;
  distinguishingFeatures?: string;
  speciesAndRace?: string[];

  // Behavior and Tastes
  archetype?: string;
  personality?: string;
  hobbies?: string;
  dreamsAndGoals?: string;
  fearsAndTraumas?: string;
  favoriteFood?: string;
  favoriteMusic?: string;

  // Alignment
  alignment?: string;

  // Locations and Organizations
  birthPlace?: string[];
  affiliatedPlace?: string;
  organization?: string;

  // Relationships
  relationships?: ICharacterRelationship[];

  // Family
  family?: ICharacterFamily;

  // Field Visibility
  fieldVisibility?: IFieldVisibility;

  // Legacy fields (for backward compatibility)
  appearance?: string;
  qualities?: string[];

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface ICharacterFormData {
  // Required fields
  name: string;
  role: string;
  age: string;
  gender: string;
  description: string;
  image: string;

  // Appearance (Advanced)
  height: string;
  skinTone: string;
  skinToneColor: string;
  weight: string;
  physicalType: string;
  hair: string;
  eyes: string;
  face: string;
  distinguishingFeatures: string;
  speciesAndRace: string[];

  // Behavior and Tastes (Advanced)
  archetype: string;
  personality: string;
  hobbies: string;
  dreamsAndGoals: string;
  fearsAndTraumas: string;
  favoriteFood: string;
  favoriteMusic: string;

  // Alignment (Advanced)
  alignment: string;

  // Locations and Organizations (Advanced)
  birthPlace: string[];
  affiliatedPlace: string;
  organization: string;
}

export interface ICharacterVersion {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isMain: boolean;
  characterData: ICharacter;
}
