import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    knownName: z.string().min(1, t("forms:validation.known_name_required")),
    scientificName: z.string().optional(),
    description: z.string().min(1, t("forms:validation.summary_required")),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

interface PropsCreateSpeciesModal {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function CreateSpeciesModal({
  isOpen,
  onClose,
  onSubmit,
}: PropsCreateSpeciesModal) {
  const { t } = useTranslation(["dialogs", "forms"]);

  const form = useForm<FormData>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      knownName: "",
      scientificName: "",
      description: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialogs:create_species.title")}</DialogTitle>
          <DialogDescription>
            {t("dialogs:create_species.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="knownName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("forms:labels.known_name")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("forms:placeholders.known_name_example")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scientificName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("forms:labels.scientific_name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "forms:placeholders.scientific_name_example"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("forms:labels.description")} *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("forms:placeholders.describe_species")}
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("forms:buttons.cancel")}
              </Button>
              <Button type="submit">{t("forms:buttons.create_species")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
