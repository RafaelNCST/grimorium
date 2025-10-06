export interface Relationship {
  id: string;
  characterId: string;
  characterName: string;
  type: string;
  intensity: number;
}

export interface CharacterDetail {
  id: string;
  name: string;
  age: number;
  role: string;
  image: string;
  description: string;
  appearance: string;
  personality: string;
  backstory: string;
  motivations: string;
  fears: string;
  organization: string;
  birthPlace: string;
  currentLocation: string;
  alignment: string;
  qualities: string[];
  relationships: Relationship[];
}

export const mockCharacterDetail: CharacterDetail = {
  id: "",
  name: "",
  age: 0,
  role: "",
  image: "",
  description: "",
  appearance: "",
  personality: "",
  backstory: "",
  motivations: "",
  fears: "",
  organization: "",
  birthPlace: "",
  currentLocation: "",
  alignment: "",
  qualities: [],
  relationships: [],
};
