import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  type IPowerBlock,
  type DividerContent,
} from "../../types/power-system-types";

interface DividerBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: DividerContent) => void;
  onDelete: () => void;
}

export function DividerBlock({
  isEditMode,
  onDelete,
}: DividerBlockProps) {
  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        {/* Linha 1: Botão de excluir */}
        <div className="flex justify-end">
          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Linha 2: Divisor */}
        <Separator className="w-full" />
      </div>
    );
  }

  return <Separator className="my-4" />;
}
