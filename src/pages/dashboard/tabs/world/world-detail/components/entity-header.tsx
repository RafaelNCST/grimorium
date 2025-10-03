import { ArrowLeft, Edit2, Trash2, X, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropsEntityHeader {
  entityName: string;
  entityType: string;
  isEditing: boolean;
  linkedNotesCount: number;
  entityIcon: React.ReactNode;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onLinkedNotesModalOpen: () => void;
}

export function EntityHeader({
  entityName,
  entityType,
  isEditing,
  linkedNotesCount,
  entityIcon,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onLinkedNotesModalOpen,
}: PropsEntityHeader) {
  return (
    <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {entityIcon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{entityName}</h1>
                <Badge variant="outline">{entityType}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="default" onClick={onSave}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onLinkedNotesModalOpen}>
                  <FileText className="w-4 h-4 mr-2" />
                  Anotações ({linkedNotesCount})
                </Button>
                <Button variant="outline" onClick={onEdit}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={onDeleteModalOpen}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
