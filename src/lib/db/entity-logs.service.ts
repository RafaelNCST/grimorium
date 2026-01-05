import {
  IEntityLog,
  DBEntityLog,
  EntityType,
  MomentType,
  ImportanceLevel,
} from "@/types/entity-log-types";

import { safeDBOperation } from "./safe-db-operation";

import { getDB } from "./index";

// Convert IEntityLog to DBEntityLog
function entityLogToDBEntityLog(log: IEntityLog): DBEntityLog {
  return {
    id: log.id,
    entity_id: log.entityId,
    entity_type: log.entityType,
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

// Convert DBEntityLog to IEntityLog
function dbEntityLogToEntityLog(dbLog: DBEntityLog): IEntityLog {
  return {
    id: dbLog.id,
    entityId: dbLog.entity_id,
    entityType: dbLog.entity_type as EntityType,
    bookId: dbLog.book_id,
    momentType: dbLog.moment_type as MomentType,
    chapterNumber: dbLog.chapter_number || undefined,
    prehistoryPeriod: dbLog.prehistory_period || undefined,
    importance: dbLog.importance as ImportanceLevel,
    description: dbLog.description,
    orderIndex: dbLog.order_index,
    createdAt: new Date(dbLog.created_at).toISOString(),
    updatedAt: new Date(dbLog.updated_at).toISOString(),
  };
}

// Get all logs for a specific entity
export async function getEntityLogs(
  entityId: string,
  entityType: EntityType
): Promise<IEntityLog[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBEntityLog[]>(
      `SELECT * FROM entity_logs
       WHERE entity_id = $1 AND entity_type = $2
       ORDER BY order_index ASC, created_at ASC`,
      [entityId, entityType]
    );
    return result.map(dbEntityLogToEntityLog);
  }, []);
}

// Get a single log by ID
export async function getEntityLogById(id: string): Promise<IEntityLog | null> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBEntityLog[]>(
      `SELECT * FROM entity_logs WHERE id = $1`,
      [id]
    );
    if (result.length === 0) return null;
    return dbEntityLogToEntityLog(result[0]);
  }, null);
}

// Create a new log
export async function createEntityLog(log: IEntityLog): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbLog = entityLogToDBEntityLog(log);

    await db.execute(
      `INSERT INTO entity_logs (
        id, entity_id, entity_type, book_id,
        moment_type, chapter_number, prehistory_period,
        importance, description, order_index,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        dbLog.id,
        dbLog.entity_id,
        dbLog.entity_type,
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

// Update an existing log
export async function updateEntityLog(
  id: string,
  updates: Partial<IEntityLog>
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Get current log
    const current = await getEntityLogById(id);
    if (!current) {
      throw new Error(`Log with id ${id} not found`);
    }

    // Merge updates with current data
    const updated: IEntityLog = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const dbLog = entityLogToDBEntityLog(updated);

    await db.execute(
      `UPDATE entity_logs SET
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

// Delete a log
export async function deleteEntityLog(id: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    await db.execute(`DELETE FROM entity_logs WHERE id = $1`, [id]);
  });
}

// Update order indices for drag and drop
export async function reorderEntityLogs(
  entityId: string,
  entityType: EntityType,
  logIds: string[]
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Update each log's order_index based on its position in the array
    for (let i = 0; i < logIds.length; i++) {
      await db.execute(
        `UPDATE entity_logs SET order_index = $1, updated_at = $2
         WHERE id = $3 AND entity_id = $4 AND entity_type = $5`,
        [i, Date.now(), logIds[i], entityId, entityType]
      );
    }
  });
}

// Get next order index for a new log
export async function getNextOrderIndex(
  entityId: string,
  entityType: EntityType
): Promise<number> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<{ max_order: number | null }[]>(
      `SELECT MAX(order_index) as max_order FROM entity_logs
       WHERE entity_id = $1 AND entity_type = $2`,
      [entityId, entityType]
    );

    const maxOrder = result[0]?.max_order;
    return maxOrder !== null ? maxOrder + 1 : 0;
  }, 0);
}
