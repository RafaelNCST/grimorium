import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, FileText, Wand2, Swords, X, Plus, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormInput } from "@/components/forms/FormInput";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { IPowerSystem } from "../types/power-system-types";

interface CreateSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    iconImage?: string,
    templateId?: string,
    language?: string
  ) => Promise<void>;
  existingSystems: IPowerSystem[];
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "System name is required" })
    .max(150, { message: "System name must be 150 characters or less" }),
  iconImage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Template {
  id: string | null;
  nameKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string }>;
  backgroundColor: string;
  borderColor: string;
}

const TEMPLATES: Template[] = [
  {
    id: null,
    nameKey: "modals.create_system.no_template",
    descriptionKey: "modals.create_system.no_template_description",
    icon: FileText,
    backgroundColor: "green-500/10",
    borderColor: "green-500/30",
  },
  {
    id: "magic",
    nameKey: "modals.create_system.templates.magic.name",
    descriptionKey: "modals.create_system.templates.magic.description",
    icon: Wand2,
    backgroundColor: "blue-500/10",
    borderColor: "blue-500/30",
  },
  {
    id: "martial",
    nameKey: "modals.create_system.templates.martial.name",
    descriptionKey: "modals.create_system.templates.martial.description",
    icon: Swords,
    backgroundColor: "orange-500/10",
    borderColor: "orange-500/30",
  },
];

// Helper para converter cores Tailwind em valores CSS
const getTailwindColor = (colorString: string): string => {
  const colorMap: Record<string, string> = {
    "green-500/10": "rgb(34 197 94 / 0.1)",
    "green-500/30": "rgb(34 197 94 / 0.3)",
    "blue-500/10": "rgb(59 130 246 / 0.1)",
    "blue-500/30": "rgb(59 130 246 / 0.3)",
    "orange-500/10": "rgb(249 115 22 / 0.1)",
    "orange-500/30": "rgb(249 115 22 / 0.3)",
  };
  return colorMap[colorString] || colorString;
};

