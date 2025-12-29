import { useState, useCallback, useRef, useEffect } from "react";

import type { Annotation } from "../types";

interface HistoryState {
  content: string;
  cursorPosition: number;
  annotations: Annotation[];
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
}

export function useUndoRedo(
  initialContent: string = "",
  initialAnnotations: Annotation[] = [],
  options: UseUndoRedoOptions = {}
) {
  const { maxHistorySize = 50, debounceMs = 200 } = options; // Reduced to 200ms for faster response

  // History stack - always start with one state (empty or with content)
  const [history, setHistory] = useState<HistoryState[]>([
    { content: initialContent, cursorPosition: initialContent.length, annotations: initialAnnotations }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs to avoid stale closures
  const historyRef = useRef(history);
  const currentIndexRef = useRef(currentIndex);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<{ content: string; cursorPosition: number; annotations: Annotation[] } | null>(null);

  // Keep refs in sync
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Add new state to history
  const pushState = useCallback(
    (
      content: string,
      cursorPosition: number,
      annotations: Annotation[],
      immediate: boolean = false
    ) => {
      const addToHistory = () => {
        let shouldTrim = false;
        let newLength = 0;

        setHistory((prev) => {
          const currentIdx = currentIndexRef.current;

          // Don't add if content and annotations are the same as current state (if we have a current state)
          if (currentIdx >= 0 && currentIdx < prev.length) {
            const currentState = prev[currentIdx];
            if (
              currentState?.content === content &&
              JSON.stringify(currentState?.annotations) === JSON.stringify(annotations)
            ) {
              console.log('[UNDO] Skipping duplicate state');
              return prev;
            }
          }

          // Remove all states after current index (if we're not at the end)
          const newHistory = prev.slice(0, currentIdx + 1);

          // Add new state
          newHistory.push({ content, cursorPosition, annotations: JSON.parse(JSON.stringify(annotations)) });
          newLength = newHistory.length;

          // Limit history size
          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
            shouldTrim = true;
            newLength = newHistory.length;
            console.log('[UNDO] Trimmed history. Length:', newLength);
          } else {
            console.log('[UNDO] Added state to history. New length:', newLength);
          }

          return newHistory;
        });

        // Update current index to point to the new state
        setCurrentIndex((prev) => {
          // If we trimmed the history, index stays the same
          // Otherwise, set to last index
          const newIndex = shouldTrim ? prev : newLength - 1;
          console.log('[UNDO] Updated currentIndex to:', newIndex, 'canUndo:', newIndex > 0);
          return newIndex;
        });

        // Clear pending state after adding to history
        pendingStateRef.current = null;
      };

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // If immediate, add to history right away (for Enter, paste, formatting changes)
      if (immediate) {
        console.log('[UNDO] Immediate save - adding to history now');
        addToHistory();
      } else {
        // Store pending state
        pendingStateRef.current = { content, cursorPosition, annotations };
        console.log('[UNDO] Debounced save - will add in 200ms');

        // Otherwise, debounce (for continuous typing)
        debounceTimerRef.current = setTimeout(addToHistory, debounceMs);
      }
    },
    [maxHistorySize, debounceMs]
  );

  // Force flush pending state to history (called when cursor moves or action changes)
  const flush = useCallback(() => {
    console.log('[UNDO] Flush called. Pending state exists:', !!pendingStateRef.current);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (pendingStateRef.current) {
      const { content, cursorPosition, annotations } = pendingStateRef.current;
      console.log('[UNDO] Flushing pending state to history');

      let shouldTrim = false;
      let newLength = 0;

      setHistory((prev) => {
        const currentIdx = currentIndexRef.current;

        // Don't add if content and annotations are the same as current state (if we have a current state)
        if (currentIdx >= 0 && currentIdx < prev.length) {
          const currentState = prev[currentIdx];
          if (
            currentState?.content === content &&
            JSON.stringify(currentState?.annotations) === JSON.stringify(annotations)
          ) {
            console.log('[UNDO] Skipping duplicate state in flush');
            return prev;
          }
        }

        // Remove all states after current index (if we're not at the end)
        const newHistory = prev.slice(0, currentIdx + 1);

        // Add new state
        newHistory.push({ content, cursorPosition, annotations: JSON.parse(JSON.stringify(annotations)) });
        newLength = newHistory.length;

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          shouldTrim = true;
          newLength = newHistory.length;
          console.log('[UNDO] Flushed & trimmed history. Length:', newLength);
        } else {
          console.log('[UNDO] Flushed state to history. New length:', newLength);
        }

        return newHistory;
      });

      // Update current index to point to the new state
      setCurrentIndex((prev) => {
        // If we trimmed the history, index stays the same
        // Otherwise, set to last index
        const newIndex = shouldTrim ? prev : newLength - 1;
        console.log('[UNDO] Updated currentIndex after flush to:', newIndex, 'canUndo:', newIndex > 0);
        return newIndex;
      });

      // Clear pending state
      pendingStateRef.current = null;
    }
  }, [maxHistorySize]);

  // Undo
  const undo = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    console.log('[UNDO] Undo called. CurrentIndex:', currentIdx, 'History length:', historyRef.current.length);
    if (currentIdx > 0) {
      console.log('[UNDO] Going back to index:', currentIdx - 1);
      setCurrentIndex(currentIdx - 1);
      return historyRef.current[currentIdx - 1];
    }
    console.log('[UNDO] Cannot undo - already at first state');
    return null;
  }, []);

  // Redo
  const redo = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    const hist = historyRef.current;
    if (currentIdx < hist.length - 1) {
      setCurrentIndex(currentIdx + 1);
      return hist[currentIdx + 1];
    }
    return null;
  }, []);

  // Check if can undo/redo
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Get current state
  const currentState = history[currentIndex];

  // Reset history (useful when loading new content or exiting editor)
  const resetHistory = useCallback(
    (content: string, annotations: Annotation[] = [], cursorPosition: number = 0) => {
      setHistory([{ content, cursorPosition: content.length, annotations }]);
      setCurrentIndex(0);
    },
    []
  );

  // Clear debounce on unmount
  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    },
    []
  );

  return {
    pushState,
    flush,
    undo,
    redo,
    canUndo,
    canRedo,
    currentState,
    resetHistory,
    historySize: history.length,
    currentIndex,
  };
}
