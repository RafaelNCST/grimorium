export type WorldEntityType = "World" | "Continent" | "Location";

export interface IWorldEntity {
  id: string;
  name: string;
  type: WorldEntityType;
  description: string;
  parentId?: string;
  bookId: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  livingEntities?: string[];
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

export interface IWorldEntityStats {
  totalWorlds: number;
  totalContinents: number;
  totalLocations: number;
}

export interface IWorld {
  id: string;
  name: string;
}

export interface IContinent {
  id: string;
  name: string;
}
