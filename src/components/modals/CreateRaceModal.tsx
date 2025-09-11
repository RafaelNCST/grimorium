import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  history: z.string().min(1, "História é obrigatória"),
  type: z.enum(['Aquática', 'Terrestre', 'Voadora', 'Espacial', 'Espiritual'], {
    required_error: "Tipo é obrigatório"
  }),
  physicalCharacteristics: z.string().optional(),
  culture: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateRaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function CreateRaceModal({ isOpen, onClose, onSubmit }: CreateRaceModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      history: "",
      type: undefined,
      physicalCharacteristics: "",
      culture: "",
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Raça</DialogTitle>
          <DialogDescription>
            Crie uma nova raça para esta espécie.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Elfos da Floresta, Dragão de Fogo..." {...field} />
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
                      placeholder="Descrição breve da raça..."
                      className="min-h-[60px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo da raça" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Aquática">Aquática</SelectItem>
                      <SelectItem value="Terrestre">Terrestre</SelectItem>
                      <SelectItem value="Voadora">Voadora</SelectItem>
                      <SelectItem value="Espacial">Espacial</SelectItem>
                      <SelectItem value="Espiritual">Espiritual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>História *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Conte a história e origem desta raça..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="physicalCharacteristics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Características Físicas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva as características físicas desta raça (opcional)..."
                      className="min-h-[60px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="culture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cultura</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a cultura e costumes desta raça (opcional)..."
                      className="min-h-[60px]"
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
              <Button type="submit">
                Criar Raça
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}