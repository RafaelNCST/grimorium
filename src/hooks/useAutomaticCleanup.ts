/**
 * Automatic Cleanup Hook
 *
 * Automatically fixes data corruption issues like duplicate maps
 * Runs once on app initialization
 */

import { useEffect, useRef } from "react";

export function useAutomaticCleanup() {
  const hasRun = useRef(false);

  useEffect(() => {
    // Only run once per session
    if (hasRun.current) return;
    hasRun.current = true;

    const runAutomaticCleanup = async () => {
      try {
        console.log("[auto-cleanup] Running automatic cleanup...");

        // Fix duplicate maps (same region with multiple maps)
        const { fixDuplicateMaps } = await import(
          "@/lib/db/fix-duplicate-maps"
        );
        const fixReport = await fixDuplicateMaps();

        if (fixReport.duplicatesFound > 0) {
          console.log(
            `[auto-cleanup] ✓ Fixed ${fixReport.duplicatesFound} region(s) with duplicate maps`
          );
          console.log(
            `[auto-cleanup] ✓ Removed ${fixReport.mapsRemoved} old map(s)`
          );
        } else {
          console.log("[auto-cleanup] ✓ No duplicates found");
        }

        if (fixReport.errors.length > 0) {
          console.warn(
            "[auto-cleanup] Errors during cleanup:",
            fixReport.errors
          );
        }
      } catch (error) {
        console.error("[auto-cleanup] Error during automatic cleanup:", error);
      }
    };

    // Run cleanup after a short delay to not block app startup
    const timer = setTimeout(() => {
      runAutomaticCleanup();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
}
