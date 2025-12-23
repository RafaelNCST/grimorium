import {
  mkdir,
  copyFile,
  exists,
  remove,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

import { GALLERY_DIRECTORY } from "@/pages/gallery/constants/gallery-constants";
import { EntityType, IGalleryItem, IGalleryLink } from "@/types/gallery-types";

import { DBGalleryItem, DBGalleryLink } from "./types";

import { getDB } from "./index";
import { safeDBOperation } from "./safe-db-operation";

// ========================================
// Converters
// ========================================

// Convert IGalleryItem to DBGalleryItem
function galleryItemToDBGalleryItem(item: IGalleryItem): DBGalleryItem {
  return {
    id: item.id,
    book_id: item.bookId,
    title: item.title,
    description: item.description,
    thumbnail_base64: item.thumbnailBase64, // DEPRECATED: para compatibilidade temporária
    thumbnail_path: item.thumbnailPath,
    original_path: item.originalPath,
    original_filename: item.originalFilename,
    file_size: item.fileSize,
    width: item.width,
    height: item.height,
    mime_type: item.mimeType,
    order_index: item.orderIndex,
    created_at: item.createdAt
      ? new Date(item.createdAt).getTime()
      : Date.now(),
    updated_at: item.updatedAt
      ? new Date(item.updatedAt).getTime()
      : Date.now(),
  };
}

// Convert DBGalleryItem to IGalleryItem (without links - those are fetched separately)
function dbGalleryItemToGalleryItem(
  dbItem: DBGalleryItem
): Omit<IGalleryItem, "links"> {
  return {
    id: dbItem.id,
    bookId: dbItem.book_id,
    title: dbItem.title,
    description: dbItem.description,
    thumbnailBase64: dbItem.thumbnail_base64, // DEPRECATED: para compatibilidade temporária
    thumbnailPath: dbItem.thumbnail_path || getThumbnailPath(dbItem.id),
    originalPath: dbItem.original_path,
    originalFilename: dbItem.original_filename,
    fileSize: dbItem.file_size,
    width: dbItem.width,
    height: dbItem.height,
    mimeType: dbItem.mime_type,
    orderIndex: dbItem.order_index,
    createdAt: new Date(dbItem.created_at).toISOString(),
    updatedAt: new Date(dbItem.updated_at).toISOString(),
  };
}

// Convert IGalleryLink to DBGalleryLink
function galleryLinkToDBGalleryLink(
  itemId: string,
  link: IGalleryLink
): DBGalleryLink {
  return {
    id: link.id,
    gallery_item_id: itemId,
    entity_id: link.entityId,
    entity_type: link.entityType,
    book_id: link.bookId,
    created_at: link.createdAt
      ? new Date(link.createdAt).getTime()
      : Date.now(),
  };
}

// Convert DBGalleryLink to IGalleryLink
function dbGalleryLinkToGalleryLink(dbLink: DBGalleryLink): IGalleryLink {
  return {
    id: dbLink.id,
    entityId: dbLink.entity_id,
    entityType: dbLink.entity_type as EntityType,
    bookId: dbLink.book_id,
    createdAt: new Date(dbLink.created_at).toISOString(),
  };
}

// ========================================
// File System Operations
// ========================================

/**
 * Ensure gallery directory exists in AppData
 */
export async function ensureGalleryDirectory(): Promise<void> {
  return safeDBOperation(async () => {
    const directoryExists = await exists(GALLERY_DIRECTORY, {
      baseDir: BaseDirectory.AppData,
    });

    if (!directoryExists) {
      await mkdir(GALLERY_DIRECTORY, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }
  }, 'ensureGalleryDirectory');
}

// ========================================
// Thumbnail File System Operations
// ========================================

/**
 * Ensure thumbnails directory exists in AppData
 */
export async function ensureThumbnailsDirectory(): Promise<void> {
  return safeDBOperation(async () => {
    const { THUMBNAILS_DIRECTORY } = await import(
      "@/pages/gallery/constants/gallery-constants"
    );

    const directoryExists = await exists(THUMBNAILS_DIRECTORY, {
      baseDir: BaseDirectory.AppData,
    });

    if (!directoryExists) {
      await mkdir(THUMBNAILS_DIRECTORY, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }
  }, 'ensureThumbnailsDirectory');
}

/**
 * Get thumbnail file path for a gallery item
 * @param itemId - Gallery item ID
 * @returns Relative path (e.g., "gallery/thumbnails/thumb_123.jpg")
 */
export function getThumbnailPath(itemId: string): string {
  return `gallery/thumbnails/thumb_${itemId}.jpg`;
}

/**
 * Save thumbnail file to filesystem
 * @param itemId - Gallery item ID
 * @param base64Data - Base64 data URL of thumbnail
 * @returns Relative path to saved thumbnail
 */
export async function saveThumbnailFile(
  itemId: string,
  base64Data: string
): Promise<string> {
  return safeDBOperation(async () => {
    const { saveThumbnailToFile } = await import(
      "@/pages/gallery/utils/image-utils"
    );

    return await saveThumbnailToFile(itemId, base64Data);
  }, 'saveThumbnailFile');
}

/**
 * Delete thumbnail file from filesystem
 * @param thumbnailPath - Relative path to thumbnail file
 */
export async function deleteThumbnailFile(
  thumbnailPath: string
): Promise<void> {
  return safeDBOperation(async () => {
    const fileExists = await exists(thumbnailPath, {
      baseDir: BaseDirectory.AppData,
    });

    if (fileExists) {
      await remove(thumbnailPath, {
        baseDir: BaseDirectory.AppData,
      });
    }
  }, 'deleteThumbnailFile');
}

/**
 * Load thumbnail as data URL with fallback to regeneration
 * @param item - Gallery item (needs id, thumbnailPath, originalPath, mimeType)
 * @returns Data URL for thumbnail
 */
export async function loadThumbnailWithFallback(
  item: Pick<IGalleryItem, 'id' | 'thumbnailPath' | 'originalPath' | 'mimeType'>
): Promise<string> {
  return safeDBOperation(async () => {
    const {
      loadThumbnailAsDataURL,
      regenerateThumbnailFromOriginal,
    } = await import("@/pages/gallery/utils/image-utils");

    try {
      // Tentar carregar thumbnail do filesystem
      return await loadThumbnailAsDataURL(item.thumbnailPath);
    } catch (error) {
      // Fallback: regenerar da imagem original
      console.warn(
        `[loadThumbnailWithFallback] Thumbnail not found for item ${item.id}, regenerating...`
      );

      try {
        const newThumbnailPath = await regenerateThumbnailFromOriginal(
          item.originalPath,
          item.mimeType,
          item.id
        );

        // Atualizar o banco de dados com o novo path
        await updateGalleryItem(item.id, { thumbnailPath: newThumbnailPath });

        // Carregar o thumbnail regenerado
        return await loadThumbnailAsDataURL(newThumbnailPath);
      } catch (regenerateError) {
        console.error(
          `[loadThumbnailWithFallback] Failed to regenerate thumbnail for item ${item.id}:`,
          regenerateError
        );
        throw new Error(
          `Cannot load or regenerate thumbnail: ${
            regenerateError instanceof Error
              ? regenerateError.message
              : "Unknown error"
          }`
        );
      }
    }
  }, 'loadThumbnailWithFallback');
}

/**
 * Load original image as data URL
 * @param item - Gallery item (needs originalPath and mimeType)
 * @returns Data URL for the original full-quality image
 */
export async function loadOriginalImageAsDataURL(
  item: Pick<IGalleryItem, 'originalPath' | 'mimeType'>
): Promise<string> {
  return safeDBOperation(async () => {
    const { readFile } = await import("@tauri-apps/plugin-fs");
    const { bytesToDataURL } = await import("@/pages/gallery/utils/image-utils");

    try {
      // Read original file from filesystem
      const bytes = await readFile(item.originalPath, {
        baseDir: BaseDirectory.AppData,
      });

      // Convert to data URL with original mime type
      return bytesToDataURL(bytes, item.mimeType);
    } catch (error) {
      console.error(
        `[loadOriginalImageAsDataURL] Failed to load original image:`,
        error
      );
      throw new Error(
        `Cannot load original image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, 'loadOriginalImageAsDataURL');
}

/**
 * Delete image file from file system
 * @param originalPath - Relative path to the image file
 */
export async function deleteGalleryImageFile(
  originalPath: string
): Promise<void> {
  return safeDBOperation(async () => {
    const fileExists = await exists(originalPath, {
      baseDir: BaseDirectory.AppData,
    });

    if (fileExists) {
      await remove(originalPath, {
        baseDir: BaseDirectory.AppData,
      });
    }
  }, 'deleteGalleryImageFile');
}

/**
 * Copy image file to gallery directory
 * @param sourceFilePath - Absolute path to source file
 * @param destinationPath - Relative path in AppData gallery directory
 */
export async function copyImageToGallery(
  sourceFilePath: string,
  destinationPath: string
): Promise<void> {
  return safeDBOperation(async () => {
    await ensureGalleryDirectory();
    await copyFile(sourceFilePath, destinationPath, {
      toPathBaseDir: BaseDirectory.AppData,
    });
  }, 'copyImageToGallery');
}

// ========================================
// CRUD Operations
// ========================================

/**
 * Get all gallery items
 */
export async function getAllGalleryItems(): Promise<IGalleryItem[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const items = await db.select<DBGalleryItem[]>(
      "SELECT * FROM gallery_items ORDER BY updated_at DESC"
    );

    const itemsWithLinks: IGalleryItem[] = [];

    for (const dbItem of items) {
      const links = await getGalleryLinks(dbItem.id);
      itemsWithLinks.push({
        ...dbGalleryItemToGalleryItem(dbItem),
        links,
      });
    }

    return itemsWithLinks;
  }, 'getAllGalleryItems');
}

/**
 * Get gallery items with pagination
 */
export async function getGalleryItemsPaginated(
  bookId: string | null,
  offset: number = 0,
  limit: number = 30
): Promise<IGalleryItem[]> {
  return safeDBOperation(async () => {
    const db = await getDB();

    let query: string;
    let params: unknown[];

    if (bookId) {
      query = "SELECT * FROM gallery_items WHERE book_id = $1 ORDER BY order_index ASC, updated_at DESC LIMIT $2 OFFSET $3";
      params = [bookId, limit, offset];
    } else {
      query = "SELECT * FROM gallery_items ORDER BY updated_at DESC LIMIT $1 OFFSET $2";
      params = [limit, offset];
    }

    const items = await db.select<DBGalleryItem[]>(query, params);

    const itemsWithLinks: IGalleryItem[] = [];

    for (const dbItem of items) {
      const links = await getGalleryLinks(dbItem.id);
      itemsWithLinks.push({
        ...dbGalleryItemToGalleryItem(dbItem),
        links,
      });
    }

    return itemsWithLinks;
  }, 'getGalleryItemsPaginated');
}

/**
 * Get total count of gallery items
 */
export async function getGalleryItemsCount(bookId: string | null): Promise<number> {
  return safeDBOperation(async () => {
    const db = await getDB();

    let query: string;
    let params: unknown[];

    if (bookId) {
      query = "SELECT COUNT(*) as count FROM gallery_items WHERE book_id = $1";
      params = [bookId];
    } else {
      query = "SELECT COUNT(*) as count FROM gallery_items";
      params = [];
    }

    const result = await db.select<Array<{ count: number }>>(query, params);
    return result[0]?.count || 0;
  }, 'getGalleryItemsCount');
}

/**
 * Get gallery items by book ID
 */
export async function getGalleryItemsByBookId(
  bookId: string
): Promise<IGalleryItem[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const items = await db.select<DBGalleryItem[]>(
      "SELECT * FROM gallery_items WHERE book_id = $1 ORDER BY order_index ASC, updated_at DESC",
      [bookId]
    );

    const itemsWithLinks: IGalleryItem[] = [];

    for (const dbItem of items) {
      const links = await getGalleryLinks(dbItem.id);
      itemsWithLinks.push({
        ...dbGalleryItemToGalleryItem(dbItem),
        links,
      });
    }

    return itemsWithLinks;
  }, 'getGalleryItemsByBookId');
}

/**
 * Get gallery item by ID
 */
export async function getGalleryItemById(
  id: string
): Promise<IGalleryItem | null> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBGalleryItem[]>(
      "SELECT * FROM gallery_items WHERE id = $1",
      [id]
    );

    if (result.length === 0) {
      return null;
    }

    const links = await getGalleryLinks(id);

    return {
      ...dbGalleryItemToGalleryItem(result[0]),
      links,
    };
  }, 'getGalleryItemById');
}

/**
 * Create gallery item
 */
export async function createGalleryItem(item: IGalleryItem): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbItem = galleryItemToDBGalleryItem(item);

    // Se thumbnailBase64 existe (compatibilidade com código antigo), salvar como arquivo
    let thumbnailPath = dbItem.thumbnail_path;
    if (item.thumbnailBase64 && !thumbnailPath) {
      thumbnailPath = await saveThumbnailFile(item.id, item.thumbnailBase64);
    }

    await db.execute(
      `INSERT INTO gallery_items (
        id, book_id, title, description, thumbnail_base64, thumbnail_path, original_path,
        original_filename, file_size, width, height, mime_type, order_index,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        dbItem.id,
        dbItem.book_id,
        dbItem.title,
        dbItem.description,
        null, // thumbnail_base64 - não salvamos mais
        thumbnailPath,
        dbItem.original_path,
        dbItem.original_filename,
        dbItem.file_size,
        dbItem.width,
        dbItem.height,
        dbItem.mime_type,
        dbItem.order_index,
        dbItem.created_at,
        dbItem.updated_at,
      ]
    );

    // Insert links
    for (const link of item.links) {
      await addGalleryLink(item.id, link);
    }
  }, 'createGalleryItem');
}

/**
 * Update gallery item
 */
export async function updateGalleryItem(
  id: string,
  updates: Partial<Omit<IGalleryItem, "id" | "createdAt" | "links">>
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const updated_at = Date.now();

    const updateFields: string[] = [];
    const updateValues: unknown[] = [];

    if (updates.title !== undefined) {
      updateFields.push(`title = $${updateValues.length + 1}`);
      updateValues.push(updates.title);
    }

    if (updates.description !== undefined) {
      updateFields.push(`description = $${updateValues.length + 1}`);
      updateValues.push(updates.description);
    }

    // Se thumbnailBase64 foi fornecido (compatibilidade), converter para arquivo
    if (updates.thumbnailBase64 !== undefined) {
      // Deletar thumbnail antigo se existir
      const currentItem = await getGalleryItemById(id);
      if (currentItem?.thumbnailPath) {
        await deleteThumbnailFile(currentItem.thumbnailPath);
      }

      // Salvar novo thumbnail
      const newThumbnailPath = await saveThumbnailFile(id, updates.thumbnailBase64);

      // Atualizar thumbnail_path no banco
      updateFields.push(`thumbnail_path = $${updateValues.length + 1}`);
      updateValues.push(newThumbnailPath);

      // Limpar thumbnail_base64
      updateFields.push(`thumbnail_base64 = $${updateValues.length + 1}`);
      updateValues.push(null);
    }

    // Se thumbnailPath foi fornecido diretamente
    if (updates.thumbnailPath !== undefined && !updates.thumbnailBase64) {
      updateFields.push(`thumbnail_path = $${updateValues.length + 1}`);
      updateValues.push(updates.thumbnailPath);
    }

    if (updates.originalPath !== undefined) {
      updateFields.push(`original_path = $${updateValues.length + 1}`);
      updateValues.push(updates.originalPath);
    }

    if (updates.orderIndex !== undefined) {
      updateFields.push(`order_index = $${updateValues.length + 1}`);
      updateValues.push(updates.orderIndex);
    }

    // Always update updated_at
    updateFields.push(`updated_at = $${updateValues.length + 1}`);
    updateValues.push(updated_at);

    // Add id as the last parameter
    updateValues.push(id);

    const query = `UPDATE gallery_items SET ${updateFields.join(", ")} WHERE id = $${updateValues.length}`;

    await db.execute(query, updateValues);
  }, 'updateGalleryItem');
}

/**
 * Delete gallery item
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Get item to delete the files
    const item = await getGalleryItemById(id);
    if (item) {
      // Delete original image
      await deleteGalleryImageFile(item.originalPath);

      // Delete thumbnail file
      if (item.thumbnailPath) {
        await deleteThumbnailFile(item.thumbnailPath);
      }
    }

    // Delete from database (links will be deleted automatically via CASCADE)
    await db.execute("DELETE FROM gallery_items WHERE id = $1", [id]);
  }, 'deleteGalleryItem');
}

/**
 * Delete multiple gallery items
 */
export async function deleteGalleryItems(ids: string[]): Promise<void> {
  return safeDBOperation(async () => {
    for (const id of ids) {
      await deleteGalleryItem(id);
    }
  }, 'deleteGalleryItems');
}

// ========================================
// Link Operations
// ========================================

/**
 * Get gallery links for an item
 */
export async function getGalleryLinks(itemId: string): Promise<IGalleryLink[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBGalleryLink[]>(
      "SELECT * FROM gallery_links WHERE gallery_item_id = $1",
      [itemId]
    );

    return result.map(dbGalleryLinkToGalleryLink);
  }, 'getGalleryLinks');
}

