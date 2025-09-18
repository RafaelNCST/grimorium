import { useState, useRef } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Upload, Plus, Minus, Shield, Skull, Sun, Moon, TreePine, Sword, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { LinkedNotesModal } from "@/components/annotations/LinkedNotesModal";
import { toast } from "sonner";

// Mock beast data
const mockBeast = {
  id: "1",
  name: "Dragão Sombrio",
  alternativeNames: ["Wyrm das Trevas", "Senhor da Noite"],
  race: "Dracônico",
  species: "Reptiliano",
  basicDescription: "Criatura ancestral de escamas negras que domina as artes da magia sombria.",
  appearanceDescription: "Um dragão de tamanho colossal com escamas que parecem absorver a luz ao redor. Seus olhos brilham com um fogo violeta intenso, e suas garras são capazes de rasgar tanto carne quanto metal. Possui chifres curvos que se estendem para trás de sua cabeça majestosa, e suas asas, quando abertas, podem cobrir uma área equivalente a uma pequena cidade.",
  behaviors: "Extremamente territorialista e orgulhoso. Prefere atacar de surpresa, usando sua capacidade de se mover através das sombras. É incrivelmente inteligente e manipulativo, frequentemente fazendo acordos com mortais apenas para quebrar os termos quando mais conveniente. Demonstra particular desprezo por outras criaturas dracônicas.",
  habit: "noturno",
  habitat: ["Montanhas Sombrias", "Cavernas Profundas"],
  humanComparison: "impossível de ganhar",
  weaknesses: ["Luz solar direta causa desconforto", "Magia de luz pura", "Armas forjadas com metal celestial"],
  preys: ["Elfos Sombrios", "Orcs das Montanhas", "Criaturas menores dracônicas"],
  predators: [],
  threatLevel: { name: "apocalíptico", color: "red" },
  mythologies: [
    {
      id: "myth-1",
      people: "Elfos da Floresta",
      version: "Para os elfos, o Dragão Sombrio é conhecido como 'Nalagor, o Devorador de Estrelas'. Segundo suas lendas, ele nasceu da primeira noite que existiu no mundo, quando as trevas se separaram da luz. É visto como uma força natural inevitável, não necessariamente maligna, mas definitivamente perigosa."
    },
    {
      id: "myth-2", 
      people: "Humanos do Norte",
      version: "Os nórdicos o chamam de 'Mörkserpent' e acreditam que ele é o precursor do fim dos tempos. Suas lendas dizem que quando ele despertar completamente de seu sono milenar, as estrelas cairão do céu e a Era da Luz chegará ao fim."
    }
  ],
  inspirations: "Baseado em Smaug de Tolkien, com elementos de Alduin de Skyrim. Inspiração visual vem de dragões orientais misturados com dragões ocidentais clássicos. A mitologia se inspira em Jörmungandr da mitologia nórdica.",
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
};

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

const threatLevels = [
  { name: "inexistente", color: "green" },
  { name: "baixo", color: "blue" },
  { name: "médio", color: "yellow" },
  { name: "mortal", color: "orange" },
  { name: "apocalíptico", color: "red" }
];

