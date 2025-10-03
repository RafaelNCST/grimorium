import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Folder,
  ArrowLeft,
  AlertTriangle,
  Link,
} from "lucide-react";

import { EntityLinksModal } from "@/components/annotations/entity-links-modal";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AnnotationLink } from "@/types/annotations";

interface PropsNotesTab {
  bookId: string;
}

interface NoteFile {
  id: string;
  name: string;
  content: string;
  type: "file";
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  links?: AnnotationLink[];
}

interface NoteFolder {
  id: string;
  name: string;
  type: "folder";
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TextStyle {
  bold: boolean;
  italic: boolean;
  heading: "none" | "h1" | "h2" | "h3";
  quote: boolean;
}

type NoteItem = NoteFile | NoteFolder;

const mockNotes: NoteItem[] = [
  {
    id: "1",
    name: "Ideias Principais",
    type: "folder",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Personagens Secundários",
    content:
      '<h1>Personagens Secundários</h1><h2>Elena Thornfield</h2><p><em>Comerciante de especiarias</em></p><blockquote>"O segredo dos negócios é saber quando dobrar a aposta."</blockquote><p>Personagem importante para o desenvolvimento do mercado negro.</p><p><strong>Características:</strong></p><div>• Astuta</div><div>• Corajosa</div><div>• Misteriosa</div>',
    type: "file",
    parentId: "1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Notas Gerais",
    type: "folder",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    name: "Sistema de Magia",
    content:
      '<h1>Sistema de Magia</h1><p>O sistema de magia é baseado em <em>elementos naturais</em>.</p><h2>Elementos Principais:</h2><div>• <strong>Fogo</strong>: Destruição e energia</div><div>• <strong>Água</strong>: Cura e fluidez</div><div>• <strong>Terra</strong>: Proteção e estabilidade</div><blockquote>"A magia flui como um rio, nunca forçada, sempre natural."</blockquote>',
    type: "file",
    parentId: "3",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18"),
  },
];

export function NotesTab({ bookId }: PropsNotesTab) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<NoteItem[]>(mockNotes);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [selectedFileForLinks, setSelectedFileForLinks] =
    useState<NoteFile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NoteItem | null>(null);

  const getCurrentFolderId = () => {
    if (currentPath.length === 0) return undefined;
    return currentPath[currentPath.length - 1];
  };

  const getCurrentItems = () => {
    const currentFolderId = getCurrentFolderId();
    return notes.filter((item) => item.parentId === currentFolderId);
  };

  const getFolderPath = () => {
    const path = ["Anotações"];
    currentPath.forEach((folderId) => {
      const folder = notes.find(
        (item) => item.id === folderId && item.type === "folder"
      );
      if (folder) path.push(folder.name);
    });
    return path;
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentPath([...currentPath, folderId]);
  };

  const handleBackClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleFileClick = (file: NoteFile) => {
    navigate(`/book/${bookId}/file/${file.id}`);
  };

