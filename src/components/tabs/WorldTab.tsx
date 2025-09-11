import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MapPin, Mountain, Home, TreePine, Castle, Globe, Filter, StickyNote, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { CreateWorldModal } from "@/components/modals/CreateWorldModal";
import { CreateContinentModal } from "@/components/modals/CreateContinentModal";
import { CreateLocationModal } from "@/components/modals/CreateLocationModal";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  bookId: string;
  // Specific to Location
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  livingEntities?: string[];
  // Specific to World/Continent
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

interface WorldTabProps {
  bookId: string;
}

// Mock data structure - in real app this would be from state management
const getWorldEntitiesForBook = (bookId: string): WorldEntity[] => {
  const allEntities: Record<string, WorldEntity[]> = {
    "new-book": [], // Empty for new book
    "existing-book": [
      {
        id: "world1",
        bookId: "existing-book",
        name: "Aethermoor",
        type: "World",
        description: "Mundo principal onde se desenrola a história. Um reino de magia e mistério.",
        age: "5000 anos",
        dominantOrganization: "Ordem dos Guardiões",
        image: "/api/placeholder/300/200"
      },
      {
        id: "continent1", 
        bookId: "existing-book",
        name: "Continente Central",
        type: "Continent",
        description: "Continente principal de Aethermoor, rico em recursos mágicos.",
        parentId: "world1",
        age: "3000 anos",
        dominantOrganization: "Reino de Aethermoor",
        image: "/api/placeholder/300/200"
      },
      {
        id: "continent2",
        bookId: "existing-book",
        name: "Terras Sombrias",
        type: "Continent", 
        description: "Continente corrompido pelas trevas, lar do Culto das Sombras.",
        parentId: "world1",
        age: "2000 anos",
        dominantOrganization: "Culto das Sombras",
        image: "/api/placeholder/300/200"
      },
      {
        id: "continent3",
        bookId: "existing-book",
        name: "Ilhas Flutuantes",
        type: "Continent", 
        description: "Continente mágico que flutua nas nuvens, sem ligação com mundos terrestres.",
        age: "1500 anos",
        image: "/api/placeholder/300/200"
      },
      {
        id: "loc1",
        bookId: "existing-book",
        name: "Floresta das Lamentações",
        type: "Location",
        description: "Floresta sombria habitada por criaturas mágicas perigosas.",
        parentId: "continent1",
        classification: "Floresta Mágica",
        climate: "Frio e Úmido",
        location: "Norte do Continente Central",
        terrain: "Florestal",
        organizations: ["Culto das Sombras", "Guarda Florestal"],
        livingEntities: ["Lobos Sombrios", "Espíritos da Floresta", "Dríades Corrompidas", "Unicórnios das Trevas", "Ents Ancestrais"],
        image: "/api/placeholder/300/200"
      },
      {
        id: "loc2",
        bookId: "existing-book",
        name: "Aldeia de Pedraverde",
        type: "Location", 
        description: "Pequena aldeia de mineradores anões nas montanhas.",
        parentId: "continent1",
        classification: "Assentamento",
        climate: "Montanhoso",
        location: "Sul do Continente Central",
        terrain: "Rochoso",
        organizations: ["Guilda dos Artífices"],
        livingEntities: ["Anões", "Águias Gigantes", "Cabras Montanhesas"],
        image: "/api/placeholder/300/200"
      },
      {
        id: "loc3",
        bookId: "existing-book",
        name: "Torre de Cristal",
        type: "Location",
        description: "Antiga torre dos magos, agora em ruínas. Contém segredos sobre magia antiga.",
        classification: "Ruína Mágica",
        climate: "Temperado", 
        terrain: "Planície",
        organizations: [],
        livingEntities: ["Constructos de Cristal", "Wisp de Energia"],
        image: "/api/placeholder/300/200"
      },
      {
        id: "loc4",
        bookId: "existing-book",
        name: "Cidade Flutuante de Nimbus",
        type: "Location",
        description: "Capital das Ilhas Flutuantes, cidade mágica suspensa nas nuvens.",
        parentId: "continent3",
        classification: "Cidade",
        climate: "Aéreo e Fresco",
        location: "Centro das Ilhas Flutuantes",
        terrain: "Aéreo",
        organizations: ["Conselho dos Ventos", "Guarda Celestial"],
        livingEntities: ["Humanos Alados", "Pégasos", "Elementais do Ar", "Fênix Menores"],
        image: "/api/placeholder/300/200"
      }
    ]
  };
  
  return allEntities[bookId] || [];
};

