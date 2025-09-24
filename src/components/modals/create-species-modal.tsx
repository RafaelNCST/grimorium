import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  knownName: z.string().min(1, "Nome conhecido é obrigatório"),
  scientificName: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

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
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
          <DialogTitle>Nova Espécie</DialogTitle>
          <DialogDescription>
            Crie uma nova espécie para este mundo. Você poderá adicionar raças
            posteriormente.
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
                  <FormLabel>Nome Conhecido *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Elfos, Dragões, Humanos..."
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
                  <FormLabel>Nome Científico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Homo elvensis (opcional)"
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
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva as características gerais desta espécie..."
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
                Cancelar
              </Button>
              <Button type="submit">Criar Espécie</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
