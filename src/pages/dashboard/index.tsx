import { useEffect } from "react";

import { useNavigate, ParamsOptions } from "@tanstack/react-router";

import { useBookStore } from "@/stores/book-store";
import { useDashboardStore } from "@/stores/dashboard-store";

import { DashboardView } from "./view";

interface BookDashboardProps {
  bookId: string;
  onBack: () => void;
}

export function BookDashboard({ bookId, onBack }: BookDashboardProps) {
  const navigate = useNavigate();
  const { books, updateBook, deleteBook, setCurrentBook } = useBookStore();
  const {
    activeTab,
    isEditingHeader,
    isHeaderHidden,
    isCustomizing,
    tabs,
    arcs,
    setActiveTab,
    setIsEditingHeader,
    setIsHeaderHidden,
    setIsCustomizing,
    updateTabs,
    toggleTabVisibility,
    getCurrentArc,
  } = useDashboardStore();

  const book = books.find((b) => b.id === bookId);

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

  if (!book) {
    return <div>Livro não encontrado</div>;
  }

  const handleUpdateBook = (updates: Partial<typeof book>) => {
    updateBook(bookId, updates);
  };

  const handleDeleteBook = () => {
    deleteBook(bookId);
    onBack();
  };

  const currentArc = getCurrentArc();

  return (
    <DashboardView
      book={book}
      bookId={bookId}
      onBack={onBack}
      activeTab={activeTab}
      isEditingHeader={isEditingHeader}
      isHeaderHidden={isHeaderHidden}
      isCustomizing={isCustomizing}
      tabs={tabs}
      currentArc={currentArc}
      onActiveTabChange={setActiveTab}
      onEditingHeaderChange={setIsEditingHeader}
      onHeaderHiddenChange={setIsHeaderHidden}
      onCustomizingChange={setIsCustomizing}
      onTabsUpdate={updateTabs}
      onToggleTabVisibility={toggleTabVisibility}
      onUpdateBook={handleUpdateBook}
      onDeleteBook={handleDeleteBook}
      navigate={navigate}
    />
  );
}
