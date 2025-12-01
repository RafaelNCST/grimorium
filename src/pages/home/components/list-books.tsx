import {
  Book as BookIcon,
  Search,
  Library,
  Type,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { BookCard } from "@/components/common/book-card";
import {
  EntityTagBadge,
  IEntityTagConfig,
} from "@/components/ui/entity-tag-badge";
import { Input } from "@/components/ui/input";
import { Book as BookType } from "@/stores/book-store";

const METRICS_CONFIG: Record<string, IEntityTagConfig> = {
  books: {
    value: "books",
    icon: Library,
    translationKey: "metrics.total_books",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/20 border-blue-500/30",
  },
  characters: {
    value: "characters",
    icon: Type,
    translationKey: "metrics.total_characters",
    colorClass: "text-green-600 dark:text-green-400",
    bgColorClass: "bg-green-500/20 border-green-500/30",
  },
  words: {
    value: "words",
    icon: FileText,
    translationKey: "metrics.total_words",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/20 border-purple-500/30",
  },
};

interface ListBooksProps {
  filteredBooks: BookType[];
  searchTerm: string;
  totalBooks: number;
  totalCharacters: number;
  totalWords: number;
  onSearchTermChange: (term: string) => void;
  onBookSelect: (bookId: string) => void;
}

export function ListBooks({
  filteredBooks,
  searchTerm,
  totalBooks,
  totalCharacters,
  totalWords,
  onSearchTermChange,
  onBookSelect,
}: ListBooksProps) {
  const { t } = useTranslation("home");

  const shouldShowMetrics =
    totalBooks > 0 || totalCharacters > 0 || totalWords > 0;

  const isEmpty = filteredBooks.length === 0;

  if (isEmpty) {
    return (
      <div className="px-6 pb-6 flex flex-col flex-1">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-3">{t("list_books.title")}</h2>
          <div className="relative w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("filter.placeholder")}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {shouldShowMetrics && (
          <div className="flex gap-3 mb-6">
            <EntityTagBadge
              config={METRICS_CONFIG.books}
              label={`${t("metrics.total_books")}: ${totalBooks}`}
            />
            <EntityTagBadge
              config={METRICS_CONFIG.characters}
              label={`${t("metrics.total_characters")}: ${totalCharacters.toLocaleString()}`}
            />
            <EntityTagBadge
              config={METRICS_CONFIG.words}
              label={`${t("metrics.total_words")}: ${totalWords.toLocaleString()}`}
            />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("list_books.text_empty")}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? t("filter.text_empty")
                : t("filter.text_create_book")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-3">{t("list_books.title")}</h2>
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("filter.placeholder")}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {shouldShowMetrics && (
        <div className="flex gap-3 mb-6">
          <EntityTagBadge
            config={METRICS_CONFIG.books}
            label={`${t("metrics.total_books")}: ${totalBooks}`}
          />
          <EntityTagBadge
            config={METRICS_CONFIG.characters}
            label={`${t("metrics.total_characters")}: ${totalCharacters.toLocaleString()}`}
          />
          <EntityTagBadge
            config={METRICS_CONFIG.words}
            label={`${t("metrics.total_words")}: ${totalWords.toLocaleString()}`}
          />
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            {...book}
            onClick={() => onBookSelect(book.id)}
          />
        ))}
      </div>
    </div>
  );
}
