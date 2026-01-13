/**
 * Entity Logs to Global Migration
 *
 * Migra entity_logs (sistema local) para global_entity_logs + entity_log_links (sistema global com linkagem).
 * Essa migração roda automaticamente no startup do app.
 *
 * Processo:
 * 1. Verifica se tabela entity_logs existe e tem dados
 * 2. Para cada entity_log:
 *    - Cria um global_entity_log (mesmo conteúdo, mas sem entity_id/entity_type)
 *    - Cria um entity_log_link apontando para a entidade original
 * 3. Drop da tabela entity_logs após sucesso
 */

import { safeDBOperation } from "./safe-db-operation";
import { DBEntityLog } from "@/types/entity-log-types";

import { getDB } from "./index";

/**
 * Verifica se a migração é necessária
 * @returns true se a tabela entity_logs existe e tem dados
 */
export async function needsEntityLogMigration(): Promise<boolean> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Verificar se a tabela entity_logs existe
    const tableCheck = await db.select<Array<{ count: number }>>(
      `SELECT COUNT(*) as count FROM sqlite_master
       WHERE type='table' AND name='entity_logs'`,
      []
    );

    if ((tableCheck[0]?.count || 0) === 0) {
      console.log("[Migration] Table entity_logs does not exist. Skipping migration.");
      return false;
    }

    // Verificar se há dados na tabela
    const dataCheck = await db.select<Array<{ count: number }>>(
      `SELECT COUNT(*) as count FROM entity_logs`,
      []
    );

    const hasData = (dataCheck[0]?.count || 0) > 0;

    if (hasData) {
      console.log(`[Migration] Found ${dataCheck[0]?.count} entity logs to migrate`);
    }

    return hasData;
  }, false);
}

/**
 * Migra todos os entity_logs para o sistema global
 * @param onProgress - Callback opcional para reportar progresso
 * @returns Relatório de migração com contadores de sucesso/falha
 */
export async function migrateEntityLogsToGlobal(
  onProgress?: (current: number, total: number) => void
): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  return safeDBOperation(async () => {
    const db = await getDB();

    console.log("[Migration] Starting entity logs migration to global system...");

    // Verificar se as novas tabelas existem
    const newTablesCheck = await db.select<Array<{ count: number }>>(
      `SELECT COUNT(*) as count FROM sqlite_master
       WHERE type='table' AND (name='global_entity_logs' OR name='entity_log_links')`,
      []
    );

    if ((newTablesCheck[0]?.count || 0) < 2) {
      console.error("[Migration] New tables (global_entity_logs, entity_log_links) not found. Run schema migration first.");
      return { success: 0, failed: 0, total: 0 };
    }

    // Buscar todos os logs que precisam migração
    const logsToMigrate = await db.select<DBEntityLog[]>(
      `SELECT * FROM entity_logs ORDER BY created_at ASC`,
      []
    );

    const total = logsToMigrate.length;
    let success = 0;
    let failed = 0;

    console.log(`[Migration] Found ${total} logs to migrate`);

    if (total === 0) {
      console.log("[Migration] No logs to migrate");
      // Drop old table even if empty
      await db.execute(`DROP TABLE IF EXISTS entity_logs`, []);
      console.log("[Migration] Dropped empty entity_logs table");
      return { success: 0, failed: 0, total: 0 };
    }

    // Migrar cada log individualmente
    for (let i = 0; i < logsToMigrate.length; i++) {
      const log = logsToMigrate[i];

      try {
        await migrateSingleEntityLog(db, log);
        success++;
        console.log(
          `[Migration] Migrated log ${log.id} (${success}/${total})`
        );
      } catch (error) {
        failed++;
        console.error(`[Migration] Failed to migrate log ${log.id}:`, error);
        // Continuar migração mesmo se um log falhar
      }

      // Reportar progresso
      if (onProgress) {
        onProgress(i + 1, total);
      }
    }

    console.log(
      `[Migration] Migration complete: ${success} succeeded, ${failed} failed, ${total} total`
    );

    // Se todos os logs foram migrados com sucesso, dropar a tabela antiga
    if (failed === 0) {
      try {
        await db.execute(`DROP TABLE IF EXISTS entity_logs`, []);
        console.log("[Migration] Successfully dropped old entity_logs table");
      } catch (error) {
        console.error("[Migration] Failed to drop entity_logs table:", error);
        // Não fatal - a tabela pode ser removida manualmente depois
      }
    } else {
      console.warn(
        `[Migration] Keeping entity_logs table due to ${failed} failed migrations. Review and re-run migration.`
      );
    }

    return { success, failed, total };
  }, { success: 0, failed: 0, total: 0 });
}

/**
 * Migra um único entity_log para o sistema global
 * @param db - Instância do banco de dados
 * @param dbLog - Log do banco de dados antigo
 */
async function migrateSingleEntityLog(
  db: Awaited<ReturnType<typeof getDB>>,
  dbLog: DBEntityLog
): Promise<void> {
  try {
    const logId = dbLog.id;
    const entityId = dbLog.entity_id;
    const entityType = dbLog.entity_type;
    const bookId = dbLog.book_id;

    // 1. Criar o global_entity_log (sem entity_id/entity_type)
    await db.execute(
      `INSERT INTO global_entity_logs (
        id, book_id, moment_type, chapter_number, prehistory_period,
        importance, description, order_index, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        logId,
        bookId,
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

    // 2. Criar o entity_log_link apontando para a entidade original
    const linkId = `link-${logId}-${entityId}`;
    await db.execute(
      `INSERT INTO entity_log_links (
        id, log_id, entity_id, entity_type, book_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        linkId,
        logId,
        entityId,
        entityType,
        bookId,
        dbLog.created_at, // Usar mesma timestamp do log
      ]
    );

    console.log(
      `[Migration] Log ${logId}: migrated to global system with link to ${entityType}:${entityId}`
    );
  } catch (error) {
    console.error(
      `[Migration] Failed to migrate log ${dbLog.id}:`,
      error
    );
    throw error;
  }
}
