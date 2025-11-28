import {
  IPowerSystem,
  IPowerGroup,
  IPowerPage,
  IPowerSection,
  IPowerBlock,
  IPowerCharacterLink,
  BlockType,
  BlockContent,
} from "@/pages/dashboard/tabs/power-system/types/power-system-types";

import {
  DBPowerSystem,
  DBPowerGroup,
  DBPowerPage,
  DBPowerSection,
  DBPowerBlock,
  DBPowerCharacterLink,
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

// Power Character Link converters
function dbPowerCharacterLinkToPowerCharacterLink(
  db: DBPowerCharacterLink
): IPowerCharacterLink {
  return {
    id: db.id,
    characterId: db.character_id,
    pageId: db.page_id,
    sectionId: db.section_id,
    customLabel: db.custom_label,
    createdAt: new Date(db.created_at).toISOString(),
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
        ? [
            originalPage.systemId,
            originalPage.groupId,
            originalPage.orderIndex,
            newPageId,
          ]
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
      const originalBlocks = await getPowerBlocksBySectionId(
        originalSection.id
      );

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

export async function getPowerSectionById(
  sectionId: string
): Promise<IPowerSection | null> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerSection[]>(
      "SELECT * FROM power_sections WHERE id = $1",
      [sectionId]
    );
    return result.length > 0 ? dbPowerSectionToPowerSection(result[0]) : null;
  } catch (error) {
    console.error("Error fetching power section:", error);
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

// ============================================================================
// POWER CHARACTER LINK FUNCTIONS
// ============================================================================

export async function getPowerLinksByCharacterId(
  characterId: string
): Promise<IPowerCharacterLink[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerCharacterLink[]>(
      "SELECT * FROM power_character_links WHERE character_id = $1 ORDER BY created_at DESC",
      [characterId]
    );
    return result.map(dbPowerCharacterLinkToPowerCharacterLink);
  } catch (error) {
    console.error("Error fetching power links by character:", error);
    throw error;
  }
}

/**
 * Get power links for a character with their associated page/section titles.
 * This function uses a single query with JOINs to avoid N+1 query problems.
 *
 * @param characterId - The ID of the character
 * @returns Array of power links with pageTitle and sectionTitle fields
 */
export async function getPowerLinksWithTitlesByCharacterId(
  characterId: string
): Promise<
  Array<IPowerCharacterLink & { pageTitle?: string; sectionTitle?: string }>
> {
  try {
    const db = await getDB();

    // Single query with LEFT JOINs to get all data at once
    const result = await db.select<
      Array<
        DBPowerCharacterLink & {
          page_name?: string;
          section_title?: string;
        }
      >
    >(
      `SELECT
        pcl.id,
        pcl.character_id,
        pcl.page_id,
        pcl.section_id,
        pcl.custom_label,
        pcl.created_at,
        pp.name as page_name,
        ps.title as section_title
      FROM power_character_links pcl
      LEFT JOIN power_pages pp ON pcl.page_id = pp.id
      LEFT JOIN power_sections ps ON pcl.section_id = ps.id
      WHERE pcl.character_id = $1
      ORDER BY pcl.created_at DESC`,
      [characterId]
    );

    // Transform to the expected format
    return result.map((row) => ({
      id: row.id,
      characterId: row.character_id,
      pageId: row.page_id,
      sectionId: row.section_id,
      customLabel: row.custom_label,
      createdAt: new Date(row.created_at).toISOString(),
      pageTitle: row.page_name,
      sectionTitle: row.section_title,
    }));
  } catch (error) {
    console.error(
      "Error fetching power links with titles by character:",
      error
    );
    throw error;
  }
}

export async function getPowerLinksByPageId(
  pageId: string
): Promise<IPowerCharacterLink[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerCharacterLink[]>(
      "SELECT * FROM power_character_links WHERE page_id = $1 ORDER BY created_at DESC",
      [pageId]
    );
    return result.map(dbPowerCharacterLinkToPowerCharacterLink);
  } catch (error) {
    console.error("Error fetching power links by page:", error);
    throw error;
  }
}

export async function getPowerLinksBySectionId(
  sectionId: string
): Promise<IPowerCharacterLink[]> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerCharacterLink[]>(
      "SELECT * FROM power_character_links WHERE section_id = $1 ORDER BY created_at DESC",
      [sectionId]
    );
    return result.map(dbPowerCharacterLinkToPowerCharacterLink);
  } catch (error) {
    console.error("Error fetching power links by section:", error);
    throw error;
  }
}

