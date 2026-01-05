import { Separator } from "@/components/ui/separator";

import {
  type IPowerBlock,
  type DividerContent,
} from "../../types/power-system-types";

import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface DividerBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: DividerContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function DividerBlock({
  isEditMode,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: DividerBlockProps) {
  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        {/* Linha 1: Botões de controle */}
        <div className="flex justify-end">
          <BlockReorderButtons
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>

        {/* Linha 2: Divisor */}
        <Separator className="w-full" />
      </div>
    );
  }

  return <Separator className="my-4" />;
}
