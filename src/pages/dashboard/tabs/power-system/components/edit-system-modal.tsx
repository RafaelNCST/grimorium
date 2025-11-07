import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  const handleRemoveImage = () => {
    form.setValue("iconImage", "");
  };

  const iconImage = form.watch("iconImage");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.edit_system.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>{t("modals.edit_system.name_label")}</FormLabel>
              <div className="flex items-center gap-3">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <label htmlFor="icon-upload" className="cursor-pointer">
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
                    id="icon-upload"
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
                          placeholder={t("modals.edit_system.name_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
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
