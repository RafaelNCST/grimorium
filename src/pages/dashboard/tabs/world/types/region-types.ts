/**
 * Region Types for the World Tab
 * Defines the types for the hierarchical region management system
 */

import type { ISectionVisibility } from "@/components/detail-page/visibility-helpers";

/**
 * Region Scale - represents the scope/size of a region
 */
export type RegionScale =
  | "local"
  | "continental"
  | "planetary"
  | "galactic"
  | "universal"
  | "multiversal";

/**
 * Season type for region environment
 */
export type RegionSeason = "spring" | "summer" | "autumn" | "winter" | "custom";

/**
 * Region Interface - represents a geographic/spatial region in the story world
 */
export interface IRegion {
  /** Unique identifier */
  id: string;
  /** Book this region belongs to */
  bookId: string;
  /** Region name */
  name: string;
  /** Parent region ID (null if top-level/neutral) */
  parentId: string | null;
  /** Scale of the region */
  scale: RegionScale;
  /** Summary/description of the region */
  summary?: string;
  /** Image path for the region */
  image?: string;
  /** Order index for sorting within same parent */
  orderIndex: number;
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;

  // Environment fields
  /** Climate description */
  climate?: string;
  /** Current season */
  currentSeason?: RegionSeason;
  /** Custom season name (when currentSeason is 'custom') */
  customSeasonName?: string;
  /** General description of flora, fauna, and environment */
  generalDescription?: string;
  /** List of region anomalies (JSON string array) */
  regionAnomalies?: string;

  // Information fields
  /** Resident faction IDs (JSON string array) */
  residentFactions?: string;
  /** Dominant faction IDs (JSON string array) */
  dominantFactions?: string;
  /** Important character IDs (JSON string array) */
  importantCharacters?: string;
  /** Race IDs found in this region (JSON string array) */
  racesFound?: string;
  /** Item IDs found in this region (JSON string array) */
  itemsFound?: string;

  // Narrative fields
  /** Narrative purpose of this region */
  narrativePurpose?: string;
  /** Unique characteristics (sounds, smells, sensations) */
  uniqueCharacteristics?: string;
  /** Political importance */
  politicalImportance?: string;
  /** Religious importance */
  religiousImportance?: string;
  /** How the world perceives this region */
  worldPerception?: string;
  /** List of region mysteries (JSON string array) */
  regionMysteries?: string;
  /** List of inspirations (JSON string array) */
  inspirations?: string;

  // Visibility configuration
  /** Section visibility configuration for special sections (timeline, map, etc.) */
  sectionVisibility?: string;

  // Timeline data
  /** Timeline data (JSON string) */
  timeline?: string;
}

/**
 * Region with children - used for tree/hierarchy display
 */
export interface IRegionWithChildren extends IRegion {
  /** Child regions */
  children: IRegionWithChildren[];
}

/**
 * Region form data - used for creating/editing regions
 */
export interface IRegionFormData {
  name: string;
  parentId: string | null;
  scale: RegionScale;
  summary?: string;
  image?: string;

  // Environment fields
  climate?: string;
  currentSeason?: RegionSeason;
  customSeasonName?: string;
  generalDescription?: string;
  regionAnomalies?: string[];

  // Information fields
  residentFactions?: string[];
  dominantFactions?: string[];
  importantCharacters?: string[];
  racesFound?: string[];
  itemsFound?: string[];

  // Narrative fields
  narrativePurpose?: string;
  uniqueCharacteristics?: string;
  politicalImportance?: string;
  religiousImportance?: string;
  worldPerception?: string;
  regionMysteries?: string[];
  inspirations?: string[];

  // Visibility configuration
  sectionVisibility?: ISectionVisibility;
}
