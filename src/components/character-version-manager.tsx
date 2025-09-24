import { useState } from "react";

import { GitBranch, Save, Trash2, Eye, Calendar, Edit3 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export interface ICharacterVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  isActive: boolean;
  data: any; // Character data for this version
}

interface PropsCharacterVersionManager {
  versions: ICharacterVersion[];
  currentVersion: ICharacterVersion;
  onVersionChange: (version: ICharacterVersion) => void;
  onVersionSave: (name: string, description?: string) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
}

export function CharacterVersionManager({
  versions,
  currentVersion,
  onVersionChange,
  onVersionSave,
  onVersionDelete,
  onVersionUpdate,
}: PropsCharacterVersionManager) {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteVersionId, setDeleteVersionId] = useState<string | null>(null);
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionDescription, setNewVersionDescription] = useState("");
  const [editingVersion, setEditingVersion] =
    useState<ICharacterVersion | null>(null);

  const handleCreateVersion = () => {
    if (!newVersionName.trim()) {
      toast.error("Nome da versão é obrigatório");
      return;
    }

    onVersionSave(
      newVersionName.trim(),
      newVersionDescription.trim() || undefined
    );
    setNewVersionName("");
    setNewVersionDescription("");
    setIsCreateModalOpen(false);
    toast.success("Versão criada com sucesso!");
  };

  const handleEditVersion = () => {
    if (!editingVersion || !newVersionName.trim()) {
      toast.error("Nome da versão é obrigatório");
      return;
    }

    onVersionUpdate(
      editingVersion.id,
      newVersionName.trim(),
      newVersionDescription.trim() || undefined
    );
    setNewVersionName("");
    setNewVersionDescription("");
    setEditingVersion(null);
    setIsEditModalOpen(false);
    toast.success("Versão atualizada com sucesso!");
  };

  const handleDeleteVersion = () => {
    if (deleteVersionId) {
      onVersionDelete(deleteVersionId);
      setDeleteVersionId(null);
      toast.success("Versão excluída com sucesso!");
    }
  };

  const openEditModal = (version: ICharacterVersion) => {
    setEditingVersion(version);
    setNewVersionName(version.name);
    setNewVersionDescription(version.description || "");
    setIsEditModalOpen(true);
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  return (
    <>
      {/* Main Version Manager Modal */}
      <Dialog open={isMainModalOpen} onOpenChange={setIsMainModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <GitBranch className="w-4 h-4 mr-2" />
            Versões ({versions.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              Versões do Personagem
              <Badge variant="outline" className="text-xs">
                {versions.length} {versions.length === 1 ? "versão" : "versões"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Nova Versão
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Salvar Nova Versão</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="version-name">Nome da Versão *</Label>
                      <Input
                        id="version-name"
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        placeholder="Ex: Versão Original, Monstrificado, Ferido..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="version-description">
                        Descrição (opcional)
                      </Label>
                      <Textarea
                        id="version-description"
                        value={newVersionDescription}
                        onChange={(e) =>
                          setNewVersionDescription(e.target.value)
                        }
                        placeholder="Descreva as mudanças ou contexto desta versão..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateVersion}>
                        Salvar Versão
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-2">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      version.isActive
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() =>
                      !version.isActive && onVersionChange(version)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {version.name}
                          </h4>
                          {version.isActive && (
                            <Badge variant="default" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Ativa
                            </Badge>
                          )}
                        </div>
                        {version.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                            {version.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(version.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(version);
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {versions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteVersionId(version.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-3" />

            <div className="text-xs text-muted-foreground">
              <p className="mb-1">
                💡 <strong>Dica:</strong> Use versões para salvar estados
                diferentes do personagem.
              </p>
              <p>
                Clique em uma versão para ativá-la. Edições afetam apenas a
                versão ativa.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Version Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Versão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-version-name">Nome da Versão *</Label>
              <Input
                id="edit-version-name"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="Ex: Versão Original, Monstrificado, Ferido..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-version-description">
                Descrição (opcional)
              </Label>
              <Textarea
                id="edit-version-description"
                value={newVersionDescription}
                onChange={(e) => setNewVersionDescription(e.target.value)}
                placeholder="Descreva as mudanças ou contexto desta versão..."
                className="min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleEditVersion}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={!!deleteVersionId}
        onClose={() => setDeleteVersionId(null)}
        onConfirm={handleDeleteVersion}
        title="Excluir Versão"
        description="Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita."
      />
    </>
  );
}
