import {
  IRegion,
  IRegionWithChildren,
  RegionScale,
  RegionSeason,
} from "@/pages/dashboard/tabs/world/types/region-types";

import { getDB } from "./index";
import { safeDBOperation } from "./safe-db-operation";

/**
 * Database representation of a region (snake_case)
 */
interface DBRegion {
  id: string;
  book_id: string;
  name: string;
  parent_id: string | null;
  scale: RegionScale;
  summary: string | null;
  image: string | null;
  order_index: number;
  created_at: number;
  updated_at: number;

  // Environment fields
  climate: string | null;
  current_season: RegionSeason | null;
  custom_season_name: string | null;
  general_description: string | null;
  region_anomalies: string | null;

  // Information fields
  resident_factions: string | null;
  dominant_factions: string | null;
  important_characters: string | null;
  races_found: string | null;
  items_found: string | null;

  // Narrative fields
  narrative_purpose: string | null;
  unique_characteristics: string | null;
  political_importance: string | null;
  religious_importance: string | null;
  world_perception: string | null;
  region_mysteries: string | null;
  inspirations: string | null;

  // Visibility configuration
  field_visibility: string | null;
  section_visibility: string | null;
}

/**
 * Convert IRegion to DBRegion
 */
function regionToDBRegion(region: IRegion): DBRegion {
  return {
    id: region.id,
    book_id: region.bookId,
    name: region.name,
    parent_id: region.parentId,
    scale: region.scale,
    summary: region.summary || null,
    image: region.image || null,
    order_index: region.orderIndex,
    created_at: region.createdAt,
    updated_at: region.updatedAt,

    // Environment fields
    climate: region.climate || null,
    current_season: region.currentSeason || null,
    custom_season_name: region.customSeasonName || null,
    general_description: region.generalDescription || null,
    region_anomalies: region.regionAnomalies || null,

    // Information fields
    resident_factions: region.residentFactions || null,
    dominant_factions: region.dominantFactions || null,
    important_characters: region.importantCharacters || null,
    races_found: region.racesFound || null,
    items_found: region.itemsFound || null,

    // Narrative fields
    narrative_purpose: region.narrativePurpose || null,
    unique_characteristics: region.uniqueCharacteristics || null,
    political_importance: region.politicalImportance || null,
    religious_importance: region.religiousImportance || null,
    world_perception: region.worldPerception || null,
    region_mysteries: region.regionMysteries || null,
    inspirations: region.inspirations || null,

    // Visibility configuration
    field_visibility: region.fieldVisibility || null,
    section_visibility: region.sectionVisibility || null,
  };
}

/**
 * Convert DBRegion to IRegion
 */
function dbRegionToRegion(dbRegion: DBRegion): IRegion {
  return {
    id: dbRegion.id,
    bookId: dbRegion.book_id,
    name: dbRegion.name,
    parentId: dbRegion.parent_id,
    scale: dbRegion.scale,
    summary: dbRegion.summary || undefined,
    image: dbRegion.image || undefined,
    orderIndex: dbRegion.order_index || 0,
    createdAt: dbRegion.created_at,
    updatedAt: dbRegion.updated_at,

    // Environment fields
    climate: dbRegion.climate || undefined,
    currentSeason: dbRegion.current_season || undefined,
    customSeasonName: dbRegion.custom_season_name || undefined,
    generalDescription: dbRegion.general_description || undefined,
    regionAnomalies: dbRegion.region_anomalies || undefined,

    // Information fields
    residentFactions: dbRegion.resident_factions || undefined,
    dominantFactions: dbRegion.dominant_factions || undefined,
    importantCharacters: dbRegion.important_characters || undefined,
    racesFound: dbRegion.races_found || undefined,
    itemsFound: dbRegion.items_found || undefined,

    // Narrative fields
    narrativePurpose: dbRegion.narrative_purpose || undefined,
    uniqueCharacteristics: dbRegion.unique_characteristics || undefined,
    politicalImportance: dbRegion.political_importance || undefined,
    religiousImportance: dbRegion.religious_importance || undefined,
    worldPerception: dbRegion.world_perception || undefined,
    regionMysteries: dbRegion.region_mysteries || undefined,
    inspirations: dbRegion.inspirations || undefined,

    // Visibility configuration
    fieldVisibility: dbRegion.field_visibility || undefined,
    sectionVisibility: dbRegion.section_visibility || undefined,
  };
}

