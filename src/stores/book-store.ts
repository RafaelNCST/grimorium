import { create } from "zustand";

export type BookStatus = "planning" | "releasing" | "hiatus" | "complete";

export interface Book {
  id: string;
  title: string;
  genre: string[];
  visualStyle: string;
  coverImage: string;
  chapters: number;
  lastModified: number;
  createdAt: number;
  status: BookStatus;
  currentArc?: string;
  synopsis?: string;
  authorSummary?: string;
  storySummary?: string;
}

interface BookState {
  books: Book[];
  currentBook: Book | null;
  searchTerm: string;
  setBooks: (books: Book[]) => void;
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  setCurrentBook: (book: Book | null) => void;
  setSearchTerm: (term: string) => void;
  getFilteredBooks: () => Book[];
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  currentBook: null,
  searchTerm: "",
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBook: (id, updates) =>
    set((state) => ({
      books: state.books.map((book) =>
        book.id === id
          ? { ...book, ...updates, lastModified: Date.now() }
          : book
      ),
      currentBook:
        state.currentBook?.id === id
          ? { ...state.currentBook, ...updates, lastModified: Date.now() }
          : state.currentBook,
    })),
  deleteBook: (id) =>
    set((state) => ({
      books: state.books.filter((book) => book.id !== id),
      currentBook: state.currentBook?.id === id ? null : state.currentBook,
    })),
  setCurrentBook: (book) => set({ currentBook: book }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  getFilteredBooks: () => {
    const { books, searchTerm } = get();
    if (!searchTerm) return books;
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.some((g) =>
          g.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  },
}));
