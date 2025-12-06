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
  const [_isLoading, setIsLoading] = useState(true);

  // Load books from database on mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        console.log("[HomePage] Starting to load books from database...");
        console.log(
          "[HomePage] Current books in store before load:",
          books.length
        );

        const booksFromDB = await getAllBooks();

        console.log("[HomePage] Books loaded from database:", {
          count: booksFromDB.length,
          books: booksFromDB,
        });

        // Check for data inconsistency
        if (books.length > 0 && booksFromDB.length === 0) {
          console.warn(
            "[HomePage] Data inconsistency detected! Books exist in store but not in database.",
            {
              storeBooks: books,
            }
          );
        }

        setBooks(booksFromDB);
        console.log("[HomePage] Books set in store successfully");
      } catch (error) {
        console.error("[HomePage] Error loading books:", error);
        console.error("[HomePage] Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      } finally {
        setIsLoading(false);
        console.log("[HomePage] Loading completed");
      }
    };

    loadBooks();
  }, [setBooks]);

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

  // This should come from actual chapter data
  const lastChapter = undefined;

  const daysSinceLastChapter = 0;

  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
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
        coverImage: bookData.cover || "",
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
      lastEditedBook={lastEditedBook}
      lastEditedDate={lastEditedDate}
      lastChapter={lastChapter}
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
