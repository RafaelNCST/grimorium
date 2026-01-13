/**
 * Global Entity Logs Service
 *
 * Serviço para gerenciar logs globais (global_entity_logs).
 * Segue o padrão do gallery.service.ts para consistência.
 */

import {
  IGlobalEntityLog,
  IEntityLogLink,
  EntityType,
} from "@/types/global-entity-log-types";

import { safeDBOperation } from "./safe-db-operation";
import { DBGlobalEntityLog } from "./types";

import { getDB } from "./index";
import { getEntityLogLinks } from "./entity-log-links.service";

// ========================================
// Converters
// ========================================

/**
 * Convert IGlobalEntityLog to DBGlobalEntityLog
 */
function globalEntityLogToDBGlobalEntityLog(
  log: IGlobalEntityLog
): DBGlobalEntityLog {
  return {
    id: log.id,
    book_id: log.bookId,
    moment_type: log.momentType,
    chapter_number: log.chapterNumber || null,
    prehistory_period: log.prehistoryPeriod || null,
    importance: log.importance,
    description: log.description,
    order_index: log.orderIndex,
    created_at: log.createdAt ? new Date(log.createdAt).getTime() : Date.now(),
    updated_at: log.updatedAt ? new Date(log.updatedAt).getTime() : Date.now(),
  };
}

/**
 * Convert DBGlobalEntityLog to IGlobalEntityLog (without links - fetched separately)
 */
function dbGlobalEntityLogToGlobalEntityLog(
  dbLog: DBGlobalEntityLog
): Omit<IGlobalEntityLog, "links"> {
  return {
    id: dbLog.id,
    bookId: dbLog.book_id,
    momentType: dbLog.moment_type as any,
    chapterNumber: dbLog.chapter_number || undefined,
    prehistoryPeriod: dbLog.prehistory_period || undefined,
    importance: dbLog.importance as any,
    description: dbLog.description,
    orderIndex: dbLog.order_index,
    createdAt: new Date(dbLog.created_at).toISOString(),
    updatedAt: new Date(dbLog.updated_at).toISOString(),
  };
}

// ========================================
// CRUD Operations
// ========================================

/**
 * Get all global entity logs for a book (with links populated)
 */
export async function getAllGlobalEntityLogs(
  bookId: string
): Promise<IGlobalEntityLog[]> {
  return safeDBOperation(async () => {
    const db = await getDB();

    const result = await db.select<DBGlobalEntityLog[]>(
      `SELECT * FROM global_entity_logs
       WHERE book_id = $1
       ORDER BY order_index ASC, created_at DESC`,
      [bookId]
    );

    // Convert and populate links for each log
    const logs: IGlobalEntityLog[] = [];
    for (const dbLog of result) {
      const log = dbGlobalEntityLogToGlobalEntityLog(dbLog);
      const links = await getEntityLogLinks(dbLog.id);
      logs.push({ ...log, links });
    }

    return logs;
  }, []);
}

/**
 * Get a single global entity log by ID (with links populated)
 */
export async function getGlobalEntityLogById(
  id: string
): Promise<IGlobalEntityLog | null> {
  return safeDBOperation(async () => {
    const db = await getDB();

    const result = await db.select<DBGlobalEntityLog[]>(
      `SELECT * FROM global_entity_logs WHERE id = $1`,
      [id]
    );

    if (result.length === 0) return null;

    const log = dbGlobalEntityLogToGlobalEntityLog(result[0]);
    const links = await getEntityLogLinks(id);

    return { ...log, links };
  }, null);
}

/**
 * Get global entity logs linked to a specific entity
 * Orders by entity-specific order_index (from entity_log_links), not global order
 */
export async function getGlobalEntityLogsByEntityId(
  entityId: string,
  entityType: EntityType
): Promise<IGlobalEntityLog[]> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Join with entity_log_links to get only logs linked to this entity
    // Order by entity-specific order_index from the link table
    const result = await db.select<DBGlobalEntityLog[]>(
      `SELECT gel.*
       FROM global_entity_logs gel
       INNER JOIN entity_log_links ell ON gel.id = ell.log_id
       WHERE ell.entity_id = $1 AND ell.entity_type = $2
       ORDER BY ell.order_index ASC, gel.created_at DESC`,
      [entityId, entityType]
    );

    // Convert and populate links for each log
    const logs: IGlobalEntityLog[] = [];
    for (const dbLog of result) {
      const log = dbGlobalEntityLogToGlobalEntityLog(dbLog);
      const links = await getEntityLogLinks(dbLog.id);
      logs.push({ ...log, links });
    }

    return logs;
  }, []);
}

/**
 * Create a new global entity log
 */
export async function createGlobalEntityLog(
  log: IGlobalEntityLog
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbLog = globalEntityLogToDBGlobalEntityLog(log);

    await db.execute(
      `INSERT INTO global_entity_logs (
        id, book_id, moment_type, chapter_number, prehistory_period,
        importance, description, order_index, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        dbLog.id,
        dbLog.book_id,
        dbLog.moment_type,
        dbLog.chapter_number,
        dbLog.prehistory_period,
        dbLog.importance,
        dbLog.description,
        dbLog.order_index,
        dbLog.created_at,
        dbLog.updated_at,
      ]
    );
  });
}

/**
 * Update an existing global entity log
 */
export async function updateGlobalEntityLog(
  id: string,
  updates: Partial<Omit<IGlobalEntityLog, "id" | "createdAt" | "links">>
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Get current log
    const current = await getGlobalEntityLogById(id);
    if (!current) {
      throw new Error(`Global entity log with id ${id} not found`);
    }

    // Merge updates with current data
    const updated: IGlobalEntityLog = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const dbLog = globalEntityLogToDBGlobalEntityLog(updated);

    await db.execute(
      `UPDATE global_entity_logs SET
        moment_type = $1,
        chapter_number = $2,
        prehistory_period = $3,
        importance = $4,
        description = $5,
        order_index = $6,
        updated_at = $7
       WHERE id = $8`,
      [
        dbLog.moment_type,
        dbLog.chapter_number,
        dbLog.prehistory_period,
        dbLog.importance,
        dbLog.description,
        dbLog.order_index,
        dbLog.updated_at,
        id,
      ]
    );
  });
}

/**
 * Delete a global entity log (links are cascade deleted automatically)
 */
export async function deleteGlobalEntityLog(id: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    await db.execute(`DELETE FROM global_entity_logs WHERE id = $1`, [id]);
  });
}

// ========================================
// Reordering
// ========================================

/**
 * Reorder global entity logs for a book
 */
export async function reorderGlobalEntityLogs(
  bookId: string,
  logIds: string[]
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Update each log's order_index based on its position in the array
    for (let i = 0; i < logIds.length; i++) {
      await db.execute(
        `UPDATE global_entity_logs
         SET order_index = $1, updated_at = $2
         WHERE id = $3 AND book_id = $4`,
        [i, Date.now(), logIds[i], bookId]
      );
    }
  });
}

/**
 * Get the next order index for a new log in a book
 */
export async function getNextOrderIndex(bookId: string): Promise<number> {
  return safeDBOperation(async () => {
    const db = await getDB();

    const result = await db.select<{ max_order: number | null }[]>(
      `SELECT MAX(order_index) as max_order
       FROM global_entity_logs
       WHERE book_id = $1`,
      [bookId]
    );

    const maxOrder = result[0]?.max_order;
    return maxOrder !== null ? maxOrder + 1 : 0;
  }, 0);
}
