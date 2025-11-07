import {
  IPowerSystem,
  IPowerGroup,
  IPowerPage,
  IPowerSection,
  IPowerBlock,
  BlockType,
  BlockContent,
} from "@/pages/dashboard/tabs/power-system/types/power-system-types";

import {
  DBPowerSystem,
  DBPowerGroup,
  DBPowerPage,
  DBPowerSection,
  DBPowerBlock,
} from "./types";

import { getDB } from "./index";

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

// Power System converters
function dbPowerSystemToPowerSystem(db: DBPowerSystem): IPowerSystem {
  return {
    id: db.id,
    bookId: db.book_id,
    name: db.name,
    iconImage: db.icon_image,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// Power Group converters
function dbPowerGroupToPowerGroup(db: DBPowerGroup): IPowerGroup {
  return {
    id: db.id,
    systemId: db.system_id,
    name: db.name,
    orderIndex: db.order_index,
    createdAt: db.created_at,
  };
}

// Power Page converters
function dbPowerPageToPowerPage(db: DBPowerPage): IPowerPage {
  return {
    id: db.id,
    systemId: db.system_id,
    groupId: db.group_id,
    name: db.name,
    orderIndex: db.order_index,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// Power Section converters
function dbPowerSectionToPowerSection(db: DBPowerSection): IPowerSection {
  return {
    id: db.id,
    pageId: db.page_id,
    title: db.title,
    orderIndex: db.order_index,
    collapsed: db.collapsed === 1,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// Power Block converters
function dbPowerBlockToPowerBlock(db: DBPowerBlock): IPowerBlock {
  return {
    id: db.id,
    sectionId: db.section_id,
    type: db.type as BlockType,
    orderIndex: db.order_index,
    content: JSON.parse(db.content_json) as BlockContent,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// ============================================================================
// POWER SYSTEM FUNCTIONS
// ============================================================================

export async function getPowerSystemsByBookId(
  bookId: string
): Promise<IPowerSystem[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerSystem[]>(
      "SELECT * FROM power_systems WHERE book_id = $1 ORDER BY created_at DESC",
      [bookId]
    );
    return result.map(dbPowerSystemToPowerSystem);
  } catch (error) {
    console.error("Error fetching power systems:", error);
    throw error;
  }
}

export async function getPowerSystemById(
  systemId: string
): Promise<IPowerSystem | null> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerSystem[]>(
      "SELECT * FROM power_systems WHERE id = $1",
      [systemId]
    );
    return result.length > 0 ? dbPowerSystemToPowerSystem(result[0]) : null;
  } catch (error) {
    console.error("Error fetching power system:", error);
    throw error;
  }
}

export async function createPowerSystem(
  bookId: string,
  name: string,
  iconImage?: string
): Promise<string> {
  try {
    const db = await getDB();
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.execute(
      `INSERT INTO power_systems (id, book_id, name, icon_image, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, bookId, name, iconImage || null, now, now]
    );

    return id;
  } catch (error) {
    console.error("Error creating power system:", error);
    throw error;
  }
}

export async function updatePowerSystem(
  systemId: string,
  name: string,
  iconImage?: string
): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    await db.execute(
      "UPDATE power_systems SET name = $1, icon_image = $2, updated_at = $3 WHERE id = $4",
      [name, iconImage || null, now, systemId]
    );
  } catch (error) {
    console.error("Error updating power system:", error);
    throw error;
  }
}

export async function deletePowerSystem(systemId: string): Promise<void> {
  try {
    const db = await getDB();

    // Delete all related data (cascade)
    // First get all groups
    const groups = await db.select<DBPowerGroup[]>(
      "SELECT id FROM power_groups WHERE system_id = $1",
      [systemId]
    );

    // Get all pages
    const pages = await db.select<DBPowerPage[]>(
      "SELECT id FROM power_pages WHERE system_id = $1",
      [systemId]
    );

    // For each page, get sections and delete blocks
    for (const page of pages) {
      const sections = await db.select<DBPowerSection[]>(
        "SELECT id FROM power_sections WHERE page_id = $1",
        [page.id]
      );

      for (const section of sections) {
        await db.execute("DELETE FROM power_blocks WHERE section_id = $1", [
          section.id,
        ]);
      }

      await db.execute("DELETE FROM power_sections WHERE page_id = $1", [
        page.id,
      ]);
    }

    // Delete pages
    await db.execute("DELETE FROM power_pages WHERE system_id = $1", [
      systemId,
    ]);

    // Delete groups
    await db.execute("DELETE FROM power_groups WHERE system_id = $1", [
      systemId,
    ]);

    // Finally delete the system
    await db.execute("DELETE FROM power_systems WHERE id = $1", [systemId]);
  } catch (error) {
    console.error("Error deleting power system:", error);
    throw error;
  }
}

// ============================================================================
// POWER GROUP FUNCTIONS
// ============================================================================

export async function getPowerGroupsBySystemId(
  systemId: string
): Promise<IPowerGroup[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerGroup[]>(
      "SELECT * FROM power_groups WHERE system_id = $1 ORDER BY order_index ASC",
      [systemId]
    );
    return result.map(dbPowerGroupToPowerGroup);
  } catch (error) {
    console.error("Error fetching power groups:", error);
    throw error;
  }
}

export async function createPowerGroup(
  systemId: string,
  name: string,
  orderIndex: number
): Promise<string> {
  try {
    const db = await getDB();
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.execute(
      `INSERT INTO power_groups (id, system_id, name, order_index, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, systemId, name, orderIndex, now]
    );

    return id;
  } catch (error) {
    console.error("Error creating power group:", error);
    throw error;
  }
}

export async function updatePowerGroup(
  groupId: string,
  name: string
): Promise<void> {
  try {
    const db = await getDB();

    await db.execute("UPDATE power_groups SET name = $1 WHERE id = $2", [
      name,
      groupId,
    ]);
  } catch (error) {
    console.error("Error updating power group:", error);
    throw error;
  }
}

export async function deletePowerGroup(groupId: string): Promise<void> {
  try {
    const db = await getDB();

    // Set all pages in this group to ungrouped (null group_id)
    await db.execute(
      "UPDATE power_pages SET group_id = NULL WHERE group_id = $1",
      [groupId]
    );

    // Delete the group
    await db.execute("DELETE FROM power_groups WHERE id = $1", [groupId]);
  } catch (error) {
    console.error("Error deleting power group:", error);
    throw error;
  }
}

export async function reorderPowerGroups(groupIds: string[]): Promise<void> {
  try {
    const db = await getDB();

    // Update each group's order_index based on its position in the array
    for (let i = 0; i < groupIds.length; i++) {
      await db.execute(
        "UPDATE power_groups SET order_index = $1 WHERE id = $2",
        [i, groupIds[i]]
      );
    }
  } catch (error) {
    console.error("Error reordering power groups:", error);
    throw error;
  }
}

// ============================================================================
// POWER PAGE FUNCTIONS
// ============================================================================

export async function getPowerPagesBySystemId(
  systemId: string
): Promise<IPowerPage[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerPage[]>(
      "SELECT * FROM power_pages WHERE system_id = $1 ORDER BY order_index ASC",
      [systemId]
    );
    return result.map(dbPowerPageToPowerPage);
  } catch (error) {
    console.error("Error fetching power pages:", error);
    throw error;
  }
}

export async function getPowerPageById(
  pageId: string
): Promise<IPowerPage | null> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerPage[]>(
      "SELECT * FROM power_pages WHERE id = $1",
      [pageId]
    );
    return result.length > 0 ? dbPowerPageToPowerPage(result[0]) : null;
  } catch (error) {
    console.error("Error fetching power page:", error);
    throw error;
  }
}

export async function createPowerPage(
  systemId: string,
  name: string,
  groupId: string | undefined,
  orderIndex: number
): Promise<string> {
  try {
    const db = await getDB();
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.execute(
      `INSERT INTO power_pages (id, system_id, group_id, name, order_index, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, systemId, groupId || null, name, orderIndex, now, now]
    );

    return id;
  } catch (error) {
    console.error("Error creating power page:", error);
    throw error;
  }
}

export async function updatePowerPage(
  pageId: string,
  name: string
): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    await db.execute(
      "UPDATE power_pages SET name = $1, updated_at = $2 WHERE id = $3",
      [name, now, pageId]
    );
  } catch (error) {
    console.error("Error updating power page:", error);
    throw error;
  }
}

export async function movePowerPage(
  pageId: string,
  newGroupId: string | undefined
): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    await db.execute(
      "UPDATE power_pages SET group_id = $1, updated_at = $2 WHERE id = $3",
      [newGroupId || null, now, pageId]
    );
  } catch (error) {
    console.error("Error moving power page:", error);
    throw error;
  }
}

export async function deletePowerPage(pageId: string): Promise<void> {
  try {
    const db = await getDB();

    // Get all sections for this page
    const sections = await db.select<DBPowerSection[]>(
      "SELECT id FROM power_sections WHERE page_id = $1",
      [pageId]
    );

    // Delete all blocks for each section
    for (const section of sections) {
      await db.execute("DELETE FROM power_blocks WHERE section_id = $1", [
        section.id,
      ]);
    }

    // Delete all sections
    await db.execute("DELETE FROM power_sections WHERE page_id = $1", [pageId]);

    // Delete the page
    await db.execute("DELETE FROM power_pages WHERE id = $1", [pageId]);
  } catch (error) {
    console.error("Error deleting power page:", error);
    throw error;
  }
}

export async function reorderPowerPages(pageIds: string[]): Promise<void> {
  try {
    const db = await getDB();

    // Update each page's order_index based on its position in the array
    for (let i = 0; i < pageIds.length; i++) {
      await db.execute(
        "UPDATE power_pages SET order_index = $1 WHERE id = $2",
        [i, pageIds[i]]
      );
    }
  } catch (error) {
    console.error("Error reordering power pages:", error);
    throw error;
  }
}

export async function duplicatePowerPage(pageId: string): Promise<string> {
  try {
    const db = await getDB();

    // 1. Get the original page
    const originalPage = await getPowerPageById(pageId);
    if (!originalPage) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    // 2. Get all pages in the same context (same group or ungrouped)
    const allPages = await db.select<DBPowerPage[]>(
      originalPage.groupId
        ? "SELECT * FROM power_pages WHERE system_id = $1 AND group_id = $2 ORDER BY order_index ASC"
        : "SELECT * FROM power_pages WHERE system_id = $1 AND group_id IS NULL ORDER BY order_index ASC",
      originalPage.groupId
        ? [originalPage.systemId, originalPage.groupId]
        : [originalPage.systemId]
    );

    // 3. Generate unique name with copy number
    const baseName = originalPage.name;
    let copyNumber = 1;
    let newName = `${baseName} (${copyNumber})`;

    // Check if name already exists and increment
    const existingNames = new Set(allPages.map((p) => p.name));
    while (existingNames.has(newName)) {
      copyNumber++;
      newName = `${baseName} (${copyNumber})`;
    }

    // 4. Create new page with orderIndex right after original
    const newPageId = crypto.randomUUID();
    const now = Date.now();
    const newOrderIndex = originalPage.orderIndex + 1;

    await db.execute(
      `INSERT INTO power_pages (id, system_id, group_id, name, order_index, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        newPageId,
        originalPage.systemId,
        originalPage.groupId || null,
        newName,
        newOrderIndex,
        now,
        now,
      ]
    );

    // 5. Update order_index of pages that come after the original
    await db.execute(
      originalPage.groupId
        ? `UPDATE power_pages
           SET order_index = order_index + 1
           WHERE system_id = $1 AND group_id = $2 AND order_index > $3 AND id != $4`
        : `UPDATE power_pages
           SET order_index = order_index + 1
           WHERE system_id = $1 AND group_id IS NULL AND order_index > $2 AND id != $3`,
      originalPage.groupId
        ? [originalPage.systemId, originalPage.groupId, originalPage.orderIndex, newPageId]
        : [originalPage.systemId, originalPage.orderIndex, newPageId]
    );

    // 6. Get all sections from the original page
    const originalSections = await getPowerSectionsByPageId(pageId);

    // 7. Copy sections and blocks
    for (const originalSection of originalSections) {
      const newSectionId = crypto.randomUUID();

      // Create new section
      await db.execute(
        `INSERT INTO power_sections (id, page_id, title, order_index, collapsed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newSectionId,
          newPageId,
          originalSection.title,
          originalSection.orderIndex,
          originalSection.collapsed ? 1 : 0,
          now,
          now,
        ]
      );

      // Get all blocks from the original section
      const originalBlocks = await getPowerBlocksBySectionId(originalSection.id);

      // Copy blocks
      for (const originalBlock of originalBlocks) {
        const newBlockId = crypto.randomUUID();

        await db.execute(
          `INSERT INTO power_blocks (id, section_id, type, order_index, content_json, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            newBlockId,
            newSectionId,
            originalBlock.type,
            originalBlock.orderIndex,
            JSON.stringify(originalBlock.content),
            now,
            now,
          ]
        );
      }
    }

    return newPageId;
  } catch (error) {
    console.error("Error duplicating power page:", error);
    throw error;
  }
}

// ============================================================================
// POWER SECTION FUNCTIONS
// ============================================================================

export async function getPowerSectionsByPageId(
  pageId: string
): Promise<IPowerSection[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerSection[]>(
      "SELECT * FROM power_sections WHERE page_id = $1 ORDER BY order_index ASC",
      [pageId]
    );
    return result.map(dbPowerSectionToPowerSection);
  } catch (error) {
    console.error("Error fetching power sections:", error);
    throw error;
  }
}