export function WorldTab({ bookId }: WorldTabProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showCreateWorldModal, setShowCreateWorldModal] = useState(false);
  const [showCreateContinentModal, setShowCreateContinentModal] = useState(false);
  const [showCreateLocationModal, setShowCreateLocationModal] = useState(false);

  const [mockWorldEntities, setMockWorldEntities] = useState(() => getWorldEntitiesForBook(bookId));

  const handleCreateWorld = () => {
    setShowCreateWorldModal(true);
  };

  const handleCreateContinent = () => {
    setShowCreateContinentModal(true);
  };

  const handleCreateLocation = () => {
    setShowCreateLocationModal(true);
  };

  const handleWorldCreated = (newWorld: any) => {
    setMockWorldEntities(prev => [...prev, newWorld]);
  };

  const handleContinentCreated = (newContinent: any) => {
    setMockWorldEntities(prev => [...prev, newContinent]);
  };

  const handleLocationCreated = (newLocation: any) => {
    setMockWorldEntities(prev => [...prev, newLocation]);
  };
  
  const worlds = mockWorldEntities.filter(e => e.type === "World");
  const continents = mockWorldEntities.filter(e => e.type === "Continent");
  const locations = mockWorldEntities.filter(e => e.type === "Location");

  const getEntityIcon = (type: string, classification?: string) => {
    if (type === "World") return <Globe className="w-4 h-4" />;
    if (type === "Continent") return <Mountain className="w-4 h-4" />;
    
    // Location icons based on classification
    switch (classification?.toLowerCase()) {
      case "floresta mágica":
        return <TreePine className="w-4 h-4" />;
      case "assentamento":
      case "aldeia":
        return <Home className="w-4 h-4" />;
      case "cidade":
        return <Castle className="w-4 h-4" />;
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

  const getFilteredEntities = (typeFilter?: string) => {
    let entities = mockWorldEntities;
    
    if (typeFilter && typeFilter !== "all") {
      entities = entities.filter(e => e.type === typeFilter);
    }
    
    return entities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entity.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredWorlds = getFilteredEntities("World");
  const filteredContinents = getFilteredEntities("Continent");
  const filteredLocations = getFilteredEntities("Location");

  // Statistics
  const totalWorlds = worlds.length;
  const totalContinents = continents.length;
  const totalLocations = locations.length;

  const handleEntityClick = (entity: WorldEntity) => {
    navigate(`/book/${bookId}/world/${entity.id}`);
  };

  const renderEntityCard = (entity: WorldEntity) => (
    <Card 
      key={entity.id} 
      className="card-magical animate-stagger cursor-pointer hover:shadow-lg transition-all"
      onClick={() => handleEntityClick(entity)}
    >
      {entity.image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={entity.image} 
            alt={entity.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              {getEntityIcon(entity.type, entity.classification)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1">{entity.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
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
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {entity.description}
        </p>
        
        <div className="space-y-2 text-sm">
          {/* Parent information */}
          {entity.type === "Continent" && getParentName(entity.parentId) && (
            <div>
              <span className="font-medium">Mundo:</span>
              <span className="ml-2 text-muted-foreground">{getParentName(entity.parentId)}</span>
            </div>
          )}
          
          {entity.type === "Location" && (
            <>
              {getParentName(entity.parentId) && (
                <div>
                  <span className="font-medium">Continente:</span>
                  <span className="ml-2 text-muted-foreground">{getParentName(entity.parentId)}</span>
                </div>
              )}
              {entity.climate && (
                <div>
                  <span className="font-medium">Clima:</span>
                  <span className="ml-2 text-muted-foreground">{entity.climate}</span>
                </div>
              )}
            </>
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
                {entity.livingEntities.slice(0, 3).map((livingEntity, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {livingEntity}
                  </Badge>
                ))}
                {entity.livingEntities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{entity.livingEntities.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (mockWorldEntities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mundo</h2>
            <p className="text-muted-foreground">Gerencie mundos, continentes e locais</p>
          </div>
          <Button variant="magical" onClick={handleCreateWorld}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Mundo
          </Button>
        </div>
        
        <EmptyState
          icon={Globe}
          title="Nenhum mundo criado"
          description="Comece criando o primeiro mundo da sua história para organizar continentes e locais."
          actionLabel="Criar Mundo"
          onAction={handleCreateWorld}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Global Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mundos, continentes ou locais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Mundos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Mundos
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalWorlds} mundo{totalWorlds !== 1 ? 's' : ''} criado{totalWorlds !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="magical" onClick={handleCreateWorld}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Mundo
          </Button>
        </div>
        
        {filteredWorlds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorlds.map(renderEntityCard)}
          </div>
        ) : (
          <EmptyState
            icon={Globe}
            title="Nenhum mundo criado"
            description="Crie o primeiro mundo da sua história para organizar continentes e locais."
            actionLabel="Criar Mundo"
            onAction={handleCreateWorld}
          />
        )}
      </div>

      {/* Continentes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Mountain className="w-5 h-5" />
              Continentes
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalContinents} continente{totalContinents !== 1 ? 's' : ''} criado{totalContinents !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="magical" onClick={handleCreateContinent}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Continente
          </Button>
        </div>
        
        {filteredContinents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContinents.map(renderEntityCard)}
          </div>
        ) : (
          <EmptyState
            icon={Mountain}
            title="Nenhum continente criado"
            description="Crie continentes para organizar melhor os locais da sua história."
            actionLabel="Criar Continente"
            onAction={handleCreateContinent}
          />
        )}
      </div>

      {/* Locais Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Locais
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalLocations} local{totalLocations !== 1 ? 'is' : ''} criado{totalLocations !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="magical" onClick={handleCreateLocation}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Local
          </Button>
        </div>
        
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map(renderEntityCard)}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Nenhum local criado"
            description="Crie locais específicos onde sua história acontece."
            actionLabel="Criar Local"     
            onAction={handleCreateLocation}
          />
        )}
      </div>

      {/* Modals */}
      <CreateWorldModal
        open={showCreateWorldModal}
        onClose={() => setShowCreateWorldModal(false)}
        onWorldCreated={handleWorldCreated}
        bookId={bookId}
      />

      <CreateContinentModal
        open={showCreateContinentModal}
        onClose={() => setShowCreateContinentModal(false)}
        onContinentCreated={handleContinentCreated}
        bookId={bookId}
        availableWorlds={worlds.map(w => ({ id: w.id, name: w.name }))}
      />

      <CreateLocationModal
        open={showCreateLocationModal}
        onClose={() => setShowCreateLocationModal(false)}
        onLocationCreated={handleLocationCreated}
        bookId={bookId}
        availableParents={[
          ...worlds.map(w => ({ id: w.id, name: w.name, type: "World" })),
          ...continents.map(c => ({ id: c.id, name: c.name, type: "Continent" }))
        ]}
      />
    </div>
  );
}