import { useState, type ReactNode } from "react";

import { type LucideIcon, Plus, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CollapsibleSection } from "@/components/layouts/CollapsibleSection";
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
  width?: string; // Classes Tailwind de largura (ex: "w-full max-w-3xl")
  height?: string; // Classes Tailwind de altura (ex: "max-h-[90vh]")
  basicFieldsTitle?: string; // default traduzível
  advancedFieldsTitle?: string; // default traduzível
}

export function EntityModal({
  open,
  onOpenChange,
  header,
  basicFields,
  advancedFields,
  footer,
  width = "w-full max-w-2xl",
  height = "max-h-[90vh]",
  basicFieldsTitle,
  advancedFieldsTitle,
}: EntityModalProps) {
  const { t } = useTranslation("common");
  const Icon = header.icon;
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${width} ${height} flex flex-col gap-0`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {header.title}
          </DialogTitle>
          <DialogDescription>{header.description}</DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pl-1 pr-4 pb-6 mt-4">
          {/* Important Note Alert */}
          {header.warning && <InfoAlert>{header.warning}</InfoAlert>}

          {/* Basic Fields Section */}
          <div className="space-y-6 mt-4 w-full max-w-full">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {basicFieldsTitle ?? t("basic_info")}
            </h3>
            {basicFields}
          </div>

          {/* Advanced Section */}
          {advancedFields && (
            <div className="mt-6 w-full max-w-full">
              <CollapsibleSection
                title={advancedFieldsTitle ?? t("advanced_info")}
                isOpen={isAdvancedOpen}
                onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
              >
                <div className="space-y-6 w-full max-w-full">
                  {advancedFields}
                </div>
              </CollapsibleSection>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
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
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-primary" />
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
