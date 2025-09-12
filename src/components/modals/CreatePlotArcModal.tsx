import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PlotArc {
  id: string;
  name: string;
  size: 'pequeno' | 'médio' | 'grande';
  focus: string;
  description: string;
  events: PlotEvent[];
  progress: number;
  status: 'planejamento' | 'andamento' | 'finalizado';
  order: number;
}

interface PlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

interface CreatePlotArcModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateArc: (arc: Omit<PlotArc, 'id' | 'events' | 'progress'>) => void;
  existingArcs: PlotArc[];
}

export function CreatePlotArcModal({ open, onOpenChange, onCreateArc, existingArcs }: CreatePlotArcModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    size: '' as 'pequeno' | 'médio' | 'grande' | '',
    focus: '',
    description: '',
    status: '' as 'planejamento' | 'andamento' | 'finalizado' | '',
    order: existingArcs.length + 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.focus.trim() || !formData.description.trim() || 
        !formData.size || !formData.status) {
      toast("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Check if there's already an arc "em andamento" and trying to create another one
    const hasCurrentArc = existingArcs.some(arc => arc.status === 'andamento');
    if (formData.status === 'andamento' && hasCurrentArc) {
      toast("Só pode haver um arco em andamento por vez");
      return;
    }

    onCreateArc({
      name: formData.name.trim(),
      size: formData.size,
      focus: formData.focus.trim(),
      description: formData.description.trim(),
      status: formData.status,
      order: formData.order
    });

    // Reset form
    setFormData({
      name: '',
      size: '',
      focus: '',
      description: '',
      status: '',
      order: existingArcs.length + 2
    });

    onOpenChange(false);
    toast("Arco criado com sucesso!");
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      size: '',
      focus: '',
      description: '',
      status: '',
      order: existingArcs.length + 1
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Arco</DialogTitle>
          <DialogDescription>
            Adicione um novo arco narrativo à sua história
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Arco *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: A Jornada do Herói"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus">Foco *</Label>
            <Input
              id="focus"
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              placeholder="Ex: Desenvolvimento do protagonista"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o arco narrativo..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Tamanho *</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeno">Pequeno</SelectItem>
                  <SelectItem value="médio">Médio</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Em Planejamento</SelectItem>
                  <SelectItem value="andamento">Em Andamento</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Posição na Timeline</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-magical">
              Criar Arco
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}