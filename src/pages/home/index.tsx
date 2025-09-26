import { useNavigate } from "@tanstack/react-router";

import { useBookStore } from "@/stores/book-store";

import { HomeView } from "./view";

export function HomePage() {
  const navigate = useNavigate();
  const { getFilteredBooks, searchTerm, setSearchTerm, addBook, books } =
    useBookStore();

  const filteredBooks = getFilteredBooks();

  const getLastEditedBook = () => {
    const sorted = [...books].sort((a, b) => {
      const getValue = (text: string) => {
        if (text.includes("dias"))
          return parseInt(text.match(/\d+/)?.[0] || "0");
        if (text.includes("semana"))
          return parseInt(text.match(/\d+/)?.[0] || "0") * 7;
        return 0;
      };
      return getValue(a.lastModified) - getValue(b.lastModified);
    });
    return sorted[0]?.title || "Nenhum";
  };

  const handleCreateBook = (bookData: any) => {
    const newBook = {
      id: Date.now().toString(),
      title: bookData.title,
      genre: bookData.genre,
      visualStyle: bookData.visualStyle,
      coverImage: "/placeholder.svg",
      chapters: 0,
      lastModified: "agora",
      storySummary: bookData.storySummary || "",
      authorSummary: bookData.authorSummary || "",
    };
    addBook(newBook);
  };

  const handleBookSelect = (bookId: string) => {
    navigate({ to: "/book/$bookId/dashboard", params: { bookId } });
  };

  return (
    <HomeView
      filteredBooks={filteredBooks}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onBookSelect={handleBookSelect}
      onCreateBook={handleCreateBook}
      totalBooks={books.length}
      lastEditedBook={getLastEditedBook()}
    />
  );
}
