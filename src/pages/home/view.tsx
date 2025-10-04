import {
  CreateBookModal,
  IBookFormData,
} from "@/components/modals/create-book-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { Book as BookType } from "@/stores/book-store";

import { Header } from "./components/header";
import { InfoCard } from "./components/info-card";
import { ListBooks } from "./components/list-books";

interface PropsHomeView {
  filteredBooks: BookType[];
  searchTerm: string;
  totalBooks: number;
  lastEditedBook: string;
  lastChapter?: {
    title: string;
    bookTitle: string;
  };
  daysSinceLastChapter: number;
  showCreateModal: boolean;
  showSettingsModal: boolean;
  onSearchTermChange: (term: string) => void;
  onBookSelect: (bookId: string) => void;
  onCreateBook: (bookData: IBookFormData) => void;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  onOpenSettingsModal: () => void;
  onCloseSettingsModal: () => void;
}

export function HomeView({
  filteredBooks,
  searchTerm,
  totalBooks,
  lastEditedBook,
  lastChapter,
  daysSinceLastChapter,
  showCreateModal,
  showSettingsModal,
  onSearchTermChange,
  onBookSelect,
  onCreateBook,
  onOpenCreateModal,
  onCloseCreateModal,
  onOpenSettingsModal,
  onCloseSettingsModal,
}: PropsHomeView) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        daysSinceLastChapter={daysSinceLastChapter}
        onOpenCreateModal={onOpenCreateModal}
        onOpenSettingsModal={onOpenSettingsModal}
      />

      <InfoCard
        totalBooks={totalBooks}
        lastEditedBook={lastEditedBook}
        lastChapter={lastChapter}
      />

      <ListBooks
        filteredBooks={filteredBooks}
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        onBookSelect={onBookSelect}
      />

      <CreateBookModal
        open={showCreateModal}
        onClose={onCloseCreateModal}
        onConfirm={onCreateBook}
      />

      <SettingsModal open={showSettingsModal} onClose={onCloseSettingsModal} />
    </div>
  );
}