/**
 * Get all regions for a book
 */
export async function getRegionsByBookId(bookId: string): Promise<IRegion[]> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const result = await db.select<DBRegion[]>(
    "SELECT * FROM regions WHERE book_id = $1 ORDER BY order_index DESC, created_at DESC",
    [bookId]
  );
  return result.map(dbRegionToRegion);
}, 'getRegionsByBookId');
}

/**
 * Get a single region by ID
 */
export async function getRegionById(id: string): Promise<IRegion | null> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const result = await db.select<DBRegion[]>(
    "SELECT * FROM regions WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbRegionToRegion(result[0]) : null;
}, 'getRegionById');
}

/**
 * Create a new region
 */
export async function createRegion(
  region: Omit<IRegion, "id" | "createdAt" | "updatedAt" | "orderIndex">
): Promise<IRegion> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const now = Date.now();
  const id = crypto.randomUUID();

  // Calculate the next order_index for regions with the same parent
  const siblings = await db.select<DBRegion[]>(
    `SELECT MAX(order_index) as max_order FROM regions WHERE book_id = $1 AND ${
      region.parentId ? "parent_id = $2" : "parent_id IS NULL"
    }`,
    region.parentId ? [region.bookId, region.parentId] : [region.bookId]
  );

  const maxOrder = (siblings[0] as any)?.max_order ?? -1;
  const orderIndex = maxOrder + 1;

  const newRegion: IRegion = {
    ...region,
    id,
    orderIndex,
    createdAt: now,
    updatedAt: now,
  };

  const dbRegion = regionToDBRegion(newRegion);

  await db.execute(
    `INSERT INTO regions (
      id, book_id, name, parent_id, scale, summary, image, order_index, created_at, updated_at,
      climate, current_season, custom_season_name, general_description, region_anomalies,
      resident_factions, dominant_factions, important_characters, races_found, items_found,
      narrative_purpose, unique_characteristics, political_importance, religious_importance, world_perception, region_mysteries, inspirations,
      field_visibility, section_visibility
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27,
      $28, $29
    )`,
    [
      dbRegion.id,
      dbRegion.book_id,
      dbRegion.name,
      dbRegion.parent_id,
      dbRegion.scale,
      dbRegion.summary,
      dbRegion.image,
      dbRegion.order_index,
      dbRegion.created_at,
      dbRegion.updated_at,
      dbRegion.climate,
      dbRegion.current_season,
      dbRegion.custom_season_name,
      dbRegion.general_description,
      dbRegion.region_anomalies,
      dbRegion.resident_factions,
      dbRegion.dominant_factions,
      dbRegion.important_characters,
      dbRegion.races_found,
      dbRegion.items_found,
      dbRegion.narrative_purpose,
      dbRegion.unique_characteristics,
      dbRegion.political_importance,
      dbRegion.religious_importance,
      dbRegion.world_perception,
      dbRegion.region_mysteries,
      dbRegion.inspirations,
      dbRegion.field_visibility,
      dbRegion.section_visibility,
    ]
  );

  return newRegion;
}, 'createRegion');
}

/**
 * Update a region
 */
