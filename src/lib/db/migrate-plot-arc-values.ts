/**
 * Migration script to update plot arc status and size values from Portuguese to English
 *
 * This migration:
 * 1. Updates status values: finalizado -> finished, atual -> current, planejamento -> planning
 * 2. Updates size values: pequeno -> small, médio -> medium, grande -> large
 */

import { Database } from "@tauri-apps/plugin-sql";

export async function migratePlotArcValues() {
  try {
    const db = await Database.load("sqlite:grimorium.db");

    console.log("[Migration] Starting plot arc values migration...");

    // Check if plot_arcs table exists
    const tables = await db.select<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='plot_arcs'"
    );

    if (tables.length === 0) {
      console.log("[Migration] plot_arcs table does not exist, skipping...");
      return {
        success: true,
        message: "Table does not exist",
      };
    }

    // Get all plot arcs to check if migration is needed
    const arcs = await db.select<{ id: string; status: string; size: string }[]>(
      "SELECT id, status, size FROM plot_arcs"
    );

    if (arcs.length === 0) {
      console.log("[Migration] No plot arcs found, skipping...");
      return {
        success: true,
        message: "No arcs to migrate",
      };
    }

    // Count how many need migration
    const needsMigration = arcs.filter(
      (arc) =>
        arc.status === "finalizado" ||
        arc.status === "atual" ||
        arc.status === "planejamento" ||
        arc.size === "pequeno" ||
        arc.size === "médio" ||
        arc.size === "grande"
    );

    if (needsMigration.length === 0) {
      console.log("[Migration] All arcs already migrated, skipping...");
      return {
        success: true,
        message: "All arcs already have English values",
      };
    }

    console.log(`[Migration] Migrating ${needsMigration.length} arcs...`);

    // Update status values
    await db.execute("UPDATE plot_arcs SET status = 'finished' WHERE status = 'finalizado'");
    await db.execute("UPDATE plot_arcs SET status = 'current' WHERE status = 'atual'");
    await db.execute("UPDATE plot_arcs SET status = 'planning' WHERE status = 'planejamento'");
    console.log("[Migration] Updated status values");

    // Update size values
    await db.execute("UPDATE plot_arcs SET size = 'small' WHERE size = 'pequeno'");
    await db.execute("UPDATE plot_arcs SET size = 'medium' WHERE size = 'médio'");
    await db.execute("UPDATE plot_arcs SET size = 'large' WHERE size = 'grande'");
    console.log("[Migration] Updated size values");

    console.log("[Migration] Migration completed successfully!");

    return {
      success: true,
      arcsMigrated: needsMigration.length,
      message: `Successfully migrated ${needsMigration.length} arcs`,
    };
  } catch (error) {
    console.error("[Migration] Error during migration:", error);
    throw error;
  }
}
