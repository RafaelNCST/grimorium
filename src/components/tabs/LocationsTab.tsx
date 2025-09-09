import { useState } from "react";
import { Plus, Edit2, Search, MapPin, Mountain, Home, TreePine, Castle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  region: string;
  importance: "Alta" | "Média" | "Baixa";
  climate?: string;
  population?: string;
}

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Reino de Aethermoor",
    type: "Reino",
    description: "Reino principal onde se desenrola a maior parte da história. Conhecido por suas planícies verdejantes e montanhas místicas.",
    region: "Continente Central",
    importance: "Alta",
    climate: "Temperado",
    population: "500.000"
  },
  {
    id: "2",
    name: "Floresta das Lamentações",
    type: "Floresta",
    description: "Floresta sombria habitada por criaturas mágicas perigosas. Local de importantes rituais ancestrais.",
    region: "Norte de Aethermoor",
    importance: "Alta",
    climate: "Frio e Úmido"
  },
  {
    id: "3",
    name: "Aldeia de Pedraverde", 
    type: "Aldeia",
    description: "Pequena aldeia de mineradores anões nas montanhas. Local de nascimento do personagem Finn.",
    region: "Montanhas do Leste",
    importance: "Média",
    climate: "Montanhoso",
    population: "2.500"
  },
  {
    id: "4",
    name: "Torre de Cristal",
    type: "Torre",
    description: "Antiga torre dos magos, agora em ruínas. Contém segredos sobre a magia antiga.",
    region: "Planícies Centrais",
    importance: "Alta",
    climate: "Temperado"
  }
];

export function LocationsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const locationTypes = ["all", "Reino", "Floresta", "Aldeia", "Torre", "Cidade", "Montanha"];

  const getLocationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "reino":
        return <Castle className="w-4 h-4" />;
      case "floresta":
        return <TreePine className="w-4 h-4" />;
      case "aldeia":
        return <Home className="w-4 h-4" />;
      case "montanha":
        return <Mountain className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Alta":
        return "bg-destructive text-destructive-foreground";
      case "Média":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredLocations = mockLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || location.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Locais</h2>
          <p className="text-muted-foreground">Explore os lugares do seu mundo</p>
        </div>
        <Button variant="magical">
          <Plus className="w-4 h-4 mr-2" />
          Novo Local
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar locais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">Todos os tipos</option>
          {locationTypes.slice(1).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="card-magical animate-stagger">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getLocationIcon(location.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {location.type}
                      </Badge>
                      <Badge className={getImportanceColor(location.importance)}>
                        {location.importance}
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
              <p className="text-sm text-muted-foreground mb-4">
                {location.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Região:</span>
                  <span className="ml-2 text-muted-foreground">{location.region}</span>
                </div>
                
                {location.climate && (
                  <div>
                    <span className="font-medium">Clima:</span>
                    <span className="ml-2 text-muted-foreground">{location.climate}</span>
                  </div>
                )}
                
                {location.population && (
                  <div>
                    <span className="font-medium">População:</span>
                    <span className="ml-2 text-muted-foreground">{location.population} habitantes</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum local encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedType !== "all" 
              ? "Tente ajustar seus filtros" 
              : "Comece criando o primeiro local do seu mundo"}
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Local
          </Button>
        </div>
      )}
    </div>
  );
}