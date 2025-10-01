import React, { useState } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Plus,
  Trash,
  Clock,
  BookOpen,
  FileText,
} from "lucide-react";

import { LinkedNotesModal } from "@/components/annotations/linked-notes-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import {
  Item,
  mockRarities,
  mockStatuses,
  mockItems,
  categories,
  mockLinkedNotes,
} from "@/mocks/local/item-data";

export default function ItemDetail() {
  const { itemId, dashboardId } = useParams({ from: "/dashboard/$dashboardId/tabs/item/$itemId" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const [item, setItem] = useState<Item | null>(
    itemId ? mockItems[itemId] || null : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMythologyPeople, setNewMythologyPeople] = useState("");
  const [newMythologyVersion, setNewMythologyVersion] = useState("");
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item não encontrado</h1>
          <Button onClick={() => window.history.back()}>
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
      window.history.back();
    }
  };

  const handleAddMythology = () => {
    if (newMythologyPeople && newMythologyVersion) {
      const newEntry: MythologyEntry = {
        id: Date.now().toString(),
        people: newMythologyPeople,
        version: newMythologyVersion,
      };
      setItem({
        ...item,
        mythology: [...item.mythology, newEntry],
      });
      setNewMythologyPeople("");
      setNewMythologyVersion("");
    }
  };

  const handleRemoveMythology = (mythologyId: string) => {
    setItem({
      ...item,
      mythology: item.mythology.filter((m) => m.id !== mythologyId),
    });
  };

  const handleOpenTimeline = () => {
    navigate({ to: "/dashboard/$dashboardId/tabs/item/$itemId/timeline", params: { dashboardId: dashboardId!, itemId: itemId! } });
  };

  // Mock linked notes - in real app would come from API/state
  const linkedNotes = mockLinkedNotes;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsLinkedNotesModalOpen(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Anotações ({linkedNotes.length})
            </Button>
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
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image and Quick Info */}
          <div className="space-y-6">
            {/* Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Categoria:</span>
                  <Badge variant="outline">{item.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Raridade:</span>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: `${item.rarity.color}20`,
                      color: item.rarity.color,
                      border: `1px solid ${item.rarity.color}40`,
                    }}
                  >
                    <span className="mr-1">{item.rarity.icon}</span>
                    {item.rarity.name}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline">
                    <span className="mr-1 text-lg">{item.status.icon}</span>
                    {item.status.name}
                  </Badge>
                </div>
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
                        value={item.name}
                        onChange={(e) =>
                          setItem({ ...item, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="alternativeNames">
                        Nomes Alternativos
                      </Label>
                      <Input
                        id="alternativeNames"
                        value={item.alternativeNames.join(", ")}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            alternativeNames: e.target.value
                              .split(", ")
                              .filter((n) => n.trim()),
                          })
                        }
                        placeholder="Separados por vírgula"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Categoria</Label>
                        <Select
                          value={item.category}
                          onValueChange={(value) =>
                            setItem({ ...item, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
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
                            const rarity = mockRarities.find(
                              (r) => r.id === value
                            );
                            if (rarity) setItem({ ...item, rarity });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockRarities.map((rarity) => (
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
                            const status = mockStatuses.find(
                              (s) => s.id === value
                            );
                            if (status) setItem({ ...item, status });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockStatuses.map((status) => (
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

                    <div>
                      <Label htmlFor="basicDescription">Descrição Básica</Label>
                      <Textarea
                        id="basicDescription"
                        value={item.basicDescription}
                        onChange={(e) =>
                          setItem({ ...item, basicDescription: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-2xl">{item.name}</h3>
                      {item.alternativeNames.length > 0 && (
                        <p className="text-muted-foreground mt-1">
                          Também conhecido como:{" "}
                          {item.alternativeNames.join(", ")}
                        </p>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {item.basicDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appearance and Origin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aparência</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={item.appearanceDescription}
                      onChange={(e) =>
                        setItem({
                          ...item,
                          appearanceDescription: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {item.appearanceDescription}
                    </p>
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
                      onChange={(e) =>
                        setItem({ ...item, origin: e.target.value })
                      }
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">{item.origin}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Powers and Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Poderes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={item.powers}
                      onChange={(e) =>
                        setItem({ ...item, powers: e.target.value })
                      }
                      rows={6}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {item.powers}
                    </p>
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
                      onChange={(e) =>
                        setItem({ ...item, weaknesses: e.target.value })
                      }
                      rows={6}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {item.weaknesses}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mythology */}
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
                    <p className="text-sm text-muted-foreground">
                      {entry.version}
                    </p>
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

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Anotações</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <RichTextEditor
                    content={item.inspirations}
                    onChange={(content) =>
                      setItem({ ...item, inspirations: content })
                    }
                    placeholder="Adicione suas anotações sobre este item..."
                  />
                ) : (
                  <div className="min-h-[200px] p-4 border rounded-lg bg-muted/20">
                    {item.inspirations ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.inspirations }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Nenhuma anotação ainda. Clique em "Editar" para
                        adicionar.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

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