export function BeastDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [beast, setBeast] = useState(mockBeast);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBeast, setEditedBeast] = useState(mockBeast);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMythology, setNewMythology] = useState({ people: "", version: "" });
  const [isAddingMythology, setIsAddingMythology] = useState(false);
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

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
      case "impotente": return "text-green-600 bg-green-50";
      case "mais fraco": return "text-green-500 bg-green-50";
      case "ligeiramente mais fraco": return "text-blue-500 bg-blue-50";
      case "igual": return "text-gray-500 bg-gray-50";
      case "ligeiramente mais forte": return "text-yellow-600 bg-yellow-50";
      case "mais forte": return "text-orange-500 bg-orange-50";
      case "impossível de ganhar": return "text-red-500 bg-red-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const handleSave = () => {
    setBeast(editedBeast);
    setIsEditing(false);
    toast.success("Besta atualizada com sucesso!");
  };

  const handleCancel = () => {
    setEditedBeast(beast);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEditing) {
          setEditedBeast({ ...editedBeast, image: imageUrl });
        } else {
          setBeast({ ...beast, image: imageUrl });
          toast.success("Imagem atualizada!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addMythology = () => {
    if (!newMythology.people.trim() || !newMythology.version.trim()) {
      toast.error("Povo e versão são obrigatórios");
      return;
    }

    const mythology = {
      id: `myth-${Date.now()}`,
      people: newMythology.people,
      version: newMythology.version
    };

    setEditedBeast({
      ...editedBeast,
      mythologies: [...editedBeast.mythologies, mythology]
    });

    setNewMythology({ people: "", version: "" });
    setIsAddingMythology(false);
  };

  const removeMythology = (mythId: string) => {
    setEditedBeast({
      ...editedBeast,
      mythologies: editedBeast.mythologies.filter(m => m.id !== mythId)
    });
  };

  const handleDelete = () => {
    toast.success("Besta excluída com sucesso!");
    navigate(-1);
  };

  const currentData = isEditing ? editedBeast : beast;

  // Mock linked notes - in real app would come from API/state
  const linkedNotes = [
    {
      id: "note-1",
      name: "Comportamento Noturno dos Dragões",
      content: "Observações sobre os padrões de comportamento dos dragões durante a noite. O Dragão Sombrio mostra características únicas...",
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      linkCreatedAt: new Date('2024-01-12')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{currentData.name}</h1>
              <p className="text-muted-foreground">Detalhes da besta</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsLinkedNotesModalOpen(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Anotações ({linkedNotes.length})
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteModal(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="btn-magical">
                  Salvar
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-6">
            {/* Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square w-full overflow-hidden rounded-lg relative group">
                  <img
                    src={currentData.image}
                    alt={currentData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Alterar
                    </Button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nível de Ameaça:</span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-${currentData.threatLevel.color}-50`}>
                    {React.createElement(getThreatLevelIcon(currentData.threatLevel.name), { className: "w-5 h-5" })}
                    <span className={`font-medium text-${currentData.threatLevel.color}-600`}>
                      {currentData.threatLevel.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hábito:</span>
                  <div className="flex items-center gap-2">
                    {React.createElement(getHabitIcon(currentData.habit), { className: "w-5 h-5" })}
                    <span className="font-medium">{currentData.habit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">vs Humano:</span>
                  <div className={`px-3 py-1 rounded-full ${getComparisonColor(currentData.humanComparison)}`}>
                    <span className="font-medium">{currentData.humanComparison}</span>
                  </div>
                </div>

                {currentData.race && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Raça:</span>
                    <Badge variant="secondary">{currentData.race}</Badge>
                  </div>
                )}

                {currentData.species && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Espécie:</span>
                    <Badge variant="outline">{currentData.species}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={editedBeast.name}
                        onChange={(e) => setEditedBeast({ ...editedBeast, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="alternativeNames">Nomes Alternativos</Label>
                      <Input
                        id="alternativeNames"
                        value={editedBeast.alternativeNames.join(", ")}
                        onChange={(e) => setEditedBeast({ 
                          ...editedBeast, 
                          alternativeNames: e.target.value.split(", ").filter(n => n.trim()) 
                        })}
                        placeholder="Separados por vírgula"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="race">Raça</Label>
                        <Input
                          id="race"
                          value={editedBeast.race}
                          onChange={(e) => setEditedBeast({ ...editedBeast, race: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="species">Espécie</Label>
                        <Input
                          id="species"
                          value={editedBeast.species}
                          onChange={(e) => setEditedBeast({ ...editedBeast, species: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="basicDescription">Descrição Básica</Label>
                      <Textarea
                        id="basicDescription"
                        value={editedBeast.basicDescription}
                        onChange={(e) => setEditedBeast({ ...editedBeast, basicDescription: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{currentData.name}</h3>
                      {currentData.alternativeNames.length > 0 && (
                        <p className="text-muted-foreground">
                          Também conhecido como: {currentData.alternativeNames.join(", ")}
                        </p>
                      )}
                    </div>
                    <p>{currentData.basicDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Descriptions */}
            <Card>
              <CardHeader>
                <CardTitle>Descrições Detalhadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="appearanceDescription">Descrição da Aparência</Label>
                      <Textarea
                        id="appearanceDescription"
                        value={editedBeast.appearanceDescription}
                        onChange={(e) => setEditedBeast({ ...editedBeast, appearanceDescription: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="behaviors">Comportamentos</Label>
                      <Textarea
                        id="behaviors"
                        value={editedBeast.behaviors}
                        onChange={(e) => setEditedBeast({ ...editedBeast, behaviors: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Aparência</h4>
                      <p className="text-muted-foreground">{currentData.appearanceDescription}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Comportamentos</h4>
                      <p className="text-muted-foreground">{currentData.behaviors}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Habitat and Relationships */}
            <Card>
              <CardHeader>
                <CardTitle>Habitat e Relacionamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="habit">Hábito</Label>
                        <Select value={editedBeast.habit} onValueChange={(value) => setEditedBeast({ ...editedBeast, habit: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {habits.map((habit) => (
                              <SelectItem key={habit} value={habit}>{habit}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="humanComparison">Comparação com Humano</Label>
                        <Select value={editedBeast.humanComparison} onValueChange={(value) => setEditedBeast({ ...editedBeast, humanComparison: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {humanComparisons.map((comparison) => (
                              <SelectItem key={comparison} value={comparison}>{comparison}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="habitat">Habitat</Label>
                      <Input
                        id="habitat"
                        value={editedBeast.habitat.join(", ")}
                        onChange={(e) => setEditedBeast({ 
                          ...editedBeast, 
                          habitat: e.target.value.split(", ").filter(h => h.trim()) 
                        })}
                        placeholder="Separados por vírgula"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weaknesses">Fraquezas</Label>
                      <Textarea
                        id="weaknesses"
                        value={editedBeast.weaknesses.join("\n")}
                        onChange={(e) => setEditedBeast({ 
                          ...editedBeast, 
                          weaknesses: e.target.value.split("\n").filter(w => w.trim()) 
                        })}
                        rows={3}
                        placeholder="Uma fraqueza por linha"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preys">Presas</Label>
                      <Input
                        id="preys"
                        value={editedBeast.preys.join(", ")}
                        onChange={(e) => setEditedBeast({ 
                          ...editedBeast, 
                          preys: e.target.value.split(", ").filter(p => p.trim()) 
                        })}
                        placeholder="Separados por vírgula"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Habitat</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentData.habitat.map((h, index) => (
                            <Badge key={index} variant="outline">{h}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Presas</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentData.preys.map((prey, index) => (
                            <Badge key={index} variant="secondary">{prey}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Fraquezas</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {currentData.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mythologies */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mitologias</CardTitle>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingMythology(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isAddingMythology && (
                  <Card className="p-4 border-dashed">
                    <div className="space-y-3">
                      <Input
                        placeholder="Nome do povo/espécie"
                        value={newMythology.people}
                        onChange={(e) => setNewMythology({ ...newMythology, people: e.target.value })}
                      />
                      <Textarea
                        placeholder="Versão da mitologia..."
                        value={newMythology.version}
                        onChange={(e) => setNewMythology({ ...newMythology, version: e.target.value })}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={addMythology}>Adicionar</Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setIsAddingMythology(false);
                          setNewMythology({ people: "", version: "" });
                        }}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {currentData.mythologies.map((mythology, index) => (
                  <Card key={mythology.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{mythology.people}</h4>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMythology(mythology.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground">{mythology.version}</p>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Inspirations */}
            <Card>
              <CardHeader>
                <CardTitle>Inspirações</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedBeast.inspirations}
                    onChange={(e) => setEditedBeast({ ...editedBeast, inspirations: e.target.value })}
                    rows={4}
                    placeholder="Links, pesquisas, temas que inspiraram esta besta..."
                  />
                ) : (
                  <p className="text-muted-foreground">{currentData.inspirations}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <ConfirmDeleteModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Excluir Besta"
          description="Esta ação não pode ser desfeita. A besta será permanentemente removida do bestiário."
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}