import {
  createPowerGroup,
  createPowerPage,
  createPowerSection,
  createPowerBlock,
} from "@/lib/db/power-system.service";

import {
  getMagicTemplateContent,
  getMartialTemplateContent,
  type Language,
} from "./template-content";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
): Promise<string> {
  // Create the page
  const pageId = await createPowerPage(systemId, pageName, groupId, orderIndex);

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
      await createPowerBlock(sectionId, block.type, block.content, blockIndex);
    }
  }

  return pageId;
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

  // Create the overview page (without group)
  firstPageId = await createPageWithContent(
    systemId,
    undefined, // No group for overview page
    content.overviewPage.name,
    content.overviewPage.sections,
    0
  );

  // Create groups and their pages
  for (let groupIndex = 0; groupIndex < content.groups.length; groupIndex++) {
    const group = content.groups[groupIndex];

    // Create the group
    const groupId = await createPowerGroup(systemId, group.name, groupIndex);

    // Create pages within the group
    for (let pageIndex = 0; pageIndex < group.pages.length; pageIndex++) {
      const page = group.pages[pageIndex];

      await createPageWithContent(
        systemId,
        groupId,
        page.name,
        page.sections,
        pageIndex
      );
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

  // Create the overview page (without group)
  firstPageId = await createPageWithContent(
    systemId,
    undefined, // No group for overview page
    content.overviewPage.name,
    content.overviewPage.sections,
    0
  );

  // Create groups and their pages
  for (let groupIndex = 0; groupIndex < content.groups.length; groupIndex++) {
    const group = content.groups[groupIndex];

    // Create the group
    const groupId = await createPowerGroup(systemId, group.name, groupIndex);

    // Create pages within the group
    for (let pageIndex = 0; pageIndex < group.pages.length; pageIndex++) {
      const page = group.pages[pageIndex];

      await createPageWithContent(
        systemId,
        groupId,
        page.name,
        page.sections,
        pageIndex
      );
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
