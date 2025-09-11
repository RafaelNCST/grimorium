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

interface CreateOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onOrganizationCreated?: (organization: any) => void;
  bookId: string;
  availableCharacters: Array<{id: string, name: string}>;
  availableLocations: Array<{id: string, name: string, type: string}>;
}

const alignments = ["Bem", "Neutro", "Caótico"];
const types = ["Comercial", "Militar", "Mágica", "Religiosa", "Culto", "Governamental", "Acadêmica", "Realeza", "Mercenária"];
const influences = ["Inexistente", "Baixa", "Média", "Alta", "Dominante"];

export function CreateOrganizationModal({ 
  open, 
  onClose, 
  onOrganizationCreated, 
  bookId,
  availableCharacters = [],
  availableLocations = []
}: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    alignment: "",
    type: "",
    influence: "",
    baseLocation: "",
    image: ""
  });

  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [leaders, setLeaders] = useState<string[]>([]);
  const [dominatedLocations, setDominatedLocations] = useState<string[]>([]);
  const [dominatedContinents, setDominatedContinents] = useState<string[]>([]);
  const [dominatedWorlds, setDominatedWorlds] = useState<string[]>([]);

  const handleAddObjective = () => {
    if (newObjective.trim() && !objectives.includes(newObjective.trim())) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (objective: string) => {
    setObjectives(objectives.filter(o => o !== objective));
  };

  const handleAddLeader = (characterId: string) => {
    if (!leaders.includes(characterId)) {
      setLeaders([...leaders, characterId]);
    }
  };

  const handleRemoveLeader = (characterId: string) => {
    setLeaders(leaders.filter(l => l !== characterId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const newOrganization = {
      id: Date.now().toString(),
      bookId,
      ...formData,
      leaders,
      objectives,
      dominatedLocations,
      dominatedContinents,
      dominatedWorlds,
      members: [], // Will be managed separately
      titles: [
        { id: "default", name: "Membro", description: "Membro padrão", level: 1 }
      ],
      createdAt: new Date().toISOString()
    };

    onOrganizationCreated?.(newOrganization);
    toast.success("Organização criada com sucesso!");
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      alignment: "",
      type: "",
      influence: "",
      baseLocation: "",
      image: ""
    });
    setObjectives([]);
    setLeaders([]);
    setDominatedLocations([]);
    setDominatedContinents([]);
    setDominatedWorlds([]);
    onClose();
  };

  const getCharacterName = (id: string) => {
    return availableCharacters.find(c => c.id === id)?.name || "";
  };

  const getLocationName = (id: string) => {
    return availableLocations.find(l => l.id === id)?.name || "";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Organização</DialogTitle>
          <DialogDescription>
            Preencha as informações da organização. Apenas o nome é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome da organização"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
              placeholder="Descreva a organização..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alignment">Alinhamento</Label>
              <Select value={formData.alignment} onValueChange={(value) => setFormData(prev => ({ ...prev, alignment: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Alinhamento" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {alignments.map((alignment) => (
                    <SelectItem key={alignment} value={alignment}>
                      {alignment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="influence">Influência</Label>
              <Select value={formData.influence} onValueChange={(value) => setFormData(prev => ({ ...prev, influence: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível de influência" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {influences.map((influence) => (
                    <SelectItem key={influence} value={influence}>
                      {influence}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseLocation">Local da Base</Label>
              <Select value={formData.baseLocation} onValueChange={(value) => setFormData(prev => ({ ...prev, baseLocation: value === "none" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Local da base" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <SelectItem value="none">Nenhum</SelectItem>
                  {availableLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} ({location.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leaders */}
          <div className="space-y-2">
            <Label>Líderes</Label>
            <div className="space-y-2">
              <Select onValueChange={handleAddLeader}>
                <SelectTrigger>
                  <SelectValue placeholder="Adicionar líder" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {availableCharacters
                    .filter(char => !leaders.includes(char.id))
                    .map((character) => (
                      <SelectItem key={character.id} value={character.id}>
                        {character.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {leaders.map((leaderId) => (
                  <Badge key={leaderId} variant="secondary" className="flex items-center gap-1">
                    {getCharacterName(leaderId)}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveLeader(leaderId)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <Label>Objetivos</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Dominar o mundo"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
              />
              <Button type="button" variant="outline" onClick={handleAddObjective}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {objectives.map((objective) => (
                <Badge key={objective} variant="secondary" className="flex items-center gap-1">
                  {objective}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveObjective(objective)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input
              id="image"
              placeholder="URL da imagem da organização..."
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="magical">
              Criar Organização
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}