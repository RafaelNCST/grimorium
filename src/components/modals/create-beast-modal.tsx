import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

interface PropsCreateBeastModal {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
}

const habits = [
  "diurno",
  "noturno",
  "crepuscular",
  "migratório",
  "caótico",
  "subterrâneo",
];

const humanComparisons = [
  "impotente",
  "mais fraco",
  "ligeiramente mais fraco",
  "igual",
  "ligeiramente mais forte",
  "mais forte",
  "impossível de ganhar",
];

const threatLevels = [
  { name: "inexistente", color: "green" },
  { name: "baixo", color: "blue" },
  { name: "médio", color: "yellow" },
  { name: "mortal", color: "orange" },
  { name: "apocalíptico", color: "red" },
];

export function CreateBeastModal({
  open,
  onOpenChange,
}: PropsCreateBeastModal) {
  const [formData, setFormData] = useState({
    name: "",
    basicDescription: "",
    habit: "",
    humanComparison: "",
    threatLevel: "",
    race: "",
    species: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nome da besta é obrigatório");
      return;
    }

    if (!formData.basicDescription.trim()) {
      toast.error("Descrição básica é obrigatória");
      return;
    }

    if (!formData.habit) {
      toast.error("Hábito é obrigatório");
      return;
    }

    if (!formData.humanComparison) {
      toast.error("Comparação com humano é obrigatória");
      return;
    }

    if (!formData.threatLevel) {
      toast.error("Nível de ameaça é obrigatório");
      return;
    }

    toast.success(`Besta "${formData.name}" criada com sucesso!`);

    // Reset form
    setFormData({
      name: "",
      basicDescription: "",
      habit: "",
      humanComparison: "",
      threatLevel: "",
      race: "",
      species: "",
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      basicDescription: "",
      habit: "",
      humanComparison: "",
      threatLevel: "",
      race: "",
      species: "",
    });
    onOpenChange(false);
  };

  const getComparisonColor = (comparison: string) => {
    switch (comparison) {
      case "impotente":
        return "text-green-600";
      case "mais fraco":
        return "text-green-500";
      case "ligeiramente mais fraco":
        return "text-blue-500";
      case "igual":
        return "text-gray-500";
      case "ligeiramente mais forte":
        return "text-yellow-500";
      case "mais forte":
        return "text-orange-500";
      case "impossível de ganhar":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Besta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome da besta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="race">Raça</Label>
              <Input
                id="race"
                value={formData.race}
                onChange={(e) =>
                  setFormData({ ...formData, race: e.target.value })
                }
                placeholder="Ex: Dracônico, Lupino..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="species">Espécie</Label>
              <Input
                id="species"
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
                placeholder="Ex: Reptiliano, Mamífero..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="habit">Hábito *</Label>
              <Select
                value={formData.habit}
                onValueChange={(value) =>
                  setFormData({ ...formData, habit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o hábito" />
                </SelectTrigger>
                <SelectContent>
                  {habits.map((habit) => (
                    <SelectItem key={habit} value={habit}>
                      {habit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="basicDescription">Descrição Básica *</Label>
            <Textarea
              id="basicDescription"
              value={formData.basicDescription}
              onChange={(e) =>
                setFormData({ ...formData, basicDescription: e.target.value })
              }
              placeholder="Descrição básica da besta..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="humanComparison">Comparação com Humano *</Label>
              <Select
                value={formData.humanComparison}
                onValueChange={(value) =>
                  setFormData({ ...formData, humanComparison: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a comparação" />
                </SelectTrigger>
                <SelectContent>
                  {humanComparisons.map((comparison) => (
                    <SelectItem key={comparison} value={comparison}>
                      <span className={getComparisonColor(comparison)}>
                        {comparison}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threatLevel">Nível de Ameaça *</Label>
              <Select
                value={formData.threatLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, threatLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  {threatLevels.map((level) => (
                    <SelectItem key={level.name} value={level.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full bg-${level.color}-500`}
                        />
                        {level.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-magical">
              Criar Besta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
