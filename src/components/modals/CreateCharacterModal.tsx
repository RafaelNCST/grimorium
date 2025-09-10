import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface CreateCharacterModalProps {
  trigger: React.ReactNode;
  onCharacterCreated?: (character: any) => void;
}

const roles = [
  { value: "protagonista", label: "Protagonista" },
  { value: "antagonista", label: "Antagonista" },
  { value: "vilao", label: "Vilão" },
  { value: "secundario", label: "Secundário" },
  { value: "figurante", label: "Figurante" }
];

const alignments = [
  { value: "bem", label: "Bem" },
  { value: "neutro", label: "Neutro" },
  { value: "caotico", label: "Caótico" }
];

const mockOrganizations = [
  "Ordem dos Guardiões",
  "Culto das Sombras",
  "Guilda dos Mercadores",
  "Academia de Magia"
];

const mockLocations = [
  "Capital Elaria",
  "Vila Pedraverde",
  "Floresta Sombria",
  "Montanhas do Norte"
];

export function CreateCharacterModal({ trigger, onCharacterCreated }: CreateCharacterModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    appearance: "",
    role: "",
    personality: "",
    description: "",
    organization: "",
    birthPlace: "",
    affiliatedPlace: "",
    alignment: "",
    image: ""
  });
  
  const [qualities, setQualities] = useState<string[]>([]);
  const [newQuality, setNewQuality] = useState("");

  const handleAddQuality = () => {
    if (newQuality.trim() && !qualities.includes(newQuality.trim())) {
      setQualities([...qualities, newQuality.trim()]);
      setNewQuality("");
    }
  };

  const handleRemoveQuality = (quality: string) => {
    setQualities(qualities.filter(q => q !== quality));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (formData.description.length > 200) {
      toast.error("Descrição deve ter no máximo 200 caracteres");
      return;
    }

    const newCharacter = {
      id: Date.now().toString(),
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      qualities,
      createdAt: new Date().toISOString()
    };

    onCharacterCreated?.(newCharacter);
    toast.success("Personagem criado com sucesso!");
    
    // Reset form
    setFormData({
      name: "",
      age: "",
      appearance: "",
      role: "",
      personality: "",
      description: "",
      organization: "",
      birthPlace: "",
      affiliatedPlace: "",
      alignment: "",
      image: ""
    });
    setQualities([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Personagem</DialogTitle>
          <DialogDescription>
            Preencha as informações do personagem. Apenas o nome é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Foto do Personagem</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <Input
                placeholder="URL da imagem..."
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome do personagem"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                placeholder="Idade"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-2">
            <Label htmlFor="appearance">Aparência Física</Label>
            <Textarea
              id="appearance"
              placeholder="Descreva a aparência do personagem..."
              value={formData.appearance}
              onChange={(e) => setFormData(prev => ({ ...prev, appearance: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Qualities */}
          <div className="space-y-2">
            <Label>Qualidades</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: corajoso, inteligente..."
                value={newQuality}
                onChange={(e) => setNewQuality(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuality())}
              />
              <Button type="button" variant="outline" onClick={handleAddQuality}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {qualities.map((quality) => (
                <Badge key={quality} variant="secondary" className="flex items-center gap-1">
                  {quality}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveQuality(quality)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role */}
            <div className="space-y-2">
              <Label>Papel</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alignment */}
            <div className="space-y-2">
              <Label>Alinhamento</Label>
              <Select value={formData.alignment} onValueChange={(value) => setFormData(prev => ({ ...prev, alignment: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o alinhamento" />
                </SelectTrigger>
                <SelectContent>
                  {alignments.map((alignment) => (
                    <SelectItem key={alignment.value} value={alignment.value}>
                      {alignment.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Personality */}
          <div className="space-y-2">
            <Label htmlFor="personality">Personalidade</Label>
            <Textarea
              id="personality"
              placeholder="Descreva a personalidade do personagem..."
              value={formData.personality}
              onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição Simples</Label>
            <Textarea
              id="description"
              placeholder="Descrição resumida do personagem (máx. 200 caracteres)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxLength={200}
              rows={2}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.description.length}/200 caracteres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organization */}
            <div className="space-y-2">
              <Label>Organização</Label>
              <Select value={formData.organization} onValueChange={(value) => setFormData(prev => ({ ...prev, organization: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a organização" />
                </SelectTrigger>
                <SelectContent>
                  {mockOrganizations.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Birth Place */}
            <div className="space-y-2">
              <Label>Local de Nascimento</Label>
              <Select value={formData.birthPlace} onValueChange={(value) => setFormData(prev => ({ ...prev, birthPlace: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Affiliated Place */}
          <div className="space-y-2">
            <Label>Local Afiliado</Label>
            <Select value={formData.affiliatedPlace} onValueChange={(value) => setFormData(prev => ({ ...prev, affiliatedPlace: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local afiliado" />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="magical">
              Criar Personagem
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}