import { useRef, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { CreateAnnotationPopup } from "./CreateAnnotationPopup";
import type { Annotation } from "../types";

interface TextEditorProps {
  content: string;
  annotations: Annotation[];
  selectedAnnotationId?: string;
  summarySection?: React.ReactNode;
  onContentChange: (content: string) => void;
  onTextSelect: (text: string, startOffset: number, endOffset: number) => void;
  onAnnotationClick: (annotationId: string) => void;
  onCreateAnnotation: () => void;
  onUpdateAnnotations: (annotations: Annotation[]) => void;
  scrollToAnnotation?: string | null;
}

export function TextEditor({
  content,
  annotations,
  selectedAnnotationId,
  summarySection,
  onContentChange,
  onTextSelect,
  onAnnotationClick,
  onCreateAnnotation,
  onUpdateAnnotations,
  scrollToAnnotation,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectionPopup, setSelectionPopup] = useState<{
    text: string;
    position: { x: number; y: number };
  } | null>(null);

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Render content with annotations highlighted
  const renderContentWithAnnotations = () => {
    if (!content) return '';

    // Sort annotations by start offset (ascending) to process from start to end
    const sortedAnnotations = [...annotations].sort((a, b) => a.startOffset - b.startOffset);

    let result = '';
    let lastIndex = 0;

    sortedAnnotations.forEach((annotation) => {
      // Add text before annotation
      const beforeText = content.substring(lastIndex, annotation.startOffset);
      result += escapeHtml(beforeText);

      // Add annotated text with span
      const annotatedText = content.substring(annotation.startOffset, annotation.endOffset);
      const isSelected = annotation.id === selectedAnnotationId;
      const className = isSelected ? 'annotation-highlight annotation-selected' : 'annotation-highlight';

      result += `<span class="${className}" data-annotation-id="${annotation.id}">${escapeHtml(annotatedText)}</span>`;

      lastIndex = annotation.endOffset;
    });

    // Add remaining text after last annotation
    if (lastIndex < content.length) {
      result += escapeHtml(content.substring(lastIndex));
    }

    // Convert newlines to <br> tags for proper display
    result = result.replace(/\n/g, '<br>');

    return result;
  };

  // Update editor content when content or annotations change
  useEffect(() => {
    if (!editorRef.current) return;

    const renderedContent = renderContentWithAnnotations();
    if (editorRef.current.innerHTML !== renderedContent) {
      // Save cursor position
      const selection = window.getSelection();
      let cursorPosition = 0;

      if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(editorRef.current);
        preSelectionRange.setEnd(range.endContainer, range.endOffset);
        cursorPosition = preSelectionRange.toString().length;
      }

      editorRef.current.innerHTML = renderedContent;

      // Restore cursor position
      if (cursorPosition > 0) {
        try {
          const textNodes: Text[] = [];
          const walker = document.createTreeWalker(
            editorRef.current,
            NodeFilter.SHOW_TEXT,
            null
          );

          let node;
          while ((node = walker.nextNode())) {
            textNodes.push(node as Text);
          }

          let currentLength = 0;
          for (const textNode of textNodes) {
            const nodeLength = textNode.textContent?.length || 0;
            if (currentLength + nodeLength >= cursorPosition) {
              const range = document.createRange();
              const offset = Math.min(cursorPosition - currentLength, nodeLength);
              range.setStart(textNode, offset);
              range.setEnd(textNode, offset);
              selection?.removeAllRanges();
              selection?.addRange(range);
              break;
            }
            currentLength += nodeLength;
          }
        } catch (e) {
          // Ignore cursor restoration errors
        }
      }
    }
  }, [content, annotations, selectedAnnotationId]);

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking on the popup itself
      if (selectionPopup && !target.closest('[data-annotation-popup]')) {
        setSelectionPopup(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectionPopup) {
        setSelectionPopup(null);
      }
    };

    if (selectionPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectionPopup]);

  // Scroll to annotation when requested
  useEffect(() => {
    if (scrollToAnnotation && editorRef.current && containerRef.current) {
      const annotationSpan = editorRef.current.querySelector(
        `[data-annotation-id="${scrollToAnnotation}"]`
      );

      if (annotationSpan) {
        // Scroll the container to show the annotation
        annotationSpan.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [scrollToAnnotation]);

  const handleInput = () => {
    // Clear selection popup when typing
    setSelectionPopup(null);

    if (editorRef.current) {
      // Extract plain text content (removes HTML tags)
      const newContent = editorRef.current.innerText;

      // Find all annotation spans and recalculate their offsets
      const annotationSpans = editorRef.current.querySelectorAll('.annotation-highlight');
      const updatedAnnotations: Annotation[] = [];

      annotationSpans.forEach((span) => {
        const annotationId = span.getAttribute('data-annotation-id');
        if (!annotationId) return;

        const originalAnnotation = annotations.find((a) => a.id === annotationId);
        if (!originalAnnotation) return;

        // Get the text content of the span
        const spanText = span.textContent || '';

        // Skip if text is completely empty
        if (spanText.trim().length === 0) return;

        // Calculate the offset of this span in the full text
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.setEnd(span, 0);
        const startOffset = range.toString().length;
        const endOffset = startOffset + spanText.length;

        updatedAnnotations.push({
          ...originalAnnotation,
          text: spanText,
          startOffset,
          endOffset,
        });
      });

      // Update annotations if any were removed or changed
      if (updatedAnnotations.length !== annotations.length ||
          updatedAnnotations.some((ann) => {
            const orig = annotations.find((a) => a.id === ann.id);
            return !orig || orig.text !== ann.text || orig.startOffset !== ann.startOffset || orig.endOffset !== ann.endOffset;
          })) {
        onUpdateAnnotations(updatedAnnotations);
      }

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

      // Get position for popup
      const rect = range.getBoundingClientRect();
      setSelectionPopup({
        text: selectedText,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top,
        },
      });
    } else {
      // Clear popup if no selection
      setSelectionPopup(null);
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

  const handleCreateAnnotationFromPopup = () => {
    onCreateAnnotation();
    setSelectionPopup(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Check if clicked on an annotation
    const annotationSpan = target.closest('.annotation-highlight');
    if (annotationSpan) {
      const annotationId = annotationSpan.getAttribute('data-annotation-id');
      if (annotationId) {
        e.preventDefault();
        onAnnotationClick(annotationId);
      }
    }
  };

  return (
    <>
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
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(
              "p-16 bg-white dark:bg-gray-900",
              "shadow-lg border border-gray-200 dark:border-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              "prose prose-lg max-w-none dark:prose-invert",
              // Annotation styles
              "[&_.annotation-highlight]:bg-primary/10",
              "[&_.annotation-highlight]:cursor-pointer [&_.annotation-highlight]:transition-colors",
              "[&_.annotation-highlight:hover]:bg-primary/20",
              // Selected annotation styles - darker background
              "[&_.annotation-selected]:bg-primary/35 [&_.annotation-selected]:dark:bg-primary/40",
              "[&_.annotation-selected]:font-medium",
              "[&_.annotation-selected:hover]:bg-primary/40 [&_.annotation-selected:hover]:dark:bg-primary/45"
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

      {/* Selection Popup */}
      {selectionPopup && (
        <CreateAnnotationPopup
          selectedText={selectionPopup.text}
          position={selectionPopup.position}
          onCreateAnnotation={handleCreateAnnotationFromPopup}
        />
      )}
    </>
  );
}
