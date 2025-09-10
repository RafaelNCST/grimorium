import { useState } from "react";
import { Plus, Book, HardDrive, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/BookCard";
import { StatsCard } from "@/components/StatsCard";
import { CreateBookModal, BookFormData } from "@/components/modals/CreateBookModal";
import { SettingsModal } from "@/components/SettingsModal";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-workspace.jpg";
import bookCover1 from "@/assets/book-cover-1.jpg";
import bookCover2 from "@/assets/book-cover-2.jpg";
import bookCover3 from "@/assets/book-cover-3.jpg";

// Mock data
const mockBooks = [
  {
    id: "1",
    title: "As Crônicas do Reino Perdido",
    genre: "Alta Fantasia",
    visualStyle: "Realista",
    coverImage: bookCover1,
    chapters: 12,
    lastModified: "há 2 dias",
  },
  {
    id: "2",
    title: "Guardiões da Floresta Encantada",
    genre: "Fantasia Urbana",
    visualStyle: "Anime",
    coverImage: bookCover2,
    chapters: 8,
    lastModified: "há 1 semana",
  },
  {
    id: "3",
    title: "A Última Fortaleza",
    genre: "Épico",
    visualStyle: "Cartoon",
    coverImage: bookCover3,
    chapters: 15,
    lastModified: "há 3 dias",
  },
  {
    id: "4",
    title: "Nova História",
    genre: "Fantasia",
    visualStyle: "Realista",
    coverImage: "/placeholder.svg",
    chapters: 0,
    lastModified: "agora",
  },
];

interface HomePageProps {
  onBookSelect: (bookId: string) => void;
}

export function HomePage({ onBookSelect }: HomePageProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Get the most recently edited book
  const getLastEditedBook = () => {
    const sorted = [...mockBooks].sort((a, b) => {
      // Convert "há X dias/semanas" to comparable values
      const getValue = (text: string) => {
        if (text.includes('dias')) return parseInt(text.match(/\d+/)?.[0] || '0');
        if (text.includes('semana')) return parseInt(text.match(/\d+/)?.[0] || '0') * 7;
        return 0;
      };
      return getValue(a.lastModified) - getValue(b.lastModified);
    });
    return sorted[0]?.title || "Nenhum";
  };

  const filteredBooks = mockBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBook = (bookData: BookFormData) => {
    console.log('Creating book:', bookData);
    // TODO: Implement book creation logic
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden rounded-xl mx-6 mt-6 mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        
        <div className="relative h-full flex items-center justify-between px-8">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
              {t('home.welcome')}<br />
              <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
                {t('home.creative_universe')}
              </span>
            </h1>
            <p className="text-lg text-gray-200 animate-fade-in-up">
              {t('home.organize_worlds')}
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
              {t('home.create_new_book')}
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

      {/* Stats Section */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title={t('home.total_books')}
            value={mockBooks.length}
            description={t('home.active_projects')}
            icon={Book}
          />
          <StatsCard
            title={t('home.storage_used')}
            value="2.1 GB"
            description={t('home.storage_available')}
            icon={HardDrive}
          />
          <StatsCard
            title={t('home.last_edition')}
            value={getLastEditedBook()}
            description={t('home.this_month')}
            icon={Book}
          />
        </div>
      </div>

      {/* Library Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('home.library')}</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('home.search_books')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Books Grid - Always 4 per row */}
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
            <h3 className="text-lg font-semibold mb-2">{t('home.no_books_found')}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? t('home.adjust_search') : t('home.create_first_book')}
            </p>
            <Button variant="magical" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('home.create_new_book')}
            </Button>
          </div>
        )}

        {/* Modals */}
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