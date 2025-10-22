import { Plus, Search, Building, Globe } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CreateFactionModal } from "@/components/modals/create-faction-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { IFaction } from "@/types/faction-types";

import { getAlignmentColor } from "./utils/formatters/get-alignment-color";
import { getInfluenceColor } from "./utils/formatters/get-influence-color";
import { getFactionIcon } from "./utils/formatters/get-faction-icon";

const MOCK_CHARACTERS: any[] = [];
const MOCK_LOCATIONS: any[] = [];

interface PropsFactionsView {
  bookId: string;
  factions: IFaction[];
  filteredFactions: IFaction[];
  totalByAlignment: {
    bem: number;
    neutro: number;
    caotico: number;
  };
  searchTerm: string;
  selectedAlignment: string;
  selectedWorld: string;
  showCreateModal: boolean;
  alignments: string[];
  worlds: string[];
  onSearchTermChange: (term: string) => void;
  onSelectedAlignmentChange: (alignment: string) => void;
  onSelectedWorldChange: (world: string) => void;
  onShowCreateModalChange: (show: boolean) => void;
  onCreateFaction: () => void;
  onFactionCreated: (faction: IFaction) => void;
  onFactionClick: (factionId: string) => void;
}

export function FactionsView({
  bookId,
  factions,
  filteredFactions,
  totalByAlignment,
  searchTerm,
  selectedAlignment,
  selectedWorld,
  showCreateModal,
  alignments,
  worlds,
  onSearchTermChange,
  onSelectedAlignmentChange,
  onSelectedWorldChange,
  onShowCreateModalChange,
  onCreateFaction,
  onFactionCreated,
  onFactionClick,
}: PropsFactionsView) {
  const totalFactions = factions.length;

  // Empty state when no factions exist
  if (totalFactions === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Facções</h2>
            <p className="text-muted-foreground">
              Gerencie as facções, reinos, seitas e grupos do seu mundo
            </p>
          </div>
          <Button
            variant="magical"
            size="lg"
            onClick={onCreateFaction}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Facção
          </Button>
        </div>

        <EmptyState
          icon={Building}
          title="Nenhuma facção criada"
          description="Comece criando a primeira facção do seu mundo para gerenciar reinos, seitas e grupos."
        />

        <CreateFactionModal
          open={showCreateModal}
          onClose={() => onShowCreateModalChange(false)}
          onFactionCreated={onFactionCreated}
          bookId={bookId}
          availableCharacters={MOCK_CHARACTERS}
          availableLocations={MOCK_LOCATIONS}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facções</h2>
          <p className="text-muted-foreground">
            Gerencie as facções, reinos, seitas e grupos do seu mundo
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{totalFactions} Total</Badge>
            <Badge className="bg-success/10 text-success">
              {totalByAlignment.bem} Bem
            </Badge>
            <Badge className="bg-secondary/10 text-secondary-foreground">
              {totalByAlignment.neutro} Neutro
            </Badge>
            <Badge className="bg-destructive/10 text-destructive">
              {totalByAlignment.caotico} Caótico
            </Badge>
          </div>
        </div>
        <Button
          variant="magical"
          size="lg"
          onClick={onCreateFaction}
          className="animate-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Facção
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar facções..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={selectedAlignment}
          onValueChange={onSelectedAlignmentChange}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Alinhamento" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todos</SelectItem>
            {alignments.slice(1).map((alignment) => (
              <SelectItem key={alignment} value={alignment}>
                {alignment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedWorld} onValueChange={onSelectedWorldChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Mundo" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todos</SelectItem>
            {worlds.slice(1).map((world) => (
              <SelectItem key={world} value={world}>
                {world}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredFactions.length === 0 ? (
        <EmptyState
          icon={Building}
          title="Nenhuma facção encontrada"
          description="Tente ajustar seus filtros para encontrar facções."
        />
      ) : (
        <div className="space-y-6">
          {filteredFactions.map((faction) => (
          <Card
            key={faction.id}
            className="card-magical animate-stagger cursor-pointer hover:shadow-lg transition-all"
            onClick={() => onFactionClick(faction.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getFactionIcon(faction.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {faction.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{faction.type}</Badge>
                      <Badge
                        className={getAlignmentColor(faction.alignment)}
                      >
                        {faction.alignment}
                      </Badge>
                      <Badge
                        className={getInfluenceColor(faction.influence)}
                      >
                        {faction.influence}
                      </Badge>
                      {faction.world && (
                        <Badge variant="secondary" className="bg-muted/50">
                          <Globe className="w-3 h-3 mr-1" />
                          {faction.world}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {faction.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {faction.leaders.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Líderes</h4>
                      <div className="space-y-2">
                        {faction.leaders.map((leader, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {leader
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{leader}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {faction.baseLocation && (
                    <div>
                      <h4 className="font-medium mb-2">Base Principal</h4>
                      <p className="text-sm text-muted-foreground">
                        {faction.baseLocation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      <CreateFactionModal
        open={showCreateModal}
        onClose={() => onShowCreateModalChange(false)}
        onFactionCreated={onFactionCreated}
        bookId={bookId}
        availableCharacters={MOCK_CHARACTERS}
        availableLocations={MOCK_LOCATIONS}
      />
    </div>
  );
}
