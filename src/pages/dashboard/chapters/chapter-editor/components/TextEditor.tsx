import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import { cn } from "@/lib/utils";

import { useTextSearch } from "../hooks/useTextSearch";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { CURSOR_COLORS } from "../types/editor-settings";

import { ContextMenu } from "./ContextMenu";
import { SearchBar } from "./SearchBar";

import type { Annotation } from "../types";
import type { EditorSettings } from "../types/editor-settings";

export interface TextEditorRef {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  markNextAsImmediate: () => void; // Mark next save as immediate (for formatting changes)
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
  settings?: EditorSettings;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(
  (
    {
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
      settings,
      onUndo: externalOnUndo,
      onRedo: externalOnRedo,
      canUndo: externalCanUndo,
      canRedo: externalCanRedo,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedSearchText, setSelectedSearchText] = useState("");
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
      hasSelection: boolean;
    } | null>(null);
    const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
    const isTypingRef = useRef(false);
    const localAnnotationUpdateRef = useRef(false);
    const isImmediateActionRef = useRef(false); // Track if next save should be immediate

    // Undo/Redo functionality
    // Initialize with empty state (will be populated on first edit)
    const undoRedo = useUndoRedo("", {
      maxHistorySize: 100,
      debounceMs: 500, // 500ms debounce for continuous typing
    });

    // Search functionality
    const search = useTextSearch({
      content,
      initialSearchTerm: selectedSearchText,
    });

    // Expose undo/redo through ref
    useImperativeHandle(ref, () => ({
      undo: handleUndo,
      redo: handleRedo,
      canUndo: undoRedo.canUndo,
      canRedo: undoRedo.canRedo,
      markNextAsImmediate: () => {
        isImmediateActionRef.current = true;
      },
    }));

    // Handle keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+B / Cmd+B for bold (mark as immediate)
        if ((e.ctrlKey || e.metaKey) && e.key === "b") {
          isImmediateActionRef.current = true;
          // Let browser handle the bold command
        }

        // Ctrl+I / Cmd+I for italic (mark as immediate)
        if ((e.ctrlKey || e.metaKey) && e.key === "i") {
          isImmediateActionRef.current = true;
          // Let browser handle the italic command
        }

        // Ctrl+U / Cmd+U for underline (mark as immediate)
        if ((e.ctrlKey || e.metaKey) && e.key === "u") {
          isImmediateActionRef.current = true;
          // Let browser handle the underline command
        }

        // Ctrl+F / Cmd+F to open search
        if ((e.ctrlKey || e.metaKey) && e.key === "f") {
          e.preventDefault();

          // Get selected text
          const selection = window.getSelection();
          const selectedText = selection?.toString().trim() || "";
          setSelectedSearchText(selectedText);

          search.openSearch();
        }

        // Ctrl+M / Cmd+M to create annotation
        if ((e.ctrlKey || e.metaKey) && e.key === "m") {
          e.preventDefault();

          // Get selected text
          const selection = window.getSelection();
          const selectedText = selection?.toString().trim() || "";

          if (selectedText) {
            onCreateAnnotation();
          }
        }

        // Ctrl+Z / Cmd+Z to undo
        if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        }

        // Ctrl+Y / Cmd+Shift+Z to redo
        if (
          ((e.ctrlKey || e.metaKey) && e.key === "y") ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
        ) {
          e.preventDefault();
          handleRedo();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [search, onCreateAnnotation]);

