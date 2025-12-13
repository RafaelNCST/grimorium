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

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, groupId?: string) => void;
  groups?: Array<{ id: string; name: string }>;
  preselectedGroupId?: string;
}

const formSchema = z.object({
  name: z.string().max(100).optional().default(""),
  groupId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreatePageModal({
  isOpen,
  onClose,
  onSubmit,
  groups = [],
  preselectedGroupId,
}: CreatePageModalProps) {
  const { t } = useTranslation("power-system");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      groupId: preselectedGroupId || undefined,
    },
  });

  // Reset form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        groupId: preselectedGroupId || undefined,
      });
    } else {
      form.reset({
        name: "",
        groupId: undefined,
      });
    }
  }, [isOpen, preselectedGroupId, form]);

  const handleSubmit = (data: FormData) => {
    if (!data.name?.trim()) return;
    onSubmit(data.name, data.groupId);
    form.reset({
      name: "",
      groupId: undefined,
    });
    onClose();
  };

  const handleCancel = () => {
    form.reset({
      name: "",
      groupId: undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.create_page.title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Page Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      label={t("modals.create_page.name_label")}
                      placeholder={t("modals.create_page.name_placeholder")}
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleCancel}
                className="flex-1"
              >
                {t("modals.create_page.cancel")}
              </Button>
              <Button
                type="submit"
                variant="magical"
                size="lg"
                className="flex-1 animate-glow"
                disabled={!form.watch("name")?.trim()}
              >
                {t("modals.create_page.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
