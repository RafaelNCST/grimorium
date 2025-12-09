import { useRef, useEffect, useState } from "react";

import {
  Bold,
  Italic,
  Quote,
  Type,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PropsRichTextEditor {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  readOnly = false,
  placeholder,
}: PropsRichTextEditor) {
  const { t } = useTranslation("chapter-editor");
  const defaultPlaceholder = placeholder || t("editor.placeholder");
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      // Convert stored HTML content to display in editor
      editorRef.current.innerHTML = content || "";
      setIsInitialized(true);
    }
  }, [content, isInitialized]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const toggleFormat = (command: string) => {
    executeCommand(command);
  };

  const applyHeading = (level: number) => {
    executeCommand("formatBlock", `h${level}`);
  };

  const applyQuote = () => {
    executeCommand("formatBlock", "blockquote");
  };

  const applyNormalText = () => {
    executeCommand("formatBlock", "div");
  };

  if (readOnly) {
    return (
      <div
        className="prose prose-lg max-w-none leading-relaxed p-6 bg-background min-h-[400px]"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      />
    );
  }

  return (
    <Card className="w-full">
      {/* Toolbar */}
      <div className="border-b border-border p-3">
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyNormalText()}
            className="h-8 px-2"
          >
            <Type className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyHeading(1)}
            className="h-8 px-2"
          >
            <Heading1 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyHeading(2)}
            className="h-8 px-2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyHeading(3)}
            className="h-8 px-2"
          >
            <Heading3 className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFormat("bold")}
            className="h-8 px-2"
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFormat("italic")}
            className="h-8 px-2"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={applyQuote}
            className="h-8 px-2"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-6 min-h-[400px] outline-none focus:outline-none"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: "1.6",
        }}
        data-placeholder={defaultPlaceholder}
        suppressContentEditableWarning
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
          border-bottom: 2px solid hsl(var(--border));
          padding-bottom: 0.5rem;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 1rem 0 0.5rem 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1.5rem;
          margin: 1rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
          background: hsl(var(--muted) / 0.5);
          padding: 0.75rem 0 0.75rem 1.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        [contenteditable] strong {
          font-weight: bold;
        }
        
        [contenteditable] em {
          font-style: italic;
        }

        [contenteditable] div {
          margin: 0.25rem 0;
        }
      `,
        }}
      />
    </Card>
  );
}