    // Clear selected search text when search closes
    useEffect(() => {
      if (!search.isSearchOpen) {
        setSelectedSearchText("");
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
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    };

    // Render content with annotations and search highlights
    const renderContentWithAnnotations = () => {
      if (!content) return "";

      // Combine annotations and search results
      const allHighlights: Array<{
        start: number;
        end: number;
        type: "annotation" | "search" | "search-current";
        id?: string;
      }> = [];

      // Add annotations
      annotations.forEach((annotation) => {
        allHighlights.push({
          start: annotation.startOffset,
          end: annotation.endOffset,
          type: "annotation",
          id: annotation.id,
        });
      });

      // Add search results
      search.results.forEach((result, index) => {
        allHighlights.push({
          start: result.start,
          end: result.end,
          type: index === search.currentIndex ? "search-current" : "search",
        });
      });

      // Sort by start position
      allHighlights.sort((a, b) => a.start - b.start);

      let result = "";
      let lastIndex = 0;

      allHighlights.forEach((highlight) => {
        // Add text before highlight
        const beforeText = content.substring(lastIndex, highlight.start);
        result += escapeHtml(beforeText);

        // Add highlighted text with appropriate class
        const highlightedText = content.substring(
          highlight.start,
          highlight.end
        );

        if (highlight.type === "annotation") {
          const isSelected = highlight.id === selectedAnnotationId;
          const className = isSelected
            ? "annotation-highlight annotation-selected"
            : "annotation-highlight";
          result += `<span class="${className}" data-annotation-id="${highlight.id}">${escapeHtml(highlightedText)}</span>`;
        } else if (highlight.type === "search-current") {
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
      result = result.replace(/\n/g, "<br>");

      return result;
    };

    // Update editor content when content, annotations, or search results change
    useEffect(() => {
      if (!editorRef.current) return;

      // Skip re-rendering if user is typing (avoid flickering and annotation jumps)
      if (isTypingRef.current) {
        isTypingRef.current = false;
        return;
      }

      // Skip re-rendering if annotations were updated locally during typing
      if (localAnnotationUpdateRef.current) {
        localAnnotationUpdateRef.current = false;
        return;
      }

      const renderedContent = renderContentWithAnnotations();
      if (editorRef.current.innerHTML !== renderedContent) {
        // Save cursor position
        const selection = window.getSelection();
        let cursorPosition = 0;

        if (
          selection &&
          selection.rangeCount > 0 &&
          editorRef.current.contains(selection.anchorNode)
        ) {
          const range = selection.getRangeAt(0);

          // Calculate cursor position by walking through nodes and counting BRs
          const walker = document.createTreeWalker(
            editorRef.current,
            NodeFilter.SHOW_ALL,
            {
              acceptNode: (node) => {
                if (node.nodeType === Node.TEXT_NODE)
                  return NodeFilter.FILTER_ACCEPT;
                if (node.nodeName === "BR") return NodeFilter.FILTER_ACCEPT;
                return NodeFilter.FILTER_SKIP;
              },
            }
          );

          let node;
          while ((node = walker.nextNode())) {
            // Check if we've reached the container node
            if (node === range.endContainer) {
              // We've reached the cursor position
              if (node.nodeType === Node.TEXT_NODE) {
                cursorPosition += range.endOffset;
              }
              break;
            }

            // Check if the cursor is in a parent element (like the editor div itself)
            if (range.endContainer.nodeType === Node.ELEMENT_NODE) {
              const containerElement = range.endContainer as Element;
              if (node.parentNode === containerElement) {
                // Check if this node is before the cursor offset
                const nodeIndex = Array.from(
                  containerElement.childNodes
                ).indexOf(node as ChildNode);
                if (nodeIndex >= range.endOffset) {
                  break;
                }
              }
            }

            // Count this node
            if (node.nodeName === "BR") {
              cursorPosition += 1;
            } else if (node.nodeType === Node.TEXT_NODE) {
              cursorPosition += node.textContent?.length || 0;
            }
          }
        }

        editorRef.current.innerHTML = renderedContent;

        // Restore cursor position
        if (cursorPosition > 0) {
          try {
            // Get all nodes including text nodes and BR elements
            const walker = document.createTreeWalker(
              editorRef.current,
              NodeFilter.SHOW_ALL,
              {
                acceptNode: (node) => {
                  if (node.nodeType === Node.TEXT_NODE)
                    return NodeFilter.FILTER_ACCEPT;
                  if (node.nodeName === "BR") return NodeFilter.FILTER_ACCEPT;
                  return NodeFilter.FILTER_SKIP;
                },
              }
            );

            let currentLength = 0;
            let node;
            let targetNode: Node | null = null;
            let targetOffset = 0;

            while ((node = walker.nextNode())) {
              if (node.nodeName === "BR") {
                // BR represents a newline character
                currentLength += 1;
                if (currentLength >= cursorPosition) {
                  // Position cursor after the BR
                  targetNode = node.nextSibling || node;
                  targetOffset = 0;
                  break;
                }
              } else if (node.nodeType === Node.TEXT_NODE) {
                const nodeLength = node.textContent?.length || 0;
                if (currentLength + nodeLength >= cursorPosition) {
                  targetNode = node;
                  targetOffset = Math.min(
                    cursorPosition - currentLength,
                    nodeLength
                  );
                  break;
                }
                currentLength += nodeLength;
              }
            }

            if (targetNode) {
              const range = document.createRange();
              if (targetNode.nodeType === Node.TEXT_NODE) {
                range.setStart(targetNode, targetOffset);
                range.setEnd(targetNode, targetOffset);
              } else {
                // Position before the node
                range.setStartBefore(targetNode);
                range.setEndBefore(targetNode);
              }
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
          } catch (e) {
            // Ignore cursor restoration errors
          }
        }
      }
    }, [
      content,
      annotations,
      selectedAnnotationId,
      search.results,
      search.currentIndex,
    ]);

    // Scroll to annotation when requested
    useEffect(() => {
      if (scrollToAnnotation && editorRef.current && containerRef.current) {
        const annotationSpan = editorRef.current.querySelector(
          `[data-annotation-id="${scrollToAnnotation}"]`
        );

        if (annotationSpan) {
          // Scroll the container to show the annotation
          annotationSpan.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }, [scrollToAnnotation]);

    // Scroll to current search result
    useEffect(() => {
      if (search.currentResult && editorRef.current && containerRef.current) {
        const searchSpans = editorRef.current.querySelectorAll(
          '[data-search-result="true"]'
        );
        const currentSpan = searchSpans[search.currentIndex];

        if (currentSpan) {
          currentSpan.scrollIntoView({
            behavior: "smooth",
            block: "center",
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

        // Restore HTML with formatting directly to the editor
        editorRef.current.innerHTML = previousState.content;

        // Extract plain text and notify parent
        const plainText = editorRef.current.innerText;
        onContentChange(plainText);

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

        // Restore HTML with formatting directly to the editor
        editorRef.current.innerHTML = nextState.content;

        // Extract plain text and notify parent
        const plainText = editorRef.current.innerText;
        onContentChange(plainText);

        // Restore cursor position after content updates
        setTimeout(() => {
          restoreCursorPosition(nextState.cursorPosition);
          setIsUndoRedoAction(false);
        }, 0);
      }
    };

    // Helper to perform auto-scroll based on settings
    const performAutoScroll = (forceScroll: boolean = false) => {
      if (
        settings?.autoScrollMode === "off" ||
        !containerRef.current ||
        !editorRef.current
      ) {
        return;
      }

      const isAtEnd = isCursorAtEnd();

      // Only auto-scroll if cursor is at the end, unless forced
      if (!forceScroll && !isAtEnd) {
        return;
      }

      setTimeout(() => {
        if (!containerRef.current || !editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        if (settings?.autoScrollMode === "center") {
          // Typewriter mode: keep cursor centered in the viewport
          const STATS_BAR_HEIGHT = 38;
          const ADJUSTMENT = 20; // Small adjustment to center more accurately

          // Calculate center position of viewport (excluding stats bar at bottom)
          const viewportHeight = window.innerHeight;
          const usableHeight = viewportHeight - STATS_BAR_HEIGHT;
          const targetY = usableHeight / 2 + ADJUSTMENT;

          // Get cursor position in viewport
          const cursorY = rect.top;
          const scrollAmount = cursorY - targetY;

          // Always scroll to keep cursor centered (typewriter effect)
          containerRef.current.scrollBy({
            top: scrollAmount,
            behavior: "smooth",
          });
        } else if (settings?.autoScrollMode === "near-end") {
          // Near-end mode: keep cursor visible just above StatsBar (fixed at bottom)
          const STATS_BAR_HEIGHT = 38;
          const BUFFER = 20; // Small buffer to keep cursor close to status bar

          // Calculate threshold: viewport height - stats bar - buffer
          const threshold = window.innerHeight - STATS_BAR_HEIGHT - BUFFER;

          // Use bottom of cursor rect (end of line)
          const cursorBottom = rect.bottom;

          // If cursor bottom is below threshold, scroll to keep it visible
          if (cursorBottom > threshold) {
            const scrollAmount = cursorBottom - threshold;
            containerRef.current.scrollBy({
              top: scrollAmount,
              behavior: "smooth",
            });
          }
        }
      }, 20);
    };

    // Helper to restore cursor position
    const restoreCursorPosition = (position: number) => {
      if (!editorRef.current) return;

      try {
        const selection = window.getSelection();
        if (!selection) return;

        // Get all nodes including text nodes and BR elements
        const walker = document.createTreeWalker(
          editorRef.current,
          NodeFilter.SHOW_ALL,
          {
            acceptNode: (node) => {
              if (node.nodeType === Node.TEXT_NODE)
                return NodeFilter.FILTER_ACCEPT;
              if (node.nodeName === "BR") return NodeFilter.FILTER_ACCEPT;
              return NodeFilter.FILTER_SKIP;
            },
          }
        );

        let currentLength = 0;
        let node;
        let targetNode: Node | null = null;
        let targetOffset = 0;

        while ((node = walker.nextNode())) {
          if (node.nodeName === "BR") {
            // BR represents a newline character
            currentLength += 1;
            if (currentLength >= position) {
              // Position cursor after the BR
              targetNode = node.nextSibling || node;
              targetOffset = 0;
              break;
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent?.length || 0;
            if (currentLength + nodeLength >= position) {
              targetNode = node;
              targetOffset = Math.min(position - currentLength, nodeLength);
              break;
            }
            currentLength += nodeLength;
          }
        }

        if (targetNode) {
          const range = document.createRange();
          if (targetNode.nodeType === Node.TEXT_NODE) {
            range.setStart(targetNode, targetOffset);
            range.setEnd(targetNode, targetOffset);
          } else {
            // Position before the node
            range.setStartBefore(targetNode);
            range.setEndBefore(targetNode);
          }
          selection.removeAllRanges();
          selection.addRange(range);
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

        // Calculate cursor position by walking through nodes and counting BRs
        const walker = document.createTreeWalker(
          editorRef.current,
          NodeFilter.SHOW_ALL,
          {
            acceptNode: (node) => {
              if (node.nodeType === Node.TEXT_NODE)
                return NodeFilter.FILTER_ACCEPT;
              if (node.nodeName === "BR") return NodeFilter.FILTER_ACCEPT;
              return NodeFilter.FILTER_SKIP;
            },
          }
        );

        let cursorPosition = 0;
        let node;

        while ((node = walker.nextNode())) {
          // Check if we've reached the container node
          if (node === range.endContainer) {
            // We've reached the cursor position
            if (node.nodeType === Node.TEXT_NODE) {
              cursorPosition += range.endOffset;
            }
            break;
          }

          // Check if the cursor is in a parent element (like the editor div itself)
          if (range.endContainer.nodeType === Node.ELEMENT_NODE) {
            const containerElement = range.endContainer as Element;
            if (node.parentNode === containerElement) {
              // Check if this node is before the cursor offset
              const nodeIndex = Array.from(containerElement.childNodes).indexOf(
                node as ChildNode
              );
              if (nodeIndex >= range.endOffset) {
                break;
              }
            }
          }

          // Count this node
          if (node.nodeName === "BR") {
            cursorPosition += 1;
          } else if (node.nodeType === Node.TEXT_NODE) {
            cursorPosition += node.textContent?.length || 0;
          }
        }

        return cursorPosition;
      } catch (e) {
        return 0;
      }
    };

    // Check if cursor is at the end of the content (last position)
    const isCursorAtEnd = (): boolean => {
      if (!editorRef.current) return false;

      try {
        const currentPosition = getCurrentCursorPosition();
        const totalLength = editorRef.current.innerText.length;

        // Cursor is at the end if position equals total length, or 1 character before
        // (happens during typing when content updates before cursor position)
        return totalLength - currentPosition <= 1;
      } catch (e) {
        return false;
      }
    };

    // Get HTML content with formatting but without annotation/search highlights
    const getCleanHtmlContent = (): string => {
      if (!editorRef.current) return "";

      const clone = editorRef.current.cloneNode(true) as HTMLElement;

      // Remove annotation highlights
      const annotationSpans = clone.querySelectorAll(".annotation-highlight");
      annotationSpans.forEach((span) => {
        const textNode = document.createTextNode(span.textContent || "");
        span.parentNode?.replaceChild(textNode, span);
      });

      // Remove search highlights
      const searchSpans = clone.querySelectorAll(".search-highlight");
      searchSpans.forEach((span) => {
        const textNode = document.createTextNode(span.textContent || "");
        span.parentNode?.replaceChild(textNode, span);
      });

      return clone.innerHTML;
    };

    const handleInput = () => {
      // Clear context menu when typing
      setContextMenu(null);

      // Mark that user is typing to avoid unnecessary re-renders
      isTypingRef.current = true;

      if (editorRef.current) {
        // Extract plain text content (removes HTML tags) for onChange
        const newContent = editorRef.current.innerText;

        // Get HTML with formatting (for undo/redo) but remove annotation spans
        const contentForHistory = getCleanHtmlContent();

        // Find all annotation spans and recalculate their offsets
        const annotationSpans = editorRef.current.querySelectorAll(
          ".annotation-highlight"
        );
        const updatedAnnotations: Annotation[] = [];

        annotationSpans.forEach((span) => {
          const annotationId = span.getAttribute("data-annotation-id");
          if (!annotationId) return;

          const originalAnnotation = annotations.find(
            (a) => a.id === annotationId
          );
          if (!originalAnnotation) return;

          // Get the text content of the span
          const spanText = span.textContent || "";

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
        if (
          updatedAnnotations.length !== annotations.length ||
          updatedAnnotations.some((ann) => {
            const orig = annotations.find((a) => a.id === ann.id);
            return (
              !orig ||
              orig.text !== ann.text ||
              orig.startOffset !== ann.startOffset ||
              orig.endOffset !== ann.endOffset
            );
          })
        ) {
          // Mark that this is a local update to avoid re-rendering
          localAnnotationUpdateRef.current = true;
          onUpdateAnnotations(updatedAnnotations);
        }

        onContentChange(newContent);

        // Add to undo/redo history (if not currently doing undo/redo)
        // Save HTML with formatting, not just plain text
        if (!isUndoRedoAction) {
          const cursorPos = getCurrentCursorPosition();
          const immediate = isImmediateActionRef.current;
          undoRedo.pushState(contentForHistory, cursorPos, immediate);

          // Reset immediate flag after use
          if (immediate) {
            isImmediateActionRef.current = false;
          }
        }

        // Auto-scroll based on settings - need to wait for DOM to update
        setTimeout(() => {
          performAutoScroll();
        }, 0);
      }
    };

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (
        selection &&
        selection.toString().trim() &&
        selection.rangeCount > 0
      ) {
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
      // Mark as immediate action (paste should create undo point)
      isImmediateActionRef.current = true;

      // Use setTimeout to wait for paste content to be inserted
      setTimeout(() => {
        if (editorRef.current) {
          const newContent = editorRef.current.innerText;
          onContentChange(newContent);

          // Auto-scroll after paste based on settings - wait for DOM update
          setTimeout(() => {
            performAutoScroll();
          }, 0);
        }
      }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (!editorRef.current) return;

        // Mark as immediate action (Enter creates new undo point)
        isImmediateActionRef.current = true;

        // Use the browser's native insertLineBreak command
        document.execCommand("insertLineBreak");

        // Trigger input handler to update content
        handleInput();

        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();

        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        if (e.shiftKey) {
          // Shift+Tab: Remove indentation intelligently
          const currentText = editorRef.current.textContent || "";
          const range = selection.getRangeAt(0);

          // Get cursor position
          const preSelectionRange = range.cloneRange();
          preSelectionRange.selectNodeContents(editorRef.current);
          preSelectionRange.setEnd(range.startContainer, range.startOffset);
          const cursorPosition = preSelectionRange.toString().length;

          // First, check if there are 4 spaces from Tab immediately before cursor
          if (cursorPosition >= 4) {
            const textBeforeCursor4 = currentText.substring(
              cursorPosition - 4,
              cursorPosition
            );
            const hasFourSpaces =
              textBeforeCursor4 === "\u00A0\u00A0\u00A0\u00A0" ||
              textBeforeCursor4 === "    ";

            if (hasFourSpaces) {
              // Remove 4 spaces at once (Tab indentation)
              for (let i = 0; i < 4; i++) {
                document.execCommand("delete", false);
              }
              handleInput();
              return;
            }
          }

          // Otherwise, remove up to 4 individual spaces before cursor
          let spacesToRemove = 0;
          for (let i = 1; i <= Math.min(4, cursorPosition); i++) {
            const char = currentText.charAt(cursorPosition - i);
            if (char === "\u00A0" || char === " ") {
              spacesToRemove++;
            } else {
              break;
            }
          }

          if (spacesToRemove > 0) {
            for (let i = 0; i < spacesToRemove; i++) {
              document.execCommand("delete", false);
            }
            handleInput();
          }
        } else {
          // Tab: Insert 4 non-breaking spaces
          const range = selection.getRangeAt(0);
          range.deleteContents();

          const spaces = "\u00A0\u00A0\u00A0\u00A0";
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
      const annotationSpan = target.closest(".annotation-highlight");
      if (annotationSpan) {
        const annotationId = annotationSpan.getAttribute("data-annotation-id");
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
      const selectedText = selection?.toString().trim() || "";
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
      const selectedText = selection?.toString() || "";

      try {
        await navigator.clipboard.writeText(selectedText);
      } catch (err) {
        // Fallback to execCommand
        document.execCommand("copy");
      }
    };

    const handleCut = async () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || "";

      try {
        await navigator.clipboard.writeText(selectedText);
        document.execCommand("delete");
        handleInput();
      } catch (err) {
        // Fallback to execCommand
        document.execCommand("cut");
        handleInput();
      }
    };

    const handlePasteFromContextMenu = async () => {
      try {
        const text = await navigator.clipboard.readText();
        document.execCommand("insertText", false, text);
        handleInput();
      } catch (err) {
        // Fallback to execCommand
        document.execCommand("paste");
        handleInput();
      }
    };

    const handleAnnotateFromContextMenu = () => {
      onCreateAnnotation();
    };

    const handleSearchFromContextMenu = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim() || "";
      setSelectedSearchText(selectedText);
      search.openSearch();
    };

    const handleBold = () => {
      // Mark as immediate action (formatting change creates undo point)
      isImmediateActionRef.current = true;
      document.execCommand("bold", false);
      handleInput();
    };

    const handleItalic = () => {
      // Mark as immediate action (formatting change creates undo point)
      isImmediateActionRef.current = true;
      document.execCommand("italic", false);
      handleInput();
    };

    const handleUnderline = () => {
      // Mark as immediate action (formatting change creates undo point)
      isImmediateActionRef.current = true;
      document.execCommand("underline", false);
      handleInput();
    };

    // Get cursor color based on settings
    const cursorColor = settings?.cursorColor
      ? CURSOR_COLORS[settings.cursorColor]
      : CURSOR_COLORS.default;

    return (
      <>
        <div ref={containerRef} className="bg-muted/30 overflow-y-auto h-full">
          {/* Summary Section - scrolls with content */}
          {summarySection && settings?.showSummarySection !== false && (
            <div className="px-8 py-6">{summarySection}</div>
          )}

          <div className="max-w-5xl mx-auto pt-8 px-6">
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
                "p-16 shadow-lg border focus:outline-none focus:ring-2 focus:ring-primary/20",
                "prose prose-lg max-w-none dark:prose-invert",
                // Base colors
                settings?.sepiaMode
                  ? "bg-[#faf6ed] border-[#e5dcc8] dark:bg-[#2a2520] dark:border-[#3a352f]"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
                // Annotation styles (conditional)
                settings?.showAnnotationHighlights !== false && [
                  "[&_.annotation-highlight]:bg-primary/10",
                  "[&_.annotation-highlight]:cursor-pointer [&_.annotation-highlight]:transition-colors",
                  "[&_.annotation-highlight:hover]:bg-primary/20",
                  "[&_.annotation-selected]:bg-primary/35 [&_.annotation-selected]:dark:bg-primary/40",
                  "[&_.annotation-selected]:font-medium",
                  "[&_.annotation-selected:hover]:bg-primary/40 [&_.annotation-selected:hover]:dark:bg-primary/45",
                ],
                // Search highlight styles
                "[&_.search-highlight]:bg-yellow-200 [&_.search-highlight]:dark:bg-yellow-500/30",
                "[&_.search-highlight]:rounded-sm",
                "[&_.search-highlight]:transition-colors",
                "[&_.search-current]:bg-yellow-400 [&_.search-current]:dark:bg-yellow-400/60",
                "[&_.search-current]:font-medium",
                "[&_.search-current]:ring-2 [&_.search-current]:ring-yellow-600/50"
              )}
              style={
                {
                  fontSize: `${fontSize}pt`,
                  lineHeight: settings?.lineHeight?.toString() || "1.6",
                  fontFamily,
                  color: "#000000",
                  minHeight: "calc(100vh - 200px)",
                  caretColor: cursorColor,
                  // Add extra padding at bottom based on auto-scroll mode
                  paddingBottom:
                    settings?.autoScrollMode === "center"
                      ? `${Math.max(window.innerHeight / 2, 400)}px`
                      : settings?.autoScrollMode === "off"
                        ? "400px" // Large breathing space when no auto-scroll
                        : undefined, // No extra padding for near-end mode
                } as React.CSSProperties
              }
              spellCheck={settings?.enableSpellCheck !== false}
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
  }
);
