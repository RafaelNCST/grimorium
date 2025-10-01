import {
  CreateBookModal,
  IBookFormData,
} from "@/components/modals/create-book-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { Book as BookType } from "@/stores/book-store";

import { Header } from "./components/header";
import { ListBooks } from "./components/list-books";
import { StatsCards } from "./components/stats-cards";

interface PropsHomeView {
  filteredBooks: BookType[];
  searchTerm: string;
  totalBooks: number;
  lastEditedBook: string;
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
        onOpenCreateModal={onOpenCreateModal}
        onOpenSettingsModal={onOpenSettingsModal}
      />

      <StatsCards totalBooks={totalBooks} lastEditedBook={lastEditedBook} />

      <ListBooks
        filteredBooks={filteredBooks}
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
        onBookSelect={onBookSelect}
        onOpenCreateModal={onOpenCreateModal}
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
