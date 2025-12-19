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
  grandparents: string[]; // Avós
  parents: string[]; // Pais (substitui father/mother)
  spouses: string[]; // Cônjuges (substitui spouse)
  unclesAunts: string[]; // Tios
  cousins: string[]; // Primos
  children: string[]; // Filhos
  siblings: string[]; // Irmãos
  halfSiblings: string[]; // Meio-irmãos
}

export interface ICharacter {
  id: string;
  name: string;
  role: string;
  age?: string;
  gender?: string;
  description: string;
  image?: string;
  status?: string;

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

  // History
  birthPlace?: string[];
  affiliatedPlace?: string;
  organization?: string;
  nicknames?: string[];
  past?: string;

  // Relationships
  relationships?: ICharacterRelationship[];

  // Family
  family?: ICharacterFamily;

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
  status: string;

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

  // History (Advanced)
  birthPlace: string[];
  affiliatedPlace: string;
  organization: string;
  nicknames: string[];
  past: string;
}
