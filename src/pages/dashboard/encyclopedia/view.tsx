import {
  Plus,
  Edit2,
  Search,
  Book,
  Scroll,
  Globe,
  Sword,
  Crown,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EncyclopediaEntry {
  id: string;
  title: string;
  category:
    | "História"
    | "Geografia"
    | "Cultura"
    | "Política"
    | "Economia"
    | "Religião"
    | "Outros";
  content: string;
  relatedEntries: string[];
  tags: string[];
  lastModified: string;
}

interface CategoryGroup {
  category: string;
  entries: EncyclopediaEntry[];
  count: number;
}

interface EncyclopediaViewProps {
  searchTerm: string;
  selectedCategory: string;
  activeTab: string;
  categories: string[];
  filteredEntries: EncyclopediaEntry[];
  entriesByCategory: CategoryGroup[];
  onSearchTermChange: (term: string) => void;
  onSelectedCategoryChange: (category: string) => void;
  onActiveTabChange: (tab: string) => void;
  onCreateEntry: () => void;
  onEditEntry: (entryId: string) => void;
  onRelatedEntryClick: (relatedEntry: string) => void;
  onCategoryClick: (category: string) => void;
  getCategoryColor: (category: string) => string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "História":
      return <Scroll className="w-4 h-4" />;
    case "Geografia":
      return <Globe className="w-4 h-4" />;
    case "Cultura":
      return <Users className="w-4 h-4" />;
    case "Política":
      return <Crown className="w-4 h-4" />;
    default:
      return <Book className="w-4 h-4" />;
  }
};

export function EncyclopediaView({
  searchTerm,
  selectedCategory,
  activeTab,
  categories,
  filteredEntries,
  entriesByCategory,
  onSearchTermChange,
  onSelectedCategoryChange,
  onActiveTabChange,
  onCreateEntry,
  onEditEntry,
  onRelatedEntryClick,
  onCategoryClick,
  getCategoryColor,
}: EncyclopediaViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enciclopédia do Mundo</h2>
          <p className="text-muted-foreground">
            Organize todo o conhecimento sobre seu universo
          </p>
        </div>
        <Button variant="magical" onClick={onCreateEntry}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={onActiveTabChange}>
        <TabsList>
          <TabsTrigger value="browse">Navegar</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar na enciclopédia..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => onSelectedCategoryChange(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">Todas as categorias</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Entries Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="card-magical animate-stagger">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {getCategoryIcon(entry.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(entry.category)}>
                            {entry.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditEntry(entry.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {entry.content}
                  </p>

                  {entry.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.relatedEntries.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Entradas relacionadas:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.relatedEntries.map((related, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-accent"
                            onClick={() => onRelatedEntryClick(related)}
                          >
                            {related}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Modificado {entry.lastModified}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          {/* Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entriesByCategory.map(({ category, entries, count }) => (
              <Card
                key={category}
                className="card-magical cursor-pointer"
                onClick={() => onCategoryClick(category)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category}</CardTitle>
                      <CardDescription>{count} entradas</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {entries.slice(0, 3).map((entry) => (
                      <div
                        key={entry.id}
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {entry.title}
                      </div>
                    ))}
                    {entries.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{entries.length - 3} mais...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredEntries.length === 0 && activeTab === "browse" && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma entrada encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Tente ajustar sua busca"
              : "Comece criando a primeira entrada da sua enciclopédia"}
          </p>
          <Button variant="magical" onClick={onCreateEntry}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Entrada
          </Button>
        </div>
      )}
    </div>
  );
}