export function CreateSystemModal({
  isOpen,
  onClose,
  onSubmit,
  existingSystems,
}: CreateSystemModalProps) {
  const { t, i18n } = useTranslation("power-system");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      iconImage: "",
    },
  });

  // Reset form and template selection when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        iconImage: "",
      });
      setSelectedTemplate(null);
      setShowDuplicateWarning(false);
      setPendingData(null);
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: FormData) => {
    // Check for duplicate names
    const duplicateSystem = existingSystems.find(
      (system) => system.name.toLowerCase() === data.name.trim().toLowerCase()
    );

    if (duplicateSystem) {
      setPendingData(data);
      setShowDuplicateWarning(true);
      return;
    }

    await onSubmit(
      data.name.trim(),
      data.iconImage || undefined,
      selectedTemplate || undefined,
      i18n.language
    );
    form.reset();
    setSelectedTemplate(null);
    onClose();
  };

  const handleConfirmDuplicate = async () => {
    if (!pendingData) return;

    await onSubmit(
      pendingData.name.trim(),
      pendingData.iconImage || undefined,
      selectedTemplate || undefined,
      i18n.language
    );
    form.reset();
    setSelectedTemplate(null);
    setShowDuplicateWarning(false);
    setPendingData(null);
    onClose();
  };

  const handleCancelDuplicate = () => {
    setShowDuplicateWarning(false);
    setPendingData(null);
  };

  const handleCancel = () => {
    form.reset();
    setSelectedTemplate(null);
    onClose();
  };

  const iconImage = form.watch("iconImage");
  const systemName = form.watch("name");

  const isSelected = (templateId: string | null): boolean => {
    return selectedTemplate === templateId;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {t("modals.create_system.title")}
            </DialogTitle>
            <DialogDescription>
              {t("modals.create_system.templates_section_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pl-1 pr-4 pb-6 mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
                id="create-system-form"
              >
                {/* System Name with Icon */}
                <div className="flex items-start gap-4">
                  {/* Image Upload - larger size, no label */}
                  <FormImageUpload
                    value={iconImage}
                    onChange={(value) => form.setValue("iconImage", value)}
                    label=""
                    height="h-28"
                    width="w-28"
                    shape="rounded"
                    imageFit="cover"
                    showLabel={false}
                    compact
                    placeholderIcon={Zap}
                  />

                  {/* System Name */}
                  <div className="flex-1">
                    <FormInput
                      {...form.register("name")}
                      label={t("modals.create_system.name_label")}
                      placeholder={t("modals.create_system.name_placeholder")}
                      maxLength={150}
                      required
                      showCharCount
                      value={systemName}
                      labelClassName="text-primary"
                    />
                  </div>
                </div>

                {/* Templates Section */}
                <div className="space-y-2">
                  <Label className="text-primary">
                    {t("modals.create_system.templates_section")}
                  </Label>

                  {/* First template (full width) */}
                  <div className="space-y-3">
                    {TEMPLATES.slice(0, 1).map((template) => {
                      const Icon = template.icon;
                      const selected = isSelected(template.id);

                      return (
                        <button
                          key={template.id ?? "no-template"}
                          type="button"
                          onClick={() => setSelectedTemplate(template.id)}
                          className={cn(
                            "relative p-4 rounded-lg border-2 transition-all text-left w-full",
                            !selected && "bg-card text-foreground border-border"
                          )}
                          style={
                            selected
                              ? {
                                  backgroundColor: getTailwindColor(
                                    template.backgroundColor
                                  ),
                                  borderColor: getTailwindColor(
                                    template.borderColor
                                  ),
                                  boxShadow: `0 0 0 4px ${getTailwindColor(template.borderColor).replace(/[0-9.]+\)$/, "0.5)")}`,
                                }
                              : undefined
                          }
                          onMouseEnter={(e) => {
                            if (!selected) {
                              e.currentTarget.style.backgroundColor =
                                getTailwindColor(template.backgroundColor);
                              e.currentTarget.style.borderColor =
                                getTailwindColor(template.borderColor);
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selected) {
                              e.currentTarget.style.backgroundColor = "";
                              e.currentTarget.style.borderColor = "";
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">
                                {t(template.nameKey)}
                              </p>
                              <p className="text-xs mt-1 opacity-80">
                                {t(template.descriptionKey)}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Last two templates (2 columns) */}
                    <div className="grid grid-cols-2 gap-3">
                      {TEMPLATES.slice(1).map((template) => {
                        const Icon = template.icon;
                        const selected = isSelected(template.id);

                        return (
                          <button
                            key={template.id ?? "no-template"}
                            type="button"
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                              "relative p-4 rounded-lg border-2 transition-all text-left",
                              !selected &&
                                "bg-card text-foreground border-border"
                            )}
                            style={
                              selected
                                ? {
                                    backgroundColor: getTailwindColor(
                                      template.backgroundColor
                                    ),
                                    borderColor: getTailwindColor(
                                      template.borderColor
                                    ),
                                    boxShadow: `0 0 0 4px ${getTailwindColor(template.borderColor).replace(/[0-9.]+\)$/, "0.5)")}`,
                                  }
                                : undefined
                            }
                            onMouseEnter={(e) => {
                              if (!selected) {
                                e.currentTarget.style.backgroundColor =
                                  getTailwindColor(template.backgroundColor);
                                e.currentTarget.style.borderColor =
                                  getTailwindColor(template.borderColor);
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!selected) {
                                e.currentTarget.style.backgroundColor = "";
                                e.currentTarget.style.borderColor = "";
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  {t(template.nameKey)}
                                </p>
                                <p className="text-xs mt-1 opacity-80">
                                  {t(template.descriptionKey)}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Footer with buttons */}
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 mr-2" />
              {t("modals.create_system.cancel")}
            </Button>
            <Button
              type="submit"
              form="create-system-form"
              variant="magical"
              className="animate-glow"
              disabled={!systemName || systemName.trim().length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("modals.create_system.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Name Warning Dialog */}
      <AlertDialog
        open={showDuplicateWarning}
        onOpenChange={setShowDuplicateWarning}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("modals.create_system.duplicate_warning.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("modals.create_system.duplicate_warning.description", {
                name: pendingData?.name.trim() || "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDuplicate}>
              {t("modals.create_system.duplicate_warning.cancel")}
            </AlertDialogCancel>
            <Button
              variant="magical"
              className="animate-glow"
              onClick={handleConfirmDuplicate}
            >
              {t("modals.create_system.duplicate_warning.confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
