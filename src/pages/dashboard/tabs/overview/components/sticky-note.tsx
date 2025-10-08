import { useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { Edit2, Trash2, Palette, BringToFront, SendToBack } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PropsSortableNote } from "../types/overview-types";

import { ColorPicker } from "./color-picker";

const MAX_CHARACTER_LIMIT = 200;

export function StickyNote({
  note,
  editingNote,
  editContent,
  isCustomizing,
  onEditingNoteChange,
  onEditContentChange,
  onEditNote,
  onDeleteNote,
  onColorChange,
  onBringToFront,
  onSendToBack,
}: PropsSortableNote) {
  const { t } = useTranslation("overview");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: `note-${note.id}`,
      disabled: isCustomizing || editingNote === note.id,
      data: note,
    });

  const style = {
    left: `${note.x}px`,
    top: `${note.y}px`,
    zIndex: note.id === editingNote ? 999 : isDragging ? 100 : note.zIndex,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const isEditing = editingNote === note.id;

  const handleSaveEdit = () => {
    onEditNote(note.id, editContent);
    onEditingNoteChange(null);
  };

  const handleCancelEdit = () => {
    onEditingNoteChange(null);
  };

  const handleStartEdit = () => {
    if (!isCustomizing) {
      onEditingNoteChange(note.id);
      onEditContentChange(note.content);
    }
  };

  const handleColorSelect = (color: string) => {
    onColorChange(note.id, color);
    setIsColorPickerOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-note-id={note.id}
      className={`absolute min-w-[180px] max-w-[220px] select-none ${
        isDragging
          ? "cursor-grabbing shadow-2xl z-50"
          : "rotate-1 hover:rotate-0 shadow-lg transition-all duration-200"
      } ${isCustomizing ? "pointer-events-none opacity-70" : ""}`}
    >
      <div
        className={`p-4 rounded-lg border-2 ${note.color} ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserDrag: "none",
        }}
        {...attributes}
        {...listeners}
      >
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full shadow-md border border-red-600" />

        <div className="flex items-start justify-between mb-2 gap-1">
          <div className="flex gap-1">
            <Popover
              open={isColorPickerOpen}
              onOpenChange={setIsColorPickerOpen}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-black/10"
                      disabled={isCustomizing}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Palette className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    {t("notes_board.change_color")}
                  </p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent
                className="w-auto p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <ColorPicker
                  selectedColor={note.color}
                  onColorSelect={handleColorSelect}
                  disabled={isCustomizing}
                />
              </PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBringToFront(note.id);
                  }}
                  disabled={isCustomizing}
                >
                  <BringToFront className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("notes_board.bring_to_front")}
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendToBack(note.id);
                  }}
                  disabled={isCustomizing}
                >
                  <SendToBack className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("notes_board.send_to_back")}
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit();
                  }}
                  disabled={isCustomizing}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("notes_board.edit_note")}
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  disabled={isCustomizing}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("notes_board.delete_note")}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={editContent}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_CHARACTER_LIMIT) {
                  onEditContentChange(newValue);
                }
              }}
              className="w-full p-2 text-xs bg-transparent border border-black/20 rounded resize-none font-handwriting"
              rows={3}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              maxLength={MAX_CHARACTER_LIMIT}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-muted-foreground">
                {editContent.length}/{MAX_CHARACTER_LIMIT}
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="text-xs h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                >
                  {t("notes_board.save")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                >
                  {t("notes_board.cancel")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p
            className="text-xs leading-relaxed font-handwriting break-words"
            onClick={(e) => {
              e.stopPropagation();
              handleStartEdit();
            }}
          >
            {note.content}
          </p>
        )}
      </div>
    </div>
  );
}
