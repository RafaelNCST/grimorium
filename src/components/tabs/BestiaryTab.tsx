import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Shield, Sword, Moon, Sun, TreePine, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateBeastModal } from "@/components/modals/CreateBeastModal";
import { StatsCard } from "@/components/StatsCard";
import { EmptyState } from "@/components/EmptyState";

interface Beast {
  id: string;
  name: string;
  race?: string;
  species?: string;
  basicDescription: string;
  habit: string;
  threatLevel: {
    name: string;
    color: string;
  };
  image?: string;
  humanComparison: string;
}

// Mock data for beasts
const getBookBeasts = (bookId: string): Beast[] => {
  if (bookId === "4") {
    return [];
  }
  
  return [
    {
      id: "1",
      name: "Dragão Sombrio",
      race: "Dracônico",
      species: "Reptiliano",
      basicDescription: "Criatura ancestral de escamas negras que domina as artes da magia sombria.",
      habit: "noturno",
      threatLevel: { name: "apocalíptico", color: "red" },
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      humanComparison: "impossível de ganhar"
    },
    {
      id: "2", 
      name: "Lobo das Névoas",
      race: "Lupino",
      species: "Mamífero",
      basicDescription: "Predador fantasmagórico que se materializa através da névoa matinal.",
      habit: "crepuscular",
      threatLevel: { name: "médio", color: "yellow" },
      image: "https://images.unsplash.com/photo-1553830591-fddf9c6aab9e?w=400&h=300&fit=crop",
      humanComparison: "mais forte"
    },
    {
      id: "3",
      name: "Pixie Luminoso",
      race: "Feérico",
      species: "Espírito",
      basicDescription: "Pequena criatura mágica que emite luz própria e possui natureza brincalhona.",
      habit: "diurno",
      threatLevel: { name: "inexistente", color: "green" },
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      humanComparison: "impotente"
    },
    {
      id: "4",
      name: "Basilisco Venenoso",
      race: "Serpentino",
      species: "Reptiliano",
      basicDescription: "Serpente gigante cujo olhar pode petrificar e cujo veneno é letal.",
      habit: "subterrâneo",
      threatLevel: { name: "mortal", color: "orange" },
      image: "https://images.unsplash.com/photo-1516301617588-4c7a8b6c4a6e?w=400&h=300&fit=crop",
      humanComparison: "impossível de ganhar"
    }
  ];
};

const threatLevels = [
  { name: "inexistente", color: "green" },
  { name: "baixo", color: "blue" },
  { name: "médio", color: "yellow" },
  { name: "mortal", color: "orange" },
  { name: "apocalíptico", color: "red" }
];

const habits = ["diurno", "noturno", "crepuscular", "migratório", "caótico", "subterrâneo"];

const humanComparisons = [
  "impotente",
  "mais fraco", 
  "ligeiramente mais fraco",
  "igual",
  "ligeiramente mais forte",
  "mais forte",
  "impossível de ganhar"
];

