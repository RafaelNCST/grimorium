import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import { useNavigate } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { useEditorShortcuts } from "../hooks/useEditorShortcuts";
import { useTextSearch } from "../hooks/useTextSearch";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { CURSOR_COLORS } from "../types/editor-settings";

import { ContextMenu } from "./ContextMenu";
import { SearchBar } from "./SearchBar";

import type { Annotation, TextAlignment } from "../types";
import { ANNOTATION_COLORS } from "../types";
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
      canUndo: _externalCanUndo,
      canRedo: _externalCanRedo,
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
    const isUndoRedoActionRef = useRef(false); // Use ref instead of state to avoid re-renders
    const isTypingRef = useRef(false);
    const localAnnotationUpdateRef = useRef(false);
    const isImmediateActionRef = useRef(false); // Track if next save should be immediate
    const justExitedAnnotationRef = useRef(false); // Track if we just exited an annotation with space
    const lastCursorPositionRef = useRef(0); // Track cursor position to detect moves
    const lastContentLengthRef = useRef(0); // Track content length to detect action type
    const lastActionTypeRef = useRef<'insert' | 'delete' | null>(null); // Track last action type

    // Undo/Redo functionality
    // Initialize with current content and annotations
    const undoRedo = useUndoRedo(content, annotations, {
      maxHistorySize: 50, // Limit to 50 actions
      debounceMs: 200, // 200ms debounce for continuous typing (fast response)
    });

    // Search functionality
    const search = useTextSearch({
      content,
      initialSearchTerm: selectedSearchText,
    });

    // Editor shortcuts (auto-close quotes, em-dash, etc.)
    useEditorShortcuts({
      editorRef,
      enabled: true,
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

    // Reset history when component unmounts (when exiting editor)
    useEffect(() => {
      return () => {
        undoRedo.resetHistory("", []);
      };
    }, []);

    // Detect cursor movement and flush pending state (VS Code-like behavior)
    useEffect(() => {
      const handleCursorMove = () => {
        if (!editorRef.current) return;

        const currentPos = getCurrentCursorPosition();
        const lastPos = lastCursorPositionRef.current;

        // If cursor moved non-adjacently (jumped), flush pending state
        // Adjacent movement is: current = last + 1 or last - 1 (normal typing/deleting)
        if (Math.abs(currentPos - lastPos) > 1) {
          undoRedo.flush();
        }

        lastCursorPositionRef.current = currentPos;
      };

      const handleClick = () => {
        handleCursorMove();
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        // Check for arrow keys, home, end, page up/down - these move cursor
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
          handleCursorMove();
        }
      };

      const editor = editorRef.current;
      if (editor) {
        editor.addEventListener('click', handleClick);
        editor.addEventListener('keyup', handleKeyUp);

        return () => {
          editor.removeEventListener('click', handleClick);
          editor.removeEventListener('keyup', handleKeyUp);
        };
      }
    }, [undoRedo]);

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
    const renderContentWithAnnotations = (
      annotationsToRender?: Annotation[]
    ) => {
      if (!content) return "";

      // Use provided annotations or default to prop
      const currentAnnotations = annotationsToRender || annotations;

      // Combine annotations and search results
      const allHighlights: Array<{
        start: number;
        end: number;
        type: "annotation" | "search" | "search-current";
        id?: string;
      }> = [];

      // Add annotations
      currentAnnotations.forEach((annotation) => {
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
        // Skip if this highlight starts before lastIndex (already covered)
        if (highlight.start < lastIndex) return;

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

          // Get annotation to access its color
          const annotation = currentAnnotations.find((a) => a.id === highlight.id);
          const color = annotation?.color || "purple"; // Default to purple
          const colorStyle = ANNOTATION_COLORS[color];
          const backgroundColor = isSelected ? colorStyle.strong : colorStyle.weak;

          result += `<span class="annotation-highlight" data-annotation-id="${highlight.id}" style="background-color: ${backgroundColor}; transition: background-color 0.2s;">${escapeHtml(highlightedText)}</span>`;
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

      // Skip re-rendering during undo/redo (we restore HTML directly)
      if (isUndoRedoActionRef.current) {
        return;
      }

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
          } catch (_e) {
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

      // Flush pending state before undo
      undoRedo.flush();

      const previousState = undoRedo.undo();
      if (previousState && editorRef.current) {
        // Set flag to prevent re-renders
        isUndoRedoActionRef.current = true;

        // Restore HTML content directly to preserve formatting (bold, italic, etc.)
        editorRef.current.innerHTML = previousState.content;

        // Extract plain text and notify parent (this will trigger useEffect but it will be skipped)
        const plainText = editorRef.current.innerText;

        // Update annotations and content
        onUpdateAnnotations(previousState.annotations);
        onContentChange(plainText);

        // Restore cursor position and reset flag after all renders complete
        requestAnimationFrame(() => {
          restoreCursorPosition(previousState.cursorPosition);
          // Keep flag active a bit longer to ensure all re-renders are skipped
          requestAnimationFrame(() => {
            isUndoRedoActionRef.current = false;
          });
        });
      }
    };

    const handleRedo = () => {
      if (externalOnRedo) {
        externalOnRedo();
        return;
      }

      // Flush pending state before redo (just in case)
      undoRedo.flush();

      const nextState = undoRedo.redo();
      if (nextState && editorRef.current) {
        // Set flag to prevent re-renders
        isUndoRedoActionRef.current = true;

        // Restore HTML content directly to preserve formatting (bold, italic, etc.)
        editorRef.current.innerHTML = nextState.content;

        // Extract plain text and notify parent (this will trigger useEffect but it will be skipped)
        const plainText = editorRef.current.innerText;

        // Update annotations and content
        onUpdateAnnotations(nextState.annotations);
        onContentChange(plainText);

        // Restore cursor position and reset flag after all renders complete
        requestAnimationFrame(() => {
          restoreCursorPosition(nextState.cursorPosition);
          // Keep flag active a bit longer to ensure all re-renders are skipped
          requestAnimationFrame(() => {
            isUndoRedoActionRef.current = false;
          });
        });
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
      } catch (_e) {
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
      } catch (_e) {
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
      } catch (_e) {
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

      if (editorRef.current) {
        // Detect action type change (VS Code-like behavior)
        const newContentLength = editorRef.current.innerText.length;
        const currentActionType: 'insert' | 'delete' = newContentLength > lastContentLengthRef.current ? 'insert' : 'delete';

        // If action type changed (from insert to delete or vice versa), flush pending state
        if (lastActionTypeRef.current !== null && lastActionTypeRef.current !== currentActionType) {
          console.log('[UNDO] Action type changed:', lastActionTypeRef.current, '→', currentActionType, '- flushing');
          undoRedo.flush();
        }

        // Update refs
        lastContentLengthRef.current = newContentLength;
        lastActionTypeRef.current = currentActionType;

        // SPECIAL FIX: Move trailing whitespace out of annotation spans
        // This allows users to "exit" annotations by typing space at the end
        const annotationSpansForWhitespace = editorRef.current.querySelectorAll('.annotation-highlight');
        let movedWhitespace = false;

        annotationSpansForWhitespace.forEach((span) => {
          const spanText = span.textContent || "";

          // Check if span ends with whitespace
          const trailingWhitespaceMatch = spanText.match(/\s+$/);

          if (trailingWhitespaceMatch) {
            movedWhitespace = true;

            // Extract the whitespace
            const whitespace = trailingWhitespaceMatch[0];

            // Remove whitespace from span
            const textWithoutWhitespace = spanText.slice(0, -whitespace.length);
            span.textContent = textWithoutWhitespace;

            // Insert whitespace as a text node AFTER the span
            const whitespaceNode = document.createTextNode(whitespace);
            span.parentNode?.insertBefore(whitespaceNode, span.nextSibling);

            // Move cursor after the whitespace
            const selection = window.getSelection();
            if (selection) {
              const newRange = document.createRange();
              newRange.setStartAfter(whitespaceNode);
              newRange.setEndAfter(whitespaceNode);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        });

        // If we moved whitespace, update content and return early
        // This prevents re-render from undoing our whitespace fix
        if (movedWhitespace) {
          const newContent = editorRef.current.innerText;
          onContentChange(newContent);

          // Mark as typing to prevent useEffect re-render
          isTypingRef.current = true;

          // Add to undo/redo history
          if (!isUndoRedoAction) {
            const contentForHistory = getCleanHtmlContent();
            const cursorPos = getCurrentCursorPosition();
            undoRedo.pushState(contentForHistory, cursorPos, annotations, false);
          }

          return; // Exit early - don't process annotations again
        }

        // CRITICAL: Remove ghost spans with inline background-color that browser creates
        // This happens when user deletes annotation content and types in the same location
        const ghostSpans = editorRef.current.querySelectorAll(
          'span[style*="background-color"]'
        );
        let hasGhostSpans = false;
        ghostSpans.forEach((span) => {
          // Check if this is NOT an annotation span, entity link, or search highlight
          if (
            !span.classList.contains("annotation-highlight") &&
            !span.classList.contains("entity-link") &&
            !span.classList.contains("search-highlight")
          ) {
            hasGhostSpans = true;
            // Remove the background-color style
            const element = span as HTMLElement;
            element.style.backgroundColor = "";

            // If the span has no other styles or classes, unwrap it
            if (!element.style.cssText && !element.className) {
              const parent = element.parentNode;
              while (element.firstChild) {
                parent?.insertBefore(element.firstChild, element);
              }
              parent?.removeChild(element);
            }
          }
        });

        // Get HTML with formatting (for undo/redo) but remove annotation spans
        const contentForHistory = getCleanHtmlContent();

        // Extract plain text content (removes HTML tags) for onChange
        const newContent = editorRef.current.innerText;

        const annotationSpans = editorRef.current.querySelectorAll(
          ".annotation-highlight"
        );
        const updatedAnnotations: Annotation[] = [];
        let needsForceRerender = hasGhostSpans; // Force rerender if we found ghost spans

        annotationSpans.forEach((span) => {
          const annotationId = span.getAttribute("data-annotation-id");
          if (!annotationId) return;

          const originalAnnotation = annotations.find(
            (a) => a.id === annotationId
          );
          if (!originalAnnotation) return;

          // Get the text content of the span
          const spanText = span.textContent || "";

          // RULE 1: Delete annotation if all content is removed
          if (spanText.length === 0) {
            needsForceRerender = true;
            return; // Skip this annotation (will be removed from list)
          }

          // Calculate the offset of this span in the PLAIN TEXT
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.setEnd(span, 0);
          const startOffset = range.toString().length;

          // RULE 2: Annotations expand and shrink dynamically with the span
          // Simple rule: just follow what's in the span

          const finalText = spanText;
          const finalEndOffset = startOffset + spanText.length;

          updatedAnnotations.push({
            ...originalAnnotation,
            text: finalText,
            startOffset,
            endOffset: finalEndOffset,
          });
        });

        // Check if annotations were removed (deleted)
        if (updatedAnnotations.length < annotations.length) {
          needsForceRerender = true;

          // CRITICAL: Remove all inline background-color styles that the browser might have kept
          // This prevents the "ghost span" issue where the browser remembers the formatting
          const allSpans = editorRef.current.querySelectorAll(
            'span[style*="background-color"]'
          );
          allSpans.forEach((span) => {
            // Check if this is NOT an annotation span, entity link, or search highlight
            if (
              !span.classList.contains("annotation-highlight") &&
              !span.classList.contains("entity-link") &&
              !span.classList.contains("search-highlight")
            ) {
              // Remove the background-color style
              const element = span as HTMLElement;
              element.style.backgroundColor = "";

              // If the span has no other styles or classes, unwrap it
              if (!element.style.cssText && !element.className) {
                const parent = element.parentNode;
                while (element.firstChild) {
                  parent?.insertBefore(element.firstChild, element);
                }
                parent?.removeChild(element);
              }
            }
          });
        }

        // Update annotations if any were removed or changed
        const hasAnnotationChanges =
          updatedAnnotations.length !== annotations.length ||
          updatedAnnotations.some((ann) => {
            const orig = annotations.find((a) => a.id === ann.id);
            return (
              !orig ||
              orig.text !== ann.text ||
              orig.startOffset !== ann.startOffset ||
              orig.endOffset !== ann.endOffset
            );
          });

        // Special handling if we just exited annotation with space
        if (justExitedAnnotationRef.current) {
          // We manually inserted space outside the span
          // Force re-render to ensure clean state
          isTypingRef.current = false;
          localAnnotationUpdateRef.current = false;
          justExitedAnnotationRef.current = false; // Reset flag

          // Update annotations if they changed
          if (hasAnnotationChanges) {
            onUpdateAnnotations(updatedAnnotations);
          }
        }
        // Handle force rerender separately - even if annotations didn't "change" in data,
        // we need to re-render the DOM to fix visual issues (capped spans, deleted annotations)
        else if (needsForceRerender) {
          // CRITICAL: Reset typing flag to ensure useEffect will re-render
          isTypingRef.current = false;
          localAnnotationUpdateRef.current = false;

          // Update annotations if they changed
          if (hasAnnotationChanges) {
            onUpdateAnnotations(updatedAnnotations);
          }
        } else if (hasAnnotationChanges) {
          // Normal update - mark as typing to avoid unnecessary re-renders
          isTypingRef.current = true;
          localAnnotationUpdateRef.current = true;
          onUpdateAnnotations(updatedAnnotations);
        } else {
          // No annotation changes and no force rerender - mark as typing to avoid re-render
          isTypingRef.current = true;
        }

        onContentChange(newContent);

        // Add to undo/redo history (if not currently doing undo/redo)
        // Save HTML with formatting, not just plain text
        if (!isUndoRedoActionRef.current) {
          const cursorPos = getCurrentCursorPosition();
          const immediate = isImmediateActionRef.current;
          undoRedo.pushState(contentForHistory, cursorPos, annotations, immediate);

          // Update cursor position ref for tracking
          lastCursorPositionRef.current = cursorPos;

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
        const range = selection.getRangeAt(0);

        // Get the ACTUAL selected text (without trim to preserve exact selection)
        const actualSelectedText = selection.toString();
        // Get trimmed version for checking
        const trimmedText = actualSelectedText.trim();

        // Calculate offsets based on ACTUAL selection (not trimmed)
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(editorRef.current!);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const startOffset = preSelectionRange.toString().length;
        const endOffset = startOffset + actualSelectedText.length;

        // Send the TRIMMED text but calculate proper offsets
        // Adjust startOffset to account for leading whitespace
        const leadingWhitespace =
          actualSelectedText.match(/^\s*/)?.[0].length || 0;
        const trailingWhitespace =
          actualSelectedText.match(/\s*$/)?.[0].length || 0;

        const adjustedStartOffset = startOffset + leadingWhitespace;
        const adjustedEndOffset = endOffset - trailingWhitespace;

        onTextSelect(trimmedText, adjustedStartOffset, adjustedEndOffset);
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
      } catch (_err) {
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
      } catch (_err) {
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
      } catch (_err) {
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
                  textAlign: settings?.textAlignment || "left",
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
          />
        )}
      </>
    );
  }
);
TextEditor.displayName = "TextEditor";
