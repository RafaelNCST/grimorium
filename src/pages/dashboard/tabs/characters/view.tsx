import { Plus, Search, Users, MapPin } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CreateCharacterModal } from "@/components/modals/create-character-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { ICharacter } from "./mocks/mock-characters";
import { getRoleColor } from "./utils/get-role-color";
import { getRoleIcon } from "./utils/get-role-icon";
import { getRoleLabel } from "./utils/get-role-label";

interface IRoleStats {
  total: number;
  protagonista: number;
  antagonista: number;
  secundario: number;
  vilao: number;
}

interface CharactersViewProps {
  bookId: string;
  characters: ICharacter[];
  filteredCharacters: ICharacter[];
  organizations: string[];
  locations: string[];
  roleStats: IRoleStats;
  searchTerm: string;
  selectedOrg: string;
  selectedLocation: string;
  onSearchTermChange: (term: string) => void;
  onSelectedOrgChange: (org: string) => void;
  onSelectedLocationChange: (location: string) => void;
  onCharacterCreated: (character: ICharacter) => void;
  onCharacterClick: (characterId: string) => void;
}

export function CharactersView({
  characters,
  filteredCharacters,
  organizations,
  locations,
  roleStats,
  searchTerm,
  selectedOrg,
  selectedLocation,
  onSearchTermChange,
  onSelectedOrgChange,
  onSelectedLocationChange,
  onCharacterCreated,
  onCharacterClick,
}: CharactersViewProps) {
  return (
    <div className="space-y-6">
      {/* Header with compact role stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personagens</h2>
          <p className="text-muted-foreground">
            Gerencie os personagens da sua história
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{roleStats.total} Total</Badge>
            <Badge className="bg-accent/10 text-accent">
              {roleStats.protagonista} Protagonista
            </Badge>
            <Badge className="bg-destructive/10 text-destructive">
              {roleStats.antagonista} Antagonista
            </Badge>
            <Badge className="bg-primary/10 text-primary">
              {roleStats.secundario} Secundário
            </Badge>
            <Badge className="bg-muted/50 text-muted-foreground">
              {roleStats.vilao} Vilão
            </Badge>
          </div>
        </div>
        <CreateCharacterModal
          trigger={
            <Button variant="magical" data-testid="create-character-trigger">
              <Plus className="w-4 h-4 mr-2" />
              Novo Personagem
            </Button>
          }
          onCharacterCreated={onCharacterCreated}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personagens..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedOrg} onValueChange={onSelectedOrgChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Organização" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todas organizações</SelectItem>
            {organizations.slice(1).map((org) => (
              <SelectItem key={org} value={org}>
                {org}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedLocation}
          onValueChange={onSelectedLocationChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Local" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todos locais</SelectItem>
            {locations.slice(1).map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => (
          <Card
            key={character.id}
            className="card-magical animate-stagger cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onCharacterClick(character.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-16 h-16 aspect-square">
                  <AvatarImage src={character.image} className="object-cover" />
                  <AvatarFallback className="text-lg">
                    {character.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={getRoleColor(character.role)}
                      variant="secondary"
                    >
                      {getRoleIcon(character.role)}
                      <span className="ml-1">
                        {getRoleLabel(character.role)}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {character.description}
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{character.organization}</span>
                </div>
                {character.birthPlace && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{character.birthPlace}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {character.qualities.slice(0, 3).map((quality) => (
                  <Badge key={quality} variant="outline" className="text-xs">
                    {quality}
                  </Badge>
                ))}
                {character.qualities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{character.qualities.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <EmptyState
          icon={Users}
          title={
            characters.length === 0
              ? "Nenhum personagem criado"
              : "Nenhum personagem encontrado"
          }
          description={
            characters.length === 0
              ? "Comece criando seu primeiro personagem para dar vida à sua história"
              : "Tente ajustar seus filtros ou criar um novo personagem"
          }
          actionLabel={characters.length === 0 ? "Criar Personagem" : undefined}
          onAction={
            characters.length === 0
              ? () => {
                  const trigger = document.querySelector(
                    '[data-testid="create-character-trigger"]'
                  ) as HTMLButtonElement;
                  trigger?.click();
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
