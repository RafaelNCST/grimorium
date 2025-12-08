import { BookOpen } from "lucide-react";

import { ResetDatabaseButton } from "@/components/dev-tools/reset-database-button";
import {
  CreateBookModal,
  IBookFormData,
} from "@/components/modals/create-book-modal";
import { Book as BookType } from "@/stores/book-store";

import { Header } from "./components/header";
import { ListBooks } from "./components/list-books";

interface PropsHomeView {
  isLoading?: boolean;
  filteredBooks: BookType[];
  searchTerm: string;
  totalBooks: number;
  lastEditedBook: string;
  lastEditedDate?: Date;
  daysSinceLastChapter: number;
  showCreateModal: boolean;
  onSearchTermChange: (term: string) => void;
  onBookSelect: (bookId: string) => void;
  onCreateBook: (bookData: IBookFormData) => void;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
}

export function HomeView({
  isLoading = false,
  filteredBooks,
  searchTerm,
  totalBooks,
  lastEditedBook,
  lastEditedDate,
  daysSinceLastChapter,
  showCreateModal,
  onSearchTermChange,
  onBookSelect,
  onCreateBook,
  onOpenCreateModal,
  onCloseCreateModal,
}: PropsHomeView) {
  // Loading state with custom book spinner
  if (isLoading) {
    return (
      <div className="bg-background flex-1 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Animated Book Icon with Pulse and Glow */}
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />

            {/* Middle rotating ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>

            {/* Book icon with pulse */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary animate-pulse" strokeWidth={2} />
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground animate-pulse">
              Carregando seus Livros...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex-1 h-full flex flex-col">
      <div className="flex-shrink-0">
        <Header
          daysSinceLastChapter={daysSinceLastChapter}
          lastEditedBook={lastEditedBook}
          lastEditedDate={lastEditedDate}
          onOpenCreateModal={onOpenCreateModal}
        />
      </div>

      <ListBooks
        filteredBooks={filteredBooks}
        searchTerm={searchTerm}
        totalBooks={totalBooks}
        onSearchTermChange={onSearchTermChange}
        onBookSelect={onBookSelect}
      />

      <CreateBookModal
        open={showCreateModal}
        onClose={onCloseCreateModal}
        onConfirm={onCreateBook}
      />

      {/* Dev Tools - Only visible in development */}
      <ResetDatabaseButton />
    </div>
  );
}
