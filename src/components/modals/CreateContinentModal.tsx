import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreateContinentModalProps {
  open: boolean;
  onClose: () => void;
  onContinentCreated?: (continent: any) => void;
  bookId: string;
  availableWorlds: Array<{id: string, name: string}>;
}

export function CreateContinentModal({ open, onClose, onContinentCreated, bookId, availableWorlds }: CreateContinentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    age: "",
    dominantOrganization: "",
    parentId: "",
    image: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const newContinent = {
      id: Date.now().toString(),
      bookId,
      type: "Continent" as const,
      ...formData,
      parentId: formData.parentId || undefined,
      createdAt: new Date().toISOString()
    };

    onContinentCreated?.(newContinent);
    toast.success("Continente criado com sucesso!");
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      age: "",
      dominantOrganization: "",
      parentId: "",
      image: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Novo Continente</DialogTitle>
          <DialogDescription>
            Preencha as informações do continente. Apenas o nome é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome do continente"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o continente..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Mundo (opcional)</Label>
              <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um mundo" />
                </SelectTrigger>  
                <SelectContent side="bottom">
                  <SelectItem value="">Nenhum mundo</SelectItem>
                  {availableWorlds.map((world) => (
                    <SelectItem key={world.id} value={world.id}>
                      {world.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                placeholder="Ex: 3000 anos"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dominantOrganization">Organização Dominante</Label>
              <Input
                id="dominantOrganization"
                placeholder="Ex: Reino de Aethermoor"
                value={formData.dominantOrganization}
                onChange={(e) => setFormData(prev => ({ ...prev, dominantOrganization: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                placeholder="URL da imagem do continente..."
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-magical">
                Criar Continente
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}