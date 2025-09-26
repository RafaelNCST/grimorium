import { useState } from "react";

import { Plus, Book, HardDrive, Search, Settings } from "lucide-react";

import { BookCard } from "@/components/common/book-card";
import { StatsCard } from "@/components/common/stats-card";
import {
  CreateBookModal,
  IBookFormData,
} from "@/components/modals/create-book-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book as BookType } from "@/stores/book-store";
import { useLanguageStore } from "@/stores/language-store";

interface HomeViewProps {
  filteredBooks: BookType[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onBookSelect: (bookId: string) => void;
  onCreateBook: (bookData: IBookFormData) => void;
  totalBooks: number;
  lastEditedBook: string;
}

export function HomeView({
  filteredBooks,
  searchTerm,
  setSearchTerm,
  onBookSelect,
  onCreateBook,
  totalBooks,
  lastEditedBook,
}: HomeViewProps) {
  const { t } = useLanguageStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleCreateBook = (bookData: IBookFormData) => {
    onCreateBook(bookData);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-80 overflow-hidden rounded-xl mx-6 mt-6 mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/assets/hero-workspace.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

        <div className="relative h-full flex items-center justify-between px-8">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
              {t("home.welcome")}
              <br />
              <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
                {t("home.creative_universe")}
              </span>
            </h1>
            <p className="text-lg text-gray-200 animate-fade-in-up">
              {t("home.organize_worlds")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="magical"
              size="lg"
              onClick={() => setShowCreateModal(true)}
              className="animate-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t("home.create_new_book")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettingsModal(true)}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title={t("home.total_books")}
            value={totalBooks}
            description={t("home.active_projects")}
            icon={Book}
          />
          <StatsCard
            title={t("home.storage_used")}
            value="2.1 GB"
            description={t("home.storage_available")}
            icon={HardDrive}
          />
          <StatsCard
            title={t("home.last_edition")}
            value={lastEditedBook}
            description={t("home.this_month")}
            icon={Book}
          />
        </div>
      </div>

      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("home.library")}</h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("home.search_books")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <h3 className="text-lg font-semibold mb-2">
              {t("home.no_books_found")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? t("home.adjust_search")
                : t("home.create_first_book")}
            </p>
            <Button variant="magical" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t("home.create_new_book")}
            </Button>
          </div>
        )}

        <CreateBookModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onConfirm={handleCreateBook}
        />

        <SettingsModal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      </div>
    </div>
  );
}