export async function updateRegion(
  id: string,
  updates: Partial<Omit<IRegion, "id" | "bookId" | "createdAt">>
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const now = Date.now();

  // Get current region
  const current = await getRegionById(id);
  if (!current) {
    throw new Error("Region not found");
  }

  // Merge updates
  const updatedRegion: IRegion = {
    ...current,
    ...updates,
    updatedAt: now,
  };

  const dbRegion = regionToDBRegion(updatedRegion);

  await db.execute(
    `UPDATE regions SET
      name = $1,
      parent_id = $2,
      scale = $3,
      summary = $4,
      image = $5,
      order_index = $6,
      updated_at = $7,
      climate = $8,
      current_season = $9,
      custom_season_name = $10,
      general_description = $11,
      region_anomalies = $12,
      resident_factions = $13,
      dominant_factions = $14,
      important_characters = $15,
      races_found = $16,
      items_found = $17,
      narrative_purpose = $18,
      unique_characteristics = $19,
      political_importance = $20,
      religious_importance = $21,
      world_perception = $22,
      region_mysteries = $23,
      inspirations = $24,
      field_visibility = $25,
      section_visibility = $26
    WHERE id = $27`,
    [
      dbRegion.name,
      dbRegion.parent_id,
      dbRegion.scale,
      dbRegion.summary,
      dbRegion.image,
      dbRegion.order_index,
      dbRegion.updated_at,
      dbRegion.climate,
      dbRegion.current_season,
      dbRegion.custom_season_name,
      dbRegion.general_description,
      dbRegion.region_anomalies,
      dbRegion.resident_factions,
      dbRegion.dominant_factions,
      dbRegion.important_characters,
      dbRegion.races_found,
      dbRegion.items_found,
      dbRegion.narrative_purpose,
      dbRegion.unique_characteristics,
      dbRegion.political_importance,
      dbRegion.religious_importance,
      dbRegion.world_perception,
      dbRegion.region_mysteries,
      dbRegion.inspirations,
      dbRegion.field_visibility,
      dbRegion.section_visibility,
      id,
    ]
  );
}, 'updateRegion');
}

/**
 * Delete a region
 */
export async function deleteRegion(id: string): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  await db.execute("DELETE FROM regions WHERE id = $1", [id]);
}, 'deleteRegion');
}

/**
 * Update parent region (for drag and drop hierarchy reorganization)
 */
export async function updateParentRegion(
  regionId: string,
  newParentId: string | null
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const now = Date.now();

  // Prevent circular hierarchy
  if (newParentId) {
    const isCircular = await checkCircularHierarchy(regionId, newParentId);
    if (isCircular) {
      throw new Error("Cannot set parent: circular hierarchy detected");
    }
  }

  await db.execute(
    "UPDATE regions SET parent_id = $1, updated_at = $2 WHERE id = $3",
    [newParentId, now, regionId]
  );
}, 'updateParentRegion');
}

/**
 * Check if setting a parent would create a circular hierarchy
 */
async function checkCircularHierarchy(
  regionId: string,
  potentialParentId: string
): Promise<boolean> {
  // A region cannot be its own parent
  if (regionId === potentialParentId) {
    return true;
  }

  // Check if the potential parent is a descendant of the region
  const db = await getDB();
  let currentId: string | null = potentialParentId;

  while (currentId) {
    const result = await db.select<DBRegion[]>(
      "SELECT parent_id FROM regions WHERE id = $1",
      [currentId]
    );

    if (result.length === 0) break;

    const parentId = result[0].parent_id;
    if (parentId === regionId) {
      return true; // Circular hierarchy detected
    }

    currentId = parentId;
  }

  return false;
}

/**
 * Get regions organized in a hierarchy tree
 */
export async function getRegionHierarchy(
  bookId: string
): Promise<IRegionWithChildren[]> {
  return safeDBOperation(async () => {
  const regions = await getRegionsByBookId(bookId);

  // Build a map for quick lookup
  const regionMap = new Map<string, IRegionWithChildren>();
  regions.forEach((region) => {
    regionMap.set(region.id, { ...region, children: [] });
  });

  // Build the tree
  const rootRegions: IRegionWithChildren[] = [];

  regions.forEach((region) => {
    const regionWithChildren = regionMap.get(region.id)!;

    if (region.parentId === null) {
      // Top-level region
      rootRegions.push(regionWithChildren);
    } else {
      // Child region - add to parent
      const parent = regionMap.get(region.parentId);
      if (parent) {
        parent.children.push(regionWithChildren);
      } else {
        // Parent not found - treat as root
        rootRegions.push(regionWithChildren);
      }
    }
  });

  // Sort children by orderIndex
  const sortByOrderIndex = (regions: IRegionWithChildren[]) => {
    regions.sort((a, b) => b.orderIndex - a.orderIndex);
    regions.forEach((region) => {
      if (region.children.length > 0) {
        sortByOrderIndex(region.children);
      }
    });
  };

  sortByOrderIndex(rootRegions);

  return rootRegions;
}, 'getRegionHierarchy');
}

