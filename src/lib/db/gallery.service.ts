import {
  mkdir,
  copyFile,
  exists,
  remove,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

import {
  EntityType,
  IGalleryItem,
  IGalleryLink,
} from "@/types/gallery-types";

import { DBGalleryItem, DBGalleryLink } from "./types";
import { getDB } from "./index";
import { GALLERY_DIRECTORY } from "@/pages/gallery/constants/gallery-constants";

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
    thumbnail_base64: item.thumbnailBase64,
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
    thumbnailBase64: dbItem.thumbnail_base64,
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
  try {
    const directoryExists = await exists(GALLERY_DIRECTORY, {
      baseDir: BaseDirectory.AppData,
    });

    if (!directoryExists) {
      await mkdir(GALLERY_DIRECTORY, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }
  } catch (error) {
    console.error("Error ensuring gallery directory:", error);
    throw error;
  }
}

/**
 * Delete image file from file system
 * @param originalPath - Relative path to the image file
 */
export async function deleteGalleryImageFile(
  originalPath: string
): Promise<void> {
  try {
    const fileExists = await exists(originalPath, {
      baseDir: BaseDirectory.AppData,
    });

    if (fileExists) {
      await remove(originalPath, {
        baseDir: BaseDirectory.AppData,
      });
    }
  } catch (error) {
    console.error("Error deleting gallery image file:", error);
    // Don't throw - continue even if file deletion fails
  }
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
  try {
    await ensureGalleryDirectory();
    await copyFile(sourceFilePath, destinationPath, {
      toPathBaseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    console.error("Error copying image to gallery:", error);
    throw error;
  }
}

// ========================================
// CRUD Operations
// ========================================

/**
 * Get all gallery items
 */
export async function getAllGalleryItems(): Promise<IGalleryItem[]> {
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
}

/**
 * Get gallery items by book ID
 */
export async function getGalleryItemsByBookId(
  bookId: string
): Promise<IGalleryItem[]> {
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
}

/**
 * Get gallery item by ID
 */
export async function getGalleryItemById(
  id: string
): Promise<IGalleryItem | null> {
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
}

/**
 * Create gallery item
 */
export async function createGalleryItem(item: IGalleryItem): Promise<void> {
  const db = await getDB();
  const dbItem = galleryItemToDBGalleryItem(item);

  await db.execute(
    `INSERT INTO gallery_items (
      id, book_id, title, description, thumbnail_base64, original_path,
      original_filename, file_size, width, height, mime_type, order_index,
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      dbItem.id,
      dbItem.book_id,
      dbItem.title,
      dbItem.description,
      dbItem.thumbnail_base64,
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
}

/**
 * Update gallery item
 */
export async function updateGalleryItem(
  id: string,
  updates: Partial<Omit<IGalleryItem, "id" | "createdAt" | "links">>
): Promise<void> {
  const db = await getDB();
  const updated_at = Date.now();

  const updateFields: string[] = [];
  const updateValues: unknown[] = [];

  if (updates.title !== undefined) {
    updateFields.push("title = $" + (updateValues.length + 1));
    updateValues.push(updates.title);
  }

  if (updates.description !== undefined) {
    updateFields.push("description = $" + (updateValues.length + 1));
    updateValues.push(updates.description);
  }

  if (updates.thumbnailBase64 !== undefined) {
    updateFields.push("thumbnail_base64 = $" + (updateValues.length + 1));
    updateValues.push(updates.thumbnailBase64);
  }

  if (updates.originalPath !== undefined) {
    updateFields.push("original_path = $" + (updateValues.length + 1));
    updateValues.push(updates.originalPath);
  }

  if (updates.orderIndex !== undefined) {
    updateFields.push("order_index = $" + (updateValues.length + 1));
    updateValues.push(updates.orderIndex);
  }

  // Always update updated_at
  updateFields.push("updated_at = $" + (updateValues.length + 1));
  updateValues.push(updated_at);

  // Add id as the last parameter
  updateValues.push(id);

  const query = `UPDATE gallery_items SET ${updateFields.join(", ")} WHERE id = $${updateValues.length}`;

  await db.execute(query, updateValues);
}

/**
 * Delete gallery item
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  const db = await getDB();

  // Get item to delete the file
  const item = await getGalleryItemById(id);
  if (item) {
    await deleteGalleryImageFile(item.originalPath);
  }

  // Delete from database (links will be deleted automatically via CASCADE)
  await db.execute("DELETE FROM gallery_items WHERE id = $1", [id]);
}

/**
 * Delete multiple gallery items
 */
export async function deleteGalleryItems(ids: string[]): Promise<void> {
  for (const id of ids) {
    await deleteGalleryItem(id);
  }
}

// ========================================
// Link Operations
// ========================================

/**
 * Get gallery links for an item
 */
export async function getGalleryLinks(
  itemId: string
): Promise<IGalleryLink[]> {
  const db = await getDB();
  const result = await db.select<DBGalleryLink[]>(
    "SELECT * FROM gallery_links WHERE gallery_item_id = $1",
    [itemId]
  );

  return result.map(dbGalleryLinkToGalleryLink);
}

/**
 * Add gallery link
 */
export async function addGalleryLink(
  itemId: string,
  link: IGalleryLink
): Promise<void> {
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
}

/**
 * Remove gallery link
 */
export async function removeGalleryLink(linkId: string): Promise<void> {
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
}

/**
 * Update gallery links (replace all links)
 */
export async function updateGalleryLinks(
  itemId: string,
  links: IGalleryLink[]
): Promise<void> {
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
  const db = await getDB();

  for (const item of items) {
    await db.execute(
      "UPDATE gallery_items SET order_index = $1 WHERE id = $2",
      [item.orderIndex, item.id]
    );
  }
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
  if (entityTypes.length === 0) {
    return getAllGalleryItems();
  }

  const db = await getDB();

  // Build placeholders for IN clause
  const placeholders = entityTypes.map((_, index) => `$${index + 1}`).join(", ");

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
}
