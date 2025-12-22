/**
 * Cleanup Orphaned Files
 *
 * Utilities to clean up orphaned image files that are not referenced in the database
 */

import { BaseDirectory, exists, readDir, remove } from "@tauri-apps/plugin-fs";
import { getDB } from "./index";

export interface OrphanedFilesReport {
  galleryOrphans: string[];
  thumbnailOrphans: string[];
  mapOrphans: string[];
  totalOrphans: number;
  totalSize: number;
  deletedFiles: string[];
  errors: string[];
  duplicatesFixed?: number;
  duplicateMapsRemoved?: number;
  debug?: {
    galleryFilesFound: string[];
    galleryPathsInDB: string[];
    thumbnailFilesFound: string[];
    thumbnailPathsInDB: string[];
    mapFilesFound: string[];
    mapPathsInDB: string[];
  };
}

/**
 * Scan for orphaned files in gallery and maps directories
 */
export async function scanOrphanedFiles(): Promise<OrphanedFilesReport> {
  const report: OrphanedFilesReport = {
    galleryOrphans: [],
    thumbnailOrphans: [],
    mapOrphans: [],
    totalOrphans: 0,
    totalSize: 0,
    deletedFiles: [],
    errors: [],
    debug: {
      galleryFilesFound: [],
      galleryPathsInDB: [],
      thumbnailFilesFound: [],
      thumbnailPathsInDB: [],
      mapFilesFound: [],
      mapPathsInDB: [],
    },
  };

  try {
    const db = await getDB();

    // 1. Scan gallery images
    try {
      const galleryDirExists = await exists("gallery", {
        baseDir: BaseDirectory.AppData,
      });

      if (galleryDirExists) {
        const files = await readDir("gallery", {
          baseDir: BaseDirectory.AppData,
        });

        // Get all gallery items from database
        const galleryItems = await db.select<{ original_path: string }[]>(
          "SELECT original_path FROM gallery_items"
        );
        const validPaths = new Set(
          galleryItems?.map((item) => item.original_path) || []
        );

        // List ALL files (not just those starting with "image_")
        const allGalleryFiles = files
          .filter((f) => f.isFile && !f.name.includes("thumbnails"))
          .map((f) => `gallery/${f.name}`);

        // Store debug info
        report.debug!.galleryPathsInDB = Array.from(validPaths);
        report.debug!.galleryFilesFound = allGalleryFiles;

        console.log("[cleanup] Gallery images in database:", report.debug!.galleryPathsInDB);
        console.log("[cleanup] ALL files in gallery directory:", report.debug!.galleryFilesFound);
        console.log("[cleanup] Total files found:", allGalleryFiles.length);

        // Check each file
        for (const file of files) {
          if (file.isFile && !file.name.includes("thumbnails")) {
            const filePath = `gallery/${file.name}`;
            const existsInDB = validPaths.has(filePath);
            console.log(`[cleanup] Checking file: ${filePath}, exists in DB: ${existsInDB}`);

            if (!existsInDB) {
              report.galleryOrphans.push(filePath);
              console.log(`[cleanup] ⚠️  File ${filePath} is ORPHAN - will be deleted`);
            } else {
              console.log(`[cleanup] ✓ File ${filePath} is valid`);
            }
          }
        }

        console.log("[cleanup] Gallery orphans found:", report.galleryOrphans);
      }
    } catch (error) {
      report.errors.push(`Error scanning gallery: ${error}`);
    }

    // 2. Scan gallery thumbnails
    try {
      const thumbnailDirExists = await exists("gallery/thumbnails", {
        baseDir: BaseDirectory.AppData,
      });

      if (thumbnailDirExists) {
        const files = await readDir("gallery/thumbnails", {
          baseDir: BaseDirectory.AppData,
        });

        // Get all gallery items from database
        const galleryItems = await db.select<{ thumbnail_path: string | null }[]>(
          "SELECT thumbnail_path FROM gallery_items"
        );
        const validPaths = new Set(
          galleryItems
            ?.filter((item) => item.thumbnail_path)
            .map((item) => item.thumbnail_path!) || []
        );

        // Check each file
        for (const file of files) {
          if (file.isFile && file.name.startsWith("thumb_")) {
            const filePath = `gallery/thumbnails/${file.name}`;
            if (!validPaths.has(filePath)) {
              report.thumbnailOrphans.push(filePath);
            }
          }
        }
      }
    } catch (error) {
      report.errors.push(`Error scanning thumbnails: ${error}`);
    }

    // 3. Scan map images
    try {
      const mapsDirExists = await exists("maps", {
        baseDir: BaseDirectory.AppData,
      });

      if (mapsDirExists) {
        const files = await readDir("maps", {
          baseDir: BaseDirectory.AppData,
        });

        // Get all map paths from database
        const maps = await db.select<{ region_id: string; image_path: string }[]>(
          "SELECT region_id, image_path FROM region_maps"
        );
        const validPaths = new Set(maps?.map((map) => map.image_path) || []);

        // Note: Duplicate maps are now automatically fixed before scanning

        // List ALL files (not just those starting with "map_")
        const allMapFiles = files
          .filter((f) => f.isFile)
          .map((f) => `maps/${f.name}`);

        // Store debug info
        report.debug!.mapPathsInDB = Array.from(validPaths);
        report.debug!.mapFilesFound = allMapFiles;

        console.log("[cleanup] Maps in database:", report.debug!.mapPathsInDB);
        console.log("[cleanup] ALL files in maps directory:", report.debug!.mapFilesFound);
        console.log("[cleanup] Total files found:", allMapFiles.length);

        // Check each file (ALL files, not just those starting with "map_")
        for (const file of files) {
          if (file.isFile) {
            const filePath = `maps/${file.name}`;
            const existsInDB = validPaths.has(filePath);
            console.log(`[cleanup] Checking file: ${filePath}, exists in DB: ${existsInDB}`);

            if (!existsInDB) {
              report.mapOrphans.push(filePath);
              console.log(`[cleanup] ⚠️  File ${filePath} is ORPHAN - will be deleted`);
            } else {
              console.log(`[cleanup] ✓ File ${filePath} is valid`);
            }
          }
        }

        console.log("[cleanup] Map orphans found:", report.mapOrphans);
      }
    } catch (error) {
      report.errors.push(`Error scanning maps: ${error}`);
    }

    report.totalOrphans =
      report.galleryOrphans.length +
      report.thumbnailOrphans.length +
      report.mapOrphans.length;
  } catch (error) {
    report.errors.push(`Fatal error: ${error}`);
  }

  return report;
}

