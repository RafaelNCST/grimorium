/**
 * Region Types for the World Tab
 * Defines the types for the hierarchical region management system
 */

/**
 * Region Scale - represents the scope/size of a region
 */
export type RegionScale =
  | 'local'
  | 'continental'
  | 'planetary'
  | 'galactic'
  | 'universal'
  | 'multiversal';

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
}
