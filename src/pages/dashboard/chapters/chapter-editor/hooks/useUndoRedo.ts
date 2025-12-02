import { useState, useCallback, useRef, useEffect } from 'react';

interface HistoryState {
  content: string;
  cursorPosition: number;
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
}

export function useUndoRedo(
  initialContent: string = '',
  options: UseUndoRedoOptions = {}
) {
  const { maxHistorySize = 100, debounceMs = 500 } = options;

  // History stack
  const [history, setHistory] = useState<HistoryState[]>([
    { content: initialContent, cursorPosition: 0 },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs to avoid stale closures
  const historyRef = useRef(history);
  const currentIndexRef = useRef(currentIndex);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep refs in sync
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Add new state to history
  const pushState = useCallback(
    (content: string, cursorPosition: number) => {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setHistory((prev) => {
          const currentIdx = currentIndexRef.current;

          // Don't add if content is the same as current state
          if (prev[currentIdx]?.content === content) {
            return prev;
          }

          // Remove all states after current index (if we're not at the end)
          const newHistory = prev.slice(0, currentIdx + 1);

          // Add new state
          newHistory.push({ content, cursorPosition });

          // Limit history size
          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
            return newHistory;
          }

          return newHistory;
        });

        // Update current index to point to the new state
        setCurrentIndex((prev) => {
          const newHistory = historyRef.current;
          // If we trimmed the history, index stays the same
          // Otherwise, increment
          if (newHistory.length > maxHistorySize) {
            return prev;
          }
          return prev + 1;
        });
      }, debounceMs);
    },
    [maxHistorySize, debounceMs]
  );

  // Undo
  const undo = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    if (currentIdx > 0) {
      setCurrentIndex(currentIdx - 1);
      return historyRef.current[currentIdx - 1];
    }
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

  // Reset history (useful when loading new content)
  const resetHistory = useCallback((content: string, cursorPosition: number = 0) => {
    setHistory([{ content, cursorPosition }]);
    setCurrentIndex(0);
  }, []);

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    pushState,
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