export function BestiaryTab({ bookId }: { bookId: string }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRace, setSelectedRace] = useState<string>("all");
  const [selectedThreatLevel, setSelectedThreatLevel] = useState<string>("all");
  const [selectedHabit, setSelectedHabit] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const beasts = getBookBeasts(bookId);
  
  // Filter beasts based on search and filters
  const filteredBeasts = beasts.filter(beast => {
    const matchesSearch = beast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         beast.basicDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRace = selectedRace === "all" || beast.race === selectedRace;
    const matchesThreat = selectedThreatLevel === "all" || beast.threatLevel.name === selectedThreatLevel;
    const matchesHabit = selectedHabit === "all" || beast.habit === selectedHabit;
    
    return matchesSearch && matchesRace && matchesThreat && matchesHabit;
  });

  // Get unique races from beasts
  const uniqueRaces = Array.from(new Set(beasts.map(beast => beast.race).filter(Boolean)));

  const getThreatLevelIcon = (threatLevel: string) => {
    switch (threatLevel) {
      case "inexistente": return Shield;
      case "baixo": return Shield;
      case "médio": return Sword;
      case "mortal": return Skull;
      case "apocalíptico": return Skull;
      default: return Shield;
    }
  };

  const getHabitIcon = (habit: string) => {
    switch (habit) {
      case "diurno": return Sun;
      case "noturno": return Moon;
      case "subterrâneo": return TreePine;
      default: return Sun;
    }
  };

  const getComparisonColor = (comparison: string) => {
    switch (comparison) {
      case "impotente": return "text-green-600";
      case "mais fraco": return "text-green-500";
      case "ligeiramente mais fraco": return "text-blue-500";
      case "igual": return "text-gray-500";
      case "ligeiramente mais forte": return "text-yellow-500";
      case "mais forte": return "text-orange-500";
      case "impossível de ganhar": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  if (beasts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bestiário</h2>
            <p className="text-muted-foreground">Gerencie as criaturas do seu mundo</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="btn-magical">
            <Plus className="w-4 h-4 mr-2" />
            Nova Besta
          </Button>
        </div>

        <EmptyState
          icon={Skull}
          title="Nenhuma besta cadastrada"
          description="Comece criando sua primeira criatura para popular o bestiário do seu mundo."
          actionLabel="Criar Primeira Besta"
          onAction={() => setShowCreateModal(true)}
        />

        <CreateBeastModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          bookId={bookId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bestiário</h2>
          <p className="text-muted-foreground">Gerencie as criaturas do seu mundo</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="btn-magical">
          <Plus className="w-4 h-4 mr-2" />
          Nova Besta
        </Button>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Bestas"
          value={beasts.length}
          icon={Skull}
        />
        <StatsCard
          title="Ameaça Mortal+"
          value={beasts.filter(b => ['mortal', 'apocalíptico'].includes(b.threatLevel.name)).length}
          icon={Skull}
        />
        <StatsCard
          title="Criaturas Diurnas"
          value={beasts.filter(b => b.habit === 'diurno').length}
          icon={Sun}
        />
        <StatsCard
          title="Criaturas Noturnas"
          value={beasts.filter(b => b.habit === 'noturno').length}
          icon={Moon}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar bestas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedRace} onValueChange={setSelectedRace}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Raça" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as raças</SelectItem>
              {uniqueRaces.map((race) => (
                <SelectItem key={race} value={race}>{race}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedThreatLevel} onValueChange={setSelectedThreatLevel}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Nível de ameaça" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ameaças</SelectItem>
              {threatLevels.map((level) => (
                <SelectItem key={level.name} value={level.name}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${level.color}-500`} />
                    {level.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedHabit} onValueChange={setSelectedHabit}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Hábito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os hábitos</SelectItem>
              {habits.map((habit) => (
                <SelectItem key={habit} value={habit}>{habit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Beasts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeasts.map((beast) => (
          <Card 
            key={beast.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => navigate(`/beast/${beast.id}`)}
          >
            <CardHeader className="p-0">
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={beast.image || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"}
                  alt={beast.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <CardTitle className="text-lg">{beast.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {beast.basicDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {beast.race && (
                    <Badge variant="secondary" className="text-xs">
                      {beast.race}
                    </Badge>
                  )}
                  {beast.species && (
                    <Badge variant="outline" className="text-xs">
                      {beast.species}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {React.createElement(getThreatLevelIcon(beast.threatLevel.name), { className: "w-4 h-4" })}
                    <span className={`text-xs font-medium text-${beast.threatLevel.color}-600`}>
                      {beast.threatLevel.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {React.createElement(getHabitIcon(beast.habit), { className: "w-4 h-4" })}
                    <span className="text-xs text-muted-foreground">
                      {beast.habit}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">vs Humano:</span>
                    <span className={`text-xs font-medium ${getComparisonColor(beast.humanComparison)}`}>
                      {beast.humanComparison}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {filteredBeasts.length === 0 && beasts.length > 0 && (
        <EmptyState
          icon={Search}
          title="Nenhuma besta encontrada"
          description="Tente ajustar os filtros ou o termo de busca."
        />
      )}

      <CreateBeastModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        bookId={bookId}
      />
    </div>
  );
}