import React from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Users,
  Crown,
  MapPin,
  Target,
  Building,
  X,
  Globe,
  Mountain,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  IOrganization,
  IOrganizationTitle,
  ILocation,
  IWorld,
  IContinent,
} from "@/types/organization-types";

interface PropsOrganizationDetailView {
  organization: IOrganization | undefined;
  editData: {
    name: string;
    description: string;
    type: string;
    alignment: string;
    influence: string;
    baseLocation: string;
    world: string;
    continent: string;
    objectives: string[];
    dominatedLocations: string[];
    titles: IOrganizationTitle[];
  };
  isEditing: boolean;
  showDeleteDialog: boolean;
  showAddTitleDialog: boolean;
  showAddMemberDialog: boolean;
  newTitle: {
    name: string;
    description: string;
    level: number;
  };
  newMember: {
    characterId: string;
    titleId: string;
    joinDate: string;
  };
  availableLocations: ILocation[];
  availableWorlds: IWorld[];
  availableContinents: IContinent[];
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onDeleteDialogOpen: () => void;
  onDeleteDialogClose: () => void;
  onAddTitleDialogOpen: () => void;
  onAddTitleDialogClose: () => void;
  onAddMemberDialogOpen: () => void;
  onAddMemberDialogClose: () => void;
  onEditDataChange: (
    field: string,
    value: string | string[] | IOrganizationTitle[]
  ) => void;
  onNewTitleChange: (field: string, value: string | number) => void;
  onNewMemberChange: (field: string, value: string) => void;
  onAddObjective: (objective: string) => void;
  onRemoveObjective: (objective: string) => void;
  onAddDominatedLocation: (locationId: string) => void;
  onRemoveDominatedLocation: (location: string) => void;
  onUpdateTitleLevel: (titleId: string, level: number) => void;
  onAddTitle: () => void;
  onAddMember: () => void;
  getAlignmentColor: (alignment: string) => string;
  getInfluenceColor: (influence: string) => string;
  getTitleName: (titleId: string) => string;
  getLocationIcon: (type: string) => React.ReactNode;
}

