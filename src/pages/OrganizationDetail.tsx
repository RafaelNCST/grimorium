import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Plus, Users, Crown, MapPin, Target, Building, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface OrganizationTitle {
  id: string;
  name: string;
  description: string;
  level: number;
}

interface OrganizationMember {
  characterId: string;
  characterName: string;
  titleId: string;
  joinDate: string;
}

interface Organization {
  id: string;
  name: string;
  photo?: string;
  alignment: "Bem" | "Neutro" | "Caótico";
  description: string;
  type: string;
  influence: string;
  leaders: string[];
  objectives: string[];
  members: OrganizationMember[];
  titles: OrganizationTitle[];
  dominatedLocations: string[];
  dominatedContinents: string[];
  dominatedWorlds: string[];
  baseLocation?: string;
  world?: string;
  continent?: string;
}

// Mock data - in real app this would come from state management
const mockOrganizations: Record<string, Organization> = {
  "1": {
    id: "1",
    name: "Ordem dos Guardiões",
    alignment: "Bem",
    description: "Antiga ordem militar dedicada à proteção do reino e preservação da luz. Formada pelos melhores guerreiros e magos, esta organização secular tem defendido os inocentes contra as forças das trevas por gerações. Seus membros são conhecidos por sua honra, coragem e dedicação inabalável à justiça.",
    type: "Militar",
    influence: "Alta",
    leaders: ["Lyara Moonwhisper"],
    objectives: [
      "Proteger o reino das forças das trevas",
      "Preservar a magia da luz",
      "Treinar novos guardiões",
      "Manter a paz entre os reinos",
      "Combater cultos sombrios"
    ],
    world: "Aethermoor",
    continent: "Continente Central",
    baseLocation: "Cidadela da Luz",
    dominatedLocations: ["Cidadela da Luz", "Postos Avançados"],
    dominatedContinents: [],
    dominatedWorlds: [],
    titles: [
      { id: "t1", name: "Guardião Supremo", description: "Líder máximo da ordem", level: 1 },
      { id: "t2", name: "Comandante", description: "Líder militar regional", level: 2 },
      { id: "t3", name: "Cavaleiro", description: "Guerreiro experiente", level: 3 },
      { id: "t4", name: "Escudeiro", description: "Guerreiro em treinamento", level: 4 }
    ],
    members: [
      { characterId: "c1", characterName: "Lyara Moonwhisper", titleId: "t1", joinDate: "Era Atual, 1090" },
      { characterId: "c2", characterName: "Aelric Valorheart", titleId: "t4", joinDate: "Era Atual, 1113" },
      { characterId: "c3", characterName: "Sir Marcus Lightbringer", titleId: "t2", joinDate: "Era Atual, 1095" }
    ]
  }
};

