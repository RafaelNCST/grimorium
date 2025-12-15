import {
  createPowerGroup,
  createPowerPage,
  createPowerSection,
  createPowerBlock,
  updatePowerBlock,
} from "@/lib/db/power-system.service";

import {
  getMagicTemplateContent,
  getMartialTemplateContent,
  type Language,
} from "./template-content";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

interface PageCreationResult {
  pageId: string;
  pageName: string;
  navigatorBlocks: Array<{
    blockId: string;
    targetPageName: string;
    content: any;
  }>;
}

async function createPageWithContent(
  systemId: string,
  groupId: string | undefined,
  pageName: string,
  sections: Array<{
    title: string;
    blocks: Array<{
      type: any;
      content: any;
    }>;
  }>,
  orderIndex: number
): Promise<PageCreationResult> {
  // Create the page
  const pageId = await createPowerPage(systemId, pageName, groupId, orderIndex);

  const navigatorBlocks: Array<{ blockId: string; targetPageName: string; content: any }> = [];

  // Create sections and blocks
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    const sectionId = await createPowerSection(
      pageId,
      section.title,
      sectionIndex
    );

    // Create blocks within the section
    for (let blockIndex = 0; blockIndex < section.blocks.length; blockIndex++) {
      const block = section.blocks[blockIndex];
      const blockId = await createPowerBlock(sectionId, block.type, block.content, blockIndex);

      // Track navigator blocks for later linking
      if (block.type === "navigator" && block.content.title) {
        // Extract target page name from title
        // "Estudar Tipos Elementais" -> "Tipos Elementais"
        // "Study Elemental Types" -> "Elemental Types"
        let targetPageName = "";
        if (block.content.title.includes("Tipos Elementais")) {
          targetPageName = "Tipos Elementais";
        } else if (block.content.title.includes("Elemental Types")) {
          targetPageName = "Elemental Types";
        } else if (block.content.title.includes("Posturas de Combate")) {
          targetPageName = "Posturas de Combate";
        } else if (block.content.title.includes("Combat Stances")) {
          targetPageName = "Combat Stances";
        }

        if (targetPageName) {
          navigatorBlocks.push({ blockId, targetPageName, content: block.content });
        }
      }
    }
  }

  return { pageId, pageName, navigatorBlocks };
}

// ============================================================================
// TEMPLATE BUILDERS
// ============================================================================

/**
 * Template Mágico (Basic)
 * Uses content from template-content.ts
 */
export async function buildMagicTemplate(
  systemId: string,
  language: Language
): Promise<string | null> {
  const content = getMagicTemplateContent(language);

  let firstPageId: string | null = null;
  const pageMap = new Map<string, string>(); // pageName -> pageId
  const allNavigatorBlocks: Array<{ blockId: string; targetPageName: string }> = [];

  // Create the overview page (without group)
  const overviewResult = await createPageWithContent(
    systemId,
    undefined, // No group for overview page
    content.overviewPage.name,
    content.overviewPage.sections,
    0
  );
  firstPageId = overviewResult.pageId;
  pageMap.set(overviewResult.pageName, overviewResult.pageId);
  allNavigatorBlocks.push(...overviewResult.navigatorBlocks);

  // Create groups and their pages
  for (let groupIndex = 0; groupIndex < content.groups.length; groupIndex++) {
    const group = content.groups[groupIndex];

    // Create the group
    const groupId = await createPowerGroup(systemId, group.name, groupIndex);

    // Create pages within the group
    for (let pageIndex = 0; pageIndex < group.pages.length; pageIndex++) {
      const page = group.pages[pageIndex];

      const pageResult = await createPageWithContent(
        systemId,
        groupId,
        page.name,
        page.sections,
        pageIndex
      );
      pageMap.set(pageResult.pageName, pageResult.pageId);
      allNavigatorBlocks.push(...pageResult.navigatorBlocks);
    }
  }

  // Update all navigator blocks with correct linkedPageId
  for (const navBlock of allNavigatorBlocks) {
    const targetPageId = pageMap.get(navBlock.targetPageName);
    if (targetPageId) {
      await updatePowerBlock(navBlock.blockId, {
        ...navBlock.content,
        linkedPageId: targetPageId,
      });
    }
  }

  return firstPageId;
}

/**
 * Template Marcial (Basic)
 * Uses content from template-content.ts
 */
export async function buildMartialTemplate(
  systemId: string,
  language: Language
): Promise<string | null> {
  const content = getMartialTemplateContent(language);

  let firstPageId: string | null = null;
  const pageMap = new Map<string, string>(); // pageName -> pageId
  const allNavigatorBlocks: Array<{ blockId: string; targetPageName: string; content: any }> = [];

  // Create the overview page (without group)
  const overviewResult = await createPageWithContent(
    systemId,
    undefined, // No group for overview page
    content.overviewPage.name,
    content.overviewPage.sections,
    0
  );
  firstPageId = overviewResult.pageId;
  pageMap.set(overviewResult.pageName, overviewResult.pageId);
  allNavigatorBlocks.push(...overviewResult.navigatorBlocks);

  // Create groups and their pages
  for (let groupIndex = 0; groupIndex < content.groups.length; groupIndex++) {
    const group = content.groups[groupIndex];

    // Create the group
    const groupId = await createPowerGroup(systemId, group.name, groupIndex);

    // Create pages within the group
    for (let pageIndex = 0; pageIndex < group.pages.length; pageIndex++) {
      const page = group.pages[pageIndex];

      const pageResult = await createPageWithContent(
        systemId,
        groupId,
        page.name,
        page.sections,
        pageIndex
      );
      pageMap.set(pageResult.pageName, pageResult.pageId);
      allNavigatorBlocks.push(...pageResult.navigatorBlocks);
    }
  }

  // Update all navigator blocks with correct linkedPageId
  for (const navBlock of allNavigatorBlocks) {
    const targetPageId = pageMap.get(navBlock.targetPageName);
    if (targetPageId) {
      await updatePowerBlock(navBlock.blockId, {
        ...navBlock.content,
        linkedPageId: targetPageId,
      });
    }
  }

  return firstPageId;
}

// ============================================================================
// TEMPLATE EXECUTOR
// ============================================================================

/**
 * Executes the appropriate template builder based on template ID
 * Returns the first page ID for navigation
 */
export async function executeTemplate(
  systemId: string,
  templateId: string,
  language: Language
): Promise<string | null> {
  switch (templateId) {
    case "magic":
      return await buildMagicTemplate(systemId, language);

    case "martial":
      return await buildMartialTemplate(systemId, language);

    default:
      return null;
  }
}
