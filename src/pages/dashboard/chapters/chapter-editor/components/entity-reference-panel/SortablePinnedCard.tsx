import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";

interface SortablePinnedCardProps {
  id: string;
  children: React.ReactNode;
  isOver?: boolean;
}

// Desabilita movimento de outros cards durante o drag
const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;

  // Durante o drag ativo (isSorting = true, wasDragging = false): não move
  if (isSorting && !wasDragging) {
    return false;
  }

  // Quando solta (wasDragging = true): anima a reorganização
  return defaultAnimateLayoutChanges(args);
};

export function SortablePinnedCard({ id, children, isOver = false }: SortablePinnedCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.3 : 1,
    cursor: 'grab',
  };

  return (
    <div className="relative">
      {/* Indicador visual de drop - aparece em cima */}
      {isOver && (
        <div className="absolute inset-x-0 -top-2 h-1 bg-primary rounded-full z-50 shadow-lg shadow-primary/50 animate-pulse" />
      )}

      <div
        ref={setNodeRef}
        style={style}
        className={`relative ${isOver ? 'ring-2 ring-primary/30 rounded-lg' : ''}`}
        {...attributes}
        {...listeners}
      >
        {children}
      </div>
    </div>
  );
}
