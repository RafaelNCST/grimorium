import { IRegion, IRegionWithChildren, RegionScale } from "@/pages/dashboard/tabs/world/types/region-types";
import { getDB } from "./index";

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
  };
}

/**
 * Get all regions for a book
 */
export async function getRegionsByBookId(bookId: string): Promise<IRegion[]> {
  const db = await getDB();
  const result = await db.select<DBRegion[]>(
    "SELECT * FROM regions WHERE book_id = $1 ORDER BY order_index ASC, created_at DESC",
    [bookId]
  );
  return result.map(dbRegionToRegion);
}

/**
 * Get a single region by ID
 */
export async function getRegionById(id: string): Promise<IRegion | null> {
  const db = await getDB();
  const result = await db.select<DBRegion[]>(
    "SELECT * FROM regions WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbRegionToRegion(result[0]) : null;
}

/**
 * Create a new region
 */
export async function createRegion(
  region: Omit<IRegion, 'id' | 'createdAt' | 'updatedAt' | 'orderIndex'>
): Promise<IRegion> {
  const db = await getDB();
  const now = Date.now();
  const id = crypto.randomUUID();

  // Calculate the next order_index for regions with the same parent
  const siblings = await db.select<DBRegion[]>(
    "SELECT MAX(order_index) as max_order FROM regions WHERE book_id = $1 AND " +
    (region.parentId ? "parent_id = $2" : "parent_id IS NULL"),
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
      id, book_id, name, parent_id, scale, summary, image, order_index, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
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
    ]
  );

  return newRegion;
}

/**
 * Update a region
 */
export async function updateRegion(
  id: string,
  updates: Partial<Omit<IRegion, 'id' | 'bookId' | 'createdAt'>>
): Promise<void> {
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
      updated_at = $7
    WHERE id = $8`,
    [
      dbRegion.name,
      dbRegion.parent_id,
      dbRegion.scale,
      dbRegion.summary,
      dbRegion.image,
      dbRegion.order_index,
      dbRegion.updated_at,
      id,
    ]
  );
}

/**
 * Delete a region
 */
export async function deleteRegion(id: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM regions WHERE id = $1", [id]);
}

/**
 * Update parent region (for drag and drop hierarchy reorganization)
 */
export async function updateParentRegion(
  regionId: string,
  newParentId: string | null
): Promise<void> {
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
    regions.sort((a, b) => a.orderIndex - b.orderIndex);
    regions.forEach((region) => {
      if (region.children.length > 0) {
        sortByOrderIndex(region.children);
      }
    });
  };

  sortByOrderIndex(rootRegions);

  return rootRegions;
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
  const db = await getDB();
  const result = await db.select<DBRegionVersion[]>(
    "SELECT * FROM region_versions WHERE region_id = $1 ORDER BY created_at DESC",
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
}

/**
 * Create a new region version
 */
export async function createRegionVersion(
  regionId: string,
  version: IRegionVersion
): Promise<void> {
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
}

/**
 * Delete a region version
 */
export async function deleteRegionVersion(versionId: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM region_versions WHERE id = $1", [versionId]);
}

/**
 * Update a region version name and description
 */
export async function updateRegionVersion(
  versionId: string,
  name: string,
  description?: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "UPDATE region_versions SET name = $1, description = $2 WHERE id = $3",
    [name, description, versionId]
  );
}

/**
 * Reorder regions within the same parent
 * Similar to power system's reorderPages function
 */
export async function reorderRegions(
  regionIds: string[],
  parentId: string | null
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Update each region with its new order index
  for (let i = 0; i < regionIds.length; i++) {
    await db.execute(
      "UPDATE regions SET order_index = $1, updated_at = $2 WHERE id = $3",
      [i, now, regionIds[i]]
    );
  }
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
      "SELECT MAX(order_index) as max_order FROM regions WHERE book_id = $1 AND " +
      (newParentId ? "parent_id = $2" : "parent_id IS NULL"),
      newParentId ? [region.bookId, newParentId] : [region.bookId]
    );

    const maxOrder = (siblings[0] as any)?.max_order ?? -1;
    orderIndex = maxOrder + 1;
  }

  await db.execute(
    "UPDATE regions SET parent_id = $1, order_index = $2, updated_at = $3 WHERE id = $4",
    [newParentId, orderIndex, now, regionId]
  );
}
