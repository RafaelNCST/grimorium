import { DBItem, DBItemVersion } from "./types";

import { getDB } from "./index";

export interface IItem {
  id: string;
  name: string;
  status?: string;
  category?: string;
  customCategory?: string;
  basicDescription?: string;
  image?: string;

  appearance?: string;
  origin?: string;
  alternativeNames?: string[];
  storyRarity?: string;
  narrativePurpose?: string;
  usageRequirements?: string;
  usageConsequences?: string;
  itemUsage?: string;

  fieldVisibility?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export interface IItemVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isMain: boolean;
  itemData: IItem;
}

function itemToDBItem(bookId: string, item: IItem): DBItem {
  return {
    id: item.id,
    book_id: bookId,
    name: item.name,
    status: item.status,
    category: item.category,
    custom_category: item.customCategory,
    basic_description: item.basicDescription,
    image: item.image,
    appearance: item.appearance,
    origin: item.origin,
    alternative_names: item.alternativeNames
      ? JSON.stringify(item.alternativeNames)
      : undefined,
    story_rarity: item.storyRarity,
    narrative_purpose: item.narrativePurpose,
    usage_requirements: item.usageRequirements,
    usage_consequences: item.usageConsequences,
    item_usage: item.itemUsage,
    field_visibility: item.fieldVisibility
      ? JSON.stringify(item.fieldVisibility)
      : undefined,
    created_at: item.createdAt
      ? new Date(item.createdAt).getTime()
      : Date.now(),
    updated_at: item.updatedAt
      ? new Date(item.updatedAt).getTime()
      : Date.now(),
  };
}

function dbItemToItem(dbItem: DBItem): IItem {
  return {
    id: dbItem.id,
    name: dbItem.name,
    status: dbItem.status,
    category: dbItem.category,
    customCategory: dbItem.custom_category,
    basicDescription: dbItem.basic_description,
    image: dbItem.image,
    appearance: dbItem.appearance,
    origin: dbItem.origin,
    alternativeNames: dbItem.alternative_names
      ? JSON.parse(dbItem.alternative_names)
      : [],
    storyRarity: dbItem.story_rarity,
    narrativePurpose: dbItem.narrative_purpose,
    usageRequirements: dbItem.usage_requirements,
    usageConsequences: dbItem.usage_consequences,
    itemUsage: dbItem.item_usage,
    fieldVisibility: dbItem.field_visibility
      ? JSON.parse(dbItem.field_visibility)
      : {},
    createdAt: new Date(dbItem.created_at).toISOString(),
    updatedAt: new Date(dbItem.updated_at).toISOString(),
  };
}

export async function getItemsByBookId(bookId: string): Promise<IItem[]> {
  const db = await getDB();
  const result = await db.select<DBItem[]>(
    "SELECT * FROM items WHERE book_id = $1 ORDER BY created_at DESC",
    [bookId]
  );
  return result.map(dbItemToItem);
}

export async function getItemById(id: string): Promise<IItem | null> {
  const db = await getDB();
  const result = await db.select<DBItem[]>(
    "SELECT * FROM items WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbItemToItem(result[0]) : null;
}

export async function createItem(bookId: string, item: IItem): Promise<void> {
  const db = await getDB();
  const dbItem = itemToDBItem(bookId, item);

  await db.execute(
    `INSERT INTO items (
      id, book_id, name, status, category, custom_category, basic_description, image,
      appearance, origin, alternative_names, story_rarity, narrative_purpose,
      usage_requirements, usage_consequences, item_usage, field_visibility, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    )`,
    [
      dbItem.id,
      dbItem.book_id,
      dbItem.name,
      dbItem.status,
      dbItem.category,
      dbItem.custom_category,
      dbItem.basic_description,
      dbItem.image,
      dbItem.appearance,
      dbItem.origin,
      dbItem.alternative_names,
      dbItem.story_rarity,
      dbItem.narrative_purpose,
      dbItem.usage_requirements,
      dbItem.usage_consequences,
      dbItem.item_usage,
      dbItem.field_visibility,
      dbItem.created_at,
      dbItem.updated_at,
    ]
  );
}

export async function updateItem(
  id: string,
  updates: Partial<IItem>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Get current item to preserve existing data
  const current = await db.select<DBItem[]>(
    "SELECT * FROM items WHERE id = $1",
    [id]
  );

  if (current.length === 0) {
    throw new Error("Item not found");
  }

  // Convert current DB item to IItem to preserve existing values
  const currentItem = dbItemToItem(current[0]);

  // Merge updates with current item, preserving existing values
  const fullItem: IItem = {
    ...currentItem,
    ...updates,
    id, // Ensure ID is preserved
  };

  const dbItem = itemToDBItem(current[0].book_id, fullItem);
  dbItem.updated_at = now;

  await db.execute(
    `UPDATE items SET
      name = $1, status = $2, category = $3, custom_category = $4,
      basic_description = $5, image = $6, appearance = $7, origin = $8,
      alternative_names = $9, story_rarity = $10, narrative_purpose = $11,
      usage_requirements = $12, usage_consequences = $13, item_usage = $14,
      field_visibility = $15, updated_at = $16
    WHERE id = $17`,
    [
      dbItem.name,
      dbItem.status,
      dbItem.category,
      dbItem.custom_category,
      dbItem.basic_description,
      dbItem.image,
      dbItem.appearance,
      dbItem.origin,
      dbItem.alternative_names,
      dbItem.story_rarity,
      dbItem.narrative_purpose,
      dbItem.usage_requirements,
      dbItem.usage_consequences,
      dbItem.item_usage,
      dbItem.field_visibility,
      dbItem.updated_at,
      id,
    ]
  );
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM items WHERE id = $1", [id]);
}

export async function getItemVersions(itemId: string): Promise<IItemVersion[]> {
  const db = await getDB();
  const result = await db.select<DBItemVersion[]>(
    "SELECT * FROM item_versions WHERE item_id = $1 ORDER BY created_at DESC",
    [itemId]
  );

  return result.map((v) => ({
    id: v.id,
    name: v.name,
    description: v.description,
    createdAt: new Date(v.created_at).toISOString(),
    isMain: v.is_main === 1,
    itemData: v.item_data ? JSON.parse(v.item_data) : ({} as IItem),
  }));
}

export async function createItemVersion(
  itemId: string,
  version: IItemVersion
): Promise<void> {
  const db = await getDB();

  await db.execute(
    `INSERT INTO item_versions (
      id, item_id, name, description, is_main, item_data, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      version.id,
      itemId,
      version.name,
      version.description,
      version.isMain ? 1 : 0,
      JSON.stringify(version.itemData),
      Date.now(),
    ]
  );
}

export async function deleteItemVersion(versionId: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM item_versions WHERE id = $1", [versionId]);
}

export async function updateItemVersion(
  versionId: string,
  name: string,
  description?: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "UPDATE item_versions SET name = $1, description = $2 WHERE id = $3",
    [name, description, versionId]
  );
}

export async function updateItemVersionData(
  versionId: string,
  itemData: IItem
): Promise<void> {
  const db = await getDB();
  await db.execute("UPDATE item_versions SET item_data = $1 WHERE id = $2", [
    JSON.stringify(itemData),
    versionId,
  ]);
}
