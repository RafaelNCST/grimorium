import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, groupId?: string) => void;
  groups?: Array<{ id: string; name: string }>;
  preselectedGroupId?: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Page name is required" }),
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        groupId: preselectedGroupId || undefined,
      });
    }
  }, [isOpen, preselectedGroupId, form]);

  const handleSubmit = (data: FormData) => {
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
          >
            {/* Page Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modals.create_page.name_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("modals.create_page.name_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Selection - Only shows when opened from group menu */}
            {preselectedGroupId && groups.length > 0 && (
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("modals.create_page.group_label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("modals.create_page.group_label")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
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
