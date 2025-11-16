import * as React from "react";

import { Loader2 } from "lucide-react";

import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CreateVersionData {
  name: string;
  description?: string;
}

export interface CreateVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateVersionData) => Promise<void>;
  title?: string;
  description?: string;
  entityType?: string;
}

/**
 * CreateVersionDialog - Dialog for creating a new version
 */
export function CreateVersionDialog({
  open,
  onOpenChange,
  onSubmit,
  title = "Criar Nova Versão",
  description = "Crie uma nova versão para esta entidade.",
  entityType = "entidade",
}: CreateVersionDialogProps) {
  const [name, setName] = React.useState("");
  const [versionDescription, setVersionDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: versionDescription.trim() || undefined,
      });

      // Reset form
      setName("");
      setVersionDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating version:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormInput
              label="Nome da Versão"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Versão Pré-Guerra"
              required
              autoFocus
            />

            <FormTextarea
              label="Descrição"
              value={versionDescription}
              onChange={(e) => setVersionDescription(e.target.value)}
              placeholder={`Descreva as mudanças desta versão do(a) ${entityType}...`}
              rows={4}
              maxLength={500}
              showCharCount
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar Versão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
