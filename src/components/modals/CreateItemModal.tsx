import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createItemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  image: z.string().optional(),
  alternativeNames: z.string().optional(),
  basicDescription: z.string().min(1, "Descrição básica é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  rarityId: z.string().min(1, "Raridade é obrigatória"),
  statusId: z.string().min(1, "Status é obrigatório"),
});

type CreateItemFormData = z.infer<typeof createItemSchema>;

interface Rarity {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ItemStatus {
  id: string;
  name: string;
  icon: string;
}

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemFormData) => void;
  rarities: Rarity[];
  statuses: ItemStatus[];
}

const categories = ["Arma", "Armadura", "Consumível", "Recurso", "Artefato", "Relíquia", "Outro"];

export function CreateItemModal({ isOpen, onClose, onSubmit, rarities, statuses }: CreateItemModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      statusId: "2" // Default to "Completa"
    }
  });

  const selectedCategory = watch("category");
  const selectedRarityId = watch("rarityId");
  const selectedStatusId = watch("statusId");

  const handleFormSubmit = async (data: CreateItemFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Excalibur"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input
              id="image"
              {...register("image")}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternativeNames">Nomes Alternativos</Label>
            <Input
              id="alternativeNames"
              {...register("alternativeNames")}
              placeholder="Ex: A Espada do Rei, Caliburn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="basicDescription">Descrição Básica *</Label>
            <Textarea
              id="basicDescription"
              {...register("basicDescription")}
              placeholder="Uma breve descrição do item..."
              rows={3}
            />
            {errors.basicDescription && (
              <p className="text-sm text-destructive">{errors.basicDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select value={selectedCategory} onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Raridade *</Label>
            <Select value={selectedRarityId} onValueChange={(value) => setValue("rarityId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma raridade" />
              </SelectTrigger>
              <SelectContent>
                {rarities.map(rarity => (
                  <SelectItem key={rarity.id} value={rarity.id}>
                    <div className="flex items-center gap-2">
                      <span>{rarity.icon}</span>
                      <span>{rarity.name}</span>
                      <div 
                        className="w-3 h-3 rounded-full ml-2" 
                        style={{ backgroundColor: rarity.color }}
                      />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rarityId && (
              <p className="text-sm text-destructive">{errors.rarityId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Select value={selectedStatusId} onValueChange={(value) => setValue("statusId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{status.icon}</span>
                      <span>{status.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.statusId && (
              <p className="text-sm text-destructive">{errors.statusId.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-magical">
              {isSubmitting ? "Criando..." : "Criar Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}