import { useEffect, useCallback, useMemo, useState } from "react";

import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
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

  const book = useMemo(
    () => books.find((b) => b.id === bookId),
    [books, bookId]
  );
  const currentArc = useMemo(() => getCurrentArc(), [getCurrentArc]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const newTabs = [...tabs];
        const oldIndex = newTabs.findIndex((item) => item.id === active.id);
        const newIndex = newTabs.findIndex((item) => item.id === over.id);

        const updatedTabs = arrayMove(newTabs, oldIndex, newIndex);
        setTabs(updatedTabs);
        updateTabs(updatedTabs);
      }
    },
    [tabs, updateTabs]
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
      onBack={onBack}
      onActiveTabChange={setActiveTab}
      onEditingHeaderChange={setIsEditingHeader}
      onHeaderHiddenChange={setIsHeaderHidden}
      onCustomizingChange={setIsCustomizing}
      onCustomizingToggle={handleCustomizingToggle}
      onTabsUpdate={updateTabs}
      onToggleTabVisibility={toggleTabVisibility}
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
