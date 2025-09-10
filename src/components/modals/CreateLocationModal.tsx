import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface CreateLocationModalProps {
  open: boolean;
  onClose: () => void;
  onLocationCreated?: (location: any) => void;
  bookId: string;
  availableParents: Array<{id: string, name: string, type: string}>;
}

const locationClassifications = [
  "Aldeia", "Cidade", "Reino", "Império", "Floresta", "Montanha", 
  "Deserto", "Oceano", "Lago", "Rio", "Caverna", "Ruína", "Torre",
  "Castelo", "Fortaleza", "Porto", "Mercado", "Templo", "Academia"
];

const climates = [
  "Tropical", "Temperado", "Frio", "Árido", "Úmido", "Montanhoso",
  "Oceânico", "Continental", "Polar", "Desértico", "Mágico"
];

const terrains = [
  "Planície", "Montanha", "Floresta", "Deserto", "Pântano", "Tundra",
  "Oceano", "Lago", "Rio", "Caverna", "Rochoso", "Vulcânico", "Mágico"
];

export function CreateLocationModal({ open, onClose, onLocationCreated, bookId, availableParents }: CreateLocationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    classification: "",
    climate: "",
    location: "",
    terrain: "",
    parentId: "",
    image: ""
  });

  const [organizations, setOrganizations] = useState<string[]>([]);
  const [newOrganization, setNewOrganization] = useState("");
  const [livingEntities, setLivingEntities] = useState<string[]>([]);
  const [newLivingEntity, setNewLivingEntity] = useState("");

  const handleAddOrganization = () => {
    if (newOrganization.trim() && !organizations.includes(newOrganization.trim())) {
      setOrganizations([...organizations, newOrganization.trim()]);
      setNewOrganization("");
    }
  };

  const handleRemoveOrganization = (org: string) => {
    setOrganizations(organizations.filter(o => o !== org));
  };

  const handleAddLivingEntity = () => {
    if (newLivingEntity.trim() && !livingEntities.includes(newLivingEntity.trim())) {
      setLivingEntities([...livingEntities, newLivingEntity.trim()]);
      setNewLivingEntity("");
    }
  };

  const handleRemoveLivingEntity = (entity: string) => {
    setLivingEntities(livingEntities.filter(e => e !== entity));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const newLocation = {
      id: Date.now().toString(),
      bookId,
      type: "Location" as const,
      ...formData,
      parentId: formData.parentId || undefined,
      organizations,
      livingEntities,
      createdAt: new Date().toISOString()
    };

    onLocationCreated?.(newLocation);
    toast.success("Local criado com sucesso!");
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      classification: "",
      climate: "",
      location: "",
      terrain: "",
      parentId: "",
      image: ""
    });
    setOrganizations([]);
    setLivingEntities([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Local</DialogTitle>
          <DialogDescription>
            Preencha as informações do local. Apenas o nome é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome do local"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classification">Classificação</Label>
              <Select value={formData.classification} onValueChange={(value) => setFormData(prev => ({ ...prev, classification: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a classificação" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {locationClassifications.map((classification) => (
                    <SelectItem key={classification} value={classification}>
                      {classification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o local..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="climate">Clima</Label>
              <Select value={formData.climate} onValueChange={(value) => setFormData(prev => ({ ...prev, climate: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o clima" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {climates.map((climate) => (
                    <SelectItem key={climate} value={climate}>
                      {climate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terrain">Tipo de Solo</Label>
              <Select value={formData.terrain} onValueChange={(value) => setFormData(prev => ({ ...prev, terrain: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o terreno" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {terrains.map((terrain) => (
                    <SelectItem key={terrain} value={terrain}>
                      {terrain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentId">Mundo/Continente (opcional)</Label>
              <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um mundo ou continente" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="">Nenhum</SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name} ({parent.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                placeholder="Ex: Norte do Continente Central"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Organizações Presentes</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Guilda dos Mercadores"
                value={newOrganization}
                onChange={(e) => setNewOrganization(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOrganization())}
              />
              <Button type="button" variant="outline" onClick={handleAddOrganization}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {organizations.map((org) => (
                <Badge key={org} variant="secondary" className="flex items-center gap-1">
                  {org}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveOrganization(org)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Entidades Viventes</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Elfos, Dragões, etc."
                value={newLivingEntity}
                onChange={(e) => setNewLivingEntity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLivingEntity())}
              />
              <Button type="button" variant="outline" onClick={handleAddLivingEntity}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {livingEntities.map((entity) => (
                <Badge key={entity} variant="secondary" className="flex items-center gap-1">
                  {entity}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveLivingEntity(entity)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input
              id="image"
              placeholder="URL da imagem do local..."
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="magical">
              Criar Local
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}