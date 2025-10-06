import { Book, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BookCard } from "@/components/common/book-card";
import { Input } from "@/components/ui/input";
import { Book as BookType } from "@/stores/book-store";

interface ListBooksProps {
  filteredBooks: BookType[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onBookSelect: (bookId: string) => void;
}

export function ListBooks({
  filteredBooks,
  searchTerm,
  onSearchTermChange,
  onBookSelect,
}: ListBooksProps) {
  const { t } = useTranslation("home");

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("list_books.title")}</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("filter.placeholder")}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 w-[30rem]"
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            {...book}
            onClick={() => onBookSelect(book.id)}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t("list_books.text_empty")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? t("filter.text_empty") : t("filter.text_create_book")}
          </p>
        </div>
      )}
    </div>
  );
}
