import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  RaceGroupFormSchema,
  useRaceGroupValidation,
} from "./use-race-group-validation";

interface CreateRaceGroupModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: RaceGroupFormSchema) => void;
  initialValues?: RaceGroupFormSchema;
  groupId?: string;
}

export function CreateRaceGroupModal({
  open,
  onClose,
  onConfirm,
  initialValues,
  groupId,
}: CreateRaceGroupModalProps) {
  const form = useRaceGroupValidation();
  const isEditMode = !!groupId;

  // Watch form values to detect changes
  const currentName = form.watch("name");
  const currentDescription = form.watch("description");

  // Check if there are changes when editing
  const hasChanges = isEditMode
    ? currentName !== initialValues?.name ||
      currentDescription !== initialValues?.description
    : true;

  // Reset form when modal closes or load initial values when opening
  useEffect(() => {
    if (open) {
      // If editing, load initial values; otherwise reset to empty
      if (initialValues) {
        form.reset(initialValues);
      } else {
        form.reset({ name: "", description: "" });
      }
    } else if (!open) {
      form.reset({ name: "", description: "" });
    }
  }, [open, initialValues, form]);

  const handleSubmit = (data: RaceGroupFormSchema) => {
    onConfirm(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Grupo de Raças" : "Criar Grupo de Raças"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edite as informações do grupo de raças."
              : "Crie um grupo para organizar suas raças. Você poderá adicionar raças ao grupo após criá-lo."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Nome do Grupo */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome do Grupo <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Raças Antigas, Bestas Míticas, Espécies Mágicas..."
                      maxLength={300}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resumo */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Resumo <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva brevemente o que caracteriza este grupo de raças..."
                      maxLength={500}
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormMessage />
                    <span>{field.value?.length || 0}/500</span>
                  </div>
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="magical"
                className="animate-glow"
                disabled={!hasChanges}
              >
                {isEditMode ? "Salvar" : "Criar Grupo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
