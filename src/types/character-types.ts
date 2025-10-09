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
  speciesAndRace?: string;

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
  birthPlace?: string;
  affiliatedPlace?: string;
  organization?: string;

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
  speciesAndRace: string;

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
  birthPlace: string;
  affiliatedPlace: string;
  organization: string;
}
