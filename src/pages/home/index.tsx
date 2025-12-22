import { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { IBookFormData } from "@/components/modals/create-book-modal";
import {
  createBook as createBookDB,
  updateLastOpened,
} from "@/lib/db/books.service";
import { getChapterMetadataByBookId } from "@/lib/db/chapters.service";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useBookStore } from "@/stores/book-store";

import { getLastEditedBook } from "./utils/get-last-edited-book";
import { HomeView } from "./view";

export function HomePage() {
  const navigate = useNavigate();
  const {
    getFilteredBooks,
    searchTerm,
    setSearchTerm,
    addBook,
    books,
    setBooks: _setBooks,
  } = useBookStore();
  const { dashboard } = useAppSettingsStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [daysSinceLastChapter, setDaysSinceLastChapter] = useState(0);

  // Books are already loaded by SplashScreen, no need to load again

  const filteredBooks = useMemo(
    () => getFilteredBooks(),
    [getFilteredBooks, books, searchTerm]
  );

  const lastEditedBook = useMemo(() => getLastEditedBook(books), [books]);

  // Calculate last edited date from the last edited book
  const lastEditedDate = useMemo(() => {
    if (books.length === 0) return undefined;

    const sorted = [...books].sort((a, b) => b.lastModified - a.lastModified);
    const mostRecent = sorted[0];

    return mostRecent ? new Date(mostRecent.lastModified) : undefined;
  }, [books]);

  // Calculate days since last chapter was edited across all books
  useEffect(() => {
    const calculateDaysSinceLastChapter = async () => {
      try {
        if (books.length === 0) {
          setDaysSinceLastChapter(0);
          return;
        }

        // Get all chapters from all books
        const allChaptersPromises = books.map((book) =>
          getChapterMetadataByBookId(book.id)
        );
        const allChaptersArrays = await Promise.all(allChaptersPromises);
        const allChapters = allChaptersArrays.flat();

        if (allChapters.length === 0) {
          setDaysSinceLastChapter(0);
          return;
        }

        // Find the most recently edited chapter
        const mostRecentChapter = allChapters.reduce((prev, current) => {
          const prevDate = new Date(prev.lastEdited).getTime();
          const currentDate = new Date(current.lastEdited).getTime();
          return currentDate > prevDate ? current : prev;
        });

        // Calculate days since that chapter was edited
        const lastEditedDate = new Date(mostRecentChapter.lastEdited);
        const now = new Date();
        const diffMs = now.getTime() - lastEditedDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        setDaysSinceLastChapter(diffDays);
      } catch (error) {
        console.error("Error calculating days since last chapter:", error);
        setDaysSinceLastChapter(0);
      }
    };

    calculateDaysSinceLastChapter();
  }, [books]);

  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleCreateBook = useCallback(
    async (bookData: IBookFormData) => {
      const now = Date.now();
      const newBook = {
        id: now.toString(),
        title: bookData.title,
        genre: bookData.genre,
        visualStyle: bookData.visualStyle,
        coverImage: bookData.cover || "",
        chapters: 0,
        lastModified: now,
        createdAt: now,
        status: "planning" as const,
        synopsis: bookData.synopsis || "",
        storySummary: bookData.storySummary || "",
        authorSummary: bookData.authorSummary || "",
      };

      // Prepare tabs config from app settings
      // Map dashboard tab IDs to the TabConfig format expected by the database
      const allTabs = [
        { id: "overview", label: "overview" },
        { id: "characters", label: "characters" },
        { id: "world", label: "world" },
        { id: "factions", label: "factions" },
        { id: "plot", label: "plot" },
        { id: "magic", label: "magic" },
        { id: "species", label: "species" },
        { id: "items", label: "items" },
      ];

      const tabsConfigArray = allTabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        visible: dashboard.defaultVisibleTabs.includes(tab.id),
      }));

      const tabsConfig = JSON.stringify(tabsConfigArray);

      try {
        // Save to database with default tabs configuration
        await createBookDB(newBook, tabsConfig);

        // Update store
        addBook(newBook);

        setShowCreateModal(false);

        navigate({
          to: "/dashboard/$dashboardId",
          params: { dashboardId: newBook.id },
        });
      } catch (error) {
        console.error("Error creating book:", error);
        alert(
          `Erro ao criar livro: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    [addBook, navigate, dashboard.defaultVisibleTabs]
  );

  const handleBookSelect = useCallback(
    async (bookId: string) => {
      try {
        // Update last opened timestamp
        await updateLastOpened(bookId);
        navigate({
          to: "/dashboard/$dashboardId",
          params: { dashboardId: bookId },
        });
      } catch (error) {
        console.error("Error updating last opened:", error);
        // Still navigate even if update fails
        navigate({
          to: "/dashboard/$dashboardId",
          params: { dashboardId: bookId },
        });
      }
    },
    [navigate]
  );

  return (
    <HomeView
      filteredBooks={filteredBooks}
      searchTerm={searchTerm}
      totalBooks={books.length}
      lastEditedBook={lastEditedBook}
      lastEditedDate={lastEditedDate}
      daysSinceLastChapter={daysSinceLastChapter}
      showCreateModal={showCreateModal}
      onSearchTermChange={setSearchTerm}
      onBookSelect={handleBookSelect}
      onCreateBook={handleCreateBook}
      onOpenCreateModal={handleOpenCreateModal}
      onCloseCreateModal={handleCloseCreateModal}
    />
  );
}
