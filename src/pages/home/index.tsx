import { useCallback, useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { IBookFormData } from "@/components/modals/create-book-modal";
import { useBookStore } from "@/stores/book-store";

import { getLastEditedBook } from "./utils/get-last-edited-book";
import { HomeView } from "./view";

export function HomePage() {
  const navigate = useNavigate();
  const { getFilteredBooks, searchTerm, setSearchTerm, addBook, books } =
    useBookStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const filteredBooks = useMemo(() => getFilteredBooks(), [getFilteredBooks]);

  const lastEditedBook = useMemo(() => getLastEditedBook(books), [books]);

  // Calculate last edited date from the last edited book
  const lastEditedDate = useMemo(() => {
    if (books.length === 0) return undefined;

    const sorted = [...books].sort((a, b) => b.lastModified - a.lastModified);
    const mostRecent = sorted[0];

    return mostRecent ? new Date(mostRecent.lastModified) : undefined;
  }, [books]);

  // Calculate total characters and words from all books
  // Note: These values should come from actual chapter data in the future
  const totalCharacters = 0;
  const totalWords = 0;

  // This should come from actual chapter data
  const lastChapter = undefined;

  const daysSinceLastChapter = 0;

  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleOpenSettingsModal = useCallback(() => {
    setShowSettingsModal(true);
  }, []);

  const handleCloseSettingsModal = useCallback(() => {
    setShowSettingsModal(false);
  }, []);

  const handleCreateBook = useCallback(
    (bookData: IBookFormData) => {
      const now = Date.now();
      const newBook = {
        id: now.toString(),
        title: bookData.title,
        genre: bookData.genre,
        visualStyle: bookData.visualStyle,
        coverImage: bookData.cover || "/placeholder.svg",
        chapters: 0,
        lastModified: now,
        createdAt: now,
        status: "Em planejamento" as const,
        storySummary: bookData.synopsis || "",
        authorSummary: bookData.authorSummary || "",
      };
      addBook(newBook);
      setShowCreateModal(false);
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId: newBook.id },
      });
    },
    [addBook, navigate]
  );

  const handleBookSelect = useCallback(
    (bookId: string) => {
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId: bookId },
      });
    },
    [navigate]
  );

  return (
    <HomeView
      filteredBooks={filteredBooks}
      searchTerm={searchTerm}
      totalBooks={books.length}
      totalCharacters={totalCharacters}
      totalWords={totalWords}
      lastEditedBook={lastEditedBook}
      lastEditedDate={lastEditedDate}
      lastChapter={lastChapter}
      daysSinceLastChapter={daysSinceLastChapter}
      showCreateModal={showCreateModal}
      showSettingsModal={showSettingsModal}
      onSearchTermChange={setSearchTerm}
      onBookSelect={handleBookSelect}
      onCreateBook={handleCreateBook}
      onOpenCreateModal={handleOpenCreateModal}
      onCloseCreateModal={handleCloseCreateModal}
      onOpenSettingsModal={handleOpenSettingsModal}
      onCloseSettingsModal={handleCloseSettingsModal}
    />
  );
}
