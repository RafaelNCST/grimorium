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

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Group name is required" }),
});

type FormData = z.infer<typeof formSchema>;

export function CreateGroupModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateGroupModalProps) {
  const { t } = useTranslation("power-system");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data.name);
    form.reset();
    onClose();
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.create_group.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modals.create_group.name_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("modals.create_group.name_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                {t("modals.create_group.cancel")}
              </Button>
              <Button
                type="submit"
                variant="magical"
                size="lg"
                className="flex-1 animate-glow"
              >
                {t("modals.create_group.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