/**
 * Region Version Types
 */
export interface IRegionVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isMain: boolean;
  regionData: IRegion;
}

interface DBRegionVersion {
  id: string;
  region_id: string;
  name: string;
  description: string | null;
  created_at: string;
  is_main: number;
  region_data: string;
}

/**
 * Get all versions for a region
 */
export async function getRegionVersions(
  regionId: string
): Promise<IRegionVersion[]> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const result = await db.select<DBRegionVersion[]>(
    "SELECT * FROM region_versions WHERE region_id = $1 ORDER BY is_main DESC, created_at ASC",
    [regionId]
  );

  return result.map((dbVersion) => ({
    id: dbVersion.id,
    name: dbVersion.name,
    description: dbVersion.description || undefined,
    createdAt: dbVersion.created_at,
    isMain: dbVersion.is_main === 1,
    regionData: JSON.parse(dbVersion.region_data),
  }));
}, 'getRegionVersions');
}

/**
 * Create a new region version
 */
export async function createRegionVersion(
  regionId: string,
  version: IRegionVersion
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  await db.execute(
    `INSERT INTO region_versions (
      id, region_id, name, description, created_at, is_main, region_data
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )`,
    [
      version.id,
      regionId,
      version.name,
      version.description || null,
      version.createdAt,
      version.isMain ? 1 : 0,
      JSON.stringify(version.regionData),
    ]
  );
}, 'createRegionVersion');
}

/**
 * Delete a region version
 */
export async function deleteRegionVersion(versionId: string): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();

  // Delete the version
  await db.execute("DELETE FROM region_versions WHERE id = $1", [versionId]);
}, 'deleteRegionVersion');
}

/**
 * Update a region version name and description
 */
export async function updateRegionVersion(
  versionId: string,
  name: string,
  description?: string
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  await db.execute(
    "UPDATE region_versions SET name = $1, description = $2 WHERE id = $3",
    [name, description, versionId]
  );
}, 'updateRegionVersion');
}

/**
 * Update region data within a version (for cleaning orphaned IDs, etc.)
 */
export async function updateRegionVersionData(
  versionId: string,
  regionData: IRegionFormData
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  await db.execute(
    "UPDATE region_versions SET region_data = $1 WHERE id = $2",
    [JSON.stringify(regionData), versionId]
  );
}, 'updateRegionVersionData');
}

/**
 * Reorder regions within the same parent
 * Similar to power system's reorderPages function
 */
export async function reorderRegions(
  regionIds: string[],
  _parentId: string | null
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const now = Date.now();

  // Update each region with its new order index
  for (let i = 0; i < regionIds.length; i++) {
    await db.execute(
      "UPDATE regions SET order_index = $1, updated_at = $2 WHERE id = $3",
      [i, now, regionIds[i]]
    );
  }
}, 'reorderRegions');
}

/**
 * Move a region to a different parent and reorder
 * Similar to power system's movePage function
 */
export async function moveRegion(
  regionId: string,
  newParentId: string | null,
  newOrderIndex?: number
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();
  const now = Date.now();

  // Prevent circular hierarchy
  if (newParentId) {
    const isCircular = await checkCircularHierarchy(regionId, newParentId);
    if (isCircular) {
      throw new Error("Cannot move region: circular hierarchy detected");
    }
  }

  // If no order index provided, calculate the next one
  let orderIndex = newOrderIndex;
  if (orderIndex === undefined) {
    const region = await getRegionById(regionId);
    if (!region) {
      throw new Error("Region not found");
    }

    const siblings = await db.select<DBRegion[]>(
      `SELECT MAX(order_index) as max_order FROM regions WHERE book_id = $1 AND ${
        newParentId ? "parent_id = $2" : "parent_id IS NULL"
      }`,
      newParentId ? [region.bookId, newParentId] : [region.bookId]
    );

    const maxOrder = (siblings[0] as any)?.max_order ?? -1;
    orderIndex = maxOrder + 1;
  }

  await db.execute(
    "UPDATE regions SET parent_id = $1, order_index = $2, updated_at = $3 WHERE id = $4",
    [newParentId, orderIndex, now, regionId]
  );
}, 'moveRegion');
}

