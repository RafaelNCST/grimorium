/**
 * Migration script to update character family structure
 *
 * Old structure:
 * - father: string | null
 * - mother: string | null
 * - spouse: string | null
 * - children: string[]
 * - siblings: string[]
 * - halfSiblings: string[]
 * - grandparents: string[]
 * - unclesAunts: string[]
 * - cousins: string[]
 *
 * New structure:
 * - grandparents: string[]
 * - parents: string[]
 * - spouses: string[]
 * - unclesAunts: string[]
 * - cousins: string[]
 * - children: string[]
 * - siblings: string[]
 * - halfSiblings: string[]
 */

import { Database } from "@tauri-apps/plugin-sql";

import { type ICharacter } from "@/types/character-types";

interface OldICharacterFamily {
  father?: string | null;
  mother?: string | null;
  spouse?: string | null;
  children?: string[];
  siblings?: string[];
  halfSiblings?: string[];
  grandparents?: string[];
  unclesAunts?: string[];
  cousins?: string[];
}

export async function migrateFamilyStructure() {
  try {
    const db = await Database.load("sqlite:grimorium.db");

    console.log("[Migration] Starting family structure migration...");

    // Get all characters
    const characters = await db.select<ICharacter[]>(
      "SELECT * FROM characters"
    );

    console.log(`[Migration] Found ${characters.length} characters to migrate`);

    let migratedCount = 0;

    for (const character of characters) {
      if (!character.family) continue;

      const oldFamily = character.family as unknown as OldICharacterFamily;

      // Check if already migrated (has parents array instead of father/mother)
      if ("parents" in oldFamily) {
        console.log(
          `[Migration] Character ${character.id} already migrated, skipping...`
        );
        continue;
      }

      // Build new family structure
      const newFamily = {
        grandparents: oldFamily.grandparents || [],
        parents: [],
        spouses: [],
        unclesAunts: oldFamily.unclesAunts || [],
        cousins: oldFamily.cousins || [],
        children: oldFamily.children || [],
        siblings: oldFamily.siblings || [],
        halfSiblings: oldFamily.halfSiblings || [],
      };

      // Migrate father and mother to parents array
      if (oldFamily.father) {
        newFamily.parents.push(oldFamily.father);
      }
      if (oldFamily.mother) {
        newFamily.parents.push(oldFamily.mother);
      }

      // Migrate spouse to spouses array
      if (oldFamily.spouse) {
        newFamily.spouses.push(oldFamily.spouse);
      }

      // Update character in database
      await db.execute("UPDATE characters SET family = ? WHERE id = ?", [
        JSON.stringify(newFamily),
        character.id,
      ]);

      migratedCount++;
      console.log(
        `[Migration] Migrated character ${character.id} (${character.name})`
      );
    }

    console.log(
      `[Migration] Migration completed! Migrated ${migratedCount} characters`
    );

    return {
      success: true,
      totalCharacters: characters.length,
      migratedCount,
    };
  } catch (error) {
    console.error("[Migration] Error during migration:", error);
    throw error;
  }
}

/**
 * Rollback migration (convert back to old structure)
 * WARNING: This will lose data if multiple parents or spouses were added after migration
 */
export async function rollbackFamilyStructure() {
  try {
    const db = await Database.load("sqlite:grimorium.db");

    console.log("[Migration] Starting family structure rollback...");

    const characters = await db.select<ICharacter[]>(
      "SELECT * FROM characters"
    );

    console.log(
      `[Migration] Found ${characters.length} characters to rollback`
    );

    let rolledBackCount = 0;

    for (const character of characters) {
      if (!character.family) continue;

      // Check if needs rollback (has parents array)
      if (!("parents" in character.family)) {
        console.log(
          `[Migration] Character ${character.id} already in old structure, skipping...`
        );
        continue;
      }

      const newFamily = character.family;

      // Build old family structure
      const oldFamily: OldICharacterFamily = {
        father:
          newFamily.parents && newFamily.parents.length > 0
            ? newFamily.parents[0]
            : null,
        mother:
          newFamily.parents && newFamily.parents.length > 1
            ? newFamily.parents[1]
            : null,
        spouse:
          newFamily.spouses && newFamily.spouses.length > 0
            ? newFamily.spouses[0]
            : null,
        children: newFamily.children || [],
        siblings: newFamily.siblings || [],
        halfSiblings: newFamily.halfSiblings || [],
        grandparents: newFamily.grandparents || [],
        unclesAunts: newFamily.unclesAunts || [],
        cousins: newFamily.cousins || [],
      };

      // Update character in database
      await db.execute("UPDATE characters SET family = ? WHERE id = ?", [
        JSON.stringify(oldFamily),
        character.id,
      ]);

      rolledBackCount++;
      console.log(
        `[Migration] Rolled back character ${character.id} (${character.name})`
      );
    }

    console.log(
      `[Migration] Rollback completed! Rolled back ${rolledBackCount} characters`
    );

    return {
      success: true,
      totalCharacters: characters.length,
      rolledBackCount,
    };
  } catch (error) {
    console.error("[Migration] Error during rollback:", error);
    throw error;
  }
}
