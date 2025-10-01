import { Plus, Book, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BookCard } from "@/components/common/book-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book as BookType } from "@/stores/book-store";

interface ListBooksProps {
  filteredBooks: BookType[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onBookSelect: (bookId: string) => void;
  onOpenCreateModal: () => void;
}

export function ListBooks({
  filteredBooks,
  searchTerm,
  onSearchTermChange,
  onBookSelect,
  onOpenCreateModal,
}: ListBooksProps) {
  const { t } = useTranslation("home");

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("library")}</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("search_books")}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 w-64"
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
          <h3 className="text-lg font-semibold mb-2">{t("no_books_found")}</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? t("adjust_search") : t("create_first_book")}
          </p>
          <Button variant="magical" onClick={onOpenCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            {t("create_new_book")}
          </Button>
        </div>
      )}
    </div>
  );
}
