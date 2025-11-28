import { memo, useMemo } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { INote, NoteColor, NoteTextColor } from "@/types/note-types";

import { NoteCard } from "./note-card";

interface NoteGridProps {
  notes: INote[];
  onNoteClick: (noteId: string) => void;
  onReorder: (reorderedNotes: INote[]) => void;
  onUpdateNote: (noteId: string, updates: Partial<INote>) => void;
  onDeleteNote: (noteId: string) => void;
}

interface SortableNoteProps {
  note: INote;
  onClick: () => void;
  onColorChange: (color: NoteColor) => void;
  onTextColorChange: (textColor: NoteTextColor) => void;
  onDelete: () => void;
}

function SortableNote({ note, onClick, onColorChange, onTextColorChange, onDelete }: SortableNoteProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteCard
        note={note}
        onClick={onClick}
        onColorChange={onColorChange}
        onTextColorChange={onTextColorChange}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

function NoteGridComponent({ notes, onNoteClick, onReorder, onUpdateNote, onDeleteNote }: NoteGridProps) {
  const { t } = useTranslation("notes");

  // Sort notes by order (ascending)
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const orderA = a.order ?? new Date(a.createdAt).getTime();
      const orderB = b.order ?? new Date(b.createdAt).getTime();
      return orderA - orderB;
    });
  }, [notes]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedNotes.findIndex((note) => note.id === active.id);
    const newIndex = sortedNotes.findIndex((note) => note.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(sortedNotes, oldIndex, newIndex);

    // Recalculate order values with gaps (index * 1000)
    const reorderedWithOrder = reordered.map((note, index) => ({
      ...note,
      order: index * 1000,
    }));

    onReorder(reorderedWithOrder);
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t("empty_state.title")}</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          {t("empty_state.description")}
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedNotes.map((n) => n.id)} strategy={rectSortingStrategy}>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {sortedNotes.map((note) => (
            <SortableNote
              key={note.id}
              note={note}
              onClick={() => onNoteClick(note.id)}
              onColorChange={(color) => onUpdateNote(note.id, { color })}
              onTextColorChange={(textColor) => onUpdateNote(note.id, { textColor })}
              onDelete={() => onDeleteNote(note.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export const NoteGrid = memo(NoteGridComponent);
