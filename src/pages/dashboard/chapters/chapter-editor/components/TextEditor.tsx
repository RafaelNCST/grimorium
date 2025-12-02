import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

import { cn } from "@/lib/utils";

import { ContextMenu } from "./ContextMenu";
import { SearchBar } from "./SearchBar";
import { useTextSearch } from "../hooks/useTextSearch";
import { useUndoRedo } from "../hooks/useUndoRedo";
import type { Annotation } from "../types";

export interface TextEditorRef {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

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
  fontSize?: number;
  fontFamily?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(function TextEditor({
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
  fontSize = 12,
  fontFamily = "Inter",
  onUndo: externalOnUndo,
  onRedo: externalOnRedo,
  canUndo: externalCanUndo,
  canRedo: externalCanRedo,
}, ref) {
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSearchText, setSelectedSearchText] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    hasSelection: boolean;
  } | null>(null);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);

  // Undo/Redo functionality
  const undoRedo = useUndoRedo(content, {
    maxHistorySize: 100,
    debounceMs: 300,
  });

  // Search functionality
  const search = useTextSearch({ content, initialSearchTerm: selectedSearchText });

  // Expose undo/redo through ref
  useImperativeHandle(ref, () => ({
    undo: handleUndo,
    redo: handleRedo,
    canUndo: undoRedo.canUndo,
    canRedo: undoRedo.canRedo,
  }));

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F / Cmd+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();

        // Get selected text
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || '';
        setSelectedSearchText(selectedText);

        search.openSearch();
      }

      // Ctrl+M / Cmd+M to create annotation
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();

        // Get selected text
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || '';

        if (selectedText) {
          onCreateAnnotation();
        }
      }

      // Ctrl+Z / Cmd+Z to undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl+Y / Cmd+Shift+Z to redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [search, onCreateAnnotation]);

  // Clear selected search text when search closes
  useEffect(() => {
    if (!search.isSearchOpen) {
      setSelectedSearchText('');
    }
  }, [search.isSearchOpen]);

  // Handle replace and update content
  const handleReplaceCurrent = () => {
    const newContent = search.replaceCurrent();
    if (newContent) {
      onContentChange(newContent);
    }
  };

  const handleReplaceAll = () => {
    const newContent = search.replaceAll();
    if (newContent) {
      onContentChange(newContent);
    }
  };

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Render content with annotations and search highlights
  const renderContentWithAnnotations = () => {
    if (!content) return '';

    // Combine annotations and search results
    const allHighlights: Array<{
      start: number;
      end: number;
      type: 'annotation' | 'search' | 'search-current';
      id?: string;
    }> = [];

    // Add annotations
    annotations.forEach((annotation) => {
      allHighlights.push({
        start: annotation.startOffset,
        end: annotation.endOffset,
        type: 'annotation',
        id: annotation.id,
      });
    });

    // Add search results
    search.results.forEach((result, index) => {
      allHighlights.push({
        start: result.start,
        end: result.end,
        type: index === search.currentIndex ? 'search-current' : 'search',
      });
    });

    // Sort by start position
    allHighlights.sort((a, b) => a.start - b.start);

    let result = '';
    let lastIndex = 0;

    allHighlights.forEach((highlight) => {
      // Add text before highlight
      const beforeText = content.substring(lastIndex, highlight.start);
      result += escapeHtml(beforeText);

      // Add highlighted text with appropriate class
      const highlightedText = content.substring(highlight.start, highlight.end);

      if (highlight.type === 'annotation') {
        const isSelected = highlight.id === selectedAnnotationId;
        const className = isSelected ? 'annotation-highlight annotation-selected' : 'annotation-highlight';
        result += `<span class="${className}" data-annotation-id="${highlight.id}">${escapeHtml(highlightedText)}</span>`;
      } else if (highlight.type === 'search-current') {
        result += `<span class="search-highlight search-current" data-search-result="true">${escapeHtml(highlightedText)}</span>`;
      } else {
        result += `<span class="search-highlight" data-search-result="true">${escapeHtml(highlightedText)}</span>`;
      }

      lastIndex = highlight.end;
    });

    // Add remaining text after last highlight
    if (lastIndex < content.length) {
      result += escapeHtml(content.substring(lastIndex));
    }

    // Convert newlines to <br> tags for proper display
    result = result.replace(/\n/g, '<br>');

    return result;
  };

  // Update editor content when content, annotations, or search results change
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
  }, [content, annotations, selectedAnnotationId, search.results, search.currentIndex]);


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

  // Scroll to current search result
  useEffect(() => {
    if (search.currentResult && editorRef.current && containerRef.current) {
      const searchSpans = editorRef.current.querySelectorAll('[data-search-result="true"]');
      const currentSpan = searchSpans[search.currentIndex];

      if (currentSpan) {
        currentSpan.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [search.currentResult, search.currentIndex]);

  // Undo/Redo handlers
  const handleUndo = () => {
    if (externalOnUndo) {
      externalOnUndo();
      return;
    }

    const previousState = undoRedo.undo();
    if (previousState && editorRef.current) {
      setIsUndoRedoAction(true);
      onContentChange(previousState.content);

      // Restore cursor position after content updates
      setTimeout(() => {
        restoreCursorPosition(previousState.cursorPosition);
        setIsUndoRedoAction(false);
      }, 0);
    }
  };

  const handleRedo = () => {
    if (externalOnRedo) {
      externalOnRedo();
      return;
    }

    const nextState = undoRedo.redo();
    if (nextState && editorRef.current) {
      setIsUndoRedoAction(true);
      onContentChange(nextState.content);

      // Restore cursor position after content updates
      setTimeout(() => {
        restoreCursorPosition(nextState.cursorPosition);
        setIsUndoRedoAction(false);
      }, 0);
    }
  };

  // Helper to restore cursor position
  const restoreCursorPosition = (position: number) => {
    if (!editorRef.current) return;

    try {
      const selection = window.getSelection();
      if (!selection) return;

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
        if (currentLength + nodeLength >= position) {
          const range = document.createRange();
          const offset = Math.min(position - currentLength, nodeLength);
          range.setStart(textNode, offset);
          range.setEnd(textNode, offset);
          selection.removeAllRanges();
          selection.addRange(range);
          break;
        }
        currentLength += nodeLength;
      }
    } catch (e) {
      // Ignore cursor restoration errors
    }
  };

  // Get current cursor position
  const getCurrentCursorPosition = (): number => {
    if (!editorRef.current) return 0;

    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return 0;

      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(editorRef.current);
      preSelectionRange.setEnd(range.endContainer, range.endOffset);
      return preSelectionRange.toString().length;
    } catch (e) {
      return 0;
    }
  };

  const handleInput = () => {
    // Clear context menu when typing
    setContextMenu(null);

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

      // Add to undo/redo history (if not currently doing undo/redo)
      if (!isUndoRedoAction) {
        const cursorPos = getCurrentCursorPosition();
        undoRedo.pushState(newContent, cursorPos);
      }

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

  // Handle context menu (right-click)
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';
    const hasSelection = selectedText.length > 0;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      hasSelection,
    });
  };

  // Context menu actions
  const handleCopy = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';

    try {
      await navigator.clipboard.writeText(selectedText);
    } catch (err) {
      // Fallback to execCommand
      document.execCommand('copy');
    }
  };

  const handleCut = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';

    try {
      await navigator.clipboard.writeText(selectedText);
      document.execCommand('delete');
      handleInput();
    } catch (err) {
      // Fallback to execCommand
      document.execCommand('cut');
      handleInput();
    }
  };

  const handlePasteFromContextMenu = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
      handleInput();
    } catch (err) {
      // Fallback to execCommand
      document.execCommand('paste');
      handleInput();
    }
  };

  const handleAnnotateFromContextMenu = () => {
    onCreateAnnotation();
  };

  const handleSearchFromContextMenu = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';
    setSelectedSearchText(selectedText);
    search.openSearch();
  };

  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
  };

  const handleUnderline = () => {
    document.execCommand('underline', false);
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
            onContextMenu={handleContextMenu}
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
              "[&_.annotation-selected:hover]:bg-primary/40 [&_.annotation-selected:hover]:dark:bg-primary/45",
              // Search highlight styles
              "[&_.search-highlight]:bg-yellow-200 [&_.search-highlight]:dark:bg-yellow-500/30",
              "[&_.search-highlight]:rounded-sm",
              "[&_.search-highlight]:transition-colors",
              // Current search result styles - darker/brighter yellow
              "[&_.search-current]:bg-yellow-400 [&_.search-current]:dark:bg-yellow-400/60",
              "[&_.search-current]:font-medium",
              "[&_.search-current]:ring-2 [&_.search-current]:ring-yellow-600/50"
            )}
            style={{
              fontSize: `${fontSize}pt`,
              lineHeight: "1.6",
              fontFamily: fontFamily,
              color: "#000000",
              minHeight: "calc(100vh - 200px)",
            }}
            spellCheck="true"
          />
        </div>
      </div>

      {/* Search Bar */}
      {search.isSearchOpen && (
        <SearchBar
          searchTerm={search.searchTerm}
          replaceTerm={search.replaceTerm}
          currentIndex={search.currentIndex}
          totalResults={search.totalResults}
          searchOptions={search.searchOptions}
          onSearchTermChange={search.setSearchTerm}
          onReplaceTermChange={search.setReplaceTerm}
          onNext={search.goToNext}
          onPrevious={search.goToPrevious}
          onClose={search.closeSearch}
          onToggleCaseSensitive={search.toggleCaseSensitive}
          onToggleWholeWord={search.toggleWholeWord}
          onSearchModeChange={search.setSearchMode}
          onDialogueFormatsChange={search.setDialogueFormats}
          onReplaceCurrent={handleReplaceCurrent}
          onReplaceAll={handleReplaceAll}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          hasSelection={contextMenu.hasSelection}
          onClose={() => setContextMenu(null)}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePasteFromContextMenu}
          onAnnotate={handleAnnotateFromContextMenu}
          onSearch={handleSearchFromContextMenu}
          onBold={handleBold}
          onItalic={handleItalic}
          onUnderline={handleUnderline}
        />
      )}
    </>
  );
});
