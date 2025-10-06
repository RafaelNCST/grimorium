export interface ICharacter {
  id: string;
  name: string;
  age?: number;
  appearance?: string;
  role: string;
  personality?: string;
  description: string;
  organization: string;
  birthPlace?: string;
  affiliatedPlace?: string;
  alignment?: string;
  image?: string;
  qualities: string[];
}
