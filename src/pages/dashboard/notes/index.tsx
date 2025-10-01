import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { toast } from "@/hooks/use-toast";
import { AnnotationLink } from "@/types/annotations";

import { NotesView } from "./view";

interface PropsNotes {
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

export function Notes({ bookId }: PropsNotes) {
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
    navigate({
      to: "/dashboard/$dashboardId/notes/file-notes/$file-notes-id",
      params: { dashboardId: bookId, "file-notes-id": file.id },
    });
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
    <NotesView
      bookId={bookId}
      notes={notes}
      currentPath={currentPath}
      showCreateFile={showCreateFile}
      showCreateFolder={showCreateFolder}
      newFileName={newFileName}
      newFolderName={newFolderName}
      editingFolder={editingFolder}
      editFolderName={editFolderName}
      isLinksModalOpen={isLinksModalOpen}
      selectedFileForLinks={selectedFileForLinks}
      showDeleteConfirm={showDeleteConfirm}
      itemToDelete={itemToDelete}
      getCurrentItems={getCurrentItems}
      getFolderPath={getFolderPath}
      onFolderClick={handleFolderClick}
      onBackClick={handleBackClick}
      onFileClick={handleFileClick}
      onSetShowCreateFile={setShowCreateFile}
      onSetShowCreateFolder={setShowCreateFolder}
      onSetNewFileName={setNewFileName}
      onSetNewFolderName={setNewFolderName}
      onSetEditFolderName={setEditFolderName}
      onCreateFile={handleCreateFile}
      onCreateFolder={handleCreateFolder}
      onEditFolder={handleEditFolder}
      onSaveFolderName={handleSaveFolderName}
      onCancelEdit={handleCancelEdit}
      onConfirmDelete={confirmDelete}
      onDeleteItem={handleDeleteItem}
      onOpenLinksModal={handleOpenLinksModal}
      onLinksChange={handleLinksChange}
      onSetIsLinksModalOpen={setIsLinksModalOpen}
      onSetSelectedFileForLinks={setSelectedFileForLinks}
      onSetShowDeleteConfirm={setShowDeleteConfirm}
      onSetItemToDelete={setItemToDelete}
    />
  );
}
