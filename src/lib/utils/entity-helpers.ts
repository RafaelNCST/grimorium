import { safeJsonParse } from "./json-parse";

/**
 * Configuration for cleaning orphaned entity IDs from a field
 */
export interface CleanupRule {
  field: string;
  checkExists: (id: string) => Promise<boolean>;
}

/**
 * Clean orphaned entity IDs from region/character/faction data
 *
 * This utility removes IDs from JSON string fields that reference entities
 * that no longer exist in the database (e.g., deleted factions, characters).
 *
 * @param data - The entity data containing fields with entity ID arrays
 * @param rules - Array of cleanup rules defining which fields to clean and how to check existence
 * @returns Object with cleaned data and whether any orphaned IDs were found
 *
 * @example
 * ```typescript
 * const { cleanedData, hasOrphanedIds } = await cleanOrphanedEntityIds(
 *   regionData,
 *   [
 *     {
 *       field: 'residentFactions',
 *       checkExists: async (id) => {
 *         const faction = await getFactionById(id);
 *         return faction !== null;
 *       }
 *     },
 *     {
 *       field: 'importantCharacters',
 *       checkExists: async (id) => {
 *         const character = await getCharacterById(id);
 *         return character !== null;
 *       }
 *     }
 *   ]
 * );
 *
 * if (hasOrphanedIds) {
 *   await updateRegion(regionId, cleanedData);
 * }
 * ```
 */
export async function cleanOrphanedEntityIds<T extends Record<string, any>>(
  data: T,
  rules: CleanupRule[]
): Promise<{ cleanedData: T; hasOrphanedIds: boolean }> {
  let hasOrphanedIds = false;
  const cleanedData = { ...data };

  for (const rule of rules) {
    const fieldValue = data[rule.field];

    // Skip if field is empty
    if (!fieldValue) continue;

    // Parse the JSON string to array
    const ids = safeJsonParse<string[]>(fieldValue, []);

    // Skip if no IDs
    if (ids.length === 0) continue;

    // Check each ID for existence
    const validIds: string[] = [];

    for (const id of ids) {
      try {
        const exists = await rule.checkExists(id);
        if (exists) {
          validIds.push(id);
        } else {
          hasOrphanedIds = true;
        }
      } catch (error) {
        console.error(`Failed to check existence for ${rule.field} ID ${id}:`, error);
        // On error, keep the ID to avoid data loss
        validIds.push(id);
      }
    }

    // Update the field with cleaned IDs
    cleanedData[rule.field] = JSON.stringify(validIds) as any;
  }

  return { cleanedData, hasOrphanedIds };
}
