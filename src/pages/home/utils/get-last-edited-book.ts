import { Book } from "@/stores/book-store";

/**
 * Gets the title of the last edited book based on lastModified string
 * @param books - Array of books to search through
 * @returns The title of the last edited book or "Nenhum" if no books exist
 */
export function getLastEditedBook(books: Book[]): string {
  if (books.length === 0) return "Nenhum";

  const sorted = [...books].sort((a, b) => {
    const getValue = (text: string): number => {
      if (text.includes("dias")) {
        return parseInt(text.match(/\d+/)?.[0] || "0");
      }
      if (text.includes("semana")) {
        return parseInt(text.match(/\d+/)?.[0] || "0") * 7;
      }
      return 0;
    };
    return getValue(a.lastModified) - getValue(b.lastModified);
  });

  return sorted[0]?.title || "Nenhum";
}
