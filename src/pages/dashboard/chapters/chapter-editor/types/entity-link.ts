export interface EntityMention {
  id: string;
  name: string;
  image?: string;
  // Character fields
  age?: string;
  gender?: string;
  role?: string;
  status?: string;
  description?: string;
  // Item fields
  category?: string;
  basicDescription?: string;
  // Faction fields
  summary?: string;
  factionType?: string;
  // Race fields
  scientificName?: string;
  domain?: string[];
  // Region fields
  scale?: string;
  parentId?: string;
  parentName?: string;
}

export type EntityType = 'character' | 'region' | 'item' | 'faction' | 'race';

export interface EntityLink {
  text: string; // O texto original que o usuário digitou
  entity: EntityMention;
  entityType: EntityType;
  startOffset: number;
  endOffset: number;
}

export interface MentionedEntities {
  characters: EntityMention[];
  regions: EntityMention[];
  items: EntityMention[];
  factions: EntityMention[];
  races: EntityMention[];
}
