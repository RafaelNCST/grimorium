/**
 * Gallery Thumbnail Migration
 *
 * Migra thumbnails de base64 no banco de dados para arquivos no filesystem.
 * Essa migração roda automaticamente no startup do app.
 */

import { getDB } from "./index";
import { DBGalleryItem } from "./types";
import { saveThumbnailFile, getThumbnailPath } from "./gallery.service";
import { safeDBOperation } from "./safe-db-operation";

/**
 * Verifica se há thumbnails em base64 que precisam ser migrados
 * @returns true se algum item ainda tem thumbnail_base64 e não tem thumbnail_path
 */
export async function needsGalleryThumbnailMigration(): Promise<boolean> {
  return safeDBOperation(async () => {
    const db = await getDB();

    const result = await db.select<Array<{ count: number }>>(
      `SELECT COUNT(*) as count FROM gallery_items
       WHERE thumbnail_base64 IS NOT NULL
       AND (thumbnail_path IS NULL OR thumbnail_path = '')`,
      []
    );

    return (result[0]?.count || 0) > 0;
  }, 'needsGalleryThumbnailMigration');
}

/**
 * Migra todos os thumbnails base64 para filesystem
 * @param onProgress - Callback opcional para reportar progresso
 * @returns Relatório de migração com contadores de sucesso/falha
 */
export async function migrateGalleryThumbnails(
  onProgress?: (current: number, total: number) => void
): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  return safeDBOperation(async () => {
    const db = await getDB();

    console.log('[Migration] Starting gallery thumbnail migration...');

    // Buscar todos os items que precisam migração
    const itemsToMigrate = await db.select<DBGalleryItem[]>(
      `SELECT * FROM gallery_items
       WHERE thumbnail_base64 IS NOT NULL
       AND (thumbnail_path IS NULL OR thumbnail_path = '')`,
      []
    );

    const total = itemsToMigrate.length;
    let success = 0;
    let failed = 0;

    console.log(`[Migration] Found ${total} items to migrate`);

    if (total === 0) {
      console.log('[Migration] No items to migrate');
      return { success: 0, failed: 0, total: 0 };
    }

    // Migrar cada item individualmente
    for (let i = 0; i < itemsToMigrate.length; i++) {
      const item = itemsToMigrate[i];

      try {
        await migrateSingleThumbnail(db, item);
        success++;
        console.log(
          `[Migration] Migrated item ${item.id} (${success}/${total})`
        );
      } catch (error) {
        failed++;
        console.error(
          `[Migration] Failed to migrate item ${item.id}:`,
          error
        );
        // Continuar migração mesmo se um item falhar
      }

      // Reportar progresso
      if (onProgress) {
        onProgress(i + 1, total);
      }
    }

    console.log(
      `[Migration] Complete: ${success} succeeded, ${failed} failed, ${total} total`
    );

    return { success, failed, total };
  }, 'migrateGalleryThumbnails');
}

/**
 * Migra o thumbnail de um único item da galeria
 * @param db - Instância do banco de dados
 * @param dbItem - Item do banco de dados com thumbnail_base64
 */
async function migrateSingleThumbnail(
  db: Awaited<ReturnType<typeof getDB>>,
  dbItem: DBGalleryItem
): Promise<void> {
  if (!dbItem.thumbnail_base64) {
    throw new Error(`Item ${dbItem.id} has no thumbnail_base64`);
  }

  try {
    // 1. Salvar thumbnail como arquivo
    const thumbnailPath = await saveThumbnailFile(
      dbItem.id,
      dbItem.thumbnail_base64
    );

    // 2. Atualizar registro no banco de dados
    await db.execute(
      `UPDATE gallery_items
       SET thumbnail_path = $1, thumbnail_base64 = NULL
       WHERE id = $2`,
      [thumbnailPath, dbItem.id]
    );

    console.log(`[Migration] Item ${dbItem.id}: saved to ${thumbnailPath}`);
  } catch (error) {
    console.error(
      `[Migration] Failed to migrate thumbnail for item ${dbItem.id}:`,
      error
    );

    // Se salvar o arquivo falhar, manter base64 intacto
    // Se update DB falhar, o arquivo será órfão mas a migração pode ser refeita
    throw error;
  }
}
