import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Sparkles, FileText, Wand2, Swords } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  name: z.string().min(1, { message: "System name is required" }),
  iconImage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Template {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TEMPLATES: Template[] = [
  {
    id: "magic",
    nameKey: "modals.create_system.templates.magic.name",
    descriptionKey: "modals.create_system.templates.magic.description",
    icon: Wand2,
  },
  {
    id: "martial",
    nameKey: "modals.create_system.templates.martial.name",
    descriptionKey: "modals.create_system.templates.martial.description",
    icon: Swords,
  },
];

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("iconImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const iconImage = form.watch("iconImage");
  const systemName = form.watch("name");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("modals.create_system.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="h-full flex flex-col space-y-4"
              >
                {/* System Name and Icon */}
                <div className="space-y-2">
                  <FormLabel>{t("modals.create_system.name_label")}</FormLabel>
                  <div className="flex items-center gap-3 p-1">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      <label
                        htmlFor="icon-upload-create"
                        className="cursor-pointer"
                      >
                        {iconImage ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary hover:border-primary/80 transition-colors">
                            <img
                              src={iconImage}
                              alt="System icon"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors flex items-center justify-center">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </label>
                      <input
                        id="icon-upload-create"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Name Input */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={t(
                                "modals.create_system.name_placeholder"
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Templates Section */}
                <div className="flex-1 min-h-0 flex flex-col space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="text-sm font-semibold">
                        {t("modals.create_system.templates_section")}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "modals.create_system.templates_section_description"
                        )}
                      </p>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 pb-2">
                      {/* No Template Option */}
                      <Card
                        className={cn(
                          "cursor-pointer transition-all",
                          selectedTemplate === null
                            ? "bg-green-500/20 border-green-500/40"
                            : "hover:bg-white/5"
                        )}
                        onClick={() => setSelectedTemplate(null)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-green-500" />
                              </div>
                              <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                  {t("modals.create_system.no_template")}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">
                                  {t(
                                    "modals.create_system.no_template_description"
                                  )}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>

                      {/* Templates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {TEMPLATES.map((template) => {
                          const Icon = template.icon;
                          return (
                            <Card
                              key={template.id}
                              className={cn(
                                "cursor-pointer transition-all",
                                selectedTemplate === template.id
                                  ? "bg-blue-500/20 border-blue-500/40"
                                  : "hover:bg-white/5"
                              )}
                              onClick={() => setSelectedTemplate(template.id)}
                            >
                              <CardHeader className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-3 min-w-0">
                                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <Icon className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <CardTitle className="text-sm">
                                        {t(template.nameKey)}
                                      </CardTitle>
                                      <CardDescription className="text-xs mt-1 line-clamp-2">
                                        {t(template.descriptionKey)}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 cursor-pointer"
                  >
                    {t("modals.create_system.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="magical"
                    size="lg"
                    className="flex-1 animate-glow cursor-pointer"
                    disabled={!systemName || systemName.trim().length === 0}
                  >
                    {t("modals.create_system.submit")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
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
              size="lg"
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