/**
 * Add gallery link
 */
export async function addGalleryLink(
  itemId: string,
  link: IGalleryLink
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbLink = galleryLinkToDBGalleryLink(itemId, link);

    await db.execute(
      `INSERT INTO gallery_links (id, gallery_item_id, entity_id, entity_type, book_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dbLink.id,
        dbLink.gallery_item_id,
        dbLink.entity_id,
        dbLink.entity_type,
        dbLink.book_id,
        dbLink.created_at,
      ]
    );

    // Update item's updated_at
    await updateGalleryItem(itemId, {});
  }, 'addGalleryLink');
}

/**
 * Remove gallery link
 */
export async function removeGalleryLink(linkId: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Get the item ID to update its updated_at
    const link = await db.select<DBGalleryLink[]>(
      "SELECT gallery_item_id FROM gallery_links WHERE id = $1",
      [linkId]
    );

    await db.execute("DELETE FROM gallery_links WHERE id = $1", [linkId]);

    // Update item's updated_at
    if (link.length > 0) {
      await updateGalleryItem(link[0].gallery_item_id, {});
    }
  }, 'removeGalleryLink');
}

/**
 * Update gallery links (replace all links)
 */
export async function updateGalleryLinks(
  itemId: string,
  links: IGalleryLink[]
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Delete all existing links
    await db.execute("DELETE FROM gallery_links WHERE gallery_item_id = $1", [
      itemId,
    ]);

    // Insert new links
    for (const link of links) {
      const dbLink = galleryLinkToDBGalleryLink(itemId, link);
      await db.execute(
        `INSERT INTO gallery_links (id, gallery_item_id, entity_id, entity_type, book_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          dbLink.id,
          dbLink.gallery_item_id,
          dbLink.entity_id,
          dbLink.entity_type,
          dbLink.book_id,
          dbLink.created_at,
        ]
      );
    }

    // Update item's updated_at
    await updateGalleryItem(itemId, {});
  }, 'updateGalleryLinks');
}

