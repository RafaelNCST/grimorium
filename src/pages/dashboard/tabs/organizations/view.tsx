import { Plus, Search, Building, Globe } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CreateOrganizationModal } from "@/components/modals/create-organization-modal";
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
import { IOrganization } from "@/types/organization-types";

import { getAlignmentColor } from "./utils/formatters/get-alignment-color";
import { getInfluenceColor } from "./utils/formatters/get-influence-color";
import { getOrganizationIcon } from "./utils/formatters/get-organization-icon";

const MOCK_CHARACTERS: any[] = [];
const MOCK_LOCATIONS: any[] = [];

interface PropsOrganizationsView {
  bookId: string;
  organizations: IOrganization[];
  filteredOrganizations: IOrganization[];
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
  onCreateOrganization: () => void;
  onOrganizationCreated: (organization: IOrganization) => void;
  onOrganizationClick: (orgId: string) => void;
}

export function OrganizationsView({
  bookId,
  organizations,
  filteredOrganizations,
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
  onCreateOrganization,
  onOrganizationCreated,
  onOrganizationClick,
}: PropsOrganizationsView) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Organizações</h2>
          <p className="text-muted-foreground">
            Gerencie as organizações e facções do seu mundo
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{organizations.length} Total</Badge>
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
        <Button variant="magical" onClick={onCreateOrganization}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Organização
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar organizações..."
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

      <div className="space-y-6">
        {filteredOrganizations.map((organization) => (
          <Card
            key={organization.id}
            className="card-magical animate-stagger cursor-pointer hover:shadow-lg transition-all"
            onClick={() => onOrganizationClick(organization.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getOrganizationIcon(organization.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {organization.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{organization.type}</Badge>
                      <Badge
                        className={getAlignmentColor(organization.alignment)}
                      >
                        {organization.alignment}
                      </Badge>
                      <Badge
                        className={getInfluenceColor(organization.influence)}
                      >
                        {organization.influence}
                      </Badge>
                      {organization.world && (
                        <Badge variant="secondary" className="bg-muted/50">
                          <Globe className="w-3 h-3 mr-1" />
                          {organization.world}
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
                  {organization.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {organization.leaders.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Líderes</h4>
                      <div className="space-y-2">
                        {organization.leaders.map((leader, index) => (
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

                  {organization.baseLocation && (
                    <div>
                      <h4 className="font-medium mb-2">Base Principal</h4>
                      <p className="text-sm text-muted-foreground">
                        {organization.baseLocation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma organização encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedAlignment !== "all"
              ? "Tente ajustar seus filtros"
              : "Comece criando a primeira organização do seu mundo"}
          </p>
          <Button variant="magical" onClick={onCreateOrganization}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Organização
          </Button>
        </div>
      )}

      {organizations.length === 0 && (
        <EmptyState
          icon={Building}
          title="Nenhuma organização criada"
          description="Comece criando a primeira organização do seu mundo para gerenciar facções e grupos."
          actionLabel="Criar Organização"
          onAction={onCreateOrganization}
        />
      )}

      <CreateOrganizationModal
        open={showCreateModal}
        onClose={() => onShowCreateModalChange(false)}
        onOrganizationCreated={onOrganizationCreated}
        bookId={bookId}
        availableCharacters={MOCK_CHARACTERS}
        availableLocations={MOCK_LOCATIONS}
      />
    </div>
  );
}
