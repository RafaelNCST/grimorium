import { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { IBookFormData } from "@/components/modals/create-book-modal";
import {
  getAllBooks,
  createBook as createBookDB,
  updateLastOpened,
} from "@/lib/db/books.service";
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
    setBooks,
  } = useBookStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [_isLoading, setIsLoading] = useState(true);

  // Load books from database on mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksFromDB = await getAllBooks();
        setBooks(booksFromDB);
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [setBooks]);

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
    async (bookData: IBookFormData) => {
      console.log("Starting book creation with data:", bookData);

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

      console.log("New book object:", newBook);

      try {
        console.log("Attempting to save to database...");
        // Save to database
        await createBookDB(newBook);
        console.log("Book saved to database successfully!");

        // Update store
        addBook(newBook);
        console.log("Book added to store!");

        setShowCreateModal(false);

        console.log("Navigating to dashboard...");
        navigate({
          to: "/dashboard/$dashboardId",
          params: { dashboardId: newBook.id },
        });
      } catch (error) {
        console.error("Error creating book:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        alert(
          `Erro ao criar livro: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    [addBook, navigate]
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
