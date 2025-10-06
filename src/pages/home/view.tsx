import {
  CreateBookModal,
  IBookFormData,
} from "@/components/modals/create-book-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { Book as BookType } from "@/stores/book-store";

import { Header } from "./components/header";
import { ListBooks } from "./components/list-books";

interface PropsHomeView {
  filteredBooks: BookType[];
  searchTerm: string;
  totalBooks: number;
  totalCharacters: number;
  totalWords: number;
  lastEditedBook: string;
  lastEditedDate?: Date;
  lastChapter?: {
    title: string;
    bookTitle: string;
    date?: Date;
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
  totalCharacters,
  totalWords,
  lastEditedBook,
  lastEditedDate,
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
        lastEditedBook={lastEditedBook}
        lastEditedDate={lastEditedDate}
        lastChapter={lastChapter}
        onOpenCreateModal={onOpenCreateModal}
        onOpenSettingsModal={onOpenSettingsModal}
      />

      <ListBooks
        filteredBooks={filteredBooks}
        searchTerm={searchTerm}
        totalBooks={totalBooks}
        totalCharacters={totalCharacters}
        totalWords={totalWords}
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
