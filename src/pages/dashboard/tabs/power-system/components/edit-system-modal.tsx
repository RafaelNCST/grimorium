import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { type IPowerSystem } from "../types/power-system-types";

interface EditSystemModalProps {
  isOpen: boolean;
  system: IPowerSystem | null;
  onClose: () => void;
  onSubmit: (systemId: string, name: string, iconImage?: string) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "System name is required" }),
  iconImage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EditSystemModal({
  isOpen,
  system,
  onClose,
  onSubmit,
}: EditSystemModalProps) {
  const { t } = useTranslation("power-system");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      iconImage: "",
    },
  });

  // Update form when system changes
  useEffect(() => {
    if (system) {
      form.reset({
        name: system.name,
        iconImage: system.iconImage || "",
      });
    }
  }, [system, form]);

  const handleSubmit = (data: FormData) => {
    if (!system) return;
    onSubmit(system.id, data.name, data.iconImage || undefined);
    onClose();
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const iconImage = form.watch("iconImage");
  const systemName = form.watch("name");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.edit_system.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* System Name with Icon */}
            <div className="flex items-start gap-4">
              {/* Image Upload */}
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
                  label={t("modals.edit_system.name_label")}
                  placeholder={t("modals.edit_system.name_placeholder")}
                  maxLength={150}
                  required
                  showCharCount
                  value={systemName}
                  labelClassName="text-primary"
                  onFocus={(e) => {
                    // Remove text selection when focused
                    setTimeout(() => {
                      e.target.selectionStart = e.target.selectionEnd;
                    }, 0);
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleCancel}
                className="flex-1 cursor-pointer"
              >
                {t("modals.edit_system.cancel")}
              </Button>
              <Button
                type="submit"
                variant="magical"
                size="lg"
                className="flex-1 animate-glow cursor-pointer"
              >
                {t("modals.edit_system.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
