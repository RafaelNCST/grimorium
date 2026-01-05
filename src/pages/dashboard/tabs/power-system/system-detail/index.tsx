import { useEffect, useState, useCallback } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
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

import { DeleteGroupModal } from "../components/delete-group-modal";
import { ManageLinksModal } from "../components/manage-links-modal";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

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
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
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
  const [groupToDelete, setGroupToDelete] = useState<IPowerGroup | null>(null);

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

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    // Check if group has pages
    const groupPages = pages.filter((page) => page.groupId === groupId);

    if (groupPages.length > 0) {
      // Show modal to ask user what to do
      setGroupToDelete(group);
      setIsDeleteGroupModalOpen(true);
    } else {
      // No pages, delete directly
      handleDeleteGroupOnly(groupId);
    }
  };

  const handleDeleteGroupOnly = async (groupId: string) => {
    try {
      await deletePowerGroup(groupId);

      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.id !== groupId)
      );

      // Update pages that belonged to this group (make them standalone)
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.groupId === groupId ? { ...page, groupId: undefined } : page
        )
      );
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleDeleteGroupAndPages = async (groupId: string) => {
    try {
      // Delete the group
      await deletePowerGroup(groupId);

      // Get pages to delete
      const pagesToDelete = pages.filter((page) => page.groupId === groupId);

      // Delete all pages in the group
      for (const page of pagesToDelete) {
        await deletePowerPage(page.id);
      }

      // Update state
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.id !== groupId)
      );
      setPages((prevPages) =>
        prevPages.filter((page) => page.groupId !== groupId)
      );

      // If current page was in the deleted group, navigate to first available page
      if (currentPage && currentPage.groupId === groupId && systemId) {
        const remainingPages = pages.filter((page) => page.groupId !== groupId);
        const newCurrentPage =
          remainingPages.length > 0 ? remainingPages[0] : null;
        setCurrentPage(newCurrentPage);
        setCurrentPageId(systemId, newCurrentPage?.id || null);
      }
    } catch (error) {
      console.error("Error deleting group and pages:", error);
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
      // Capture current page value before async operation
      const currentPageSnapshot = currentPage;
      const isCurrentPageBeingDeleted = currentPageSnapshot?.id === pageId;

      await deletePowerPage(pageId);

      setPages((prevPages) => {
        const filteredPages = prevPages.filter((page) => page.id !== pageId);

        // Only navigate if the deleted page is the current page
        if (isCurrentPageBeingDeleted) {
          // Find the index of the deleted page
          const deletedIndex = prevPages.findIndex(
            (page) => page.id === pageId
          );

          let newCurrentPage: IPowerPage | null = null;

          if (filteredPages.length > 0) {
            // Try to navigate to the next page (at the same index after deletion)
            if (deletedIndex < filteredPages.length) {
              newCurrentPage = filteredPages[deletedIndex];
            }
            // If no next page, navigate to the previous one
            else if (deletedIndex > 0) {
              newCurrentPage = filteredPages[deletedIndex - 1];
            }
            // Fallback to first page if something goes wrong
            else {
              newCurrentPage = filteredPages[0];
            }
          }

          setCurrentPage(newCurrentPage);
          setCurrentPageId(systemId, newCurrentPage?.id || null);
        }
        // If not the current page, keep the current page unchanged

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
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deletePowerSection(sectionId);

      setSections((prevSections) =>
        prevSections.filter((section) => section.id !== sectionId)
      );
      setBlocks((prevBlocks) =>
        prevBlocks.filter((block) => block.sectionId !== sectionId)
      );
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
      let orderIndex = 0;
      setBlocks((prevBlocks) => {
        const sectionBlocks = prevBlocks.filter(
          (b) => b.sectionId === sectionId
        );
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
    } catch (error) {
      console.error("Error updating block:", error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deletePowerBlock(blockId);

      setBlocks((prevBlocks) =>
        prevBlocks.filter((block) => block.id !== blockId)
      );
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
        <LoadingSpinner size="xl" />
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
      {/* Delete Group Modal */}
      <DeleteGroupModal
        isOpen={isDeleteGroupModalOpen}
        onClose={() => setIsDeleteGroupModalOpen(false)}
        onDeleteGroupOnly={() => {
          if (groupToDelete) {
            handleDeleteGroupOnly(groupToDelete.id);
          }
        }}
        onDeleteGroupAndPages={() => {
          if (groupToDelete) {
            handleDeleteGroupAndPages(groupToDelete.id);
          }
        }}
        groupName={groupToDelete?.name}
        pageCount={
          groupToDelete
            ? pages.filter((p) => p.groupId === groupToDelete.id).length
            : 0
        }
      />

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