export function OrganizationDetail() {
  const { bookId, orgId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddTitleDialog, setShowAddTitleDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  
  const [newTitle, setNewTitle] = useState({ name: "", description: "", level: 1 });
  const [newMember, setNewMember] = useState({ characterId: "", titleId: "", joinDate: "" });

  const organization = mockOrganizations[orgId || ""];
  
  const [editData, setEditData] = useState({
    name: organization?.name || "",
    description: organization?.description || "",
    type: organization?.type || "",
    alignment: organization?.alignment || "",
    influence: organization?.influence || "",
    baseLocation: organization?.baseLocation || "",
    world: organization?.world || "",
    continent: organization?.continent || "",
    objectives: organization?.objectives || [],
    dominatedLocations: organization?.dominatedLocations || [],
    titles: organization?.titles || []
  });

  // Mock data for dropdowns
  const availableLocations = [
    { id: "l1", name: "Cidadela da Luz", type: "Fortaleza" },
    { id: "l2", name: "Torre Sombria", type: "Torre" },
    { id: "l3", name: "Aldeia de Pedraverde", type: "Aldeia" },
    { id: "l4", name: "Floresta das Lamentações", type: "Floresta" },
    { id: "l5", name: "Postos Avançados", type: "Posto" }
  ];

  const availableWorlds = [
    { id: "w1", name: "Aethermoor", type: "Mundo" }
  ];

  const availableContinents = [
    { id: "c1", name: "Continente Central", type: "Continente" },
    { id: "c2", name: "Terras Sombrias", type: "Continente" }
  ];

  if (!organization) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Organização não encontrada</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case "Bem":
        return "bg-success text-success-foreground";
      case "Caótico":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case "Dominante":
        return "bg-destructive text-destructive-foreground";
      case "Alta":
        return "bg-accent text-accent-foreground";
      case "Média":
        return "bg-primary text-primary-foreground";
      case "Baixa":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTitleName = (titleId: string) => {
    const title = organization.titles.find(t => t.id === titleId);
    return title?.name || "Membro";
  };

  const handleDelete = () => {
    toast.success("Organização excluída com sucesso!");
    navigate(`/book/${bookId}/organizations`);
  };

  const handleAddTitle = () => {
    if (!newTitle.name.trim()) {
      toast.error("Nome do título é obrigatório");
      return;
    }

    // In real app, this would update the state
    toast.success("Título adicionado com sucesso!");
    setNewTitle({ name: "", description: "", level: 1 });
    setShowAddTitleDialog(false);
  };

  const handleAddMember = () => {
    if (!newMember.characterId || !newMember.titleId) {
      toast.error("Personagem e título são obrigatórios");
      return;
    }

    // In real app, this would update the state
    toast.success("Membro adicionado com sucesso!");
    setNewMember({ characterId: "", titleId: "", joinDate: "" });
    setShowAddMemberDialog(false);
  };

  const handleAddObjective = (newObjective: string) => {
    if (newObjective.trim() && !editData.objectives.includes(newObjective.trim())) {
      setEditData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
    }
  };

  const handleRemoveObjective = (objective: string) => {
    setEditData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(o => o !== objective)
    }));
  };

  const handleAddDominatedLocation = (locationId: string) => {
    const location = [...availableLocations, ...availableWorlds, ...availableContinents]
      .find(l => l.id === locationId);
    
    if (location && !editData.dominatedLocations.includes(location.name)) {
      setEditData(prev => ({
        ...prev,
        dominatedLocations: [...prev.dominatedLocations, location.name]
      }));
    }
  };

  const handleRemoveDominatedLocation = (location: string) => {
    setEditData(prev => ({
      ...prev,
      dominatedLocations: prev.dominatedLocations.filter(l => l !== location)
    }));
  };

  const handleUpdateTitleLevel = (titleId: string, newLevel: number) => {
    setEditData(prev => ({
      ...prev,
      titles: prev.titles.map(title => 
        title.id === titleId ? { ...title, level: newLevel } : title
      )
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button variant="magical" onClick={() => {
                toast.success("Organização atualizada com sucesso!");
                setIsEditing(false);
              }}>
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
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
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
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

          {/* Objectives */}
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
                        if (e.key === 'Enter') {
                          handleAddObjective(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddObjective(input.value);
                        input.value = "";
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <span>{objective}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveObjective(objective)}
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

          {/* Members and Titles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Membros ({organization.members.length})
                </CardTitle>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddMemberDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Membro
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddTitleDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Título
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Titles */}
                <div>
                  <h4 className="font-medium mb-3">Hierarquia de Títulos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(isEditing ? editData.titles : organization.titles)
                      .sort((a, b) => a.level - b.level)
                      .map((title) => (
                        <div key={title.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 gap-3">
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
                                <span className="font-medium">{title.name}</span>
                                <p className="text-xs text-muted-foreground">{title.description}</p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <Label className="text-xs text-muted-foreground">Nível</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={title.level}
                                  onChange={(e) => handleUpdateTitleLevel(title.id, parseInt(e.target.value) || 1)}
                                  className="w-16 h-8 text-xs text-center"
                                />
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Nível {title.level}
                              </Badge>
                            )}
                            {isEditing && title.id !== "default" && (
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Members */}
                <div>
                  <h4 className="font-medium mb-3">Lista de Membros</h4>
                  <div className="space-y-3">
                    {organization.members
                      .sort((a, b) => {
                        const titleA = organization.titles.find(t => t.id === a.titleId);
                        const titleB = organization.titles.find(t => t.id === b.titleId);
                        return (titleA?.level || 999) - (titleB?.level || 999);
                      })
                      .map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-sm">
                                {member.characterName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{member.characterName}</span>
                              <p className="text-sm text-muted-foreground">
                                {getTitleName(member.titleId)} • Desde {member.joinDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {organization.leaders.includes(member.characterName) && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Líder
                              </Badge>
                            )}
                            {isEditing && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                {isEditing ? (
                  <Select value={editData.type} onValueChange={(value) => setEditData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="Militar">Militar</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Mágica">Mágica</SelectItem>
                      <SelectItem value="Religiosa">Religiosa</SelectItem>
                      <SelectItem value="Culto">Culto</SelectItem>
                      <SelectItem value="Governamental">Governamental</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">{organization.type}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Alinhamento</Label>
                {isEditing ? (
                  <Select value={editData.alignment} onValueChange={(value) => setEditData(prev => ({ ...prev, alignment: value }))}>
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
                  <p className="text-sm text-muted-foreground">{organization.alignment}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Influência</Label>
                {isEditing ? (
                  <Select value={editData.influence} onValueChange={(value) => setEditData(prev => ({ ...prev, influence: value }))}>
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
                  <p className="text-sm text-muted-foreground">{organization.influence}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Mundo</Label>
                {isEditing ? (
                  <Select value={editData.world} onValueChange={(value) => setEditData(prev => ({ ...prev, world: value === "none" ? "" : value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o mundo" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="Aethermoor">Aethermoor</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">{organization.world || "Não especificado"}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Continente</Label>
                {isEditing ? (
                  <Select value={editData.continent} onValueChange={(value) => setEditData(prev => ({ ...prev, continent: value === "none" ? "" : value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o continente" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="Continente Central">Continente Central</SelectItem>
                      <SelectItem value="Terras Sombrias">Terras Sombrias</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">{organization.continent || "Não especificado"}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">Base Principal</Label>
                {isEditing ? (
                  <Select value={editData.baseLocation} onValueChange={(value) => setEditData(prev => ({ ...prev, baseLocation: value === "none" ? "" : value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione a base" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="Cidadela da Luz">Cidadela da Luz</SelectItem>
                      <SelectItem value="Torre Sombria">Torre Sombria</SelectItem>
                      <SelectItem value="Aldeia de Pedraverde">Aldeia de Pedraverde</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">{organization.baseLocation || "Não especificado"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dominated Territories */}
          {(isEditing ? editData.dominatedLocations.length > 0 : organization.dominatedLocations.length > 0) && (
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
                      <Select onValueChange={handleAddDominatedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Adicionar território..." />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                          {availableWorlds
                            .filter(world => !editData.dominatedLocations.includes(world.name))
                            .map((world) => (
                              <SelectItem key={world.id} value={world.id}>
                                🌍 {world.name}
                              </SelectItem>
                            ))}
                          {availableContinents
                            .filter(continent => !editData.dominatedLocations.includes(continent.name))
                            .map((continent) => (
                              <SelectItem key={continent.id} value={continent.id}>
                                🗺️ {continent.name}
                              </SelectItem>
                            ))}
                          {availableLocations
                            .filter(location => !editData.dominatedLocations.includes(location.name))
                            .map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                📍 {location.name} ({location.type})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      {editData.dominatedLocations.map((location, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
                          <Badge variant="outline">
                            {location}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveDominatedLocation(location)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {organization.dominatedLocations.map((location, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {location}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Organização</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir "{organization.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sim, Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
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
              <Select value={newMember.characterId} onValueChange={(value) => setNewMember(prev => ({ ...prev, characterId: value }))}>
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
              <Select value={newMember.titleId} onValueChange={(value) => setNewMember(prev => ({ ...prev, titleId: value }))}>
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
                onChange={(e) => setNewMember(prev => ({ ...prev, joinDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMember}>
              Adicionar Membro
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Title Dialog */}
      <Dialog open={showAddTitleDialog} onOpenChange={setShowAddTitleDialog}>
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
                onChange={(e) => setNewTitle(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="titleDescription">Descrição</Label>
              <Input
                id="titleDescription"
                placeholder="Descrição do título..."
                value={newTitle.description}
                onChange={(e) => setNewTitle(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="titleLevel">Nível Hierárquico</Label>
              <Input
                id="titleLevel"
                type="number"
                min="1"
                value={newTitle.level}
                onChange={(e) => setNewTitle(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
              />
              <p className="text-xs text-muted-foreground">1 = mais alto, números maiores = mais baixo</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddTitleDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTitle}>
              Adicionar Título
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}