export async function createPowerCharacterLink(
  characterId: string,
  pageId?: string,
  sectionId?: string,
  customLabel?: string
): Promise<string> {
  try {
    const db = await getDB();
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.execute(
      `INSERT INTO power_character_links (id, character_id, page_id, section_id, custom_label, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        characterId,
        pageId || null,
        sectionId || null,
        customLabel || null,
        now,
      ]
    );

    return id;
  } catch (error) {
    console.error("Error creating power character link:", error);
    throw error;
  }
}

export async function updatePowerCharacterLinkLabel(
  linkId: string,
  customLabel: string
): Promise<void> {
  try {
    const db = await getDB();

    await db.execute(
      "UPDATE power_character_links SET custom_label = $1 WHERE id = $2",
      [customLabel || null, linkId]
    );
  } catch (error) {
    console.error("Error updating power character link label:", error);
    throw error;
  }
}

export async function deletePowerCharacterLink(linkId: string): Promise<void> {
  try {
    const db = await getDB();

    await db.execute("DELETE FROM power_character_links WHERE id = $1", [
      linkId,
    ]);
  } catch (error) {
    console.error("Error deleting power character link:", error);
    throw error;
  }
}

export async function getPowerLinkById(
  linkId: string
): Promise<IPowerCharacterLink | null> {
  try {
    const db = await getDB();
    const result = await db.select<DBPowerCharacterLink[]>(
      "SELECT * FROM power_character_links WHERE id = $1",
      [linkId]
    );
    return result.length > 0
      ? dbPowerCharacterLinkToPowerCharacterLink(result[0])
      : null;
  } catch (error) {
    console.error("Error fetching power link by ID:", error);
    throw error;
  }
}

export async function checkPowerLinkExists(
  characterId: string,
  pageId?: string,
  sectionId?: string
): Promise<boolean> {
  try {
    const db = await getDB();

    if (pageId) {
      const result = await db.select<DBPowerCharacterLink[]>(
        "SELECT * FROM power_character_links WHERE character_id = $1 AND page_id = $2",
        [characterId, pageId]
      );
      return result.length > 0;
    } else if (sectionId) {
      const result = await db.select<DBPowerCharacterLink[]>(
        "SELECT * FROM power_character_links WHERE character_id = $1 AND section_id = $2",
        [characterId, sectionId]
      );
      return result.length > 0;
    }

    return false;
  } catch (error) {
    console.error("Error checking power link existence:", error);
    throw error;
  }
}

/**
 * Get all character IDs that are already linked in a page hierarchy.
 * This includes:
 * - Characters linked directly to the page
 * - Characters linked to any section of the page
 *
 * Used to prevent duplicate links in the hierarchy.
 */
export async function getLinkedCharacterIdsInPageHierarchy(
  pageId: string
): Promise<string[]> {
  try {
    const db = await getDB();

    // Get character IDs linked directly to the page
    const pageLinks = await db.select<DBPowerCharacterLink[]>(
      "SELECT character_id FROM power_character_links WHERE page_id = $1",
      [pageId]
    );

    // Get all sections of this page
    const sections = await db.select<DBPowerSection[]>(
      "SELECT id FROM power_sections WHERE page_id = $1",
      [pageId]
    );

    const sectionIds = sections.map((s) => s.id);

    // Get character IDs linked to any section of this page
    let sectionLinks: DBPowerCharacterLink[] = [];
    if (sectionIds.length > 0) {
      const placeholders = sectionIds.map(() => "?").join(",");
      sectionLinks = await db.select<DBPowerCharacterLink[]>(
        `SELECT DISTINCT character_id FROM power_character_links WHERE section_id IN (${placeholders})`,
        sectionIds
      );
    }

    // Combine and deduplicate character IDs
    const allCharacterIds = new Set<string>();
    pageLinks.forEach((link) => allCharacterIds.add(link.character_id));
    sectionLinks.forEach((link) => allCharacterIds.add(link.character_id));

    return Array.from(allCharacterIds);
  } catch (error) {
    console.error(
      "Error getting linked character IDs in page hierarchy:",
      error
    );
    throw error;
  }
}

/**
 * Get all character IDs that are already linked in a section hierarchy.
 * This includes:
 * - Characters linked to the parent page of the section
 * - Characters linked to the section itself
 * - Characters linked to sibling sections
 *
 * Used to prevent duplicate links in the hierarchy.
 */
export async function getLinkedCharacterIdsInSectionHierarchy(
  sectionId: string
): Promise<string[]> {
  try {
    // Get the section to find its parent page
    const section = await getPowerSectionById(sectionId);
    if (!section) {
      throw new Error(`Section with id ${sectionId} not found`);
    }

    // Use the page hierarchy function since we want all links in the page
    return await getLinkedCharacterIdsInPageHierarchy(section.pageId);
  } catch (error) {
    console.error(
      "Error getting linked character IDs in section hierarchy:",
      error
    );
    throw error;
  }
}
