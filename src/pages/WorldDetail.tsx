import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Plus, StickyNote, MapPin, Mountain, Globe, TreePine, Castle, Home, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { WorldTimeline } from "@/components/WorldTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeciesTab } from "@/components/tabs/SpeciesTab";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  worldId?: string;
  continentId?: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

interface StickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
}

// Mock data - in a real app this would come from API/state management
const mockWorldEntities: WorldEntity[] = [
  {
    id: "world1",
    name: "Aethermoor",
    type: "World",
    description: "Mundo principal onde se desenrola a história. Um reino de magia e mistério onde antigas magias ainda ecoam pelas terras.",
    age: "5000 anos",
    dominantOrganization: "Ordem dos Guardiões",
    image: "/api/placeholder/400/250"
  },
  {
    id: "continent1", 
    name: "Continente Central",
    type: "Continent",
    description: "Continente principal de Aethermoor, rico em recursos mágicos e lar de diversas civilizações antigas.",
    worldId: "world1",
    age: "3000 anos",
    dominantOrganization: "Reino de Aethermoor",
    image: "/api/placeholder/400/250"
  },
  {
    id: "loc1",
    name: "Floresta das Lamentações",
    type: "Location",
    description: "Floresta sombria habitada por criaturas mágicas perigosas. As árvores sussurram segredos dos tempos antigos.",
    worldId: "world1",
    continentId: "continent1",
    classification: "Floresta Mágica",
    climate: "Frio e Úmido",
    location: "Norte do Continente Central",
    terrain: "Florestal",
    organizations: ["Culto das Sombras", "Guarda Florestal"],
    image: "/api/placeholder/400/250"
  }
];

// Mock data for selects
const mockWorlds = [
  { id: "world1", name: "Aethermoor" },
  { id: "world2", name: "Terra Sombria" },
  { id: "world3", name: "Reino Celestial" }
];

const mockContinents = [
  { id: "continent1", name: "Continente Central", worldId: "world1" },
  { id: "continent2", name: "Terras do Norte", worldId: "world1" },
  { id: "continent3", name: "Ilhas do Sul", worldId: "world1" }
];

const mockOrganizations = [
  { id: "1", name: "Ordem dos Guardiões" },
  { id: "2", name: "Culto das Sombras" },
  { id: "3", name: "Guarda Florestal" },
  { id: "4", name: "Reino de Aethermoor" },
  { id: "5", name: "Academia Arcana" }
];

