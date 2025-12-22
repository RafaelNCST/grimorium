export type FactionStatus =
  | "active"
  | "weakened"
  | "dissolved"
  | "reformed"
  | "apex";

export type FactionType =
  | "commercial"
  | "military"
  | "magical"
  | "religious"
  | "cult"
  | "tribal"
  | "racial"
  | "governmental"
  | "revolutionary"
  | "academic"
  | "royalty"
  | "mercenary"
  | "kingdom"
  | "empire"
  | "country"
  | "divine";

export type FactionInfluence =
  | "nonexistent"
  | "low"
  | "medium"
  | "high"
  | "superior"
  | "dominant";

export type FactionAlignment = "good" | "chaotic" | "neutral";

export type FactionReputation =
  | "unknown"
  | "hated"
  | "feared"
  | "tolerated"
  | "respected"
  | "adored";

export interface ITimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
}

// Timeline (Linha do tempo) types
export interface IFactionTimelineEvent {
  id: string;
  name: string;
  description: string;
  reason: string;
  outcome: string;
  startDate: string;
  endDate: string;
  charactersInvolved: string[];
  factionsInvolved: string[];
  racesInvolved: string[];
  itemsInvolved: string[];
}

export interface IFactionTimelineEra {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  events: IFactionTimelineEvent[];
}

export interface IHierarchyTitle {
  id: string;
  name: string;
  order?: number; // undefined para título "Membros"
  color?: string; // Cor de background do título
  isMembersTitle?: boolean;
  characterIds: string[];
}

export interface IFactionUIState {
  advancedSectionOpen?: boolean;
  sectionVisibility?: Record<string, boolean>;
}

export interface IFaction {
  id: string;
  bookId: string;
  image?: string;
  name: string;
  summary: string;
  status: FactionStatus;
  factionType: FactionType;

  // Advanced fields - Alignment
  alignment?: string;

  // Advanced fields - Relationships
  influence?: FactionInfluence;
  publicReputation?: FactionReputation;

  // Advanced fields - Territory
  dominatedAreas?: string[];
  mainBase?: string[];
  areasOfInterest?: string[];

  // Advanced fields - Internal Structure
  governmentForm?: string;
  rulesAndLaws?: string[];
  mainResources?: string[];
  economy?: string;
  symbolsAndSecrets?: string;
  currencies?: string[];

  // Advanced fields - Power (1-10 scale)
  militaryPower?: number;
  politicalPower?: number;
  culturalPower?: number;
  economicPower?: number;

  // Advanced fields - Culture
  factionMotto?: string;
  traditionsAndRituals?: string[];
  beliefsAndValues?: string[];
  languagesUsed?: string[];
  uniformAndAesthetics?: string;
  races?: string[];

  // Advanced fields - History
  foundationDate?: string;
  foundationHistorySummary?: string;
  founders?: string[];
  chronology?: ITimelineEvent[];

  // Advanced fields - Narrative
  organizationObjectives?: string;
  narrativeImportance?: string;
  inspirations?: string;

  // Special sections - Timeline
  timeline?: IFactionTimelineEra[];

  // Special sections - Hierarchy
  hierarchy?: IHierarchyTitle[];

  // UI State (for persisting UI preferences)
  uiState?: IFactionUIState;

  createdAt: string;
}

export interface IFactionFormData {
  image?: string;
  name: string;
  summary: string;
  status: FactionStatus;
  factionType: FactionType;

  // Advanced fields - Alignment
  alignment?: string;

  // Advanced fields - Relationships
  influence?: FactionInfluence;
  publicReputation?: FactionReputation;

  // Advanced fields - Territory
  dominatedAreas?: string[];
  mainBase?: string[];
  areasOfInterest?: string[];

  // Advanced fields - Internal Structure
  governmentForm?: string;
  rulesAndLaws?: string[];
  mainResources?: string[];
  economy?: string;
  symbolsAndSecrets?: string;
  currencies?: string[];

  // Advanced fields - Power (1-10 scale)
  militaryPower?: number;
  politicalPower?: number;
  culturalPower?: number;
  economicPower?: number;

  // Advanced fields - Culture
  factionMotto?: string;
  traditionsAndRituals?: string[];
  beliefsAndValues?: string[];
  languagesUsed?: string[];
  uniformAndAesthetics?: string;
  races?: string[];

  // Advanced fields - History
  foundationDate?: string;
  foundationHistorySummary?: string;
  founders?: string[];
  chronology?: ITimelineEvent[];

  // Advanced fields - Narrative
  organizationObjectives?: string;
  narrativeImportance?: string;
  inspirations?: string;

  // Special sections - Timeline
  timeline?: IFactionTimelineEra[];

  // Special sections - Hierarchy
  hierarchy?: IHierarchyTitle[];
}
