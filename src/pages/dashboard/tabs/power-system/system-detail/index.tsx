import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";

import { usePowerSystemStore } from "@/stores/power-system-store";
import { usePowerSystemUIStore } from "@/stores/power-system-ui-store";
import {
  getPowerGroupsBySystemId,
  getPowerPagesBySystemId,
  getPowerSectionsByPageId,
  getPowerBlocksBySectionId,
  createPowerGroup,
  createPowerPage,
  createPowerSection,
  createPowerBlock,
  updatePowerGroup,
  updatePowerPage,
  updatePowerSection,
  updatePowerBlock,
  deletePowerGroup,
  deletePowerPage,
  deletePowerSection,
  deletePowerBlock,
  reorderPowerGroups,
  reorderPowerPages,
  reorderPowerSections,
  reorderPowerBlocks,
  movePowerPage,
  duplicatePowerPage,
} from "@/lib/db/power-system.service";

import type {
  IPowerSystem,
  IPowerGroup,
  IPowerPage,
  IPowerSection,
  IPowerBlock,
  BlockType,
  BlockContent,
} from "../types/power-system-types";
import { PowerSystemDetailView } from "./view";
import { ManageLinksModal } from "../components/manage-links-modal";

interface PowerSystemDetailProps {
  bookId: string;
}

