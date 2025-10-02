import { useEffect, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useBookStore } from "@/stores/book-store";
import { useDashboardStore } from "@/stores/dashboard-store";

import { DashboardView } from "./view";

interface PropsDashboard {
  bookId: string;
  onBack: () => void;
}

export function BookDashboard({ bookId, onBack }: PropsDashboard) {
  const navigate = useNavigate();
  const { books, updateBook, deleteBook, setCurrentBook } = useBookStore();
  const {
    activeTab,
    isEditingHeader,
    isHeaderHidden,
    isCustomizing,
    tabs,
    setActiveTab,
    setIsEditingHeader,
    setIsHeaderHidden,
    setIsCustomizing,
    updateTabs,
    toggleTabVisibility,
    getCurrentArc,
  } = useDashboardStore();

  const book = useMemo(
    () => books.find((b) => b.id === bookId),
    [books, bookId]
  );
  const currentArc = useMemo(() => getCurrentArc(), [getCurrentArc]);

  useEffect(() => {
    if (book) {
      setCurrentBook(book);
    }
  }, [book, setCurrentBook]);

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

  const handleUpdateBook = useCallback(
    (updates: Partial<typeof book>) => {
      updateBook(bookId, updates);
    },
    [updateBook, bookId]
  );

  const handleDeleteBook = useCallback(() => {
    deleteBook(bookId);
    onBack();
  }, [deleteBook, bookId, onBack]);

  const handleNavigateToChapters = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/chapter/chapters",
      params: { dashboardId: bookId },
    });
  }, [navigate, bookId]);

  const handleNavigateToNotes = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/notes/notes",
      params: { dashboardId: bookId },
    });
  }, [navigate, bookId]);

  if (!book) {
    return <div>Livro não encontrado</div>;
  }

  return (
    <DashboardView
      book={book}
      bookId={bookId}
      activeTab={activeTab}
      isEditingHeader={isEditingHeader}
      isHeaderHidden={isHeaderHidden}
      isCustomizing={isCustomizing}
      tabs={tabs}
      currentArc={currentArc}
      onBack={onBack}
      onActiveTabChange={setActiveTab}
      onEditingHeaderChange={setIsEditingHeader}
      onHeaderHiddenChange={setIsHeaderHidden}
      onCustomizingChange={setIsCustomizing}
      onTabsUpdate={updateTabs}
      onToggleTabVisibility={toggleTabVisibility}
      onUpdateBook={handleUpdateBook}
      onDeleteBook={handleDeleteBook}
      onNavigateToChapters={handleNavigateToChapters}
      onNavigateToNotes={handleNavigateToNotes}
    />
  );
}
