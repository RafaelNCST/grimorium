import { create } from "zustand";

export interface Book {
  id: string;
  title: string;
  genre: string;
  visualStyle: string;
  coverImage: string;
  chapters: number;
  lastModified: string;
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
  books: [
    {
      id: "1",
      title: "As Crônicas do Reino Perdido",
      genre: "Alta Fantasia",
      visualStyle: "Realista",
      coverImage: "/assets/book-cover-1.jpg",
      chapters: 12,
      lastModified: "há 2 dias",
      authorSummary:
        "Para mim como autor: explorar temas de crescimento pessoal através da jornada do herói. Focar na dualidade luz/trevas como metáfora.",
      storySummary:
        "Em um reino onde a magia está desaparecendo, um jovem pastor descobre que carrega o poder de restaurar o equilíbrio entre luz e trevas.",
    },
  ],
  currentBook: null,
  searchTerm: "",
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBook: (id, updates) =>
    set((state) => ({
      books: state.books.map((book) =>
        book.id === id ? { ...book, ...updates } : book
      ),
      currentBook:
        state.currentBook?.id === id
          ? { ...state.currentBook, ...updates }
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
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
}));