export function PowerSystemDetail({ bookId }: PowerSystemDetailProps) {
  const { systemId } = useParams({
    from: "/dashboard/$dashboardId/tabs/power-system/$systemId"
  });
  const navigate = useNavigate();

  // Store
  const { getSystems, fetchSystems } = usePowerSystemStore();
  const systems = getSystems(bookId);
  const currentSystem = systems.find((s) => s.id === systemId) || null;

  // UI Store
  const {
    getCurrentPageId,
    setCurrentPageId,
    getEditMode,
    setEditMode,
    getSidebarOpen,
    setSidebarOpen,
  } = usePowerSystemUIStore();

  // State
  const [currentPage, setCurrentPage] = useState<IPowerPage | null>(null);
  const [groups, setGroups] = useState<IPowerGroup[]>([]);
  const [pages, setPages] = useState<IPowerPage[]>([]);
  const [sections, setSections] = useState<IPowerSection[]>([]);
  const [blocks, setBlocks] = useState<IPowerBlock[]>([]);

  // UI State - using local state to avoid re-renders from store
  const [isEditMode, setIsEditModeLocal] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpenLocal] = useState(true);

  // Modal States
  const [isEditSystemModalOpen, setIsEditSystemModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] = useState(false);
  const [isSelectBlockModalOpen, setIsSelectBlockModalOpen] = useState(false);
  const [isDeleteSystemModalOpen, setIsDeleteSystemModalOpen] = useState(false);
  const [isManageLinksModalOpen, setIsManageLinksModalOpen] = useState(false);

  // Modal Context
  const [selectedGroupForPage, setSelectedGroupForPage] = useState<string | undefined>();
  const [selectedSectionForBlock, setSelectedSectionForBlock] = useState<string | undefined>();
  const [selectedLinkPageId, setSelectedLinkPageId] = useState<string | undefined>();
  const [selectedLinkSectionId, setSelectedLinkSectionId] = useState<string | undefined>();

  // Loading States
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);

  // Restore UI state from store when system changes
  useEffect(() => {
    if (!systemId) return;

    // Restore UI state
    const savedEditMode = getEditMode(systemId);
    const savedSidebarOpen = getSidebarOpen(systemId);

    setIsEditModeLocal(savedEditMode);
    setIsLeftSidebarOpenLocal(savedSidebarOpen);
  }, [systemId, getEditMode, getSidebarOpen]);

  // Fetch systems if not loaded
  useEffect(() => {
    if (systems.length === 0) {
      fetchSystems(bookId);
    }
  }, [bookId, systems.length, fetchSystems]);

  // Redirect to list if system not found
  useEffect(() => {
    if (systems.length > 0 && !currentSystem) {
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId: bookId }
      });
    }
  }, [systems, currentSystem, bookId, navigate]);

  // Fetch groups and pages when system changes
  useEffect(() => {
    if (!currentSystem) {
      setGroups([]);
      setPages([]);
      setCurrentPage(null);
      return;
    }

    const loadSystemData = async () => {
      setIsLoadingGroups(true);
      setIsLoadingPages(true);

      try {
        const [fetchedGroups, fetchedPages] = await Promise.all([
          getPowerGroupsBySystemId(currentSystem.id),
          getPowerPagesBySystemId(currentSystem.id),
        ]);

        setGroups(fetchedGroups);
        setPages(fetchedPages);

        // Restore saved page or set first page
        const savedPageId = getCurrentPageId(currentSystem.id);
        const savedPage = savedPageId
          ? fetchedPages.find((p) => p.id === savedPageId)
          : null;

        if (savedPage) {
          // Restore previously selected page
          setCurrentPage(savedPage);
        } else if (fetchedPages.length > 0) {
          // Set first page as current if no saved page
          const firstPage = fetchedPages[0];
          setCurrentPage(firstPage);
          setCurrentPageId(currentSystem.id, firstPage.id);
        } else {
          // No pages available
          setCurrentPage(null);
          setCurrentPageId(currentSystem.id, null);
        }
      } catch (error) {
        console.error("Error loading system data:", error);
      } finally {
        setIsLoadingGroups(false);
        setIsLoadingPages(false);
      }
    };

    loadSystemData();
  }, [currentSystem, getCurrentPageId, setCurrentPageId]);

  // Fetch sections and blocks when page changes
  useEffect(() => {
    if (!currentPage) {
      setSections([]);
      setBlocks([]);
      return;
    }

    const loadPageData = async () => {
      setIsLoadingSections(true);
      setIsLoadingBlocks(true);

      try {
        const fetchedSections = await getPowerSectionsByPageId(currentPage.id);
        setSections(fetchedSections);

        // Fetch all blocks for all sections
        const allBlocks: IPowerBlock[] = [];
        for (const section of fetchedSections) {
          const sectionBlocks = await getPowerBlocksBySectionId(section.id);
          allBlocks.push(...sectionBlocks);
        }
        setBlocks(allBlocks);
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setIsLoadingSections(false);
        setIsLoadingBlocks(false);
      }
    };

    loadPageData();
  }, [currentPage]);

  // ============================================================================
  // SYSTEM HANDLERS
  // ============================================================================

  const handleBackToList = () => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: bookId },
      search: { tab: "magic" } as any
    });
  };

  const handleUpdateSystem = async (systemId: string, name: string, iconImage?: string) => {
    try {
      await usePowerSystemStore.getState().updateSystemInCache(systemId, name, iconImage);
      setIsEditSystemModalOpen(false);
    } catch (error) {
      console.error("Error updating system:", error);
    }
  };

  const handleDeleteSystem = async () => {
    if (!currentSystem) return;

    try {
      await usePowerSystemStore.getState().deleteSystemFromCache(bookId, currentSystem.id);

      // Navigate back to list after deletion
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId: bookId },
        search: { tab: "magic" } as any
      });
    } catch (error) {
      console.error("Error deleting system:", error);
    }
  };

  // ============================================================================
  // GROUP HANDLERS
  // ============================================================================

  const handleCreateGroup = async (name: string) => {
    if (!currentSystem) return;

    try {
      const orderIndex = groups.length;
      const groupId = await createPowerGroup(currentSystem.id, name, orderIndex);

      const newGroup: IPowerGroup = {
        id: groupId,
        systemId: currentSystem.id,
        name,
        orderIndex,
        createdAt: Date.now(),
      };

      setGroups([...groups, newGroup]);
      setIsCreateGroupModalOpen(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleUpdateGroup = async (groupId: string, name: string) => {
    try {
      await updatePowerGroup(groupId, name);

      setGroups(
        groups.map((group) =>
          group.id === groupId ? { ...group, name } : group
        )
      );
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deletePowerGroup(groupId);

      setGroups(groups.filter((group) => group.id !== groupId));

      // Update pages that belonged to this group
      setPages(
        pages.map((page) =>
          page.groupId === groupId ? { ...page, groupId: undefined } : page
        )
      );
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleReorderGroups = async (reorderedGroups: IPowerGroup[]) => {
    try {
      setGroups(reorderedGroups);
      await reorderPowerGroups(reorderedGroups.map((g) => g.id));
    } catch (error) {
      console.error("Error reordering groups:", error);
    }
  };

  // ============================================================================
  // PAGE HANDLERS
  // ============================================================================

  const handlePageSelect = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page && systemId) {
      setCurrentPage(page);
      setCurrentPageId(systemId, page.id);
    }
  };

  const handleCreatePage = async (name: string, groupId?: string) => {
    if (!currentSystem) return;

    try {
      const orderIndex = pages.length;
      const pageId = await createPowerPage(currentSystem.id, name, groupId, orderIndex);

      const newPage: IPowerPage = {
        id: pageId,
        systemId: currentSystem.id,
        groupId,
        name,
        orderIndex,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setPages([...pages, newPage]);
      setCurrentPage(newPage);
      setCurrentPageId(currentSystem.id, newPage.id);
      setIsCreatePageModalOpen(false);
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  const handleUpdatePage = async (pageId: string, name: string) => {
    try {
      await updatePowerPage(pageId, name);

      setPages(
        pages.map((page) =>
          page.id === pageId
            ? { ...page, name, updatedAt: Date.now() }
            : page
        )
      );

      if (currentPage?.id === pageId) {
        setCurrentPage({ ...currentPage, name, updatedAt: Date.now() });
      }
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  const handleMovePage = async (pageId: string, newGroupId?: string) => {
    try {
      await movePowerPage(pageId, newGroupId);

      setPages(
        pages.map((page) =>
          page.id === pageId
            ? { ...page, groupId: newGroupId, updatedAt: Date.now() }
            : page
        )
      );
    } catch (error) {
      console.error("Error moving page:", error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!systemId) return;

    try {
      await deletePowerPage(pageId);

      setPages(pages.filter((page) => page.id !== pageId));

      if (currentPage?.id === pageId) {
        const remainingPages = pages.filter((p) => p.id !== pageId);
        const newCurrentPage = remainingPages.length > 0 ? remainingPages[0] : null;
        setCurrentPage(newCurrentPage);
        setCurrentPageId(systemId, newCurrentPage?.id || null);
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const handleReorderPages = async (reorderedPages: IPowerPage[]) => {
    try {
      setPages(reorderedPages);
      await reorderPowerPages(reorderedPages.map((p) => p.id));
    } catch (error) {
      console.error("Error reordering pages:", error);
    }
  };

  const handleDuplicatePage = async (pageId: string) => {
    try {
      // Call the duplicate service
      const newPageId = await duplicatePowerPage(pageId);

      // Reload pages to get the updated list with correct order
      if (currentSystem) {
        const fetchedPages = await getPowerPagesBySystemId(currentSystem.id);
        setPages(fetchedPages);

        // Find and set the duplicated page as current
        const duplicatedPage = fetchedPages.find((p) => p.id === newPageId);
        if (duplicatedPage) {
          setCurrentPage(duplicatedPage);
          setCurrentPageId(currentSystem.id, duplicatedPage.id);
        }
      }
    } catch (error) {
      console.error("Error duplicating page:", error);
    }
  };

  // ============================================================================
  // SECTION HANDLERS
  // ============================================================================

  const handleCreateSection = async (title: string) => {
    if (!currentPage) return;

    try {
      const orderIndex = sections.length;
      const sectionId = await createPowerSection(currentPage.id, title, orderIndex);

      const newSection: IPowerSection = {
        id: sectionId,
        pageId: currentPage.id,
        title,
        orderIndex,
        collapsed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setSections([...sections, newSection]);
      setIsCreateSectionModalOpen(false);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const handleUpdateSection = async (sectionId: string, title: string) => {
    try {
      await updatePowerSection(sectionId, title);

      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? { ...section, title, updatedAt: Date.now() }
            : section
        )
      );
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deletePowerSection(sectionId);

      setSections(sections.filter((section) => section.id !== sectionId));
      setBlocks(blocks.filter((block) => block.sectionId !== sectionId));
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleReorderSections = async (reorderedSections: IPowerSection[]) => {
    try {
      setSections(reorderedSections);
      await reorderPowerSections(reorderedSections.map((s) => s.id));
    } catch (error) {
      console.error("Error reordering sections:", error);
    }
  };

  // ============================================================================
  // BLOCK HANDLERS
  // ============================================================================

  const handleCreateBlock = async (
    sectionId: string,
    type: BlockType,
    content: BlockContent
  ) => {
    try {
      const sectionBlocks = blocks.filter((b) => b.sectionId === sectionId);
      const orderIndex = sectionBlocks.length;

      const blockId = await createPowerBlock(sectionId, type, content, orderIndex);

      const newBlock: IPowerBlock = {
        id: blockId,
        sectionId,
        type,
        orderIndex,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setBlocks([...blocks, newBlock]);
      setIsSelectBlockModalOpen(false);
    } catch (error) {
      console.error("Error creating block:", error);
    }
  };

  const handleUpdateBlock = async (blockId: string, content: BlockContent) => {
    try {
      await updatePowerBlock(blockId, content);

      setBlocks(
        blocks.map((block) =>
          block.id === blockId
            ? { ...block, content, updatedAt: Date.now() }
            : block
        )
      );
    } catch (error) {
      console.error("Error updating block:", error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deletePowerBlock(blockId);

      setBlocks(blocks.filter((block) => block.id !== blockId));
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };

  const handleReorderBlocks = async (
    sectionId: string,
    reorderedBlocks: IPowerBlock[]
  ) => {
    try {
      // Update local state with reordered blocks
      setBlocks((prevBlocks) => {
        const otherBlocks = prevBlocks.filter((b) => b.sectionId !== sectionId);
        return [...otherBlocks, ...reorderedBlocks];
      });

      await reorderPowerBlocks(reorderedBlocks.map((b) => b.id));
    } catch (error) {
      console.error("Error reordering blocks:", error);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const isBlockEmpty = (block: IPowerBlock): boolean => {
    const { type, content } = block;

    if (!content) return true;

    switch (type) {
      case "heading":
        return !(content as any).text || (content as any).text.trim() === "";
      case "paragraph":
        return !(content as any).text || (content as any).text.trim() === "";
      case "unordered-list":
      case "numbered-list":
        return !(content as any).items || (content as any).items.length === 0;
      case "tag-list":
        return !(content as any).tags || (content as any).tags.length === 0;
      case "dropdown":
        return !(content as any).options || (content as any).options.length === 0;
      case "multi-dropdown":
        return !(content as any).options || (content as any).options.length === 0;
      case "image":
        return !(content as any).imageUrl || (content as any).imageUrl.trim() === "";
      case "icon":
        const hasTitle = (content as any).title && (content as any).title.trim() !== "";
        const hasDescription = (content as any).description && (content as any).description.trim() !== "";
        return !hasTitle && !hasDescription;
      case "icon-group":
        return !(content as any).icons || (content as any).icons.length === 0;
      case "informative":
        return !(content as any).text || (content as any).text.trim() === "";
      case "divider":
        // Dividers are never empty (they're just a visual element)
        return false;
      case "stars":
        // Consider empty if rating is 0 or undefined
        return (content as any).rating === 0 || (content as any).rating === undefined || (content as any).rating === null;
      case "attributes":
        // Consider empty if both current and max are at their default values (max=5, current=0)
        // OR if max is 0 or undefined
        const max = (content as any).max;
        const current = (content as any).current;
        return max === undefined || max === null || max === 0 || (max === 5 && current === 0);
      case "navigator":
        // Consider empty if no page is linked
        return !(content as any).linkedPageId;
      default:
        return true;
    }
  };

  const deleteEmptyBlocks = async () => {
    const emptyBlocks = blocks.filter((block) => isBlockEmpty(block));

    if (emptyBlocks.length === 0) return;

    // Delete all empty blocks in parallel
    try {
      await Promise.all(
        emptyBlocks.map(async (block) => {
          await deletePowerBlock(block.id);
        })
      );

      // Update local state once after all deletions
      const emptyBlockIds = new Set(emptyBlocks.map(b => b.id));
      setBlocks(blocks.filter(block => !emptyBlockIds.has(block.id)));
    } catch (error) {
      console.error("Error deleting empty blocks:", error);
    }
  };

  // ============================================================================
  // MODAL HANDLERS
  // ============================================================================

  const handleOpenCreateGroupModal = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleOpenCreatePageModal = (groupId?: string) => {
    setSelectedGroupForPage(groupId);
    setIsCreatePageModalOpen(true);
  };

  const handleOpenCreateSectionModal = () => {
    setIsCreateSectionModalOpen(true);
  };

  const handleOpenSelectBlockModal = (sectionId: string) => {
    setSelectedSectionForBlock(sectionId);
    setIsSelectBlockModalOpen(true);
  };

  const handleManagePageLinks = (pageId: string) => {
    setSelectedLinkPageId(pageId);
    setSelectedLinkSectionId(undefined);
    setIsManageLinksModalOpen(true);
  };

  const handleManageSectionLinks = (sectionId: string) => {
    setSelectedLinkSectionId(sectionId);
    setSelectedLinkPageId(undefined);
    setIsManageLinksModalOpen(true);
  };

  const handleCloseManageLinks = () => {
    setIsManageLinksModalOpen(false);
    setSelectedLinkPageId(undefined);
    setSelectedLinkSectionId(undefined);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!currentSystem) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading system...</p>
        </div>
      </div>
    );
  }

  return (
    <PowerSystemDetailView
      // Data
      system={currentSystem}
      currentPage={currentPage}
      groups={groups}
      pages={pages}
      sections={sections}
      blocks={blocks}
      bookId={bookId}
      // UI State
      isEditMode={isEditMode}
      isLeftSidebarOpen={isLeftSidebarOpen}
      // Loading States
      isLoadingGroups={isLoadingGroups}
      isLoadingPages={isLoadingPages}
      isLoadingSections={isLoadingSections}
      isLoadingBlocks={isLoadingBlocks}
      // Modal States
      isEditSystemModalOpen={isEditSystemModalOpen}
      isCreateGroupModalOpen={isCreateGroupModalOpen}
      isCreatePageModalOpen={isCreatePageModalOpen}
      isCreateSectionModalOpen={isCreateSectionModalOpen}
      isSelectBlockModalOpen={isSelectBlockModalOpen}
      isDeleteSystemModalOpen={isDeleteSystemModalOpen}
      // Modal Context
      selectedGroupForPage={selectedGroupForPage}
      selectedSectionForBlock={selectedSectionForBlock}
      // System Handlers
      onBackToList={handleBackToList}
      onUpdateSystem={handleUpdateSystem}
      onDeleteSystem={handleDeleteSystem}
      // Group Handlers
      onCreateGroup={handleCreateGroup}
      onUpdateGroup={handleUpdateGroup}
      onDeleteGroup={handleDeleteGroup}
      onReorderGroups={handleReorderGroups}
      // Page Handlers
      onPageSelect={handlePageSelect}
      onCreatePage={handleCreatePage}
      onUpdatePage={handleUpdatePage}
      onMovePage={handleMovePage}
      onDeletePage={handleDeletePage}
      onReorderPages={handleReorderPages}
      onDuplicatePage={handleDuplicatePage}
      // Section Handlers
      onCreateSection={handleCreateSection}
      onUpdateSection={handleUpdateSection}
      onDeleteSection={handleDeleteSection}
      onReorderSections={handleReorderSections}
      // Block Handlers
      onCreateBlock={handleCreateBlock}
      onUpdateBlock={handleUpdateBlock}
      onDeleteBlock={handleDeleteBlock}
      onReorderBlocks={handleReorderBlocks}
      // UI Handlers
      onToggleEditMode={async () => {
        if (!systemId) return;

        // If turning OFF edit mode, delete empty blocks first
        if (isEditMode) {
          await deleteEmptyBlocks();
        }
        const newEditMode = !isEditMode;
        setIsEditModeLocal(newEditMode);
        setEditMode(systemId, newEditMode);
      }}
      onToggleLeftSidebar={() => {
        if (!systemId) return;

        const newSidebarOpen = !isLeftSidebarOpen;
        setIsLeftSidebarOpenLocal(newSidebarOpen);
        setSidebarOpen(systemId, newSidebarOpen);
      }}
      // Modal Handlers
      onOpenEditSystemModal={() => setIsEditSystemModalOpen(true)}
      onCloseEditSystemModal={() => setIsEditSystemModalOpen(false)}
      onOpenCreateGroupModal={handleOpenCreateGroupModal}
      onCloseCreateGroupModal={() => setIsCreateGroupModalOpen(false)}
      onOpenCreatePageModal={handleOpenCreatePageModal}
      onCloseCreatePageModal={() => setIsCreatePageModalOpen(false)}
      onOpenCreateSectionModal={handleOpenCreateSectionModal}
      onCloseCreateSectionModal={() => setIsCreateSectionModalOpen(false)}
      onOpenSelectBlockModal={handleOpenSelectBlockModal}
      onCloseSelectBlockModal={() => setIsSelectBlockModalOpen(false)}
      onOpenDeleteSystemModal={() => setIsDeleteSystemModalOpen(true)}
      onCloseDeleteSystemModal={() => setIsDeleteSystemModalOpen(false)}
      onManagePageLinks={handleManagePageLinks}
      onManageSectionLinks={handleManageSectionLinks}
    >
      {/* Manage Links Modal */}
      <ManageLinksModal
        isOpen={isManageLinksModalOpen}
        onClose={handleCloseManageLinks}
        bookId={bookId}
        pageId={selectedLinkPageId}
        sectionId={selectedLinkSectionId}
        onLinksChanged={() => {
          // Optional: Refresh data if needed
        }}
      />
    </PowerSystemDetailView>
  );
}
