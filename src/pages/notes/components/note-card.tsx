import { memo, useMemo, useState, useRef, useEffect } from "react";

import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link2, Palette, Trash2, Type } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { INote, NoteColor, NoteTextColor } from "@/types/note-types";

import {
  DEFAULT_NOTE_COLOR,
  DEFAULT_TEXT_COLOR,
  NOTE_COLORS,
  POST_IT_SIZE,
} from "../constants";
import { extractTextFromContent } from "../utils/extract-text";

import { ColorPicker } from "./color-picker";
import { TextColorPicker } from "./text-color-picker";

interface NoteCardProps {
  note: INote;
  onClick: () => void;
  onColorChange: (color: NoteColor) => void;
  onTextColorChange: (textColor: NoteTextColor) => void;
  onDelete: () => void;
  isDragging?: boolean;
}

function NoteCardComponent({
  note,
  onClick,
  onColorChange,
  onTextColorChange,
  onDelete,
  isDragging = false,
}: NoteCardProps) {
  const { t } = useTranslation("notes");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const color = note.color || DEFAULT_NOTE_COLOR;
  const textColor = note.textColor || DEFAULT_TEXT_COLOR;
  const colorClasses = NOTE_COLORS[color];

  // Create read-only editor for preview
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: note.content,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "text-sm leading-relaxed tracking-wide h-full overflow-hidden",
          "prose prose-sm dark:prose-invert max-w-none",
          "[&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through"
        ),
      },
    },
  });

  // Subtle random rotation for organic feel (deterministic based on note ID)
  const rotation = useMemo(() => {
    const hash = note.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((hash % 5) - 2) * 0.5; // Range: -1deg to +1deg
  }, [note.id]);

  const linksCount = note.links.length;

  // Check if note has content
  const hasContent = useMemo(() => {
    const text = extractTextFromContent(note.content);
    return text.trim().length > 0;
  }, [note.content]);

  // Update editor content when note changes
  useEffect(() => {
    if (editor && note.content) {
      editor.commands.setContent(note.content);
    }
  }, [editor, note.content]);

  // Detect if content is overflowing
  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      const isContentOverflowing = element.scrollHeight > element.clientHeight;
      setIsOverflowing(isContentOverflowing);
    }
  }, [note.content, editor]);

  const handleColorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleTextColorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const iconColorClass = textColor === "white" ? "text-white" : "text-gray-900";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        width: `${POST_IT_SIZE.width}px`,
        height: `${POST_IT_SIZE.height}px`,
        transform: `rotate(${rotation}deg)`,
      }}
      className={cn(
        "group relative flex flex-col px-5 pt-5 pb-2 cursor-pointer transition-all duration-300",
        // Sticky note shadow effect
        "shadow-[2px_2px_8px_rgba(0,0,0,0.15),4px_4px_12px_rgba(0,0,0,0.1)]",
        "hover:shadow-[4px_4px_16px_rgba(0,0,0,0.2),8px_8px_24px_rgba(0,0,0,0.15)]",
        // Subtle rotation for organic feel
        "hover:-rotate-1 hover:scale-105",
        // Colors with texture
        colorClasses.bg,
        textColor === "white" ? "text-white" : "text-gray-900",
        // Stronger border for definition
        "border-2",
        colorClasses.border,
        // Slight skew for handwritten effect
        isDragging && "opacity-50 scale-95 rotate-6",
        "focus:outline-none focus:ring-2 focus:ring-purple-500",
        // Texture overlay
        "before:absolute before:inset-0 before:opacity-[0.03]",
        "before:bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.1)_100%)]",
        "before:pointer-events-none"
      )}
    >
      {/* Action buttons at top */}
      <div className="absolute top-1 right-1 z-20 flex gap-0.5">
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost-bright"
              size="sm"
              onClick={handleColorClick}
              className={cn("h-6 w-6 p-0", iconColorClass)}
            >
              <Palette className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-3"
            align="end"
            onClick={handleColorClick}
          >
            <ColorPicker
              value={color}
              onChange={(newColor) => {
                onColorChange(newColor);
                setShowColorPicker(false);
              }}
              size="sm"
            />
          </PopoverContent>
        </Popover>

        <Popover
          open={showTextColorPicker}
          onOpenChange={setShowTextColorPicker}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost-bright"
              size="sm"
              onClick={handleTextColorClick}
              className={cn("h-6 w-6 p-0", iconColorClass)}
            >
              <Type className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-3"
            align="end"
            onClick={handleTextColorClick}
          >
            <TextColorPicker
              value={textColor}
              onChange={(newTextColor) => {
                onTextColorChange(newTextColor);
                setShowTextColorPicker(false);
              }}
              size="sm"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost-destructive"
          size="sm"
          onClick={handleDeleteClick}
          className={cn("h-6 w-6 p-0", iconColorClass)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Red thumbtack pin at top center */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        {/* Pin shadow */}
        <div className="absolute inset-0 blur-sm bg-black/20 translate-y-1" />

        {/* Pin head (metallic circle) */}
        <div className="relative">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg" />
          {/* Shine effect */}
          <div className="absolute top-[2px] left-[2px] w-2 h-2 rounded-full bg-white/40" />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-900/50" />
        </div>
      </div>

      {/* Spacer for visual separation from buttons */}
      <div className="h-4 flex-shrink-0" />

      {/* Content Preview with formatting */}
      <div className="flex-1 overflow-hidden relative z-10 min-h-0">
        <div
          ref={contentRef}
          className="h-full relative"
          style={{
            fontFamily: "'Segoe UI', 'Inter', system-ui, sans-serif",
            textRendering: "optimizeLegibility",
          }}
        >
          {!hasContent && (
            <div
              className={cn(
                "text-sm italic",
                textColor === "white" ? "text-white/40" : "text-gray-900/40"
              )}
            >
              {t("card.empty_placeholder")}
            </div>
          )}
          {editor && hasContent && <EditorContent editor={editor} />}

          {/* Gradient fade for overflowing content */}
          {isOverflowing && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[5]",
                "bg-gradient-to-t from-current/15 to-transparent"
              )}
            />
          )}
        </div>
      </div>

      {/* Links icon in top left corner */}
      {linksCount > 0 && (
        <div className="absolute top-1 left-1 z-20 pointer-events-none flex items-center gap-1">
          <Link2 className={cn("h-3.5 w-3.5", iconColorClass)} />
          <span className={cn("text-sm font-semibold", iconColorClass)}>
            {linksCount}
          </span>
        </div>
      )}

      {/* Page curl effect - corner fold (only when overflowing) */}
      {isOverflowing && (
        <div className="absolute bottom-0 right-0 w-12 h-12 z-20 pointer-events-none overflow-hidden">
          {/* Folded corner */}
          <div
            className={cn(
              "absolute bottom-0 right-0 w-0 h-0",
              "border-l-[24px] border-l-transparent",
              "border-b-[24px]",
              "opacity-50"
            )}
            style={{
              borderBottomColor: "#1f2937",
              filter: "drop-shadow(-1px -1px 2px rgba(0, 0, 0, 0.3))",
            }}
          />
          {/* Shadow under the fold */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 bg-black/20 blur-sm"
            style={{
              clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
            }}
          />
        </div>
      )}

      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          colorClasses.hover.replace("hover:", ""), // Remove hover prefix
          "blur-xl -z-10"
        )}
      />
    </div>
  );
}

export const NoteCard = memo(NoteCardComponent);
