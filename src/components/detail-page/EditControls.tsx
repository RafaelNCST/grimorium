import * as React from "react";

import { Edit, Save, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EditControlsProps {
  isEditing: boolean;
  hasChanges?: boolean;
  isSaving?: boolean;
  onEdit: () => void;
  onSave: () => Promise<void> | void;
  onCancel: () => void;
  className?: string;
  position?: "top" | "bottom" | "sticky";
  saveText?: string;
  cancelText?: string;
  editText?: string;
}

/**
 * EditControls - Standardized edit/save/cancel buttons
 *
 * @example
 * ```tsx
 * <EditControls
 *   isEditing={isEditing}
 *   hasChanges={hasChanges}
 *   isSaving={isSaving}
 *   onEdit={() => setIsEditing(true)}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function EditControls({
  isEditing,
  hasChanges = false,
  isSaving = false,
  onEdit,
  onSave,
  onCancel,
  className,
  position = "sticky",
  saveText = "Salvar",
  cancelText = "Cancelar",
  editText = "Editar",
}: EditControlsProps) {
  const positionClasses = {
    top: "sticky top-0 z-10",
    bottom: "sticky bottom-0 z-10",
    sticky: "sticky top-0 z-10",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 bg-card p-4 border-b border-border",
        positionClasses[position],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {hasChanges && isEditing && (
          <span className="text-sm text-muted-foreground">
            Alterações não salvas
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isEditing ? (
          <Button onClick={onEdit} variant="default">
            <Edit className="h-4 w-4" />
            {editText}
          </Button>
        ) : (
          <>
            <Button onClick={onCancel} variant="outline" disabled={isSaving}>
              <X className="h-4 w-4" />
              {cancelText}
            </Button>
            <Button
              onClick={onSave}
              variant="default"
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Salvando..." : saveText}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
