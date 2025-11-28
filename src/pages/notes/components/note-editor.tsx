import { memo, useState } from "react";
import * as React from "react";

import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link,
  Trash2,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import type { NoteColor } from "@/types/note-types";

import { ColorPicker } from "./color-picker";

interface NoteEditorProps {
  content?: JSONContent;
  onChange: (content: JSONContent) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  color?: NoteColor;
  onColorChange?: (color: NoteColor) => void;
  onManageLinks?: () => void;
  onDelete?: () => void;
  onEditorReady?: (editor: any) => void;
  linksCount?: number;
}

function NoteEditorComponent({
  content,
  onChange,
  placeholder = "Write your thoughts...",
  className,
  editable = true,
  color,
  onColorChange,
  onManageLinks,
  onDelete,
  onEditorReady,
  linksCount = 0,
}: NoteEditorProps) {
  const { t } = useTranslation("notes");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [, forceUpdate] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable headings for simple notes
      }),
      Underline,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
      forceUpdate({});
    },
    onSelectionUpdate: () => {
      forceUpdate({});
    },
    onCreate: ({ editor }) => {
      if (onEditorReady) {
        onEditorReady(editor);
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none",
          "focus:outline-none h-full p-4"
        ),
        spellcheck: "false",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border rounded-lg flex flex-col h-full overflow-hidden",
        className
      )}
    >
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center justify-between gap-1 p-2 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  tabIndex={-1}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("editor.toolbar.bold")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  tabIndex={-1}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("editor.toolbar.italic")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  tabIndex={-1}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("editor.toolbar.underline")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  tabIndex={-1}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("editor.toolbar.strikethrough")}
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "left" }) &&
                      "bg-accent text-accent-foreground"
                  )}
                  tabIndex={-1}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("editor.toolbar.align_left")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "center" }) &&
                      "bg-accent text-accent-foreground"
                  )}
                  tabIndex={-1}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("editor.toolbar.align_center")}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "right" }) &&
                      "bg-accent text-accent-foreground"
                  )}
                  tabIndex={-1}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("editor.toolbar.align_right")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "justify" }) &&
                      "bg-accent text-accent-foreground"
                  )}
                  tabIndex={-1}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("editor.toolbar.align_justify")}
              </TooltipContent>
            </Tooltip>
          </div>

          {(color || onManageLinks || onDelete) && (
            <div className="flex items-center gap-1">
              {color && onColorChange && (
                <Popover
                  open={showColorPicker}
                  onOpenChange={setShowColorPicker}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" tabIndex={-1}>
                          <Palette className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("editor.toolbar.change_color")}
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-auto p-3" align="end">
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
              )}

              {(onManageLinks || onDelete) && (
                <div className="flex items-center gap-1 ml-1 pl-1 border-l">
                  {onManageLinks && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onManageLinks}
                          tabIndex={-1}
                          className="relative"
                        >
                          <Link className="h-4 w-4" />
                          {linksCount > 0 && (
                            <Badge
                              variant="default"
                              className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center"
                            >
                              {linksCount}
                            </Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("editor.toolbar.manage_links")}
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {onDelete && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onDelete}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          tabIndex={-1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("editor.toolbar.delete_note")}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <div
        className="flex-1 overflow-auto cursor-text"
        onClick={() => {
          if (editable) {
            editor.commands.focus();
          }
        }}
      >
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </div>
  );
}

export const NoteEditor = memo(NoteEditorComponent);
