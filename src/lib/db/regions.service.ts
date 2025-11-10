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
    "SELECT * FROM regions WHERE book_id = $1 ORDER BY created_at DESC",
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
  region: Omit<IRegion, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IRegion> {
  const db = await getDB();
  const now = Date.now();
  const id = crypto.randomUUID();

  const newRegion: IRegion = {
    ...region,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const dbRegion = regionToDBRegion(newRegion);

  await db.execute(
    `INSERT INTO regions (
      id, book_id, name, parent_id, scale, summary, image, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )`,
    [
      dbRegion.id,
      dbRegion.book_id,
      dbRegion.name,
      dbRegion.parent_id,
      dbRegion.scale,
      dbRegion.summary,
      dbRegion.image,
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
      updated_at = $6
    WHERE id = $7`,
    [
      dbRegion.name,
      dbRegion.parent_id,
      dbRegion.scale,
      dbRegion.summary,
      dbRegion.image,
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

  return rootRegions;
}