/**
 * Delete orphaned files
 */
export async function cleanupOrphanedFiles(): Promise<OrphanedFilesReport> {
  // First, fix duplicate maps (same region with multiple maps)
  console.log("[cleanup] Step 1: Fixing duplicate maps...");
  let duplicatesFixed = 0;
  let duplicateMapsRemoved = 0;

  try {
    const { fixDuplicateMaps } = await import("./fix-duplicate-maps");
    const fixReport = await fixDuplicateMaps();

    duplicatesFixed = fixReport.duplicatesFound;
    duplicateMapsRemoved = fixReport.mapsRemoved;

    if (fixReport.duplicatesFound > 0) {
      console.log(`[cleanup] Fixed ${fixReport.duplicatesFound} region(s) with duplicate maps`);
      console.log(`[cleanup] Removed ${fixReport.mapsRemoved} old map(s)`);
    }

    if (fixReport.errors.length > 0) {
      console.warn("[cleanup] Errors during duplicate fix:", fixReport.errors);
    }
  } catch (error) {
    console.error("[cleanup] Error fixing duplicates:", error);
  }

  // Then, scan for orphaned files
  console.log("[cleanup] Step 2: Scanning for orphaned files...");
  const report = await scanOrphanedFiles();

  // Add duplicate fix info to report
  report.duplicatesFixed = duplicatesFixed;
  report.duplicateMapsRemoved = duplicateMapsRemoved;

  // Delete gallery orphans
  for (const filePath of report.galleryOrphans) {
    try {
      await remove(filePath, { baseDir: BaseDirectory.AppData });
      report.deletedFiles.push(filePath);
    } catch (error) {
      report.errors.push(`Failed to delete ${filePath}: ${error}`);
    }
  }

  // Delete thumbnail orphans
  for (const filePath of report.thumbnailOrphans) {
    try {
      await remove(filePath, { baseDir: BaseDirectory.AppData });
      report.deletedFiles.push(filePath);
    } catch (error) {
      report.errors.push(`Failed to delete ${filePath}: ${error}`);
    }
  }

  // Delete map orphans
  for (const filePath of report.mapOrphans) {
    try {
      await remove(filePath, { baseDir: BaseDirectory.AppData });
      report.deletedFiles.push(filePath);
    } catch (error) {
      report.errors.push(`Failed to delete ${filePath}: ${error}`);
    }
  }

  return report;
}