/**
 * Region Timeline Types
 */
export interface ITimelineEvent {
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

export interface ITimelineEra {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  events: ITimelineEvent[];
}

interface DBTimelineEvent {
  id: string;
  era_id: string;
  name: string;
  description: string;
  reason: string;
  outcome: string;
  start_date: string;
  end_date: string;
  characters_involved: string;
  factions_involved: string;
  races_involved: string;
  items_involved: string;
}

interface DBTimelineEra {
  id: string;
  region_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

/**
 * Get timeline for a region version
 */
export async function getRegionVersionTimeline(
  versionId: string
): Promise<ITimelineEra[]> {
  return safeDBOperation(async () => {
  const db = await getDB();

  // Get all eras for this version
  const erasResult = await db.select<DBTimelineEra[]>(
    "SELECT * FROM region_timeline_eras WHERE region_id = $1 ORDER BY start_date ASC",
    [versionId]
  );

  // Get all events for all eras
  const timeline: ITimelineEra[] = [];

  for (const dbEra of erasResult) {
    const eventsResult = await db.select<DBTimelineEvent[]>(
      "SELECT * FROM region_timeline_events WHERE era_id = $1 ORDER BY start_date ASC",
      [dbEra.id]
    );

    const events: ITimelineEvent[] = eventsResult.map((dbEvent) => ({
      id: dbEvent.id,
      name: dbEvent.name,
      description: dbEvent.description,
      reason: dbEvent.reason,
      outcome: dbEvent.outcome,
      startDate: dbEvent.start_date,
      endDate: dbEvent.end_date,
      charactersInvolved: JSON.parse(dbEvent.characters_involved || "[]"),
      factionsInvolved: JSON.parse(dbEvent.factions_involved || "[]"),
      racesInvolved: JSON.parse(dbEvent.races_involved || "[]"),
      itemsInvolved: JSON.parse(dbEvent.items_involved || "[]"),
    }));

    timeline.push({
      id: dbEra.id,
      name: dbEra.name,
      description: dbEra.description,
      startDate: dbEra.start_date,
      endDate: dbEra.end_date,
      events,
    });
  }

  return timeline;
}, 'getRegionVersionTimeline');
}

/**
 * Save complete timeline for a region version (replaces existing timeline)
 */
export async function saveRegionVersionTimeline(
  versionId: string,
  timeline: ITimelineEra[]
): Promise<void> {
  return safeDBOperation(async () => {
  const db = await getDB();

  // Delete existing timeline for this version
  await db.execute("DELETE FROM region_timeline_eras WHERE region_id = $1", [
    versionId,
  ]);
  // Events will be cascade deleted

  // Insert new eras and events
  for (const era of timeline) {
    await db.execute(
      `INSERT INTO region_timeline_eras (
        id, region_id, name, description, start_date, end_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )`,
      [era.id, versionId, era.name, era.description, era.startDate, era.endDate]
    );

    // Insert events for this era
    for (const event of era.events) {
      await db.execute(
        `INSERT INTO region_timeline_events (
          id, era_id, name, description, reason, outcome,
          start_date, end_date, characters_involved, factions_involved,
          races_involved, items_involved
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )`,
        [
          event.id,
          era.id,
          event.name,
          event.description,
          event.reason,
          event.outcome,
          event.startDate,
          event.endDate,
          JSON.stringify(event.charactersInvolved),
          JSON.stringify(event.factionsInvolved),
          JSON.stringify(event.racesInvolved),
          JSON.stringify(event.itemsInvolved),
        ]
      );
    }
  }
}, 'saveRegionVersionTimeline');
}
