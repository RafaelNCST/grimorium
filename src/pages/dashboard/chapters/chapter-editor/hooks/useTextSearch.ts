import { useState, useMemo, useCallback, useEffect } from "react";

import { detectDialogues, isRangeInDialogue } from "../utils/dialogue-detector";

import type { SearchOptions, SearchResult } from "../types/search-types";

interface UseTextSearchProps {
  content: string;
  initialSearchTerm?: string;
}

export function useTextSearch({
  content,
  initialSearchTerm,
}: UseTextSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    mode: "all",
    dialogueFormats: {
      doubleQuotes: true,
      singleQuotes: true,
      emDash: true,
    },
  });

  // Set initial search term when opening search
  useEffect(() => {
    if (isSearchOpen && initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [isSearchOpen, initialSearchTerm]);

  // Detect dialogues based on current formats
  const dialogueRanges = useMemo(() => {
    if (searchOptions.mode === "all") return [];
    return detectDialogues(content, searchOptions.dialogueFormats);
  }, [content, searchOptions.mode, searchOptions.dialogueFormats]);

  // Find all search results
  const results = useMemo<SearchResult[]>(() => {
    if (!searchTerm || !content) return [];

    // Helper function to check if a position is in the correct context
    const isInCorrectContext = (start: number, end: number): boolean => {
      if (searchOptions.mode === "all") return true;

      const isInDialogue = isRangeInDialogue(start, end, dialogueRanges);

      if (searchOptions.mode === "dialogues") {
        return isInDialogue;
      } else {
        // mode === 'narration'
        return !isInDialogue;
      }
    };

    const results: SearchResult[] = [];
    let searchText = content;
    let pattern = searchTerm;

    // Build regex pattern
    if (!searchOptions.caseSensitive) {
      pattern = pattern.toLowerCase();
      searchText = content.toLowerCase();
    }

    if (searchOptions.wholeWord) {
      // Escape special regex characters
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedPattern}\\b`, "g");
      let match;

      while ((match = regex.exec(searchText)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        const matchedText = content.substring(start, end);

        // Check if match is in correct context (dialogue/narration)
        if (isInCorrectContext(start, end)) {
          results.push({
            index: results.length,
            start,
            end,
            text: matchedText,
          });
        }
      }
    } else {
      // Simple substring search
      let index = 0;
      while (index < searchText.length) {
        const foundIndex = searchText.indexOf(pattern, index);
        if (foundIndex === -1) break;

        const start = foundIndex;
        const end = start + pattern.length;
        const matchedText = content.substring(start, end);

        // Check if match is in correct context (dialogue/narration)
        if (isInCorrectContext(start, end)) {
          results.push({
            index: results.length,
            start,
            end,
            text: matchedText,
          });
        }

        index = foundIndex + 1;
      }
    }

    return results;
  }, [searchTerm, content, searchOptions, dialogueRanges]);

  // Reset current index when results change
  useEffect(() => {
    if (results.length > 0) {
      setCurrentIndex(0);
    }
  }, [results]);

  // Navigation
  const goToNext = useCallback(() => {
    if (results.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % results.length);
  }, [results.length]);

  const goToPrevious = useCallback(() => {
    if (results.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + results.length) % results.length);
  }, [results.length]);

  // Toggle options
  const toggleCaseSensitive = useCallback(() => {
    setSearchOptions((prev) => ({
      ...prev,
      caseSensitive: !prev.caseSensitive,
    }));
  }, []);

  const toggleWholeWord = useCallback(() => {
    setSearchOptions((prev) => ({
      ...prev,
      wholeWord: !prev.wholeWord,
    }));
  }, []);

  const setSearchMode = useCallback((mode: SearchOptions["mode"]) => {
    setSearchOptions((prev) => ({
      ...prev,
      mode,
    }));
  }, []);

  const setDialogueFormats = useCallback(
    (formats: SearchOptions["dialogueFormats"]) => {
      setSearchOptions((prev) => ({
        ...prev,
        dialogueFormats: formats,
      }));
    },
    []
  );

  // Replace functions
  const replaceCurrent = useCallback((): string | null => {
    if (results.length === 0 || !replaceTerm) return null;

    const currentResult = results[currentIndex];
    if (!currentResult) return null;

    const newContent =
      content.substring(0, currentResult.start) +
      replaceTerm +
      content.substring(currentResult.end);

    // Move to next result (or stay at same index if it was the last one)
    if (currentIndex >= results.length - 1) {
      setCurrentIndex(Math.max(0, results.length - 2));
    }

    return newContent;
  }, [results, currentIndex, replaceTerm, content]);

  const replaceAll = useCallback((): string | null => {
    if (results.length === 0 || !replaceTerm) return null;

    let newContent = content;
    const _offset = 0;

    // Replace from end to start to maintain correct offsets
    const sortedResults = [...results].sort((a, b) => b.start - a.start);

    for (const result of sortedResults) {
      newContent =
        newContent.substring(0, result.start) +
        replaceTerm +
        newContent.substring(result.end);
    }

    return newContent;
  }, [results, replaceTerm, content]);

  // Open/close search
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setReplaceTerm("");
    setCurrentIndex(0);
  }, []);

  // Clear search term when closing
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchTerm("");
      setReplaceTerm("");
    }
  }, [isSearchOpen]);

  // Get current result
  const currentResult = results[currentIndex] || null;

  return {
    // State
    searchTerm,
    replaceTerm,
    currentIndex,
    isSearchOpen,
    searchOptions,
    results,
    currentResult,
    totalResults: results.length,

    // Actions
    setSearchTerm,
    setReplaceTerm,
    goToNext,
    goToPrevious,
    toggleCaseSensitive,
    toggleWholeWord,
    setSearchMode,
    setDialogueFormats,
    replaceCurrent,
    replaceAll,
    openSearch,
    closeSearch,
  };
}