export function OrganizationDetailView({
  organization,
  editData,
  isEditing,
  showDeleteDialog,
  showAddTitleDialog,
  showAddMemberDialog,
  newTitle,
  newMember,
  availableLocations,
  availableWorlds,
  availableContinents,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDeleteDialogOpen,
  onDeleteDialogClose,
  onAddTitleDialogOpen,
  onAddTitleDialogClose,
  onAddMemberDialogOpen,
  onAddMemberDialogClose,
  onEditDataChange,
  onNewTitleChange,
  onNewMemberChange,
  onAddObjective,
  onRemoveObjective,
  onAddDominatedLocation,
  onRemoveDominatedLocation,
  onUpdateTitleLevel,
  onAddTitle,
  onAddMember,
  getAlignmentColor,
  getInfluenceColor,
  getTitleName,
  getLocationIcon,
}: PropsOrganizationDetailView) {
  if (!organization) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Organização não encontrada
          </h1>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{organization.type}</Badge>
              <Badge className={getAlignmentColor(organization.alignment)}>
                {organization.alignment}
              </Badge>
              <Badge className={getInfluenceColor(organization.influence)}>
                {organization.influence}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button variant="magical" onClick={onSave}>
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="destructive" onClick={onDeleteDialogOpen}>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.description}
                  onChange={(e) =>
                    onEditDataChange("description", e.target.value)
                  }
                  rows={4}
                  placeholder="Descrição da organização..."
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {organization.description}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Novo objetivo..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          onAddObjective(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        onAddObjective(input.value);
                        input.value = "";
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editData.objectives.map((objective, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-muted/30"
                      >
                        <span>{objective}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onRemoveObjective(objective)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {organization.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-2">•</span>
                      <span>{objective}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Membros ({organization.members.length})
                </CardTitle>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddMemberDialogOpen}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Membro
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddTitleDialogOpen}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Título
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Hierarquia de Títulos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(isEditing ? editData.titles : organization.titles)
                      .sort((a, b) => a.level - b.level)
                      .map((title) => (
                        <div
                          key={title.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="space-y-2">
                                <Input
                                  value={title.name}
                                  placeholder="Nome do título"
                                  className="text-sm font-medium"
                                />
                                <Input
                                  value={title.description}
                                  placeholder="Descrição"
                                  className="text-xs"
                                />
                              </div>
                            ) : (
                              <>
                                <span className="font-medium">
                                  {title.name}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {title.description}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <Label className="text-xs text-muted-foreground">
                                  Nível
                                </Label>
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-none border-r"
                                    onClick={() =>
                                      onUpdateTitleLevel(
                                        title.id,
                                        Math.max(1, title.level - 1)
                                      )
                                    }
                                  >
                                    <span className="text-xs">-</span>
                                  </Button>
                                  <span className="px-2 text-xs font-medium min-w-[2rem] text-center">
                                    {title.level}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-none border-l"
                                    onClick={() =>
                                      onUpdateTitleLevel(
                                        title.id,
                                        title.level + 1
                                      )
                                    }
                                  >
                                    <span className="text-xs">+</span>
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Nível {title.level}
                              </Badge>
                            )}
                            {isEditing && title.id !== "default" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Lista de Membros</h4>
                  <div className="space-y-3">
                    {organization.members
                      .sort((a, b) => {
                        const titleA = organization.titles.find(
                          (t) => t.id === a.titleId
                        );
                        const titleB = organization.titles.find(
                          (t) => t.id === b.titleId
                        );
                        return (titleA?.level || 999) - (titleB?.level || 999);
                      })
                      .map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-sm">
                                {member.characterName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">
                                {member.characterName}
                              </span>
                              <p className="text-sm text-muted-foreground">
                                {getTitleName(member.titleId)} • Desde{" "}
                                {member.joinDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {organization.leaders.includes(
                              member.characterName
                            ) && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Líder
                              </Badge>
                            )}
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                {isEditing ? (
                  <Select
                    value={editData.type}
                    onValueChange={(value) => onEditDataChange("type", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="Militar">Militar</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Mágica">Mágica</SelectItem>
                      <SelectItem value="Religiosa">Religiosa</SelectItem>
                      <SelectItem value="Culto">Culto</SelectItem>
                      <SelectItem value="Governamental">
                        Governamental
                      </SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {organization.type}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Alinhamento</Label>
                {isEditing ? (
                  <Select
                    value={editData.alignment}
                    onValueChange={(value) =>
                      onEditDataChange("alignment", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o alinhamento" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="Bem">Bem</SelectItem>
                      <SelectItem value="Neutro">Neutro</SelectItem>
                      <SelectItem value="Caótico">Caótico</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {organization.alignment}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Influência</Label>
                {isEditing ? (
                  <Select
                    value={editData.influence}
                    onValueChange={(value) =>
                      onEditDataChange("influence", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione a influência" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="Inexistente">Inexistente</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Dominante">Dominante</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {organization.influence}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Mundo</Label>
                {isEditing ? (
                  <Select
                    value={editData.world}
                    onValueChange={(value) =>
                      onEditDataChange("world", value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o mundo" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="Aethermoor">Aethermoor</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {organization.world || "Não especificado"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Continente</Label>
                {isEditing ? (
                  <Select
                    value={editData.continent}
                    onValueChange={(value) =>
                      onEditDataChange(
                        "continent",
                        value === "none" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o continente" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="Continente Central">
                        Continente Central
                      </SelectItem>
                      <SelectItem value="Terras Sombrias">
                        Terras Sombrias
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {organization.continent || "Não especificado"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Base Principal</Label>
                {isEditing ? (
                  <Select
                    value={editData.baseLocation}
                    onValueChange={(value) =>
                      onEditDataChange(
                        "baseLocation",
                        value === "none" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione a base" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="Cidadela da Luz">
                        Cidadela da Luz
                      </SelectItem>
                      <SelectItem value="Torre Sombria">
                        Torre Sombria
                      </SelectItem>
                      <SelectItem value="Aldeia de Pedraverde">
                        Aldeia de Pedraverde
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {organization.baseLocation || "Não especificado"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {(isEditing
            ? editData.dominatedLocations.length > 0
            : organization.dominatedLocations.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Territórios Dominados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Select onValueChange={onAddDominatedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Adicionar território..." />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                          {availableWorlds
                            .filter(
                              (world) =>
                                !editData.dominatedLocations.includes(
                                  world.name
                                )
                            )
                            .map((world) => (
                              <SelectItem key={world.id} value={world.id}>
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  {world.name}
                                </div>
                              </SelectItem>
                            ))}
                          {availableContinents
                            .filter(
                              (continent) =>
                                !editData.dominatedLocations.includes(
                                  continent.name
                                )
                            )
                            .map((continent) => (
                              <SelectItem
                                key={continent.id}
                                value={continent.id}
                              >
                                <div className="flex items-center gap-2">
                                  <Mountain className="w-4 h-4" />
                                  {continent.name}
                                </div>
                              </SelectItem>
                            ))}
                          {availableLocations
                            .filter(
                              (location) =>
                                !editData.dominatedLocations.includes(
                                  location.name
                                )
                            )
                            .map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {location.name} ({location.type})
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      {editData.dominatedLocations.map((location, index) => {
                        const allAvailable = [
                          ...availableWorlds,
                          ...availableContinents,
                          ...availableLocations,
                        ];
                        const locationData = allAvailable.find(
                          (l) => l.name === location
                        );
                        const icon = getLocationIcon(
                          locationData?.type || "Location"
                        );

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded bg-muted/30"
                          >
                            <Badge
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              {icon}
                              {location}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                onRemoveDominatedLocation(location)
                              }
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {organization.dominatedLocations.map((location, index) => {
                      const icon =
                        location.includes("Continente") ||
                        location.includes("Terras") ? (
                          <Mountain className="w-3 h-3" />
                        ) : location.includes("Aethermoor") ? (
                          <Globe className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        );

                      return (
                        <Badge
                          key={index}
                          variant="outline"
                          className="mr-2 mb-2 flex items-center gap-1 w-fit"
                        >
                          {icon}
                          {location}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={onDeleteDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Organização</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir &quot;{organization.name}&quot;?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onDeleteDialogClose}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Sim, Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddMemberDialog} onOpenChange={onAddMemberDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Membro</DialogTitle>
            <DialogDescription>
              Adicione um personagem como membro desta organização.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberCharacter">Personagem</Label>
              <Select
                value={newMember.characterId}
                onValueChange={(value) =>
                  onNewMemberChange("characterId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um personagem" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="c1">Lyara Moonwhisper</SelectItem>
                  <SelectItem value="c2">Aelric Valorheart</SelectItem>
                  <SelectItem value="c3">Sir Marcus Lightbringer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberTitle">Título</Label>
              <Select
                value={newMember.titleId}
                onValueChange={(value) => onNewMemberChange("titleId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um título" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {organization.titles.map((title) => (
                    <SelectItem key={title.id} value={title.id}>
                      {title.name} (Nível {title.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">Data de Ingresso</Label>
              <Input
                id="joinDate"
                placeholder="Ex: Era Atual, 1115"
                value={newMember.joinDate}
                onChange={(e) => onNewMemberChange("joinDate", e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onAddMemberDialogClose}>
              Cancelar
            </Button>
            <Button onClick={onAddMember}>Adicionar Membro</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddTitleDialog} onOpenChange={onAddTitleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Título</DialogTitle>
            <DialogDescription>
              Crie um novo título hierárquico para esta organização.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titleName">Nome do Título</Label>
              <Input
                id="titleName"
                placeholder="Ex: Capitão, Senhor, etc."
                value={newTitle.name}
                onChange={(e) => onNewTitleChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleDescription">Descrição</Label>
              <Input
                id="titleDescription"
                placeholder="Descrição do título..."
                value={newTitle.description}
                onChange={(e) =>
                  onNewTitleChange("description", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleLevel">Nível Hierárquico</Label>
              <Input
                id="titleLevel"
                type="number"
                min="1"
                value={newTitle.level}
                onChange={(e) =>
                  onNewTitleChange("level", parseInt(e.target.value) || 1)
                }
              />
              <p className="text-xs text-muted-foreground">
                1 = mais alto, números maiores = mais baixo
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onAddTitleDialogClose}>
              Cancelar
            </Button>
            <Button onClick={onAddTitle}>Adicionar Título</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
