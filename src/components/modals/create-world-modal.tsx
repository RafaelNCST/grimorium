import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PropsCreateWorldModal {
  open: boolean;
  onClose: () => void;
  onWorldCreated?: (world: any) => void;
  bookId: string;
}

export function CreateWorldModal({
  open,
  onClose,
  onWorldCreated,
  bookId,
}: PropsCreateWorldModal) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    age: "",
    dominantOrganization: "",
    image: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const newWorld = {
      id: Date.now().toString(),
      bookId,
      type: "World" as const,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    onWorldCreated?.(newWorld);
    toast.success("Mundo criado com sucesso!");

    // Reset form
    setFormData({
      name: "",
      description: "",
      age: "",
      dominantOrganization: "",
      image: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Novo Mundo</DialogTitle>
          <DialogDescription>
            Preencha as informações do mundo. Apenas o nome é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome do mundo"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o mundo..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                placeholder="Ex: 5000 anos"
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dominantOrganization">
                Organização Dominante
              </Label>
              <Input
                id="dominantOrganization"
                placeholder="Ex: Reino de Aethermoor"
                value={formData.dominantOrganization}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dominantOrganization: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                placeholder="URL da imagem do mundo..."
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-magical">
                Criar Mundo
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
