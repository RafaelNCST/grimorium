/**
 * Helper functions for cleaning up orphaned references when deleting entities
 */

import { getDB } from "./index";

/**
 * Remove an ID from a JSON array field in the database
 * @param table - Table name
 * @param column - JSON column name containing an array
 * @param entityId - ID to remove from arrays
 * @param whereClause - Optional WHERE clause (e.g., "book_id = $1")
 * @param whereParams - Parameters for WHERE clause
 */
export async function removeFromJSONArray(
  table: string,
  column: string,
  entityId: string,
  whereClause?: string,
  whereParams?: any[]
): Promise<void> {
  const db = await getDB();

  // Get all rows that might contain the entity ID
  const query = whereClause
    ? `SELECT id, ${column} FROM ${table} WHERE ${whereClause}`
    : `SELECT id, ${column} FROM ${table}`;

  const rows = await db.select<Array<{ id: string; [key: string]: any }>>(
    query,
    whereParams || []
  );

  for (const row of rows) {
    const columnValue = row[column];
    if (!columnValue) continue;

    try {
      const array: string[] = JSON.parse(columnValue);
      const filteredArray = array.filter((id) => id !== entityId);

      // Only update if something changed
      if (filteredArray.length !== array.length) {
        await db.execute(`UPDATE ${table} SET ${column} = $1 WHERE id = $2`, [
          JSON.stringify(filteredArray),
          row.id,
        ]);
      }
    } catch (error) {
      console.warn(
        `[cleanup] Failed to parse JSON in ${table}.${column} for row ${row.id}:`,
        error
      );
    }
  }
}

/**
 * Remove an ID from nested JSON arrays (e.g., timeline events)
 * @param table - Table name
 * @param column - JSON column name containing nested structure
 * @param entityId - ID to remove
 * @param paths - Array of paths to the arrays (e.g., ["timeline", "*", "events", "*", "charactersInvolved"])
 * @param whereClause - Optional WHERE clause
 * @param whereParams - Parameters for WHERE clause
 */
export async function removeFromNestedJSONArray(
  table: string,
  column: string,
  entityId: string,
  paths: string[],
  whereClause?: string,
  whereParams?: any[]
): Promise<void> {
  const db = await getDB();

  const query = whereClause
    ? `SELECT id, ${column} FROM ${table} WHERE ${whereClause}`
    : `SELECT id, ${column} FROM ${table}`;

  const rows = await db.select<Array<{ id: string; [key: string]: any }>>(
    query,
    whereParams || []
  );

  for (const row of rows) {
    const columnValue = row[column];
    if (!columnValue) continue;

    try {
      const data = JSON.parse(columnValue);
      let modified = false;

      // Recursively clean the nested structure
      const cleanNested = (obj: any, pathIndex: number): any => {
        if (pathIndex >= paths.length) {
          return obj;
        }

        const currentPath = paths[pathIndex];

        if (currentPath === "*") {
          // Wildcard - iterate over array
          if (Array.isArray(obj)) {
            return obj.map((item) => cleanNested(item, pathIndex + 1));
          }
        } else {
          // Named property
          if (obj && typeof obj === "object" && currentPath in obj) {
            if (pathIndex === paths.length - 1) {
              // Last path segment - this should be the array to clean
              if (Array.isArray(obj[currentPath])) {
                const before = obj[currentPath].length;
                obj[currentPath] = obj[currentPath].filter(
                  (id: string) => id !== entityId
                );
                if (obj[currentPath].length !== before) {
                  modified = true;
                }
              }
            } else {
              // Continue recursion
              obj[currentPath] = cleanNested(obj[currentPath], pathIndex + 1);
            }
          }
        }

        return obj;
      };

      const cleanedData = cleanNested(data, 0);

      if (modified) {
        await db.execute(`UPDATE ${table} SET ${column} = $1 WHERE id = $2`, [
          JSON.stringify(cleanedData),
          row.id,
        ]);
      }
    } catch (error) {
      console.warn(
        `[cleanup] Failed to parse nested JSON in ${table}.${column} for row ${row.id}:`,
        error
      );
    }
  }
}

/**
 * Delete entity mentions from chapters
 */
export async function deleteEntityMentions(
  entityId: string,
  entityType: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "DELETE FROM chapter_entity_mentions WHERE entity_id = $1 AND entity_type = $2",
    [entityId, entityType]
  );
}

/**
 * Delete gallery links for an entity
 */
export async function deleteGalleryLinks(
  entityId: string,
  entityType: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "DELETE FROM gallery_links WHERE entity_id = $1 AND entity_type = $2",
    [entityId, entityType]
  );
}

/**
 * Delete note links for an entity
 */
export async function deleteNoteLinks(
  entityId: string,
  entityType: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "DELETE FROM note_links WHERE entity_id = $1 AND entity_type = $2",
    [entityId, entityType]
  );
}

/**
 * Clean all common entity references (mentions, gallery, notes)
 */
export async function cleanCommonEntityReferences(
  entityId: string,
  entityType: string
): Promise<void> {
  await deleteEntityMentions(entityId, entityType);
  await deleteGalleryLinks(entityId, entityType);
  await deleteNoteLinks(entityId, entityType);
}
