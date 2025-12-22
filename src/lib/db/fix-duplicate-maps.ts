/**
 * Fix Duplicate Maps
 *
 * Detects and fixes regions that have multiple maps in the database
 * (data corruption - should not happen due to UNIQUE constraint)
 */

import { BaseDirectory, exists, remove } from "@tauri-apps/plugin-fs";
import { getDB } from "./index";

export interface DuplicateMapReport {
  duplicatesFound: number;
  mapsRemoved: number;
  filesDeleted: string[];
  errors: string[];
}

/**
 * Find and fix regions with multiple maps
 * Keeps only the most recent map (by updated_at)
 */
export async function fixDuplicateMaps(): Promise<DuplicateMapReport> {
  const report: DuplicateMapReport = {
    duplicatesFound: 0,
    mapsRemoved: 0,
    filesDeleted: [],
    errors: [],
  };

  try {
    const db = await getDB();

    // Find regions with multiple maps
    const duplicates = await db.select<
      Array<{
        region_id: string;
        map_count: number;
      }>
    >(
      `
      SELECT region_id, COUNT(*) as map_count
      FROM region_maps
      GROUP BY region_id
      HAVING COUNT(*) > 1
    `
    );

    if (!duplicates || duplicates.length === 0) {
      console.log("[fix-duplicates] No duplicate maps found");
      return report;
    }

    report.duplicatesFound = duplicates.length;
    console.log(
      `[fix-duplicates] Found ${duplicates.length} region(s) with duplicate maps`
    );

    // For each region with duplicates, keep only the most recent
    for (const dup of duplicates) {
      console.log(
        `[fix-duplicates] Processing region ${dup.region_id} (${dup.map_count} maps)`
      );

      // Get all maps for this region, ordered by updated_at DESC
      const maps = await db.select<
        Array<{
          id: string;
          region_id: string;
          image_path: string;
          created_at: number;
          updated_at: number;
        }>
      >(
        `
        SELECT id, region_id, image_path, created_at, updated_at
        FROM region_maps
        WHERE region_id = $1
        ORDER BY updated_at DESC
      `,
        [dup.region_id]
      );

      if (!maps || maps.length <= 1) {
        continue;
      }

      // Keep the first one (most recent), delete the rest
      const [keepMap, ...deleteMaps] = maps;
      console.log(`[fix-duplicates] Keeping map: ${keepMap.image_path}`);

      for (const oldMap of deleteMaps) {
        console.log(`[fix-duplicates] Removing old map: ${oldMap.image_path}`);

        // Delete the file from disk
        try {
          const fileExists = await exists(oldMap.image_path, {
            baseDir: BaseDirectory.AppData,
          });
          if (fileExists) {
            await remove(oldMap.image_path, {
              baseDir: BaseDirectory.AppData,
            });
            report.filesDeleted.push(oldMap.image_path);
            console.log(`[fix-duplicates] ✓ Deleted file: ${oldMap.image_path}`);
          } else {
            console.log(
              `[fix-duplicates] File not found (already deleted?): ${oldMap.image_path}`
            );
          }
        } catch (error) {
          const errorMsg = `Failed to delete file ${oldMap.image_path}: ${error}`;
          console.error(`[fix-duplicates] ${errorMsg}`);
          report.errors.push(errorMsg);
        }

        // Delete the database record
        try {
          await db.execute("DELETE FROM region_maps WHERE id = $1", [
            oldMap.id,
          ]);
          report.mapsRemoved++;
          console.log(`[fix-duplicates] ✓ Deleted DB record: ${oldMap.id}`);
        } catch (error) {
          const errorMsg = `Failed to delete DB record ${oldMap.id}: ${error}`;
          console.error(`[fix-duplicates] ${errorMsg}`);
          report.errors.push(errorMsg);
        }
      }
    }

    console.log("[fix-duplicates] Cleanup complete");
    console.log(`[fix-duplicates] Regions with duplicates: ${report.duplicatesFound}`);
    console.log(`[fix-duplicates] Old maps removed: ${report.mapsRemoved}`);
    console.log(`[fix-duplicates] Files deleted: ${report.filesDeleted.length}`);
  } catch (error) {
    const errorMsg = `Fatal error in fixDuplicateMaps: ${error}`;
    console.error(`[fix-duplicates] ${errorMsg}`);
    report.errors.push(errorMsg);
  }

  return report;
}
