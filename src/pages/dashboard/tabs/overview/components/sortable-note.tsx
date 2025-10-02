import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PropsSortableNote } from "../types/overview-types";

export function SortableNote({
  note,
  editingNote,
  editContent,
  isCustomizing,
  onEditingNoteChange,
  onEditContentChange,
  onEditNote,
  onDeleteNote,
}: PropsSortableNote) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: `note-${note.id}` });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: note.x,
    top: note.y,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!isCustomizing ? listeners : {})}
      className={`absolute p-4 rounded-lg border-2 cursor-move min-w-[180px] max-w-[200px] transform rotate-1 hover:rotate-0 transition-all duration-200 ${note.color} ${isCustomizing ? "pointer-events-none" : ""} ${isDragging ? "z-50 shadow-2xl scale-105" : ""}`}
    >
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full shadow-md border border-red-600" />

      <div className="flex items-start justify-between mb-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-black/10"
            onClick={() => {
              onEditingNoteChange(note.id);
              onEditContentChange(note.content);
            }}
            disabled={isCustomizing}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-black/10"
            onClick={() => onDeleteNote(note.id)}
            disabled={isCustomizing}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {editingNote === note.id ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            className="w-full p-2 text-xs bg-transparent border border-black/20 rounded resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              className="text-xs h-6"
              onClick={() => {
                onEditNote(note.id, editContent);
                onEditingNoteChange(null);
              }}
            >
              Salvar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => onEditingNoteChange(null)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <p
          className={`text-xs leading-relaxed font-handwriting ${isCustomizing ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => {
            if (!isCustomizing) {
              onEditingNoteChange(note.id);
              onEditContentChange(note.content);
            }
          }}
        >
          {note.content}
        </p>
      )}
    </div>
  );
}
