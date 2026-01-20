import {
  CreateBookModal,
  IBookFormData,
} from "@/components/modals/create-book-modal";
import { Book as BookType } from "@/stores/book-store";

import { Header } from "./components/header";
import { ListBooks } from "./components/list-books";

interface PropsHomeView {
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
    </div>
  );
}
