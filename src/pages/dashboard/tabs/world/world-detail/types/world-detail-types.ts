export type WorldEntityType = "World" | "Continent" | "Location";

export interface IWorldDetailEntity {
  id: string;
  name: string;
  type: WorldEntityType;
  description: string;
  parentId?: string;
  worldId?: string;
  continentId?: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

export interface IStickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
}

export interface IOrganization {
  id: string;
  name: string;
}

export interface IWorld {
  id: string;
  name: string;
}

export interface IContinent {
  id: string;
  name: string;
  worldId: string;
}

export interface ILinkedNote {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  linkCreatedAt: Date;
}
