import { useState } from "react";
import { ArrowLeft, Edit2, Users, MapPin, Building, Clock, Sparkles, BookOpen, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { CharactersTab } from "@/components/tabs/CharactersTab";
import { LocationsTab } from "@/components/tabs/LocationsTab";
import { FactionsTab } from "@/components/tabs/FactionsTab";
import { TimelineTab } from "@/components/tabs/TimelineTab";
import { MagicSystemTab } from "@/components/tabs/MagicSystemTab";
import { EncyclopediaTab } from "@/components/tabs/EncyclopediaTab";
import { RelationsTab } from "@/components/tabs/RelationsTab";
import bookCover1 from "@/assets/book-cover-1.jpg";

interface BookDashboardProps {
  bookId: string;
  onBack: () => void;
}

// Mock book data
const mockBook = {
  id: "1",
  title: "As Crônicas do Reino Perdido",
  genre: "Alta Fantasia",
  visualStyle: "Realista",
  coverImage: bookCover1,
  chapters: 12,
  currentArc: "A Ascensão do Herói",
  synopsis: "Em um reino onde a magia está desaparecendo, um jovem pastor descobre que carrega o poder de restaurar o equilíbrio entre luz e trevas.",
};

export function BookDashboard({ bookId, onBack }: BookDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Dashboard do Livro</h1>
          </div>

          {/* Book Header */}
          <div className="flex items-start gap-6">
            <div className="w-32 h-48 rounded-lg overflow-hidden shadow-lg">
              <img
                src={mockBook.coverImage}
                alt={mockBook.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{mockBook.title}</h2>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary">{mockBook.genre}</Badge>
                    <Badge variant="outline">{mockBook.visualStyle}</Badge>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">
                    {mockBook.synopsis}
                  </p>
                </div>

                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{mockBook.chapters} capítulos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Arco atual: {mockBook.currentArc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 h-auto p-1 bg-muted/30 mt-6">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="characters" className="flex items-center gap-2 py-3">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Personagens</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2 py-3">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Locais</span>
            </TabsTrigger>
            <TabsTrigger value="factions" className="flex items-center gap-2 py-3">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">Facções</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2 py-3">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="magic" className="flex items-center gap-2 py-3">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Magia</span>
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" className="flex items-center gap-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Enciclopédia</span>
            </TabsTrigger>
            <TabsTrigger value="relations" className="flex items-center gap-2 py-3">
              <Network className="w-4 h-4" />
              <span className="hidden sm:inline">Relações</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 pb-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab book={mockBook} />
            </TabsContent>
            <TabsContent value="characters" className="mt-0">
              <CharactersTab />
            </TabsContent>
            <TabsContent value="locations" className="mt-0">
              <LocationsTab />
            </TabsContent>
            <TabsContent value="factions" className="mt-0">
              <FactionsTab />
            </TabsContent>
            <TabsContent value="timeline" className="mt-0">
              <TimelineTab />
            </TabsContent>
            <TabsContent value="magic" className="mt-0">
              <MagicSystemTab />
            </TabsContent>
            <TabsContent value="encyclopedia" className="mt-0">
              <EncyclopediaTab />
            </TabsContent>
            <TabsContent value="relations" className="mt-0">
              <RelationsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}