import {
  cleanCommonEntityReferences,
  removeFromJSONArray,
  removeFromNestedJSONArray,
} from "./cleanup-helpers";
import { safeDBOperation } from "./safe-db-operation";
import {
  safeParseStringArray,
  safeParseUnknownObject,
} from "./safe-json-parse";
import { DBItem } from "./types";

import { getDB } from "./index";

export interface IItemUIState {
  advancedSectionOpen?: boolean;
  sectionVisibility?: {
    "chapter-metrics"?: boolean;
  };
  extraSectionsOpenState?: Record<string, boolean>;
}

export interface IItem {
  id: string;
  bookId: string;
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

  // UI State (legacy - to be migrated to uiState)
  sectionVisibility?: Record<string, boolean>;

  // UI State (for persisting UI preferences)
  uiState?: IItemUIState;

  createdAt?: string;
  updatedAt?: string;
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
    section_visibility: item.sectionVisibility
      ? JSON.stringify(item.sectionVisibility)
      : undefined,
    ui_state: item.uiState ? JSON.stringify(item.uiState) : undefined,
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
    bookId: dbItem.book_id,
    name: dbItem.name,
    status: dbItem.status,
    category: dbItem.category,
    customCategory: dbItem.custom_category,
    basicDescription: dbItem.basic_description,
    image: dbItem.image,
    appearance: dbItem.appearance,
    origin: dbItem.origin,
    alternativeNames: safeParseStringArray(dbItem.alternative_names),
    storyRarity: dbItem.story_rarity,
    narrativePurpose: dbItem.narrative_purpose,
    usageRequirements: dbItem.usage_requirements,
    usageConsequences: dbItem.usage_consequences,
    itemUsage: dbItem.item_usage,
    sectionVisibility: dbItem.section_visibility
      ? safeParseUnknownObject(dbItem.section_visibility)
      : undefined,
    uiState: dbItem.ui_state ? safeParseUnknownObject(dbItem.ui_state) : undefined,
    createdAt: new Date(dbItem.created_at).toISOString(),
    updatedAt: new Date(dbItem.updated_at).toISOString(),
  };
}

export async function getItemsByBookId(bookId: string): Promise<IItem[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBItem[]>(
      "SELECT * FROM items WHERE book_id = $1 ORDER BY created_at DESC",
      [bookId]
    );
    return result.map(dbItemToItem);
  }, "getItemsByBookId");
}

export async function getItemById(id: string): Promise<IItem | null> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBItem[]>(
      "SELECT * FROM items WHERE id = $1",
      [id]
    );
    return result.length > 0 ? dbItemToItem(result[0]) : null;
  }, "getItemById");
}

export async function createItem(bookId: string, item: IItem): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbItem = itemToDBItem(bookId, item);

    await db.execute(
      `INSERT INTO items (
        id, book_id, name, status, category, custom_category, basic_description, image,
        appearance, origin, alternative_names, story_rarity, narrative_purpose,
        usage_requirements, usage_consequences, item_usage, section_visibility, ui_state,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
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
        dbItem.section_visibility,
        dbItem.ui_state,
        dbItem.created_at,
        dbItem.updated_at,
      ]
    );
  }, "createItem");
}

export async function updateItem(
  id: string,
  updates: Partial<IItem>
): Promise<void> {
  return safeDBOperation(async () => {
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
        section_visibility = $15, ui_state = $16, updated_at = $17
      WHERE id = $18`,
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
        dbItem.section_visibility,
        dbItem.ui_state,
        dbItem.updated_at,
        id,
      ]
    );
  }, "updateItem");
}

export async function deleteItem(id: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // 1. Clean common entity references (mentions, gallery, notes)
    await cleanCommonEntityReferences(id, "item");

    // 2. Remove from plot_arcs.important_items
    await removeFromJSONArray("plot_arcs", "important_items", id);

    // 3. Remove from factions.timeline[].events[].itemsInvolved
    await removeFromNestedJSONArray("factions", "timeline", id, [
      "timeline",
      "*",
      "events",
      "*",
      "itemsInvolved",
    ]);

    // 4. Finally, delete the item (CASCADE will handle versions)
    await db.execute("DELETE FROM items WHERE id = $1", [id]);
  }, "deleteItem");
}
