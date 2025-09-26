import React from "react";

import {
  Plus,
  Search,
  Shield,
  Sword,
  Moon,
  Sun,
  TreePine,
  Skull,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CreateBeastModal } from "@/components/modals/create-beast-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface BestiaryViewProps {
  bookId: string;
  beasts: Beast[];
  filteredBeasts: Beast[];
  uniqueRaces: string[];
  searchQuery: string;
  selectedRace: string;
  selectedThreatLevel: string;
  selectedHabit: string;
  showCreateModal: boolean;
  onSearchQueryChange: (query: string) => void;
  onSelectedRaceChange: (race: string) => void;
  onSelectedThreatLevelChange: (level: string) => void;
  onSelectedHabitChange: (habit: string) => void;
  onShowCreateModalChange: (show: boolean) => void;
  onNavigateToBeast: (beastId: string) => void;
}

const threatLevels = [
  { name: "inexistente", color: "green" },
  { name: "baixo", color: "blue" },
  { name: "médio", color: "yellow" },
  { name: "mortal", color: "orange" },
  { name: "apocalíptico", color: "red" },
];

const habits = [
  "diurno",
  "noturno",
  "crepuscular",
  "migratório",
  "caótico",
  "subterrâneo",
];

const getThreatLevelIcon = (threatLevel: string) => {
  switch (threatLevel) {
    case "inexistente":
      return Shield;
    case "baixo":
      return Shield;
    case "médio":
      return Sword;
    case "mortal":
      return Skull;
    case "apocalíptico":
      return Skull;
    default:
      return Shield;
  }
};

const getHabitIcon = (habit: string) => {
  switch (habit) {
    case "diurno":
      return Sun;
    case "noturno":
      return Moon;
    case "subterrâneo":
      return TreePine;
    default:
      return Sun;
  }
};

const getComparisonColor = (comparison: string) => {
  switch (comparison) {
    case "impotente":
      return "text-green-600";
    case "mais fraco":
      return "text-green-500";
    case "ligeiramente mais fraco":
      return "text-blue-500";
    case "igual":
      return "text-gray-500";
    case "ligeiramente mais forte":
      return "text-yellow-500";
    case "mais forte":
      return "text-orange-500";
    case "impossível de ganhar":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export function BestiaryView({
  bookId,
  beasts,
  filteredBeasts,
  uniqueRaces,
  searchQuery,
  selectedRace,
  selectedThreatLevel,
  selectedHabit,
  showCreateModal,
  onSearchQueryChange,
  onSelectedRaceChange,
  onSelectedThreatLevelChange,
  onSelectedHabitChange,
  onShowCreateModalChange,
  onNavigateToBeast,
}: BestiaryViewProps) {
  if (beasts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bestiário</h2>
            <p className="text-muted-foreground">
              Gerencie as criaturas do seu mundo
            </p>
          </div>
          <Button
            onClick={() => onShowCreateModalChange(true)}
            className="btn-magical"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Besta
          </Button>
        </div>

        <EmptyState
          icon={Skull}
          title="Nenhuma besta cadastrada"
          description="Comece criando sua primeira criatura para popular o bestiário do seu mundo."
          actionLabel="Criar Primeira Besta"
          onAction={() => onShowCreateModalChange(true)}
        />

        <CreateBeastModal
          open={showCreateModal}
          onOpenChange={onShowCreateModalChange}
          bookId={bookId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with compact threat level stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bestiário</h2>
          <p className="text-muted-foreground">
            Gerencie as criaturas do seu mundo
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{beasts.length} Total</Badge>
            <Badge className="bg-green-100 text-green-700">
              {
                beasts.filter((b) => b.threatLevel.name === "inexistente")
                  .length
              }{" "}
              Inofensivo
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-700">
              {beasts.filter((b) => b.threatLevel.name === "médio").length}{" "}
              Médio
            </Badge>
            <Badge className="bg-red-100 text-red-700">
              {
                beasts.filter((b) =>
                  ["mortal", "apocalíptico"].includes(b.threatLevel.name)
                ).length
              }{" "}
              Letal
            </Badge>
          </div>
        </div>
        <Button
          onClick={() => onShowCreateModalChange(true)}
          className="btn-magical"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Besta
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar bestas..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedRace} onValueChange={onSelectedRaceChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Raça" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todas as raças</SelectItem>
            {uniqueRaces.map((race) => (
              <SelectItem key={race} value={race}>
                {race}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedThreatLevel}
          onValueChange={onSelectedThreatLevelChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Nível de ameaça" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todas as ameaças</SelectItem>
            {threatLevels.map((level) => (
              <SelectItem key={level.name} value={level.name}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full bg-${level.color}-500`}
                  />
                  {level.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedHabit} onValueChange={onSelectedHabitChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Hábito" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todos os hábitos</SelectItem>
            {habits.map((habit) => (
              <SelectItem key={habit} value={habit}>
                {habit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Beasts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeasts.map((beast) => (
          <Card
            key={beast.id}
            className="cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => onNavigateToBeast(beast.id)}
          >
            <CardHeader className="p-0">
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={
                    beast.image ||
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
                  }
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
                    {React.createElement(
                      getThreatLevelIcon(beast.threatLevel.name),
                      { className: "w-4 h-4" }
                    )}
                    <span
                      className={`text-xs font-medium text-${beast.threatLevel.color}-600`}
                    >
                      {beast.threatLevel.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {React.createElement(getHabitIcon(beast.habit), {
                      className: "w-4 h-4",
                    })}
                    <span className="text-xs text-muted-foreground">
                      {beast.habit}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      vs Humano:
                    </span>
                    <span
                      className={`text-xs font-medium ${getComparisonColor(beast.humanComparison)}`}
                    >
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
        onOpenChange={onShowCreateModalChange}
        bookId={bookId}
      />
    </div>
  );
}