export async function createPowerSection(
  pageId: string,
  title: string,
  orderIndex: number
): Promise<string> {
  try {
    const db = await getDB();
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.execute(
      `INSERT INTO power_sections (id, page_id, title, order_index, collapsed, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, pageId, title, orderIndex, 0, now, now]
    );

    return id;
  } catch (error) {
    console.error("Error creating power section:", error);
    throw error;
  }
}

export async function updatePowerSection(
  sectionId: string,
  title: string
): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    await db.execute(
      "UPDATE power_sections SET title = $1, updated_at = $2 WHERE id = $3",
      [title, now, sectionId]
    );
  } catch (error) {
    console.error("Error updating power section:", error);
    throw error;
  }
}

export async function toggleSectionCollapse(
  sectionId: string,
  collapsed: boolean
): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    await db.execute(
      "UPDATE power_sections SET collapsed = $1, updated_at = $2 WHERE id = $3",
      [collapsed ? 1 : 0, now, sectionId]
    );
  } catch (error) {
    console.error("Error toggling section collapse:", error);
    throw error;
  }
}

export async function deletePowerSection(sectionId: string): Promise<void> {
  try {
    const db = await getDB();

    // Delete all blocks in this section
    await db.execute("DELETE FROM power_blocks WHERE section_id = $1", [
      sectionId,
    ]);

    // Delete the section
    await db.execute("DELETE FROM power_sections WHERE id = $1", [sectionId]);
  } catch (error) {
    console.error("Error deleting power section:", error);
    throw error;
  }
}

export async function reorderPowerSections(
  sectionIds: string[]
): Promise<void> {
  try {
    const db = await getDB();

    // Update each section's order_index based on its position in the array
    for (let i = 0; i < sectionIds.length; i++) {
      await db.execute(
        "UPDATE power_sections SET order_index = $1 WHERE id = $2",
        [i, sectionIds[i]]
      );
    }
  } catch (error) {
    console.error("Error reordering power sections:", error);
    throw error;
  }
}

// ============================================================================
// POWER BLOCK FUNCTIONS
// ============================================================================

export async function getPowerBlocksBySectionId(
  sectionId: string
): Promise<IPowerBlock[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerBlock[]>(
      "SELECT * FROM power_blocks WHERE section_id = $1 ORDER BY order_index ASC",
      [sectionId]
    );
    return result.map(dbPowerBlockToPowerBlock);
  } catch (error) {
    console.error("Error fetching power blocks:", error);
    throw error;
  }
}

export async function createPowerBlock(
  sectionId: string,
  type: BlockType,
  content: BlockContent,
  orderIndex: number
): Promise<string> {
  try {
    const db = await getDB();
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.execute(
      `INSERT INTO power_blocks (id, section_id, type, order_index, content_json, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, sectionId, type, orderIndex, JSON.stringify(content), now, now]
    );

    return id;
  } catch (error) {
    console.error("Error creating power block:", error);
    throw error;
  }
}

export async function updatePowerBlock(
  blockId: string,
  content: BlockContent
): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    await db.execute(
      "UPDATE power_blocks SET content_json = $1, updated_at = $2 WHERE id = $3",
      [JSON.stringify(content), now, blockId]
    );
  } catch (error) {
    console.error("Error updating power block:", error);
    throw error;
  }
}

export async function deletePowerBlock(blockId: string): Promise<void> {
  try {
    const db = await getDB();

    await db.execute("DELETE FROM power_blocks WHERE id = $1", [blockId]);
  } catch (error) {
    console.error("Error deleting power block:", error);
    throw error;
  }
}

export async function reorderPowerBlocks(blockIds: string[]): Promise<void> {
  try {
    const db = await getDB();

    // Update each block's order_index based on its position in the array
    for (let i = 0; i < blockIds.length; i++) {
      await db.execute(
        "UPDATE power_blocks SET order_index = $1 WHERE id = $2",
        [i, blockIds[i]]
      );
    }
  } catch (error) {
    console.error("Error reordering power blocks:", error);
    throw error;
  }
}
