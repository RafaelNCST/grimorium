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
  | "mercenary";

export type FactionInfluence =
  | "nonexistent"
  | "low"
  | "medium"
  | "high"
  | "superior"
  | "dominant";

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
  externalInfluence?: string;

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
  externalInfluence?: string;

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
}
