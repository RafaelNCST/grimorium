/**
 * Debug helper to inspect maps in database
 */

import { getDB } from "./index";

export async function debugMaps() {
  const db = await getDB();

  // Get all regions with their maps
  const regions = await db.select<
    Array<{
      region_id: string;
      region_name: string;
      image_path: string;
      book_id: string;
    }>
  >(
    `
    SELECT
      r.id as region_id,
      r.name as region_name,
      r.book_id,
      rm.image_path
    FROM regions r
    LEFT JOIN region_maps rm ON r.id = rm.region_id
    ORDER BY r.name
  `
  );

  console.log("=== ALL REGIONS AND MAPS ===");
  console.table(regions);

  // Get all maps
  const maps = await db.select<
    Array<{
      region_id: string;
      image_path: string;
    }>
  >("SELECT region_id, image_path FROM region_maps");

  console.log("\n=== ALL MAPS ===");
  console.table(maps);

  // Count regions with maps
  const stats = await db.select<
    Array<{
      total_regions: number;
      regions_with_maps: number;
      regions_without_maps: number;
    }>
  >(
    `
    SELECT
      COUNT(*) as total_regions,
      SUM(CASE WHEN rm.region_id IS NOT NULL THEN 1 ELSE 0 END) as regions_with_maps,
      SUM(CASE WHEN rm.region_id IS NULL THEN 1 ELSE 0 END) as regions_without_maps
    FROM regions r
    LEFT JOIN region_maps rm ON r.id = rm.region_id
  `
  );

  console.log("\n=== STATISTICS ===");
  console.table(stats);

  return { regions, maps, stats };
}

// Export for use in console
(window as any).debugMaps = debugMaps;
