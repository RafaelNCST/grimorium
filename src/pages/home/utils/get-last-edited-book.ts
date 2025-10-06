import { Book } from "@/stores/book-store";

/**
 * Gets the title of the last edited book based on lastModified timestamp
 * @param books - Array of books to search through
 * @returns The title of the last edited book or "Nenhum" if no books exist
 */
export function getLastEditedBook(books: Book[]): string {
  if (books.length === 0) return "Nenhum";

  const sorted = [...books].sort((a, b) => b.lastModified - a.lastModified);

  return sorted[0]?.title || "Nenhum";
}
