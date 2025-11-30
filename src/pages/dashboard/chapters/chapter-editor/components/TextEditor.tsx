import { useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

import type { Annotation } from "../types";

interface TextEditorProps {
  content: string;
  viewMode: boolean;
  annotations: Annotation[];
  selectedAnnotationId?: string;
  summarySection?: React.ReactNode;
  onContentChange: (content: string) => void;
  onTextSelect: (text: string, startOffset: number, endOffset: number) => void;
  onAnnotationClick: (annotationId: string) => void;
}

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const A4_PADDING = 96;
const CHARS_PER_PAGE = 1800;

export function TextEditor({
  content,
  viewMode,
  annotations,
  selectedAnnotationId,
  summarySection,
  onContentChange,
  onTextSelect,
  onAnnotationClick,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Update editor content when content changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== content) {
      editorRef.current.innerText = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerText;
      onContentChange(newContent);

      // Auto-scroll only if cursor is at or near the end of the text
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Calculate cursor position in text
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(editorRef.current);
        preSelectionRange.setEnd(range.endContainer, range.endOffset);
        const cursorPosition = preSelectionRange.toString().length;
        const textLength = newContent.length;

        // Only auto-scroll if cursor is at the very end (within 1 character tolerance)
        const isAtEnd = cursorPosition >= textLength - 1;

        if (isAtEnd && containerRef.current) {
          // Small delay to ensure cursor position is updated
          setTimeout(() => {
            if (!containerRef.current) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // StatsBar height + some buffer
            const STATS_BAR_HEIGHT = 38;
            const BUFFER = 50;
            const reservedSpace = STATS_BAR_HEIGHT + BUFFER;

            // Check if cursor is too close to bottom (would be behind StatsBar)
            if (rect.bottom > viewportHeight - reservedSpace) {
              // Scroll just enough to keep cursor visible above StatsBar
              const scrollAmount = rect.bottom - (viewportHeight - reservedSpace);
              containerRef.current.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
              });
            }
          }, 10);
        }
      }
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() && selection.rangeCount > 0) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);

      // Calculate offsets
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(editorRef.current!);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const startOffset = preSelectionRange.toString().length;
      const endOffset = startOffset + selectedText.length;

      onTextSelect(selectedText, startOffset, endOffset);
    }
  };

  const handlePaste = () => {
    // Use setTimeout to wait for paste content to be inserted
    setTimeout(() => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerText;
        onContentChange(newContent);

        // Auto-scroll after paste if cursor is at end
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // Calculate cursor position in text
          const preSelectionRange = range.cloneRange();
          preSelectionRange.selectNodeContents(editorRef.current);
          preSelectionRange.setEnd(range.endContainer, range.endOffset);
          const cursorPosition = preSelectionRange.toString().length;
          const textLength = newContent.length;

          // Only auto-scroll if cursor is at or near the end
          const isAtEnd = cursorPosition >= textLength - 1;

          if (isAtEnd && containerRef.current) {
            // Calculate if cursor is hidden behind StatsBar
            const rect = range.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // StatsBar height + some buffer
            const STATS_BAR_HEIGHT = 38;
            const BUFFER = 50;
            const reservedSpace = STATS_BAR_HEIGHT + BUFFER;

            // Check if cursor is too close to bottom (would be behind StatsBar)
            if (rect.bottom > viewportHeight - reservedSpace) {
              // Scroll just enough to keep cursor visible above StatsBar
              const scrollAmount = rect.bottom - (viewportHeight - reservedSpace);
              containerRef.current.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
              });
            }
          }
        }
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      if (e.shiftKey) {
        // Shift+Tab: Remove indentation intelligently
        const currentText = editorRef.current.textContent || '';
        const range = selection.getRangeAt(0);

        // Get cursor position
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(editorRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const cursorPosition = preSelectionRange.toString().length;

        // First, check if there are 4 spaces from Tab immediately before cursor
        if (cursorPosition >= 4) {
          const textBeforeCursor4 = currentText.substring(cursorPosition - 4, cursorPosition);
          const hasFourSpaces =
            textBeforeCursor4 === '\u00A0\u00A0\u00A0\u00A0' ||
            textBeforeCursor4 === '    ';

          if (hasFourSpaces) {
            // Remove 4 spaces at once (Tab indentation)
            for (let i = 0; i < 4; i++) {
              document.execCommand('delete', false);
            }
            handleInput();
            return;
          }
        }

        // Otherwise, remove up to 4 individual spaces before cursor
        let spacesToRemove = 0;
        for (let i = 1; i <= Math.min(4, cursorPosition); i++) {
          const char = currentText.charAt(cursorPosition - i);
          if (char === '\u00A0' || char === ' ') {
            spacesToRemove++;
          } else {
            break;
          }
        }

        if (spacesToRemove > 0) {
          for (let i = 0; i < spacesToRemove; i++) {
            document.execCommand('delete', false);
          }
          handleInput();
        }
      } else {
        // Tab: Insert 4 non-breaking spaces
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const spaces = '\u00A0\u00A0\u00A0\u00A0';
        const textNode = document.createTextNode(spaces);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);

        handleInput();
      }
    }
  };

  // Calculate pages for A4 view
  const pages = viewMode ? Math.ceil(content.length / CHARS_PER_PAGE) : 1;

  if (viewMode) {
    // A4 View Mode - Show pages
    const pagesArray = Array.from({ length: Math.max(1, pages) }, (_, i) => {
      const startChar = i * CHARS_PER_PAGE;
      const endChar = Math.min((i + 1) * CHARS_PER_PAGE, content.length);
      const pageContent = content.substring(startChar, endChar);

      return (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 shadow-2xl mx-auto mb-8 relative border border-gray-300 dark:border-gray-700"
          style={{
            width: `${A4_WIDTH}px`,
            minHeight: `${A4_HEIGHT}px`,
            padding: `${A4_PADDING}px`,
          }}
        >
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            style={{
              fontSize: "12pt",
              lineHeight: "1.5",
              fontFamily: "'Times New Roman', Times, serif",
              textAlign: "justify",
            }}
          >
            {pageContent}
          </div>

          {/* Page number */}
          <div className="absolute bottom-8 right-12 text-sm text-gray-500 dark:text-gray-400">
            {i + 1}
          </div>
        </div>
      );
    });

    return (
      <div className="py-12 bg-gray-100 dark:bg-gray-950 min-h-screen">
        {pagesArray}
      </div>
    );
  }

  // Normal editing mode - Word-like
  // StatsBar is 36px height (fixed at bottom)
  // Create a scrollable container that accounts for the StatsBar
  const STATS_BAR_HEIGHT = 36;
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="bg-muted/30 overflow-y-auto h-full"
    >
      {/* Summary Section - scrolls with content */}
      {summarySection && (
        <div className="px-8 py-6">
          {summarySection}
        </div>
      )}

      <div className="max-w-5xl mx-auto py-8 px-6">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onMouseUp={handleMouseUp}
          onKeyDown={handleKeyDown}
          className={cn(
            "p-16 bg-white dark:bg-gray-900",
            "shadow-lg border border-gray-200 dark:border-gray-800",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "prose prose-lg max-w-none dark:prose-invert"
          )}
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            fontFamily: "Inter, sans-serif",
            color: "#000000",
            minHeight: "calc(100vh - 200px)",
          }}
          spellCheck="true"
        />
      </div>
    </div>
  );
}