  const handleSaveFile = () => {
    // This function is no longer needed since editing happens on separate page
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    const newFile: NoteFile = {
      id: Date.now().toString(),
      name: newFileName,
      content: "<div>Comece a escrever suas anotações aqui...</div>",
      type: "file",
      parentId: getCurrentFolderId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([...notes, newFile]);
    setNewFileName("");
    setShowCreateFile(false);
    toast({
      title: "Arquivo criado",
      description: `O arquivo "${newFileName}" foi criado com sucesso.`,
    });
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: NoteFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      type: "folder",
      parentId: getCurrentFolderId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([...notes, newFolder]);
    setNewFolderName("");
    setShowCreateFolder(false);
    toast({
      title: "Pasta criada",
      description: `A pasta "${newFolderName}" foi criada com sucesso.`,
    });
  };

  const handleEditFolder = (folder: NoteFolder) => {
    setEditingFolder(folder.id);
    setEditFolderName(folder.name);
  };

  const handleSaveFolderName = () => {
    if (!editFolderName.trim() || !editingFolder) return;

    setNotes(
      notes.map((item) =>
        item.id === editingFolder
          ? ({
              ...item,
              name: editFolderName,
              updatedAt: new Date(),
            } as NoteFolder)
          : item
      )
    );

    setEditingFolder(null);
    setEditFolderName("");
    toast({
      title: "Pasta renomeada",
      description: "O nome da pasta foi alterado com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setEditingFolder(null);
    setEditFolderName("");
  };

  const hasContentInFolder = (folderId: string): boolean => {
    const folderItems = notes.filter((item) => item.parentId === folderId);

    for (const item of folderItems) {
      if (item.type === "file") {
        const file = item as NoteFile;
        if (
          file.content &&
          file.content.trim() !==
            "<div>Comece a escrever suas anotações aqui...</div>" &&
          file.content.trim() !== ""
        ) {
          return true;
        }
      } else if (item.type === "folder") {
        if (hasContentInFolder(item.id)) {
          return true;
        }
      }
    }

    return false;
  };

  const hasFileContent = (file: NoteFile): boolean =>
    file.content &&
    file.content.trim() !==
      "<div>Comece a escrever suas anotações aqui...</div>" &&
    file.content.trim() !== "";

  const confirmDelete = (item: NoteItem) => {
    if (item.type === "folder" && hasContentInFolder(item.id)) {
      setItemToDelete(item);
      setShowDeleteConfirm(true);
      return;
    }

    if (item.type === "file" && hasFileContent(item as NoteFile)) {
      setItemToDelete(item);
      setShowDeleteConfirm(true);
      return;
    }

    handleDeleteItem(item.id);
  };

  const handleDeleteItem = (itemId: string) => {
    const deleteRecursive = (id: string) => {
      const children = notes.filter((item) => item.parentId === id);
      children.forEach((child) => deleteRecursive(child.id));
    };

    deleteRecursive(itemId);
    setNotes(
      notes.filter((item) => item.id !== itemId && item.parentId !== itemId)
    );
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    toast({
      title: "Item excluído",
      description: "O item foi excluído com sucesso.",
    });
  };

  const handleOpenLinksModal = (file: NoteFile) => {
    setSelectedFileForLinks(file);
    setIsLinksModalOpen(true);
  };

  const handleLinksChange = (links: AnnotationLink[]) => {
    if (selectedFileForLinks) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedFileForLinks.id && note.type === "file"
            ? { ...note, links }
            : note
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Anotações</h2>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {getFolderPath().map((folder, index) => (
              <span key={index}>
                {folder}
                {index < getFolderPath().length - 1 && " / "}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentPath.length > 0 && (
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}

          <Dialog open={showCreateFile} onOpenChange={setShowCreateFile}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Novo Arquivo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Arquivo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fileName">Nome do arquivo</Label>
                  <Input
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Nome do arquivo"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateFile(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateFile}>Criar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Nova Pasta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Pasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Nome da pasta</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nome da pasta"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateFolder(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateFolder}>Criar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getCurrentItems().map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition-shadow cursor-pointer group relative"
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col items-center justify-center text-center gap-3 relative">
                <div
                  className="flex flex-col items-center gap-2 flex-1 w-full"
                  onClick={() => {
                    if (editingFolder === item.id) return;
                    item.type === "folder"
                      ? handleFolderClick(item.id)
                      : handleFileClick(item as NoteFile);
                  }}
                >
                  {item.type === "folder" ? (
                    <Folder className="w-12 h-12 text-amber-600" />
                  ) : (
                    <FileText className="w-12 h-12 text-blue-600" />
                  )}

                  <div className="flex-1 min-w-0 w-full">
                    {editingFolder === item.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editFolderName}
                          onChange={(e) => setEditFolderName(e.target.value)}
                          className="text-center"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveFolderName();
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSaveFolderName}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <CardTitle className="text-base truncate">
                          {item.name}
                        </CardTitle>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex flex-col gap-1">
                            <span>
                              Criado:{" "}
                              {new Date(item.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                            <span>
                              Editado:{" "}
                              {new Date(item.updatedAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                          {item.type === "file" &&
                            (item as NoteFile).links &&
                            (item as NoteFile).links!.length > 0 && (
                              <div className="flex items-center gap-1 text-primary">
                                <Link className="w-3 h-3" />
                                <span>{(item as NoteFile).links!.length}</span>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay para arquivos */}
                {item.type === "file" && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${bookId}/file/${item.id}`);
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLinksModal(item);
                      }}
                      className="text-white hover:bg-white/20"
                    >
                      <Link className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(item);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {/* Botões para pastas */}
                {item.type === "folder" && editingFolder !== item.id && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFolder(item as NoteFolder);
                      }}
                      className="h-8 w-8"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(item);
                      }}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}

        {getCurrentItems().length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma anotação encontrada</p>
            <p className="text-sm text-muted-foreground">
              Crie seu primeiro arquivo ou pasta
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === "folder"
                ? `A pasta "${itemToDelete.name}" contém arquivos com conteúdo. Tem certeza que deseja excluí-la? Esta ação não pode ser desfeita.`
                : `O arquivo "${itemToDelete?.name}" contém conteúdo. Tem certeza que deseja excluí-lo? Esta ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteConfirm(false);
                setItemToDelete(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleDeleteItem(itemToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Entity Links Modal */}
      {selectedFileForLinks && (
        <EntityLinksModal
          isOpen={isLinksModalOpen}
          onClose={() => {
            setIsLinksModalOpen(false);
            setSelectedFileForLinks(null);
          }}
          noteId={selectedFileForLinks.id}
          noteName={selectedFileForLinks.name}
          currentLinks={selectedFileForLinks.links || []}
          onLinksChange={handleLinksChange}
        />
      )}
    </div>
  );
}
