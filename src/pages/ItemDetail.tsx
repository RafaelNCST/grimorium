import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Save, X, Plus, Trash, Clock, BookOpen } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useToast } from "@/hooks/use-toast";

// Mock data structures (same as ItemsTab)
interface Rarity {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ItemStatus {
  id: string;
  name: string;
  icon: string;
}

interface MythologyEntry {
  id: string;
  people: string;
  version: string;
}

interface Item {
  id: string;
  name: string;
  image: string;
  alternativeNames: string[];
  basicDescription: string;
  appearanceDescription: string;
  category: string;
  rarity: Rarity;
  status: ItemStatus;
  origin: string;
  weaknesses: string;
  powers: string;
  mythology: MythologyEntry[];
  inspirations: string;
}

// Mock data
const mockRarities: Rarity[] = [
  { id: "1", name: "Comum", color: "#6B7280", icon: "⚪" },
  { id: "2", name: "Incomum", color: "#10B981", icon: "🟢" },
  { id: "3", name: "Raro", color: "#3B82F6", icon: "🔵" },
  { id: "4", name: "Lendário", color: "#F59E0B", icon: "🟡" },
];

const mockStatuses: ItemStatus[] = [
  { id: "1", name: "Destruído", icon: "💥" },
  { id: "2", name: "Completa", icon: "✨" },
  { id: "3", name: "Incompleta", icon: "🪓" },
  { id: "4", name: "Selada", icon: "🔒" },
  { id: "5", name: "Enfraquecida", icon: "⚡" },
];

const mockItems: Record<string, Item> = {
  "1": {
    id: "1",
    name: "Excalibur",
    image: "/placeholder.svg",
    alternativeNames: ["A Espada do Rei", "Caliburn"],
    basicDescription: "Lendária espada do Rei Arthur",
    appearanceDescription: "Uma espada de lâmina prateada com punho dourado ornamentado, envolta em runas místicas que brilham quando empunhada por alguém digno.",
    category: "Arma",
    rarity: mockRarities[3],
    status: mockStatuses[1],
    origin: "Forjada por Merlim nas forjas celestiais usando metal estelar",
    weaknesses: "Só pode ser empunhada por alguém puro de coração. Perde seus poderes se usada para fins malévolos.",
    powers: "Corta qualquer material conhecido, emite luz divina que repele criaturas das trevas, concede proteção contra magia negra.",
    mythology: [
      { id: "1", people: "Bretões", version: "A espada sagrada dada pelos deuses ao rei escolhido" },
      { id: "2", people: "Saxões", version: "Uma arma demoníaca que corrompe quem a empunha" }
    ],
    inspirations: "Lenda Arturiana, mitologia celta, espadas lendárias japonesas"
  }
};

const categories = ["Arma", "Armadura", "Consumível", "Recurso", "Artefato", "Relíquia", "Outro"];

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [item, setItem] = useState<Item | null>(id ? mockItems[id] || null : null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMythologyPeople, setNewMythologyPeople] = useState("");
  const [newMythologyVersion, setNewMythologyVersion] = useState("");

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item não encontrado</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Item salvo",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDelete = (itemName: string) => {
    if (itemName === item.name) {
      toast({
        title: "Item excluído",
        description: "O item foi excluído permanentemente.",
      });
      navigate(-1);
    }
  };

  const handleAddMythology = () => {
    if (newMythologyPeople && newMythologyVersion) {
      const newEntry: MythologyEntry = {
        id: Date.now().toString(),
        people: newMythologyPeople,
        version: newMythologyVersion
      };
      setItem({
        ...item,
        mythology: [...item.mythology, newEntry]
      });
      setNewMythologyPeople("");
      setNewMythologyVersion("");
    }
  };

  const handleRemoveMythology = (mythologyId: string) => {
    setItem({
      ...item,
      mythology: item.mythology.filter(m => m.id !== mythologyId)
    });
  };

  const handleOpenTimeline = () => {
    navigate(`/item/${id}/timeline`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleOpenTimeline}>
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="btn-magical">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                  <Trash className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Item Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={item.name}
                    onChange={(e) => setItem({ ...item, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="alternativeNames">Nomes Alternativos</Label>
                  <Input
                    id="alternativeNames"
                    value={item.alternativeNames.join(", ")}
                    onChange={(e) => setItem({ 
                      ...item, 
                      alternativeNames: e.target.value.split(", ").filter(n => n.trim()) 
                    })}
                    placeholder="Separados por vírgula"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
                {item.alternativeNames.length > 0 && (
                  <p className="text-lg text-muted-foreground mb-4">
                    Também conhecido como: {item.alternativeNames.join(", ")}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline">{item.category}</Badge>
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: item.rarity.color + '20',
                  color: item.rarity.color,
                  border: `1px solid ${item.rarity.color}40`
                }}
              >
                <span className="mr-1">{item.rarity.icon}</span>
                {item.rarity.name}
              </Badge>
              <Badge variant="outline">
                <span className="mr-1 text-lg">{item.status.icon}</span>
                {item.status.name}
              </Badge>
            </div>

            {isEditing ? (
              <Textarea
                value={item.basicDescription}
                onChange={(e) => setItem({ ...item, basicDescription: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-lg">{item.basicDescription}</p>
            )}
          </div>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="powers">Poderes & Fraquezas</TabsTrigger>
            <TabsTrigger value="mythology">Mitologia</TabsTrigger>
            <TabsTrigger value="notes">Anotações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aparência</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={item.appearanceDescription}
                      onChange={(e) => setItem({ ...item, appearanceDescription: e.target.value })}
                      rows={4}
                    />
                  ) : (
                    <p>{item.appearanceDescription}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Origem</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={item.origin}
                      onChange={(e) => setItem({ ...item, origin: e.target.value })}
                      rows={4}
                    />
                  ) : (
                    <p>{item.origin}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {isEditing && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select 
                    value={item.category} 
                    onValueChange={(value) => setItem({ ...item, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Raridade</Label>
                  <Select 
                    value={item.rarity.id} 
                    onValueChange={(value) => {
                      const rarity = mockRarities.find(r => r.id === value);
                      if (rarity) setItem({ ...item, rarity });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRarities.map(rarity => (
                        <SelectItem key={rarity.id} value={rarity.id}>
                          <div className="flex items-center gap-2">
                            <span>{rarity.icon}</span>
                            <span>{rarity.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select 
                    value={item.status.id} 
                    onValueChange={(value) => {
                      const status = mockStatuses.find(s => s.id === value);
                      if (status) setItem({ ...item, status });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStatuses.map(status => (
                        <SelectItem key={status.id} value={status.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{status.icon}</span>
                            <span>{status.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="powers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Poderes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={item.powers}
                      onChange={(e) => setItem({ ...item, powers: e.target.value })}
                      rows={6}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{item.powers}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fraquezas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={item.weaknesses}
                      onChange={(e) => setItem({ ...item, weaknesses: e.target.value })}
                      rows={6}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{item.weaknesses}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mythology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Visões Mitológicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.mythology.map((entry) => (
                  <div key={entry.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{entry.people}</Badge>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMythology(entry.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm">{entry.version}</p>
                  </div>
                ))}

                {isEditing && (
                  <div className="space-y-3 p-4 border-2 border-dashed rounded-lg">
                    <h4 className="font-medium">Adicionar Nova Visão</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Povo/Cultura (ex: Elfos, Anões...)"
                        value={newMythologyPeople}
                        onChange={(e) => setNewMythologyPeople(e.target.value)}
                      />
                      <Textarea
                        placeholder="Como este povo vê/interpreta o item..."
                        value={newMythologyVersion}
                        onChange={(e) => setNewMythologyVersion(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleAddMythology} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Visão
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inspirações & Anotações</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <RichTextEditor
                    content={item.inspirations}
                    onChange={(content) => setItem({ ...item, inspirations: content })}
                    placeholder="Adicione suas inspirações, links, referências e ideias..."
                  />
                ) : (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.inspirations }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ConfirmDeleteModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete(item.name)}
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir o item "${item.name}"?`}
          itemName={item.name}
          itemType="item"
        />
      </div>
    </div>
  );
}