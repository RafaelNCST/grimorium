import { useState } from "react";
import { Plus, Book, HardDrive, Settings, Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/BookCard";
import { StatsCard } from "@/components/StatsCard";
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
];

interface HomePageProps {
  onBookSelect: (bookId: string) => void;
  onCreateBook: () => void;
}

export function HomePage({ onBookSelect, onCreateBook }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredBooks = mockBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Bem-vindo ao seu<br />
              <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
                Universo Criativo
              </span>
            </h1>
            <p className="text-lg text-gray-200 animate-fade-in-up">
              Organize seus mundos, personagens e histórias de fantasia
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="magical" 
              size="lg" 
              onClick={onCreateBook}
              className="animate-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Livro
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total de Livros"
            value={mockBooks.length}
            description="Projetos ativos"
            icon={Book}
            trend={{ value: 15.2, isPositive: true }}
          />
          <StatsCard
            title="Armazenamento Usado"
            value="2.1 GB"
            description="de 10 GB disponível"
            icon={HardDrive}
          />
          <StatsCard
            title="Capítulos Escritos"
            value="35"
            description="Este mês"
            icon={Book}
            trend={{ value: 8.1, isPositive: true }}
          />
        </div>
      </div>

      {/* Library Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Sua Biblioteca</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar livros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => onBookSelect(book.id)}
              onEdit={() => console.log("Edit book", book.id)}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar sua busca" : "Que tal criar seu primeiro livro?"}
            </p>
            <Button variant="magical" onClick={onCreateBook}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Livro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}