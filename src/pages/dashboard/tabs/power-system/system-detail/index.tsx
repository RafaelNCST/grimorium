import { useEffect, useState, useCallback } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

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
import { usePowerSystemStore } from "@/stores/power-system-store";
import { usePowerSystemUIStore } from "@/stores/power-system-ui-store";

import { ManageLinksModal } from "../components/manage-links-modal";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useUndoRedo, type Snapshot } from "../hooks/useUndoRedo";

import { PowerSystemDetailView } from "./view";

import type {
  IPowerGroup,
  IPowerPage,
  IPowerSection,
  IPowerBlock,
  BlockType,
  BlockContent,
} from "../types/power-system-types";

interface PowerSystemDetailProps {
  bookId: string;
}

export function PowerSystemDetail({ bookId }: PowerSystemDetailProps) {
  const { systemId } = useParams({
    from: "/dashboard/$dashboardId/tabs/power-system/$systemId",
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
    getSelectedItem,
    setSelectedItem,
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
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] =
    useState(false);
  const [isSelectBlockModalOpen, setIsSelectBlockModalOpen] = useState(false);
  const [isDeleteSystemModalOpen, setIsDeleteSystemModalOpen] = useState(false);
  const [isManageLinksModalOpen, setIsManageLinksModalOpen] = useState(false);

  // Modal Context
  const [selectedGroupForPage, setSelectedGroupForPage] = useState<
    string | undefined
  >();
  const [selectedSectionForBlock, setSelectedSectionForBlock] = useState<
    string | undefined
  >();
  const [selectedLinkPageId, setSelectedLinkPageId] = useState<
    string | undefined
  >();
  const [selectedLinkSectionId, setSelectedLinkSectionId] = useState<
    string | undefined
  >();

  // Loading States
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);

  // Undo/Redo Hook
  const {
    pushSnapshot,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    isApplyingSnapshot,
  } = useUndoRedo({
    maxHistorySize: 50,
    pageId: currentPage?.id || null,
  });

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
        params: { dashboardId: bookId },
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

        // Save initial snapshot when entering edit mode with loaded data
        if (isEditMode && !isApplyingSnapshot) {
          const snapshot: Snapshot = {
            pageId: currentPage.id,
            // Deep clone sections to preserve all properties
            sections: fetchedSections.map((section) => ({ ...section })),
            // Deep clone blocks to preserve content including images
            blocks: allBlocks.map((block) => ({
              ...block,
              content: JSON.parse(JSON.stringify(block.content)),
            })),
            timestamp: Date.now(),
          };
          pushSnapshot(snapshot);
        }
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setIsLoadingSections(false);
        setIsLoadingBlocks(false);
      }
    };

    loadPageData();
  }, [currentPage?.id]);

  // ============================================================================
  // HISTORY MANAGEMENT
  // ============================================================================

  /**
   * Save current snapshot after an action is completed.
   * This should be called AFTER create/update/delete/reorder operations.
   * Uses deep clone to preserve all data including images and complex content.
   */
  const saveSnapshot = useCallback(() => {
    if (!currentPage || !isEditMode || isApplyingSnapshot) return;

    const snapshot: Snapshot = {
      pageId: currentPage.id,
      // Deep clone sections to preserve all properties
      sections: sections.map((section) => ({ ...section })),
      // Deep clone blocks to preserve content including images
      blocks: blocks.map((block) => ({
        ...block,
        content: JSON.parse(JSON.stringify(block.content)), // Deep clone content
      })),
      timestamp: Date.now(),
    };
    pushSnapshot(snapshot);
  }, [
    currentPage,
    sections,
    blocks,
    isEditMode,
    isApplyingSnapshot,
    pushSnapshot,
  ]);

  /**
   * Handle undo action
   */
  const handleUndo = useCallback(async () => {
    if (!canUndo || !currentPage) return;

    const result = await undo();
    if (result) {
      setSections(result.sections);
      setBlocks(result.blocks);
    }
  }, [canUndo, currentPage, undo]);

  /**
   * Handle redo action
   */
  const handleRedo = useCallback(async () => {
    if (!canRedo || !currentPage) return;

    const result = await redo();
    if (result) {
      setSections(result.sections);
      setBlocks(result.blocks);
    }
  }, [canRedo, currentPage, redo]);

  // Clear history when page changes
  useEffect(() => {
    clearHistory();
  }, [currentPage?.id, clearHistory]);

  // Clear history when system changes
  useEffect(() => {
    clearHistory();
  }, [systemId, clearHistory]);

  // Clear history when exiting edit mode, save initial snapshot when entering
  useEffect(() => {
    if (!isEditMode) {
      clearHistory();
    } else if (
      isEditMode &&
      currentPage &&
      sections.length > 0 &&
      !isApplyingSnapshot
    ) {
      // Save initial snapshot when entering edit mode with existing data
      const snapshot: Snapshot = {
        pageId: currentPage.id,
        // Deep clone sections to preserve all properties
        sections: sections.map((section) => ({ ...section })),
        // Deep clone blocks to preserve content including images
        blocks: blocks.map((block) => ({
          ...block,
          content: JSON.parse(JSON.stringify(block.content)),
        })),
        timestamp: Date.now(),
      };
      pushSnapshot(snapshot);
    }
  }, [isEditMode]);

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  /**
   * Handle rename shortcut (F2)
   */
  const handleRenameShortcut = useCallback(() => {
    if (!systemId) return;
    const selectedItem = getSelectedItem(systemId);

    if (!selectedItem.id || !selectedItem.type) {
      // If no item is selected, try to use current page
      if (currentPage) {
        setSelectedItem(systemId, currentPage.id, "page");
        // Trigger rename on current page - this will be handled by the sidebar
        const event = new CustomEvent("power-system:rename-item", {
          detail: { id: currentPage.id, type: "page" },
        });
        window.dispatchEvent(event);
      }
      return;
    }

    // Trigger rename event for selected item
    const event = new CustomEvent("power-system:rename-item", {
      detail: { id: selectedItem.id, type: selectedItem.type },
    });
    window.dispatchEvent(event);
  }, [systemId, currentPage, getSelectedItem, setSelectedItem]);

  /**
   * Handle delete shortcut (Delete)
   */
  const handleDeleteShortcut = useCallback(() => {
    if (!systemId) return;
    const selectedItem = getSelectedItem(systemId);

    if (!selectedItem.id || !selectedItem.type) {
      // If no item is selected, try to use current page
      if (currentPage) {
        setSelectedItem(systemId, currentPage.id, "page");
        // Trigger delete on current page
        const event = new CustomEvent("power-system:delete-item", {
          detail: { id: currentPage.id, type: "page" },
        });
        window.dispatchEvent(event);
      }
      return;
    }

    // Trigger delete event for selected item
    const event = new CustomEvent("power-system:delete-item", {
      detail: { id: selectedItem.id, type: selectedItem.type },
    });
    window.dispatchEvent(event);
  }, [systemId, currentPage, getSelectedItem, setSelectedItem]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    enabled: isEditMode,
    handlers: {
      onUndo: handleUndo,
      onRedo: handleRedo,
      onRename: handleRenameShortcut,
      onDelete: handleDeleteShortcut,
    },
  });

  // ============================================================================
  // SYSTEM HANDLERS
  // ============================================================================

  const handleBackToList = () => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: bookId },
      search: { tab: "magic" } as any,
    });
  };

  const handleUpdateSystem = async (
    systemId: string,
    name: string,
    iconImage?: string
  ) => {
    try {
      await usePowerSystemStore
        .getState()
        .updateSystemInCache(systemId, name, iconImage);
      setIsEditSystemModalOpen(false);
    } catch (error) {
      console.error("Error updating system:", error);
    }
  };

  const handleDeleteSystem = async () => {
    if (!currentSystem) return;

    try {
      await usePowerSystemStore
        .getState()
        .deleteSystemFromCache(bookId, currentSystem.id);

      // Navigate back to list after deletion
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId: bookId },
        search: { tab: "magic" } as any,
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
      let orderIndex = 0;
      setGroups((prevGroups) => {
        orderIndex = prevGroups.length;
        return prevGroups;
      });

      const groupId = await createPowerGroup(
        currentSystem.id,
        name,
        orderIndex
      );

      const newGroup: IPowerGroup = {
        id: groupId,
        systemId: currentSystem.id,
        name,
        orderIndex,
        createdAt: Date.now(),
      };

      setGroups((prev) => [...prev, newGroup]);
      setIsCreateGroupModalOpen(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleUpdateGroup = async (groupId: string, name: string) => {
    try {
      // Update state immediately (optimistic update)
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId ? { ...group, name } : group
        )
      );

      // Then persist to database
      await updatePowerGroup(groupId, name);
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deletePowerGroup(groupId);

      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));

      // Update pages that belonged to this group
      setPages((prevPages) =>
        prevPages.map((page) =>
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
      let orderIndex = 0;
      setPages((prevPages) => {
        orderIndex = prevPages.length;
        return prevPages;
      });

      const pageId = await createPowerPage(
        currentSystem.id,
        name,
        groupId,
        orderIndex
      );

      const newPage: IPowerPage = {
        id: pageId,
        systemId: currentSystem.id,
        groupId,
        name,
        orderIndex,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setPages((prev) => [...prev, newPage]);
      setCurrentPage(newPage);
      setCurrentPageId(currentSystem.id, newPage.id);
      setIsCreatePageModalOpen(false);
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  const handleUpdatePage = async (pageId: string, name: string) => {
    try {
      // Update state immediately (optimistic update)
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.id === pageId ? { ...page, name, updatedAt: Date.now() } : page
        )
      );

      if (currentPage?.id === pageId) {
        setCurrentPage({ ...currentPage, name, updatedAt: Date.now() });
      }

      // Then persist to database
      await updatePowerPage(pageId, name);
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  const handleMovePage = async (pageId: string, newGroupId?: string) => {
    try {
      await movePowerPage(pageId, newGroupId);

      setPages((prevPages) =>
        prevPages.map((page) =>
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

      setPages((prevPages) => {
        const filteredPages = prevPages.filter((page) => page.id !== pageId);

        if (currentPage?.id === pageId) {
          const newCurrentPage = filteredPages.length > 0 ? filteredPages[0] : null;
          setCurrentPage(newCurrentPage);
          setCurrentPageId(systemId, newCurrentPage?.id || null);
        }

        return filteredPages;
      });
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
      let orderIndex = 0;
      setSections((prevSections) => {
        orderIndex = prevSections.length;
        return prevSections;
      });

      const sectionId = await createPowerSection(
        currentPage.id,
        title,
        orderIndex
      );

      const newSection: IPowerSection = {
        id: sectionId,
        pageId: currentPage.id,
        title,
        orderIndex,
        collapsed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setSections((prev) => [...prev, newSection]);
      setIsCreateSectionModalOpen(false);

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const handleUpdateSection = async (sectionId: string, title: string) => {
    try {
      // Update state immediately (optimistic update)
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? { ...section, title, updatedAt: Date.now() }
            : section
        )
      );

      // Then persist to database
      await updatePowerSection(sectionId, title);

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deletePowerSection(sectionId);

      setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId));
      setBlocks((prevBlocks) => prevBlocks.filter((block) => block.sectionId !== sectionId));

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleReorderSections = async (reorderedSections: IPowerSection[]) => {
    try {
      setSections(reorderedSections);
      await reorderPowerSections(reorderedSections.map((s) => s.id));

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
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
      let orderIndex = 0;
      setBlocks((prevBlocks) => {
        const sectionBlocks = prevBlocks.filter((b) => b.sectionId === sectionId);
        orderIndex = sectionBlocks.length;
        return prevBlocks;
      });

      const blockId = await createPowerBlock(
        sectionId,
        type,
        content,
        orderIndex
      );

      const newBlock: IPowerBlock = {
        id: blockId,
        sectionId,
        type,
        orderIndex,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setBlocks((prev) => [...prev, newBlock]);
      setIsSelectBlockModalOpen(false);

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
    } catch (error) {
      console.error("Error creating block:", error);
    }
  };

  const handleUpdateBlock = async (blockId: string, content: BlockContent) => {
    try {
      // Update state immediately (optimistic update)
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === blockId
            ? { ...block, content, updatedAt: Date.now() }
            : block
        )
      );

      // Then persist to database
      await updatePowerBlock(blockId, content);

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
    } catch (error) {
      console.error("Error updating block:", error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deletePowerBlock(blockId);

      setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockId));

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
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

      // Save snapshot AFTER action is completed
      setTimeout(() => saveSnapshot(), 100);
    } catch (error) {
      console.error("Error reordering blocks:", error);
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
      // Undo/Redo State
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={handleUndo}
      onRedo={handleRedo}
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
      onToggleEditMode={() => {
        if (!systemId) return;

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
      onItemSelect={(itemId, itemType) => {
        if (systemId) {
          setSelectedItem(systemId, itemId, itemType);
        }
      }}
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
