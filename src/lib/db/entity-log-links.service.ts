/**
 * Entity Log Links Service
 *
 * Serviço para gerenciar links entre logs globais e entidades (entity_log_links).
 * Segue o padrão do gallery links para consistência.
 */

import { IEntityLogLink } from "@/types/global-entity-log-types";

import { safeDBOperation } from "./safe-db-operation";
import { DBEntityLogLink } from "./types";

import { getDB } from "./index";

// ========================================
// Converters
// ========================================

/**
 * Convert IEntityLogLink to DBEntityLogLink
 */
function entityLogLinkToDBEntityLogLink(
  link: IEntityLogLink
): DBEntityLogLink {
  return {
    id: link.id,
    log_id: link.logId,
    entity_id: link.entityId,
    entity_type: link.entityType,
    book_id: link.bookId,
    order_index: link.orderIndex,
    created_at: link.createdAt
      ? new Date(link.createdAt).getTime()
      : Date.now(),
  };
}

/**
 * Convert DBEntityLogLink to IEntityLogLink
 */
function dbEntityLogLinkToEntityLogLink(
  dbLink: DBEntityLogLink
): IEntityLogLink {
  return {
    id: dbLink.id,
    logId: dbLink.log_id,
    entityId: dbLink.entity_id,
    entityType: dbLink.entity_type as any,
    bookId: dbLink.book_id,
    orderIndex: dbLink.order_index,
    createdAt: new Date(dbLink.created_at).toISOString(),
  };
}

// ========================================
// Link Operations
// ========================================

/**
 * Get all links for a specific log
 */
export async function getEntityLogLinks(
  logId: string
): Promise<IEntityLogLink[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBEntityLogLink[]>(
      `SELECT * FROM entity_log_links WHERE log_id = $1`,
      [logId]
    );

    return result.map(dbEntityLogLinkToEntityLogLink);
  }, []);
}

/**
 * Add a link between a log and an entity
 */
export async function addEntityLogLink(link: IEntityLogLink): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbLink = entityLogLinkToDBEntityLogLink(link);

    await db.execute(
      `INSERT INTO entity_log_links (id, log_id, entity_id, entity_type, book_id, order_index, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        dbLink.id,
        dbLink.log_id,
        dbLink.entity_id,
        dbLink.entity_type,
        dbLink.book_id,
        dbLink.order_index,
        dbLink.created_at,
      ]
    );
  });
}

/**
 * Remove a link by ID
 */
export async function removeEntityLogLink(linkId: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    await db.execute(`DELETE FROM entity_log_links WHERE id = $1`, [linkId]);
  });
}

/**
 * Update all links for a log (replace all links)
 */
export async function updateEntityLogLinks(
  logId: string,
  links: IEntityLogLink[]
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Delete all existing links for this log
    await db.execute(`DELETE FROM entity_log_links WHERE log_id = $1`, [logId]);

    // Insert new links
    for (const link of links) {
      const dbLink = entityLogLinkToDBEntityLogLink(link);
      await db.execute(
        `INSERT INTO entity_log_links (id, log_id, entity_id, entity_type, book_id, order_index, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          dbLink.id,
          dbLink.log_id,
          dbLink.entity_id,
          dbLink.entity_type,
          dbLink.book_id,
          dbLink.order_index,
          dbLink.created_at,
        ]
      );
    }
  });
}

/**
 * Count the number of links for a log
 * Used to determine edit permissions (only allow local edit if count === 1)
 */
export async function countLinksForLog(logId: string): Promise<number> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM entity_log_links WHERE log_id = $1`,
      [logId]
    );

    return result[0]?.count || 0;
  }, 0);
}

/**
 * Get all links for a specific entity
 * Useful for cleanup operations or displaying linked logs in entity view
 */
export async function getLinksForEntity(
  entityId: string,
  entityType: string
): Promise<IEntityLogLink[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBEntityLogLink[]>(
      `SELECT * FROM entity_log_links
       WHERE entity_id = $1 AND entity_type = $2`,
      [entityId, entityType]
    );

    return result.map(dbEntityLogLinkToEntityLogLink);
  }, []);
}

/**
 * Remove all links for a specific entity
 * Useful for cleanup when an entity is deleted
 */
export async function removeLinksForEntity(
  entityId: string,
  entityType: string
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    await db.execute(
      `DELETE FROM entity_log_links WHERE entity_id = $1 AND entity_type = $2`,
      [entityId, entityType]
    );
  });
}

/**
 * Reorder entity log links for a specific entity
 * Updates only the order_index for links belonging to this entity
 */
export async function reorderEntityLogLinks(
  entityId: string,
  entityType: string,
  logIds: string[]
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Update each link's order_index based on its position in the array
    for (let i = 0; i < logIds.length; i++) {
      await db.execute(
        `UPDATE entity_log_links
         SET order_index = $1
         WHERE log_id = $2 AND entity_id = $3 AND entity_type = $4`,
        [i, logIds[i], entityId, entityType]
      );
    }
  });
}
