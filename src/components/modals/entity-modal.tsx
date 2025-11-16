import { type ReactNode } from "react";

import { type LucideIcon, Plus, Save, Loader2, X } from "lucide-react";

import { AdvancedSection } from "@/components/modals/create-region-modal/components/advanced-section";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoAlert } from "@/components/ui/info-alert";

interface EntityModalHeader {
  title: string;
  icon: LucideIcon;
  description: string;
  warning?: string; // Texto opcional para InfoAlert
}

interface EntityModalFooter {
  isSubmitting: boolean;
  isValid: boolean; // Controla se botão de submit está habilitado
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string; // default: "Criar"
  cancelLabel?: string; // default: "Cancelar"
  editMode?: boolean; // Se true, muda ícone para Save e label
}

interface EntityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  header: EntityModalHeader;
  basicFields: ReactNode; // Conteúdo dos campos básicos
  advancedFields?: ReactNode; // Conteúdo opcional da seção avançada
  footer: EntityModalFooter;
  maxWidth?: string; // default: "max-w-2xl"
  basicFieldsTitle?: string; // default traduzível
}

export function EntityModal({
  open,
  onOpenChange,
  header,
  basicFields,
  advancedFields,
  footer,
  maxWidth = "max-w-2xl",
  basicFieldsTitle = "Informações Básicas",
}: EntityModalProps) {
  const Icon = header.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {header.title}
          </DialogTitle>
          <DialogDescription>{header.description}</DialogDescription>
        </DialogHeader>

        {/* Important Note Alert */}
        {header.warning && <InfoAlert>{header.warning}</InfoAlert>}

        {/* Basic Fields Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {basicFieldsTitle}
          </h3>
          {basicFields}
        </div>

        {/* Advanced Section */}
        {advancedFields && <AdvancedSection>{advancedFields}</AdvancedSection>}

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={footer.onCancel}
            disabled={footer.isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            {footer.cancelLabel || "Cancelar"}
          </Button>
          <Button
            type="submit"
            variant="magical"
            className="animate-glow"
            disabled={footer.isSubmitting || !footer.isValid}
            onClick={footer.onSubmit}
          >
            {footer.isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : footer.editMode ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {footer.isSubmitting
              ? footer.editMode
                ? "Salvando..."
                : "Criando..."
              : footer.submitLabel || (footer.editMode ? "Salvar" : "Criar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
