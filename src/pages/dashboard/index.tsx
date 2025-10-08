import { useEffect, useCallback, useMemo, useState } from "react";

import {
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useNavigate } from "@tanstack/react-router";

import { useBookStore, Book as BookType } from "@/stores/book-store";
import { useDashboardStore } from "@/stores/dashboard-store";

import { DEFAULT_TABS_CONSTANT } from "./constants/dashboard-constants";
import { DashboardView } from "./view";

interface PropsDashboard {
  bookId: string;
  onBack: () => void;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

export function BookDashboard({ bookId, onBack }: PropsDashboard) {
  const navigate = useNavigate();
  const { books, updateBook, deleteBook, setCurrentBook } = useBookStore();
  const {
    activeTab,
    isEditingHeader,
    isHeaderHidden,
    isCustomizing,
    tabs: storeTabs,
    setActiveTab,
    setIsEditingHeader,
    setIsHeaderHidden,
    setIsCustomizing,
    updateTabs,
    toggleTabVisibility,
    getCurrentArc,
  } = useDashboardStore();

  const [draftBook, setDraftBook] = useState<BookType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [tabs, setTabs] = useState<TabConfig[]>(
    storeTabs.length > 0 ? storeTabs : DEFAULT_TABS_CONSTANT
  );
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [previewTabs, setPreviewTabs] = useState<TabConfig[]>([]);

  const book = useMemo(
    () => books.find((b) => b.id === bookId),
    [books, bookId]
  );
  const currentArc = useMemo(() => getCurrentArc(), [getCurrentArc]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const visibleTabs = useMemo(() => tabs.filter((tab) => tab.visible), [tabs]);

  useEffect(() => {
    if (book) {
      setCurrentBook(book);
      setDraftBook(book);
    }
  }, [book, setCurrentBook]);

  useEffect(() => {
    if (storeTabs.length === 0) {
      updateTabs(DEFAULT_TABS_CONSTANT);
    }
  }, [storeTabs, updateTabs]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsCustomizing(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [setIsCustomizing]);

  useEffect(() => {
    if (isCustomizing && activeTab !== "overview") {
      setIsCustomizing(false);
    }
  }, [activeTab, isCustomizing, setIsCustomizing]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active) {
      setDraggedTabId(active.id.toString());
    }
  }, []);

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { active, delta } = event;

      if (!active || !draggedTabId) {
        return;
      }

      // Get all tab elements to calculate positions
      const tabsContainer = document.getElementById("tabs-container");
      if (!tabsContainer) {
        return;
      }

      const tabElements = Array.from(
        tabsContainer.querySelectorAll("[data-tab-id]")
      ) as HTMLElement[];

      // Find the dragged tab's new position based on its center point
      const draggedElement = tabElements.find(
        (el) => el.getAttribute("data-tab-id") === draggedTabId
      );

      if (!draggedElement) {
        return;
      }

      const draggedRect = draggedElement.getBoundingClientRect();
      const draggedCenterX = draggedRect.left + draggedRect.width / 2 + delta.x;

      // Find which tab position the dragged tab should occupy
      let newIndex = tabs.findIndex((tab) => tab.id === draggedTabId);

      for (let i = 0; i < tabElements.length; i++) {
        const element = tabElements[i];
        const tabId = element.getAttribute("data-tab-id");

        // Skip the overview tab (isDefault)
        const tab = tabs.find((t) => t.id === tabId);
        if (tab?.isDefault) continue;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        // If dragged tab center is past this tab's center, potential new position
        if (draggedCenterX > centerX && tabId !== draggedTabId) {
          const tabIndex = tabs.findIndex((t) => t.id === tabId);
          if (tabIndex > newIndex) {
            newIndex = tabIndex;
          }
        } else if (draggedCenterX < centerX && tabId !== draggedTabId) {
          const tabIndex = tabs.findIndex((t) => t.id === tabId);
          if (tabIndex < newIndex) {
            newIndex = tabIndex;
          }
        }
      }

      // Create preview order
      const oldIndex = tabs.findIndex((tab) => tab.id === draggedTabId);
      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(oldIndex, 1);

        // Ensure overview tab stays at index 0
        const overviewIndex = newTabs.findIndex((tab) => tab.isDefault);
        if (overviewIndex !== 0 && overviewIndex !== -1) {
          const [overviewTab] = newTabs.splice(overviewIndex, 1);
          newTabs.unshift(overviewTab);
        }

        // Insert the moved tab at the correct position
        let finalIndex = newIndex;
        if (newIndex > oldIndex) {
          finalIndex = newIndex;
        }

        // Make sure we don't insert before the overview tab
        if (finalIndex === 0) {
          finalIndex = 1;
        }

        newTabs.splice(finalIndex, 0, movedTab);

        setPreviewTabs(newTabs);
      } else {
        setPreviewTabs([]);
      }
    },
    [tabs, draggedTabId]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      if (!active || !draggedTabId) {
        setDraggedTabId(null);
        setPreviewTabs([]);
        return;
      }

      // Get all tab elements to calculate positions
      const tabsContainer = document.getElementById("tabs-container");
      if (!tabsContainer) {
        setDraggedTabId(null);
        setPreviewTabs([]);
        return;
      }

      const tabElements = Array.from(
        tabsContainer.querySelectorAll("[data-tab-id]")
      ) as HTMLElement[];

      // Find the dragged tab's new position based on its center point
      const draggedElement = tabElements.find(
        (el) => el.getAttribute("data-tab-id") === draggedTabId
      );

      if (!draggedElement) {
        setDraggedTabId(null);
        setPreviewTabs([]);
        return;
      }

      const draggedRect = draggedElement.getBoundingClientRect();
      const draggedCenterX = draggedRect.left + draggedRect.width / 2 + delta.x;

      // Find which tab position the dragged tab should occupy
      let newIndex = tabs.findIndex((tab) => tab.id === draggedTabId);

      for (let i = 0; i < tabElements.length; i++) {
        const element = tabElements[i];
        const tabId = element.getAttribute("data-tab-id");

        // Skip the overview tab (isDefault)
        const tab = tabs.find((t) => t.id === tabId);
        if (tab?.isDefault) continue;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        // If dragged tab center is past this tab's center, potential new position
        if (draggedCenterX > centerX && tabId !== draggedTabId) {
          const tabIndex = tabs.findIndex((t) => t.id === tabId);
          if (tabIndex > newIndex) {
            newIndex = tabIndex;
          }
        } else if (draggedCenterX < centerX && tabId !== draggedTabId) {
          const tabIndex = tabs.findIndex((t) => t.id === tabId);
          if (tabIndex < newIndex) {
            newIndex = tabIndex;
          }
        }
      }

      // Reorder tabs
      const oldIndex = tabs.findIndex((tab) => tab.id === draggedTabId);
      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(oldIndex, 1);

        // Ensure overview tab stays at index 0
        const overviewIndex = newTabs.findIndex((tab) => tab.isDefault);
        if (overviewIndex !== 0 && overviewIndex !== -1) {
          const [overviewTab] = newTabs.splice(overviewIndex, 1);
          newTabs.unshift(overviewTab);
        }

        // Insert the moved tab at the correct position
        let finalIndex = newIndex;
        if (newIndex > oldIndex) {
          finalIndex = newIndex;
        }

        // Make sure we don't insert before the overview tab
        if (finalIndex === 0) {
          finalIndex = 1;
        }

        newTabs.splice(finalIndex, 0, movedTab);

        setTabs(newTabs);
        updateTabs(newTabs);
      }

      setDraggedTabId(null);
      setPreviewTabs([]);
    },
    [tabs, updateTabs, draggedTabId]
  );

  const handleToggleVisibility = useCallback(
    (tabId: string) => {
      const updatedTabs = tabs.map((tab) =>
        tab.id === tabId ? { ...tab, visible: !tab.visible } : tab
      );
      setTabs(updatedTabs);
      toggleTabVisibility(tabId);
    },
    [tabs, toggleTabVisibility]
  );

  const handleSave = useCallback(() => {
    if (draftBook) {
      updateBook(bookId, draftBook);
      setIsEditingHeader(false);
    }
  }, [draftBook, updateBook, bookId, setIsEditingHeader]);

  const handleCancel = useCallback(() => {
    if (book) {
      setDraftBook(book);
    }
    setIsEditingHeader(false);
  }, [book, setIsEditingHeader]);

  const handleDelete = useCallback(() => {
    if (book && deleteInput === book.title) {
      deleteBook(bookId);
      onBack();
      setShowDeleteDialog(false);
    }
  }, [book, deleteInput, deleteBook, bookId, onBack]);

  const handleDeleteBook = useCallback(() => {
    deleteBook(bookId);
    onBack();
  }, [deleteBook, bookId, onBack]);

  const handleNavigateToChapters = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/chapters",
      params: { dashboardId: bookId },
    });
  }, [navigate, bookId]);

  const handleNavigateToNotes = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/notes",
      params: { dashboardId: bookId },
    });
  }, [navigate, bookId]);

  const handleShowDeleteDialog = useCallback((show: boolean) => {
    setShowDeleteDialog(show);
  }, []);

  const handleDeleteInputChange = useCallback((value: string) => {
    setDeleteInput(value);
  }, []);

  const handleDraftBookChange = useCallback((updates: Partial<BookType>) => {
    setDraftBook((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const handleCustomizingToggle = useCallback(() => {
    if (!isCustomizing) {
      setActiveTab("overview");
    }
    setIsCustomizing(!isCustomizing);
  }, [isCustomizing, setIsCustomizing, setActiveTab]);

  if (!book) {
    return <div>Livro não encontrado</div>;
  }

  return (
    <DashboardView
      book={book}
      draftBook={draftBook}
      bookId={bookId}
      activeTab={activeTab}
      isEditingHeader={isEditingHeader}
      isHeaderHidden={isHeaderHidden}
      isCustomizing={isCustomizing}
      tabs={tabs}
      visibleTabs={visibleTabs}
      currentArc={currentArc}
      sensors={sensors}
      showDeleteDialog={showDeleteDialog}
      deleteInput={deleteInput}
      previewTabs={previewTabs}
      draggedTabId={draggedTabId}
      onBack={onBack}
      onActiveTabChange={setActiveTab}
      onEditingHeaderChange={setIsEditingHeader}
      onHeaderHiddenChange={setIsHeaderHidden}
      onCustomizingChange={setIsCustomizing}
      onCustomizingToggle={handleCustomizingToggle}
      onTabsUpdate={updateTabs}
      onToggleTabVisibility={toggleTabVisibility}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onToggleVisibility={handleToggleVisibility}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onDeleteBook={handleDeleteBook}
      onNavigateToChapters={handleNavigateToChapters}
      onNavigateToNotes={handleNavigateToNotes}
      onShowDeleteDialog={handleShowDeleteDialog}
      onDeleteInputChange={handleDeleteInputChange}
      onDraftBookChange={handleDraftBookChange}
    />
  );
}