export function WorldDetail() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [character, setCharacter] = useState(mockWorldEntities.find(e => e.id === worldId));
  const [editData, setEditData] = useState(mockWorldEntities.find(e => e.id === worldId) || mockWorldEntities[0]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: "1",
      content: "Investigar a origem dos sussurros nas árvores",
      x: 20,
      y: 20,
      color: "bg-yellow-200"
    },
    {
      id: "2", 
      content: "Conexão com o Culto das Sombras precisa ser explorada",
      x: 250,
      y: 80,
      color: "bg-blue-200"
    }
  ]);

  useEffect(() => {
    const entity = mockWorldEntities.find(e => e.id === worldId);
    if (entity) {
      setCharacter(entity);
      setEditData(entity);
    }
  }, [worldId]);

  if (!character) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Entidade não encontrada</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const getEntityIcon = () => {
    if (character.type === "World") return <Globe className="w-6 h-6" />;
    if (character.type === "Continent") return <Mountain className="w-6 h-6" />;
    
    switch (character.classification?.toLowerCase()) {
      case "floresta mágica":
        return <TreePine className="w-6 h-6" />;
      case "assentamento":
        return <Home className="w-6 h-6" />;
      case "ruína mágica":
        return <Castle className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  };

  const getWorldName = (worldId?: string) => {
    if (!worldId) return null;
    const world = mockWorlds.find(w => w.id === worldId);
    return world?.name;
  };

  const getContinentName = (continentId?: string) => {
    if (!continentId) return null;
    const continent = mockContinents.find(c => c.id === continentId);
    return continent?.name;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setEditData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to API/state
    setCharacter(editData);
    setIsEditing(false);
    setImagePreview("");
    setSelectedFile(null);
    toast.success(`${character.type === "World" ? "Mundo" : character.type === "Continent" ? "Continente" : "Local"} atualizado com sucesso!`);
  };

  const handleCancel = () => {
    setEditData(character);
    setIsEditing(false);
    setImagePreview("");
    setSelectedFile(null);
  };

  const handleDelete = () => {
    // In a real app, this would delete from API/state
    console.log("Deleting entity:", character.id);
    setShowDeleteModal(false);
    navigate(-1);
  };

  const addStickyNote = () => {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      content: "Nova nota",
      x: Math.random() * 300,
      y: Math.random() * 200,
      color: "bg-yellow-200"
    };
    setStickyNotes([...stickyNotes, newNote]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {getEntityIcon()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{character.name}</h1>
                  <Badge variant="outline">{character.type === "World" ? "Mundo" : character.type === "Continent" ? "Continente" : "Local"}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="default" onClick={handleSave}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => setShowDeleteModal(true)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="species">Espécies</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="locations">Locais</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="card-magical">
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label htmlFor="image">Imagem</Label>
                          <div 
                            className="flex items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {imagePreview ? (
                              <div className="relative w-full h-full">
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            ) : character.image ? (
                              <div className="relative w-full h-full">
                                <img 
                                  src={character.image} 
                                  alt="Current" 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                                <span className="text-sm text-muted-foreground text-center">Clique para enviar imagem ou mapa</span>
                                <span className="text-xs text-muted-foreground/70 text-center mt-1">Recomendado: 16:9 para melhor visualização</span>
                              </div>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input 
                            id="name" 
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea 
                            id="description" 
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>

                        {character.type === "Location" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="classification">Classificação</Label>
                              <Input 
                                id="classification" 
                                value={editData.classification || ""}
                                onChange={(e) => setEditData(prev => ({ ...prev, classification: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="climate">Clima</Label>
                              <Input 
                                id="climate" 
                                value={editData.climate || ""}
                                onChange={(e) => setEditData(prev => ({ ...prev, climate: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location">Localização</Label>
                              <Input 
                                id="location" 
                                value={editData.location || ""}
                                onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="terrain">Solo</Label>
                              <Input 
                                id="terrain" 
                                value={editData.terrain || ""}
                                onChange={(e) => setEditData(prev => ({ ...prev, terrain: e.target.value }))}
                              />
                            </div>
                          </>
                        )}

                        {(character.type === "World" || character.type === "Continent") && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="age">Idade</Label>
                              <Input 
                                id="age" 
                                value={editData.age || ""}
                                onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dominantOrganization">Organização Dominante</Label>
                              <Select value={editData.dominantOrganization || ""} onValueChange={(value) => setEditData(prev => ({ ...prev, dominantOrganization: value === "none" ? "" : value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma organização" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Nenhuma</SelectItem>
                                  {mockOrganizations.map((org) => (
                                    <SelectItem key={org.id} value={org.name}>
                                      {org.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Full-width image */}
                        {character.image && (
                          <div className="w-full">
                            <img 
                              src={character.image} 
                              alt={character.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {getEntityIcon()}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-semibold">{character.name}</h2>
                              <Badge variant="outline">
                                {character.type === "World" ? "Mundo" : character.type === "Continent" ? "Continente" : "Local"}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-sm mb-1">Descrição</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{character.description}</p>
                              </div>

                              {character.type === "Location" && character.classification && (
                                <div>
                                  <h3 className="font-semibold text-sm mb-1">Classificação</h3>
                                  <Badge variant="secondary">{character.classification}</Badge>
                                </div>
                              )}

                              {character.type === "Location" && character.climate && (
                                <div>
                                  <h3 className="font-semibold text-sm mb-1">Clima</h3>
                                  <p className="text-muted-foreground text-sm">{character.climate}</p>
                                </div>
                              )}

                              {character.type === "Location" && character.location && (
                                <div>
                                  <h3 className="font-semibold text-sm mb-1">Localização</h3>
                                  <p className="text-muted-foreground text-sm">{character.location}</p>
                                </div>
                              )}

                              {character.type === "Location" && character.terrain && (
                                <div>
                                  <h3 className="font-semibold text-sm mb-1">Solo</h3>
                                  <p className="text-muted-foreground text-sm">{character.terrain}</p>
                                </div>
                              )}

                              {(character.type === "World" || character.type === "Continent") && character.age && (
                                <div>
                                  <h3 className="font-semibold text-sm mb-1">Idade</h3>
                                  <p className="text-muted-foreground text-sm">{character.age}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Sticky Notes */}
                <Card className="card-magical">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <StickyNote className="w-5 h-5" />
                        Notas
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addStickyNote}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative min-h-[200px] border-2 border-dashed border-border rounded-lg p-4">
                      {stickyNotes.map((note) => (
                        <div
                          key={note.id}
                          className={`absolute p-2 rounded-lg shadow-sm border cursor-move min-w-[120px] max-w-[200px] ${note.color}`}
                          style={{ left: note.x, top: note.y }}
                          draggable
                        >
                          <p className="text-xs break-words">{note.content}</p>
                        </div>
                      ))}
                      
                      {stickyNotes.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Clique no + para adicionar notas</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Hierarchy */}
                {character.worldId && (
                  <Card className="card-magical">
                    <CardHeader>
                      <CardTitle>Mundo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Select value={editData.worldId || ""} onValueChange={(value) => setEditData(prev => ({ ...prev, worldId: value === "none" ? "" : value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um mundo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            {mockWorlds.map((world) => (
                              <SelectItem key={world.id} value={world.id}>
                                {world.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{getWorldName(character.worldId) || "Nenhum mundo"}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {character.type === "Location" && (
                  <>
                    <Card className="card-magical">
                      <CardHeader>
                        <CardTitle>Continente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <Select value={editData.continentId || ""} onValueChange={(value) => setEditData(prev => ({ ...prev, continentId: value === "none" ? "" : value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um continente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhum</SelectItem>
                              {mockContinents.map((continent) => (
                                <SelectItem key={continent.id} value={continent.id}>
                                  {continent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mountain className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{getContinentName(character.continentId) || "Nenhum continente"}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Organizations */}
                {character.organizations && character.organizations.length > 0 && (
                  <Card className="card-magical">
                    <CardHeader>
                      <CardTitle>Organizações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {character.organizations.map((org, idx) => (
                          <Badge key={idx} variant="secondary">
                            {org}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Dominant Organization */}
                {(character.dominantOrganization || isEditing) && (
                  <Card className="card-magical">
                    <CardHeader>
                      <CardTitle>Organização Dominante</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Select value={editData.dominantOrganization || ""} onValueChange={(value) => setEditData(prev => ({ ...prev, dominantOrganization: value === "none" ? "" : value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma organização" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhuma</SelectItem>
                            {mockOrganizations.map((org) => (
                              <SelectItem key={org.id} value={org.name}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{character.dominantOrganization || "Nenhuma organização"}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="species" className="mt-6">
            <SpeciesTab />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            <WorldTimeline 
              worldId={character.id}
              worldType={character.type as "World" | "Continent"}
              isEditing={isEditing}
            />
          </TabsContent>
          
          <TabsContent value="locations" className="mt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Funcionalidade de locais em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Funcionalidade de notas em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={`Excluir ${character.type === "World" ? "Mundo" : character.type === "Continent" ? "Continente" : "Local"}`}
        description={`Tem certeza que deseja excluir "${character.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}