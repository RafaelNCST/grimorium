import { X, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { IPowerElement } from "../types/power-system-types";

interface PropsPropertiesPanel {
  element: IPowerElement;
  defaultColors: string[];
  onUpdate: (updates: Partial<IPowerElement>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function PropertiesPanel({
  element,
  defaultColors,
  onUpdate,
  onDelete,
  onClose,
}: PropsPropertiesPanel) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Propriedades</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={element.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Digite o título..."
          />
        </div>

        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <Textarea
            value={element.content || ""}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Digite o conteúdo..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cor de Fundo</Label>
            <div className="grid grid-cols-5 gap-2">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${element.color === color ? "border-primary" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate({ color })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Elemento
        </Button>
      </div>
    </div>
  );
}
