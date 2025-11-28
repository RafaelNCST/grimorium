import { memo, useMemo, useState, useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import type { INote, NoteColor, NoteTextColor } from "@/types/note-types";

import { NoteCard } from "./note-card";

interface NoteGridProps {
  notes: INote[];
  onNoteClick: (noteId: string) => void;
  onReorder: (reorderedNotes: INote[]) => void;
  onUpdateNote: (noteId: string, updates: Partial<INote>) => void;
  onDeleteNote: (noteId: string) => void;
}

interface DraggableNoteProps {
  note: INote;
  onClick: () => void;
  onColorChange: (color: NoteColor) => void;
  onTextColorChange: (textColor: NoteTextColor) => void;
  onDelete: () => void;
  isDraggingAny: boolean;
}

const DraggableNote = memo(function DraggableNote({
  note,
  onClick,
  onColorChange,
  onTextColorChange,
  onDelete,
  isDraggingAny,
}: DraggableNoteProps) {
  const { t } = useTranslation("notes");
  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
    id: note.id,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: note.id,
  });

  const setRefs = (element: HTMLDivElement | null) => {
    setDraggableRef(element);
    setDroppableRef(element);
  };

  const showDropZone = isOver && !isDragging && isDraggingAny;

  return (
    <div
      ref={setRefs}
      {...attributes}
      {...listeners}
      className="relative"
      style={{
        opacity: isDragging ? 0.4 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      {/* Card original - fica opaco quando é área de drop */}
      <div style={{ opacity: showDropZone ? 0.3 : 1, transition: "opacity 200ms ease" }}>
        <NoteCard
          note={note}
          onClick={onClick}
          onColorChange={onColorChange}
          onTextColorChange={onTextColorChange}
          onDelete={onDelete}
          isDragging={isDragging}
        />
      </div>

      {/* Overlay de drop zone - aparece quando hovering */}
      {showDropZone && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          {/* Borda tracejada animada imitando a nota */}
          <div className="absolute inset-0 border-4 border-dashed border-white rounded-lg animate-pulse" />

          {/* Mensagem centralizada */}
          <div className="relative text-white font-bold text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {t("drag.drop_here")}
          </div>
        </div>
      )}
    </div>
  );
});

function NoteGridComponent({ notes, onNoteClick, onReorder, onUpdateNote, onDeleteNote }: NoteGridProps) {
  const { t } = useTranslation("notes");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [optimisticNotes, setOptimisticNotes] = useState<INote[] | null>(null);
  const isSwappingRef = useRef(false);

  // Reset optimistic state when notes prop changes (but only if not currently swapping)
  useLayoutEffect(() => {
    if (!isSwappingRef.current) {
      setOptimisticNotes(null);
    } else {
      // If we're swapping, mark that we can clear on next update
      isSwappingRef.current = false;
    }
  }, [notes]);

  // Use optimistic notes if available, otherwise use props
  const displayNotes = optimisticNotes ?? notes;

  // Sort notes by order (ascending)
  const sortedNotes = useMemo(() => {
    return [...displayNotes].sort((a, b) => {
      const orderA = a.order ?? new Date(a.createdAt).getTime();
      const orderB = b.order ?? new Date(b.createdAt).getTime();
      return orderA - orderB;
    });
  }, [displayNotes]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start dragging
      },
    })
  );

  const activeNote = useMemo(() => {
    return sortedNotes.find((note) => note.id === activeId);
  }, [activeId, sortedNotes]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedNotes.findIndex((note) => note.id === active.id);
    const newIndex = sortedNotes.findIndex((note) => note.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Get the two notes involved
    const note1 = sortedNotes[oldIndex];
    const note2 = sortedNotes[newIndex];

    // Get their current orders
    const order1 = note1.order ?? new Date(note1.createdAt).getTime();
    const order2 = note2.order ?? new Date(note2.createdAt).getTime();

    // OPTIMISTIC UPDATE: Apply swap immediately to local state
    const optimisticUpdate = displayNotes.map((note) => {
      if (note.id === note1.id) {
        return { ...note, order: order2 };
      }
      if (note.id === note2.id) {
        return { ...note, order: order1 };
      }
      return note;
    });

    // Mark that we're swapping
    isSwappingRef.current = true;

    // Use flushSync to force synchronous update (no batching, no async)
    flushSync(() => {
      setOptimisticNotes(optimisticUpdate);
    });

    // Create updated notes with swapped orders - ONLY update these two notes
    const updatedNotes = [
      { ...note1, order: order2 },
      { ...note2, order: order1 },
    ];

    // Call onReorder in background (this will eventually update the props)
    onReorder(updatedNotes);
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
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          willChange: activeId ? "contents" : "auto",
        }}
      >
        {sortedNotes.map((note) => (
          <DraggableNote
            key={note.id}
            note={note}
            onClick={() => onNoteClick(note.id)}
            onColorChange={(color) => onUpdateNote(note.id, { color })}
            onTextColorChange={(textColor) => onUpdateNote(note.id, { textColor })}
            onDelete={() => onDeleteNote(note.id)}
            isDraggingAny={activeId !== null}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeNote ? (
          <div className="cursor-grabbing scale-105 shadow-2xl">
            <NoteCard
              note={activeNote}
              onClick={() => {}}
              onColorChange={() => {}}
              onTextColorChange={() => {}}
              onDelete={() => {}}
              isDragging={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export const NoteGrid = memo(NoteGridComponent);
