import { useState } from "react";
import { Plus, Edit2, Search, MapPin, Mountain, Home, TreePine, Castle, Globe, Filter, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  // Specific to Location
  classification?: string;
  climate?: string;
  terrain?: string;
  organizations?: string[];
  livingEntities?: string[];
  // Specific to World/Continent
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

const mockWorldEntities: WorldEntity[] = [
  {
    id: "world1",
    name: "Aethermoor",
    type: "World",
    description: "Mundo principal onde se desenrola a história. Um reino de magia e mistério.",
    age: "5000 anos",
    dominantOrganization: "Ordem dos Guardiões"
  },
  {
    id: "continent1", 
    name: "Continente Central",
    type: "Continent",
    description: "Continente principal de Aethermoor, rico em recursos mágicos.",
    parentId: "world1",
    age: "3000 anos",
    dominantOrganization: "Reino de Aethermoor"
  },
  {
    id: "continent2",
    name: "Terras Sombrias",
    type: "Continent", 
    description: "Continente corrompido pelas trevas, lar do Culto das Sombras.",
    parentId: "world1",
    age: "2000 anos",
    dominantOrganization: "Culto das Sombras"
  },
  {
    id: "loc1",
    name: "Floresta das Lamentações",
    type: "Location",
    description: "Floresta sombria habitada por criaturas mágicas perigosas.",
    parentId: "continent1",
    classification: "Floresta Mágica",
    climate: "Frio e Úmido",
    terrain: "Florestal",
    organizations: ["Culto das Sombras"],
    livingEntities: ["Lobos Sombrios", "Espíritos da Floresta", "Dríades Corrompidas"]
  },
  {
    id: "loc2",
    name: "Aldeia de Pedraverde",
    type: "Location", 
    description: "Pequena aldeia de mineradores anões nas montanhas.",
    parentId: "continent1",
    classification: "Assentamento",
    climate: "Montanhoso",
    terrain: "Rochoso",
    organizations: ["Guilda dos Artífices"],
    livingEntities: ["Anões", "Águias Gigantes", "Cabras Montanhesas"]
  },
  {
    id: "loc3",
    name: "Torre de Cristal",
    type: "Location",
    description: "Antiga torre dos magos, agora em ruínas. Contém segredos sobre magia antiga.",
    classification: "Ruína Mágica",
    climate: "Temperado", 
    terrain: "Planície",
    organizations: [],
    livingEntities: ["Constructos de Cristal", "Wisp de Energia"]
  }
];

export function WorldTab() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedParent, setSelectedParent] = useState<string>("all");

  const typeOptions = ["all", "World", "Continent", "Location"];
  const worlds = mockWorldEntities.filter(e => e.type === "World");
  const continents = mockWorldEntities.filter(e => e.type === "Continent");

  const getEntityIcon = (type: string, classification?: string) => {
    if (type === "World") return <Globe className="w-4 h-4" />;
    if (type === "Continent") return <Mountain className="w-4 h-4" />;
    
    // Location icons based on classification
    switch (classification?.toLowerCase()) {
      case "floresta mágica":
        return <TreePine className="w-4 h-4" />;
      case "assentamento":
        return <Home className="w-4 h-4" />;
      case "ruína mágica":
        return <Castle className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "World":
        return "bg-primary text-primary-foreground";
      case "Continent":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getParentName = (parentId?: string) => {
    if (!parentId) return "";
    const parent = mockWorldEntities.find(e => e.id === parentId);
    return parent?.name || "";
  };

  const filteredEntities = mockWorldEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || entity.type === selectedType;
    const matchesParent = selectedParent === "all" || 
                         (selectedParent === "none" && !entity.parentId) ||
                         entity.parentId === selectedParent;
    return matchesSearch && matchesType && matchesParent;
  });

  // Statistics
  const totalWorlds = mockWorldEntities.filter(e => e.type === "World").length;
  const totalContinents = mockWorldEntities.filter(e => e.type === "Continent").length;
  const totalLocations = mockWorldEntities.filter(e => e.type === "Location").length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mundo</h2>
          <p className="text-muted-foreground">Gerencie mundos, continentes e locais</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{totalWorlds} Mundos</Badge>
            <Badge variant="outline">{totalContinents} Continentes</Badge>
            <Badge variant="outline">{totalLocations} Locais</Badge>
          </div>
        </div>
        <Button variant="magical">
          <Plus className="w-4 h-4 mr-2" />
          Novo Local
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar locais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {typeOptions.slice(1).map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedParent} onValueChange={setSelectedParent}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Hierarquia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas hierarquias</SelectItem>
            <SelectItem value="none">Sem hierarquia</SelectItem>
            {worlds.map(world => (
              <SelectItem key={world.id} value={world.id}>{world.name}</SelectItem>
            ))}
            {continents.map(continent => (
              <SelectItem key={continent.id} value={continent.id}>{continent.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntities.map((entity) => (
          <Card key={entity.id} className="card-magical animate-stagger">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getEntityIcon(entity.type, entity.classification)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{entity.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(entity.type)}>
                        {entity.type}
                      </Badge>
                      {entity.classification && (
                        <Badge variant="outline" className="text-xs">
                          {entity.classification}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {entity.description}
              </p>
              
              <div className="space-y-2 text-sm">
                {getParentName(entity.parentId) && (
                  <div>
                    <span className="font-medium">Localização:</span>
                    <span className="ml-2 text-muted-foreground">{getParentName(entity.parentId)}</span>
                  </div>
                )}
                
                {entity.climate && (
                  <div>
                    <span className="font-medium">Clima:</span>
                    <span className="ml-2 text-muted-foreground">{entity.climate}</span>
                  </div>
                )}
                
                {entity.age && (
                  <div>
                    <span className="font-medium">Idade:</span>
                    <span className="ml-2 text-muted-foreground">{entity.age}</span>
                  </div>
                )}

                {entity.dominantOrganization && (
                  <div>
                    <span className="font-medium">Org. Dominante:</span>
                    <span className="ml-2 text-muted-foreground">{entity.dominantOrganization}</span>
                  </div>
                )}

                {entity.livingEntities && entity.livingEntities.length > 0 && (
                  <div>
                    <span className="font-medium">Entidades:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entity.livingEntities.slice(0, 2).map((entity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                      {entity.livingEntities.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entity.livingEntities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {entity.type === "Location" && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Quadro de notas disponível</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntities.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum local encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedType !== "all" 
              ? "Tente ajustar seus filtros" 
              : "Comece criando o primeiro mundo da sua história"}
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Mundo
          </Button>
        </div>
      )}
    </div>
  );
}