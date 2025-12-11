import {
  mkdir,
  copyFile,
  exists,
  remove,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

import { getDB } from "./index";

/**
 * Region Map Types
 */
export interface IRegionMap {
  id: string;
  regionId: string;
  versionId: string | null;
  imagePath: string;
  createdAt: number;
  updatedAt: number;
}

export interface IRegionMapMarker {
  id: string;
  mapId: string;
  parentRegionId: string;
  childRegionId: string;
  positionX: number;
  positionY: number;
  color: string;
  showLabel: boolean;
  scale: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Database representation of region map (snake_case)
 */
interface DBRegionMap {
  id: string;
  region_id: string;
  version_id: string | null;
  image_path: string;
  created_at: number;
  updated_at: number;
}

/**
 * Database representation of region map marker (snake_case)
 */
interface DBRegionMapMarker {
  id: string;
  map_id: string;
  parent_region_id: string;
  child_region_id: string;
  position_x: number;
  position_y: number;
  color: string;
  show_label: number;
  scale: number;
  created_at: number;
  updated_at: number;
}

/**
 * Convert DBRegionMap to IRegionMap
 */
function dbRegionMapToRegionMap(dbMap: DBRegionMap): IRegionMap {
  return {
    id: dbMap.id,
    regionId: dbMap.region_id,
    versionId: dbMap.version_id,
    imagePath: dbMap.image_path,
    createdAt: dbMap.created_at,
    updatedAt: dbMap.updated_at,
  };
}

/**
 * Convert DBRegionMapMarker to IRegionMapMarker
 */
function dbMarkerToMarker(dbMarker: DBRegionMapMarker): IRegionMapMarker {
  return {
    id: dbMarker.id,
    mapId: dbMarker.map_id,
    parentRegionId: dbMarker.parent_region_id,
    childRegionId: dbMarker.child_region_id,
    positionX: dbMarker.position_x,
    positionY: dbMarker.position_y,
    color: dbMarker.color || "#8b5cf6",
    showLabel: dbMarker.show_label === 1,
    scale: dbMarker.scale || 1.0,
    createdAt: dbMarker.created_at,
    updatedAt: dbMarker.updated_at,
  };
}

/**
 * Ensure maps directory exists
 */
async function ensureMapsDirectory(): Promise<void> {
  const dirExists = await exists("maps", { baseDir: BaseDirectory.AppData });
  if (!dirExists) {
    await mkdir("maps", { baseDir: BaseDirectory.AppData, recursive: true });
  }
}

/**
 * Sanitize filename by removing special characters and spaces
 */
function sanitizeFileName(fileName: string): string {
  // Extract extension
  const lastDot = fileName.lastIndexOf(".");
  const name = lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
  const ext = lastDot > 0 ? fileName.substring(lastDot) : "";

  // Replace spaces and special characters with underscore
  const sanitizedName = name.replace(/[^a-zA-Z0-9-_]/g, "_");

  return `${sanitizedName}${ext}`;
}

/**
 * Upload map image for a region
 * Copies the file to app_data_dir/maps/ and saves the path to database
 */
export async function uploadMapImage(
  regionId: string,
  sourceFilePath: string,
  versionId: string | null = null
): Promise<IRegionMap> {
  const db = await getDB();
  const now = Date.now();

  // Ensure maps directory exists
  await ensureMapsDirectory();

  // Extract extension from source file
  const originalFileName =
    sourceFilePath.split(/[\\/]/).pop() || `map_${regionId}_${now}`;
  const lastDot = originalFileName.lastIndexOf(".");
  const ext = lastDot > 0 ? originalFileName.substring(lastDot) : ".jpg";

  // Create unique filename with UUID to avoid conflicts between versions
  const uniqueId = crypto.randomUUID();
  const fileName = `map_${regionId}_${versionId || "main"}_${uniqueId}${ext}`;
  const relativePath = `maps/${fileName}`;

  // Copy file to maps directory
  await copyFile(sourceFilePath, relativePath, {
    toPathBaseDir: BaseDirectory.AppData,
  });

  // Check if map already exists for this region and version
  const existingMap = await getMapByRegionId(regionId, versionId);

  if (existingMap) {
    // Delete all markers for this map before updating
    await db.execute("DELETE FROM region_map_markers WHERE map_id = $1", [
      existingMap.id,
    ]);

    // Update existing map
    await db.execute(
      `UPDATE region_maps SET image_path = $1, updated_at = $2 WHERE region_id = $3 AND ${versionId ? "version_id = $4" : "version_id IS NULL"}`,
      versionId
        ? [relativePath, now, regionId, versionId]
        : [relativePath, now, regionId]
    );

    // Delete old image file if it's different
    if (existingMap.imagePath !== relativePath) {
      try {
        const oldFileExists = await exists(existingMap.imagePath, {
          baseDir: BaseDirectory.AppData,
        });
        if (oldFileExists) {
          await remove(existingMap.imagePath, {
            baseDir: BaseDirectory.AppData,
          });
        }
      } catch (error) {
        console.error("[region-maps] Failed to delete old image:", error);
      }
    }

    return {
      ...existingMap,
      imagePath: relativePath,
      updatedAt: now,
    };
  } else {
    // Create new map
    const id = crypto.randomUUID();
    const newMap: IRegionMap = {
      id,
      regionId,
      versionId,
      imagePath: relativePath,
      createdAt: now,
      updatedAt: now,
    };

    await db.execute(
      `INSERT INTO region_maps (id, region_id, version_id, image_path, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, regionId, versionId, relativePath, now, now]
    );

    return newMap;
  }
}

/**
 * Get map by region ID and optional version ID
 */
export async function getMapByRegionId(
  regionId: string,
  versionId: string | null = null
): Promise<IRegionMap | null> {
  const db = await getDB();
  const query = versionId
    ? "SELECT * FROM region_maps WHERE region_id = $1 AND version_id = $2"
    : "SELECT * FROM region_maps WHERE region_id = $1 AND version_id IS NULL";
  const params = versionId ? [regionId, versionId] : [regionId];

  const result = await db.select<DBRegionMap[]>(query, params);

  return result.length > 0 ? dbRegionMapToRegionMap(result[0]) : null;
}

/**
 * Delete map for a region
 */
export async function deleteMap(regionId: string): Promise<void> {
  const db = await getDB();

  // Get the map to find the image path
  const map = await getMapByRegionId(regionId);

  if (map) {
    // Delete the image file
    try {
      const fileExists = await exists(map.imagePath, {
        baseDir: BaseDirectory.AppData,
      });
      if (fileExists) {
        await remove(map.imagePath, { baseDir: BaseDirectory.AppData });
      }
    } catch (error) {
      console.error("[region-maps] Failed to delete image file:", error);
    }

    // Delete from database
    await db.execute("DELETE FROM region_maps WHERE region_id = $1", [
      regionId,
    ]);
  }
}

/**
 * Add a marker to the map
 */
export async function addMarker(
  mapId: string,
  parentRegionId: string,
  childRegionId: string,
  x: number,
  y: number,
  color: string = "#8b5cf6",
  showLabel: boolean = true,
  scale: number = 1.0
): Promise<IRegionMapMarker> {
  const db = await getDB();
  const now = Date.now();
  const id = crypto.randomUUID();

  const newMarker: IRegionMapMarker = {
    id,
    mapId,
    parentRegionId,
    childRegionId,
    positionX: Math.round(x),
    positionY: Math.round(y),
    color,
    showLabel,
    scale,
    createdAt: now,
    updatedAt: now,
  };

  await db.execute(
    `INSERT INTO region_map_markers (id, map_id, parent_region_id, child_region_id, position_x, position_y, color, show_label, scale, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      id,
      mapId,
      parentRegionId,
      childRegionId,
      Math.round(x),
      Math.round(y),
      color,
      showLabel ? 1 : 0,
      scale,
      now,
      now,
    ]
  );

  return newMarker;
}

/**
 * Update marker position
 */
export async function updateMarkerPosition(
  markerId: string,
  x: number,
  y: number
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  await db.execute(
    `UPDATE region_map_markers SET position_x = $1, position_y = $2, updated_at = $3 WHERE id = $4`,
    [Math.round(x), Math.round(y), now, markerId]
  );
}

/**
 * Update marker color
 */
export async function updateMarkerColor(
  markerId: string,
  color: string
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  await db.execute(
    `UPDATE region_map_markers SET color = $1, updated_at = $2 WHERE id = $3`,
    [color, now, markerId]
  );
}

/**
 * Update marker label visibility
 */
export async function updateMarkerLabelVisibility(
  markerId: string,
  showLabel: boolean
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  await db.execute(
    `UPDATE region_map_markers SET show_label = $1, updated_at = $2 WHERE id = $3`,
    [showLabel ? 1 : 0, now, markerId]
  );
}

/**
 * Update marker scale
 */
export async function updateMarkerScale(
  markerId: string,
  scale: number
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  await db.execute(
    `UPDATE region_map_markers SET scale = $1, updated_at = $2 WHERE id = $3`,
    [scale, now, markerId]
  );
}

/**
 * Remove a marker from the map
 */
export async function removeMarker(markerId: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM region_map_markers WHERE id = $1", [markerId]);
}

/**
 * Get all markers for a specific map
 */
export async function getMarkersByMapId(
  mapId: string
): Promise<IRegionMapMarker[]> {
  const db = await getDB();
  const result = await db.select<DBRegionMapMarker[]>(
    "SELECT * FROM region_map_markers WHERE map_id = $1",
    [mapId]
  );

  return result.map(dbMarkerToMarker);
}

/**
 * Get all markers for a parent region (deprecated - use getMarkersByMapId)
 */
export async function getMarkersByRegion(
  parentRegionId: string
): Promise<IRegionMapMarker[]> {
  const db = await getDB();
  const result = await db.select<DBRegionMapMarker[]>(
    "SELECT * FROM region_map_markers WHERE parent_region_id = $1",
    [parentRegionId]
  );

  return result.map(dbMarkerToMarker);
}

/**
 * Get marker for a specific child region on a specific map
 */
export async function getMarkerByChildRegion(
  mapId: string,
  childRegionId: string
): Promise<IRegionMapMarker | null> {
  const db = await getDB();
  const result = await db.select<DBRegionMapMarker[]>(
    "SELECT * FROM region_map_markers WHERE map_id = $1 AND child_region_id = $2",
    [mapId, childRegionId]
  );

  return result.length > 0 ? dbMarkerToMarker(result[0]) : null;
}

/**
 * Check if a child region already has a marker on specific map
 */
export async function hasMarker(
  mapId: string,
  childRegionId: string
): Promise<boolean> {
  const marker = await getMarkerByChildRegion(mapId, childRegionId);
  return marker !== null;
}
