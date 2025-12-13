import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormInput } from "@/components/forms/FormInput";
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
} from "@/components/ui/form";

interface CreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

const formSchema = z.object({
  title: z.string().max(100).optional().default(""),
});

type FormData = z.infer<typeof formSchema>;

export function CreateSectionModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateSectionModalProps) {
  const { t } = useTranslation("power-system");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
    mode: "onChange", // Enable validation on change
  });

  const handleSubmit = (data: FormData) => {
    if (!data.title?.trim()) return;
    onSubmit(data.title);
    form.reset();
    onClose();
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.create_section.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      label={t("modals.create_section.title_label")}
                      placeholder={t("modals.create_section.title_placeholder")}
                      required
                      labelClassName="text-primary"
                      showOptionalLabel={false}
                      maxLength={100}
                      showCharCount
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleCancel}
                className="flex-1"
              >
                {t("modals.create_section.cancel")}
              </Button>
              <Button
                type="submit"
                variant="magical"
                size="lg"
                className="flex-1 animate-glow"
                disabled={!form.watch("title")?.trim()}
              >
                {t("modals.create_section.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
