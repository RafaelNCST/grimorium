import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Edit2, Trash2, Save, Link } from "lucide-react";

import { EntityLinksModal } from "@/components/annotations/entity-links-modal";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NoteFile } from "@/mocks/local/files-data";
import { AnnotationLink } from "@/types/annotations";

export default function FileEditor() {
  const { bookId, fileId } = useParams({
    from: "/dashboard/$dashboardId/file/$fileId",
  });
  const navigate = useNavigate();
  const { t } = useTranslation(["errors", "forms", "common"]);
  const [file, setFile] = useState<NoteFile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editName, setEditName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);

  useEffect(() => {
    // Find the file by ID - would fetch from database in production
    // For now, set null as there are no mock files
    setFile(null);
  }, [fileId]);

  useEffect(() => {
    if (file) {
      const hasNameChanged = editName !== file.name;
      const hasContentChanged = editContent !== file.content;
      setHasUnsavedChanges(hasNameChanged || hasContentChanged);
    }
  }, [editName, editContent, file]);

  const handleSave = () => {
    if (!file) return;

    // Here you would update the file in your state management/API
    const updatedFile = {
      ...file,
      name: editName,
      content: editContent,
      updatedAt: new Date(),
    };

    setFile(updatedFile);
    setHasUnsavedChanges(false);
  };

  const handleDelete = () => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: bookId! },
    });
  };

  const handleLinksChange = (links: AnnotationLink[]) => {
    if (file) {
      const updatedFile = { ...file, links };
      setFile(updatedFile);
    }
  };

  const handleBackToNotes = () => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: bookId || "1" },
    });
  };

  const formatText = (text: string) =>
    // No longer needed - content is already in HTML format for rich text editor
    text;
  if (!file) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("errors:not_found.file")}
          </h1>
          <Button
            onClick={() =>
              navigate({
                to: "/dashboard/$dashboardId",
                params: { dashboardId: bookId! },
              })
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common:actions.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBackToNotes}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-bold border-none px-0 focus-visible:ring-0 bg-transparent"
                    placeholder={t("forms:labels.file_name")}
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{file.name}</h1>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Última edição: {file.updatedAt.toLocaleDateString()} às{" "}
                  {file.updatedAt.toLocaleTimeString()}
                  {hasUnsavedChanges && (
                    <span className="text-amber-600 ml-2">• Não salvo</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsLinksModalOpen(true)}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Links ({file.links?.length || 0})
                </Button>
              )}
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
                    <Save className="w-4 h-4 mr-2" />
                    {t("common:actions.save")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(file.content);
                      setEditName(file.name);
                      setHasUnsavedChanges(false);
                    }}
                  >
                    {t("common:actions.cancel")}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t("common:actions.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("common:actions.delete")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <RichTextEditor
          content={editContent}
          onChange={setEditContent}
          readOnly={!isEditing}
          placeholder="Comece a escrever suas anotações..."
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("common:delete_confirmation.title", { type: "arquivo" })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t("common:delete_confirmation.message", { name: file.name })}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                {t("common:delete_confirmation.cancel")}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="animate-glow-red"
                onClick={handleDelete}
              >
                {t("common:delete_confirmation.confirm")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Entity Links Modal */}
      <EntityLinksModal
        isOpen={isLinksModalOpen}
        onClose={() => setIsLinksModalOpen(false)}
        noteId={file.id}
        noteName={file.name}
        currentLinks={file.links || []}
        onLinksChange={handleLinksChange}
      />
    </div>
  );
}
