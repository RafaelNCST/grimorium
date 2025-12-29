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
  const { maxHistorySize = 50, debounceMs = 200 } = options;

  const [history, setHistory] = useState<HistoryState[]>([
    { content: initialContent, cursorPosition: initialContent.length, annotations: initialAnnotations }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const historyRef = useRef(history);
  const currentIndexRef = useRef(currentIndex);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<{ content: string; cursorPosition: number; annotations: Annotation[] } | null>(null);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
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

          if (currentIdx >= 0 && currentIdx < prev.length) {
            const currentState = prev[currentIdx];
            if (
              currentState?.content === content &&
              JSON.stringify(currentState?.annotations) === JSON.stringify(annotations)
            ) {
              return prev;
            }
          }

          const newHistory = prev.slice(0, currentIdx + 1);
          newHistory.push({ content, cursorPosition, annotations: JSON.parse(JSON.stringify(annotations)) });
          newLength = newHistory.length;

          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
            shouldTrim = true;
            newLength = newHistory.length;
          }

          return newHistory;
        });

        setCurrentIndex((prev) => {
          const newIndex = shouldTrim ? prev : newLength - 1;
          return newIndex;
        });

        pendingStateRef.current = null;
      };

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      if (immediate) {
        addToHistory();
      } else {
        pendingStateRef.current = { content, cursorPosition, annotations };
        debounceTimerRef.current = setTimeout(addToHistory, debounceMs);
      }
    },
    [maxHistorySize, debounceMs]
  );

  const flush = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (pendingStateRef.current) {
      const { content, cursorPosition, annotations } = pendingStateRef.current;

      let shouldTrim = false;
      let newLength = 0;

      setHistory((prev) => {
        const currentIdx = currentIndexRef.current;

        if (currentIdx >= 0 && currentIdx < prev.length) {
          const currentState = prev[currentIdx];
          if (
            currentState?.content === content &&
            JSON.stringify(currentState?.annotations) === JSON.stringify(annotations)
          ) {
            return prev;
          }
        }

        const newHistory = prev.slice(0, currentIdx + 1);
        newHistory.push({ content, cursorPosition, annotations: JSON.parse(JSON.stringify(annotations)) });
        newLength = newHistory.length;

        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          shouldTrim = true;
          newLength = newHistory.length;
        }

        return newHistory;
      });

      setCurrentIndex((prev) => {
        const newIndex = shouldTrim ? prev : newLength - 1;
        return newIndex;
      });

      pendingStateRef.current = null;
    }
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    if (currentIdx > 0) {
      setCurrentIndex(currentIdx - 1);
      return historyRef.current[currentIdx - 1];
    }
    return null;
  }, []);

  const redo = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    const hist = historyRef.current;
    if (currentIdx < hist.length - 1) {
      setCurrentIndex(currentIdx + 1);
      return hist[currentIdx + 1];
    }
    return null;
  }, []);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const currentState = history[currentIndex];

  const resetHistory = useCallback(
    (content: string, annotations: Annotation[] = [], cursorPosition: number = 0) => {
      setHistory([{ content, cursorPosition, annotations }]);
      setCurrentIndex(0);
    },
    []
  );

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