// ========================================
// Ordering Operations
// ========================================

/**
 * Reorder gallery items
 */
export async function reorderGalleryItems(
  items: Array<{ id: string; orderIndex: number }>
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    for (const item of items) {
      await db.execute(
        "UPDATE gallery_items SET order_index = $1 WHERE id = $2",
        [item.orderIndex, item.id]
      );
    }
  }, 'reorderGalleryItems');
}

// ========================================
// Filter Operations
// ========================================

/**
 * Get gallery items by entity types
 */
export async function getGalleryItemsByEntityTypes(
  entityTypes: EntityType[]
): Promise<IGalleryItem[]> {
  return safeDBOperation(async () => {
    if (entityTypes.length === 0) {
      return getAllGalleryItems();
    }

    const db = await getDB();

    // Build placeholders for IN clause
    const placeholders = entityTypes
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const links = await db.select<DBGalleryLink[]>(
      `SELECT DISTINCT gallery_item_id FROM gallery_links WHERE entity_type IN (${placeholders})`,
      entityTypes
    );

    const itemIds = links.map((link) => link.gallery_item_id);

    if (itemIds.length === 0) {
      return [];
    }

    const items: IGalleryItem[] = [];

    for (const itemId of itemIds) {
      const item = await getGalleryItemById(itemId);
      if (item) {
        items.push(item);
      }
    }

    return items;
  }, 'getGalleryItemsByEntityTypes');
}
