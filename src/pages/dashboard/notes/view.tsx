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
import { useTranslation } from "react-i18next";

import { EntityLinksModal } from "@/components/annotations/entity-links-modal";
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
import { AnnotationLink } from "@/types/annotations";

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

interface NotesViewProps {
  bookId: string;
  notes: NoteItem[];
  currentPath: string[];
  showCreateFile: boolean;
  showCreateFolder: boolean;
  newFileName: string;
  newFolderName: string;
  editingFolder: string | null;
  editFolderName: string;
  isLinksModalOpen: boolean;
  selectedFileForLinks: NoteFile | null;
  showDeleteConfirm: boolean;
  itemToDelete: NoteItem | null;
  getCurrentItems: () => NoteItem[];
  getFolderPath: () => string[];
  onFolderClick: (folderId: string) => void;
  onBackClick: () => void;
  onFileClick: (file: NoteFile) => void;
  onSetShowCreateFile: (show: boolean) => void;
  onSetShowCreateFolder: (show: boolean) => void;
  onSetNewFileName: (name: string) => void;
  onSetNewFolderName: (name: string) => void;
  onSetEditFolderName: (name: string) => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onEditFolder: (folder: NoteFolder) => void;
  onSaveFolderName: () => void;
  onCancelEdit: () => void;
  onConfirmDelete: (item: NoteItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenLinksModal: (file: NoteFile) => void;
  onLinksChange: (links: AnnotationLink[]) => void;
  onSetIsLinksModalOpen: (open: boolean) => void;
  onSetSelectedFileForLinks: (file: NoteFile | null) => void;
  onSetShowDeleteConfirm: (show: boolean) => void;
  onSetItemToDelete: (item: NoteItem | null) => void;
}

export function NotesView({
  bookId,
  currentPath,
  showCreateFile,
  showCreateFolder,
  newFileName,
  newFolderName,
  editingFolder,
  editFolderName,
  isLinksModalOpen,
  selectedFileForLinks,
  showDeleteConfirm,
  itemToDelete,
  getCurrentItems,
  getFolderPath,
  onFolderClick,
  onBackClick,
  onFileClick,
  onSetShowCreateFile,
  onSetShowCreateFolder,
  onSetNewFileName,
  onSetNewFolderName,
  onSetEditFolderName,
  onCreateFile,
  onCreateFolder,
  onEditFolder,
  onSaveFolderName,
  onCancelEdit,
  onConfirmDelete,
  onDeleteItem,
  onOpenLinksModal,
  onLinksChange,
  onSetIsLinksModalOpen,
  onSetSelectedFileForLinks,
  onSetShowDeleteConfirm,
  onSetItemToDelete,
}: NotesViewProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("notes");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t("page.title")}</h2>
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
            <Button variant="outline" onClick={onBackClick}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("page.back")}
            </Button>
          )}

          <Dialog open={showCreateFile} onOpenChange={onSetShowCreateFile}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                {t("page.new_file")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("file_manager.create_file_title")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fileName">{t("file_manager.file_name_label")}</Label>
                  <Input
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => onSetNewFileName(e.target.value)}
                    placeholder={t("file_manager.file_name_placeholder")}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onSetShowCreateFile(false)}
                  >
                    {t("page.cancel")}
                  </Button>
                  <Button onClick={onCreateFile}>{t("page.create")}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateFolder} onOpenChange={onSetShowCreateFolder}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                {t("page.new_folder")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("file_manager.create_folder_title")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">{t("file_manager.folder_name_label")}</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => onSetNewFolderName(e.target.value)}
                    placeholder={t("file_manager.folder_name_placeholder")}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onSetShowCreateFolder(false)}
                  >
                    {t("page.cancel")}
                  </Button>
                  <Button onClick={onCreateFolder}>{t("page.create")}</Button>
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
                      ? onFolderClick(item.id)
                      : onFileClick(item as NoteFile);
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
                          onChange={(e) => onSetEditFolderName(e.target.value)}
                          className="text-center"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onSaveFolderName();
                            } else if (e.key === "Escape") {
                              onCancelEdit();
                            }
                          }}
                        />
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={onSaveFolderName}
                          >
                            {t("page.save")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={onCancelEdit}
                          >
                            {t("page.cancel")}
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
                              {t("page.created")}{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span>
                              {t("page.edited")}{" "}
                              {new Date(item.updatedAt).toLocaleDateString()}
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
                        navigate({
                          to: "/dashboard/$dashboardId/file/$fileId",
                          params: { dashboardId: bookId, fileId: item.id },
                        });
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLinksModal(item);
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
                        onConfirmDelete(item);
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
                        onEditFolder(item as NoteFolder);
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
                        onConfirmDelete(item);
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
            <p className="text-muted-foreground">{t("file_manager.empty_state_title")}</p>
            <p className="text-sm text-muted-foreground">
              {t("file_manager.empty_state_description")}
            </p>
          </div>
        )}
      </div>

      <AlertDialog
        open={showDeleteConfirm}
        onOpenChange={onSetShowDeleteConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {t("file_manager.confirm_delete_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === "folder"
                ? t("file_manager.confirm_delete_folder", { name: itemToDelete.name })
                : t("file_manager.confirm_delete_file", { name: itemToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                onSetShowDeleteConfirm(false);
                onSetItemToDelete(null);
              }}
            >
              {t("page.cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              size="lg"
              className="animate-glow-red"
              onClick={() => itemToDelete && onDeleteItem(itemToDelete.id)}
            >
              {t("page.delete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Entity Links Modal */}
      {selectedFileForLinks && (
        <EntityLinksModal
          isOpen={isLinksModalOpen}
          onClose={() => {
            onSetIsLinksModalOpen(false);
            onSetSelectedFileForLinks(null);
          }}
          noteId={selectedFileForLinks.id}
          noteName={selectedFileForLinks.name}
          currentLinks={selectedFileForLinks.links || []}
          onLinksChange={onLinksChange}
        />
      )}
    </div>
  );
}
