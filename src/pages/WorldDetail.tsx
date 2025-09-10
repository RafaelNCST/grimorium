import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Plus, StickyNote, MapPin, Mountain, Globe, TreePine, Castle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  livingEntities?: string[];
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
    parentId: "world1",
    age: "3000 anos",
    dominantOrganization: "Reino de Aethermoor",
    image: "/api/placeholder/400/250"
  },
  {
    id: "loc1",
    name: "Floresta das Lamentações",
    type: "Location",
    description: "Floresta sombria habitada por criaturas mágicas perigosas. As árvores sussurram segredos dos tempos antigos.",
    parentId: "continent1",
    classification: "Floresta Mágica",
    climate: "Frio e Úmido",
    location: "Norte do Continente Central",
    terrain: "Florestal",
    organizations: ["Culto das Sombras", "Guarda Florestal"],
    livingEntities: ["Lobos Sombrios", "Espíritos da Floresta", "Dríades Corrompidas", "Unicórnios das Trevas", "Ents Ancestrais"],
    image: "/api/placeholder/400/250"
  }
];

export function WorldDetail() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const entity = mockWorldEntities.find(e => e.id === worldId);
  
  if (!entity) {
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
    if (entity.type === "World") return <Globe className="w-6 h-6" />;
    if (entity.type === "Continent") return <Mountain className="w-6 h-6" />;
    
    switch (entity.classification?.toLowerCase()) {
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

  const getParentName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = mockWorldEntities.find(e => e.id === parentId);
    return parent?.name;
  };

  const handleDelete = () => {
    // In a real app, this would delete from API/state
    console.log("Deleting entity:", entity.id);
    setShowDeleteDialog(false);
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
                  <h1 className="text-2xl font-bold">{entity.name}</h1>
                  <Badge variant="outline">{entity.type}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Salvar" : "Editar"}
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir "{entity.name}"? Esta ação não pode ser desfeita.
                      {entity.type !== "Location" && " Entidades vinculadas ficarão sem vínculo hierárquico."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Não
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Sim, Excluir
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {entity.image && (
              <Card>
                <CardContent className="p-0">
                  <img 
                    src={entity.image} 
                    alt={entity.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" defaultValue={entity.name} />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" defaultValue={entity.description} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold">Nome</h3>
                      <p className="text-muted-foreground">{entity.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Descrição</h3>
                      <p className="text-muted-foreground">{entity.description}</p>
                    </div>
                  </>
                )}

                {entity.type === "Location" && (
                  <>
                    {isEditing ? (
                      <>
                        <div>
                          <Label htmlFor="classification">Classificação</Label>
                          <Input id="classification" defaultValue={entity.classification} />
                        </div>
                        <div>
                          <Label htmlFor="climate">Clima</Label>
                          <Input id="climate" defaultValue={entity.climate} />
                        </div>
                        <div>
                          <Label htmlFor="location">Localização</Label>
                          <Input id="location" defaultValue={entity.location} />
                        </div>
                        <div>
                          <Label htmlFor="terrain">Solo</Label>
                          <Input id="terrain" defaultValue={entity.terrain} />
                        </div>
                      </>
                    ) : (
                      <>
                        {entity.classification && (
                          <div>
                            <h3 className="font-semibold">Classificação</h3>
                            <p className="text-muted-foreground">{entity.classification}</p>
                          </div>
                        )}
                        {entity.climate && (
                          <div>
                            <h3 className="font-semibold">Clima</h3>
                            <p className="text-muted-foreground">{entity.climate}</p>
                          </div>
                        )}
                        {entity.location && (
                          <div>
                            <h3 className="font-semibold">Localização</h3>
                            <p className="text-muted-foreground">{entity.location}</p>
                          </div>
                        )}
                        {entity.terrain && (
                          <div>
                            <h3 className="font-semibold">Solo</h3>
                            <p className="text-muted-foreground">{entity.terrain}</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {(entity.type === "World" || entity.type === "Continent") && (
                  <>
                    {isEditing ? (
                      <div>
                        <Label htmlFor="age">Idade</Label>
                        <Input id="age" defaultValue={entity.age} />
                      </div>
                    ) : (
                      entity.age && (
                        <div>
                          <h3 className="font-semibold">Idade</h3>
                          <p className="text-muted-foreground">{entity.age}</p>
                        </div>
                      )
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Sticky Notes for Locations */}
            {entity.type === "Location" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <StickyNote className="w-5 h-5" />
                      Quadro de Notas
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={addStickyNote}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Nota
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative min-h-[300px] bg-gray-50 rounded-lg p-4">
                    {stickyNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`absolute w-48 p-3 rounded shadow-md ${note.color} cursor-move`}
                        style={{ left: note.x, top: note.y }}
                      >
                        <Textarea 
                          defaultValue={note.content}
                          className="border-none bg-transparent resize-none text-sm"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hierarchy */}
            <Card>
              <CardHeader>
                <CardTitle>Hierarquia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {getParentName(entity.parentId) ? (
                  <div>
                    <h3 className="font-semibold text-sm">Pertence a</h3>
                    <p className="text-muted-foreground">{getParentName(entity.parentId)}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Sem vínculo hierárquico</p>
                )}
              </CardContent>
            </Card>

            {/* Organizations */}
            {entity.organizations && entity.organizations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Organizações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {entity.organizations.map((org, idx) => (
                      <Badge key={idx} variant="secondary">
                        {org}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dominant Organization */}
            {entity.dominantOrganization && (
              <Card>
                <CardHeader>
                  <CardTitle>Organização Dominante</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="default">{entity.dominantOrganization}</Badge>
                </CardContent>
              </Card>
            )}

            {/* Living Entities */}
            {entity.livingEntities && entity.livingEntities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Entidades Viventes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {entity.livingEntities.map((entity, idx) => (
                      <div key={idx} className="text-sm">
                        <Badge variant="outline" className="w-full justify-start">
                          {entity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}