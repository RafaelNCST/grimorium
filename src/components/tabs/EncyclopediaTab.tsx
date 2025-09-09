import { useState } from "react";
import { Plus, Edit2, Search, Book, Scroll, Globe, Sword, Crown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EncyclopediaEntry {
  id: string;
  title: string;
  category: "História" | "Geografia" | "Cultura" | "Política" | "Economia" | "Religião" | "Outros";
  content: string;
  relatedEntries: string[];
  tags: string[];
  lastModified: string;
}

const mockEntries: EncyclopediaEntry[] = [
  {
    id: "1",
    title: "A Era das Trevas",
    category: "História",
    content: "Período sombrio da história mundial que durou aproximadamente 1000 anos. Iniciou-se com a Grande Ruptura, evento que dividiu o mundo entre luz e trevas. Durante este período, criaturas sombrias dominaram vastas regiões, forçando a humanidade a se refugiar em cidades fortificadas.",
    relatedEntries: ["Grande Ruptura", "Ordem dos Guardiões"],
    tags: ["história", "trevas", "guerra"],
    lastModified: "há 2 dias"
  },
  {
    id: "2",
    title: "Cristais de Aetherium",
    category: "Geografia", 
    content: "Cristais mágicos raros encontrados apenas nas Montanhas Celestiais. São a principal fonte de poder mágico no mundo. Possuem uma cor azul-prateada e emitem uma luz suave. Extremamente valiosos e disputados por todas as facções.",
    relatedEntries: ["Montanhas Celestiais", "Sistema de Magia"],
    tags: ["magia", "cristais", "recursos"],
    lastModified: "há 1 semana"
  },
  {
    id: "3",
    title: "Festivais da Lua Prateada",
    category: "Cultura",
    content: "Celebração anual realizada durante a lua cheia de inverno. Marca o fim do período mais sombrio do ano e renova as esperanças de paz. Inclui danças rituais, oferendas aos ancestrais e a tradicional Cerimônia das Luzes.",
    relatedEntries: ["Cultura Élfica", "Religião da Luz"],
    tags: ["festival", "cultura", "tradição"],
    lastModified: "há 5 dias"
  },
  {
    id: "4", 
    title: "Conselho dos Reinos",
    category: "Política",
    content: "Órgão político formado pelos representantes dos cinco principais reinos. Criado para coordenar a defesa contra as ameaças sombrias e mediar conflitos entre os reinos. Reúne-se na Torre Neutra uma vez por estação.",
    relatedEntries: ["Reino de Aethermoor", "Torre Neutra"],
    tags: ["política", "governo", "diplomacia"],
    lastModified: "há 3 dias"
  }
];

export function EncyclopediaTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");

  const categories = ["all", "História", "Geografia", "Cultura", "Política", "Economia", "Religião", "Outros"];

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "História":
        return "bg-accent text-accent-foreground";
      case "Geografia":
        return "bg-success text-success-foreground";
      case "Cultura":
        return "bg-primary text-primary-foreground";
      case "Política":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredEntries = mockEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const entriesByCategory = categories.slice(1).map(category => ({
    category,
    entries: mockEntries.filter(entry => entry.category === category),
    count: mockEntries.filter(entry => entry.category === category).length
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enciclopédia do Mundo</h2>
          <p className="text-muted-foreground">Organize todo o conhecimento sobre seu universo</p>
        </div>
        <Button variant="magical">
          <Plus className="w-4 h-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">Todas as categorias</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
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
                    <Button variant="ghost" size="icon">
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
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.relatedEntries.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs font-medium text-muted-foreground">Entradas relacionadas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.relatedEntries.map((related, index) => (
                          <Badge key={index} variant="secondary" className="text-xs cursor-pointer hover:bg-accent">
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
              <Card key={category} className="card-magical cursor-pointer">
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
                      <div key={entry.id} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
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
          <h3 className="text-lg font-semibold mb-2">Nenhuma entrada encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all" 
              ? "Tente ajustar sua busca" 
              : "Comece criando a primeira entrada da sua enciclopédia"}
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Entrada
          </Button>
        </div>
      )}
    </div>
  );
}