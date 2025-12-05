import { useEffect, useRef, useState, useMemo } from "react";

import type {
  EntityMention,
  MentionedEntities,
  EntityType,
  EntityLink,
} from "../types/entity-link";

interface UseEntityAutoLinkProps {
  editorRef: React.RefObject<HTMLDivElement>;
  mentionedEntities: MentionedEntities;
  enabled?: boolean;
  matchThreshold?: number; // 0-1, default 0.8 (80%)
  debounceMs?: number;
  initialLinks?: EntityLink[]; // Persistent links to restore
  blacklistedEntityIds?: string[]; // Entity IDs that user explicitly blacklisted
  onBlacklistChange?: (entityIds: string[]) => void; // Callback when blacklist changes
}

/**
 * Hook that automatically links text to mentioned entities as the user types
 * - Triggers on space after word (with debounce)
 * - Uses fuzzy matching (80% similarity by default)
 * - Only matches against mentioned entities in the chapter
 * - Links are dynamic (not saved in content)
 * - Maintains blacklist of entity IDs that user explicitly chose not to link
 */
export function useEntityAutoLink({
  editorRef,
  mentionedEntities,
  enabled = true,
  matchThreshold = 0.8,
  debounceMs = 500,
  initialLinks = [],
  blacklistedEntityIds = [],
  onBlacklistChange,
}: UseEntityAutoLinkProps) {
  // Blacklist of entity IDs that user explicitly unlinked
  const blacklistRef = useRef<Set<string>>(new Set(blacklistedEntityIds));

  // Active links found in the content
  const [activeLinks, setActiveLinks] = useState<EntityLink[]>(initialLinks);

  // Track if initial links have been loaded
  const initialLinksLoadedRef = useRef(false);

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update blacklist ref when blacklistedEntityIds prop changes
  useEffect(() => {
    blacklistRef.current = new Set(blacklistedEntityIds);
  }, [blacklistedEntityIds]);

  // Load initial links on mount only
  useEffect(() => {
    if (initialLinks.length > 0 && !initialLinksLoadedRef.current) {
      setActiveLinks(initialLinks);
      initialLinksLoadedRef.current = true;
    }
  }, [initialLinks]);

  // Debounced cleanup of invalid links (runs in background, doesn't affect cursor)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !enabled) return;

    let cleanupTimer: NodeJS.Timeout | null = null;

    const handleInput = () => {
      // Clear existing timer
      if (cleanupTimer) {
        clearTimeout(cleanupTimer);
      }

      // Wait 300ms after typing stops to clean up invalid links
      cleanupTimer = setTimeout(() => {
        const content = editor.innerText;

        const validLinks = activeLinks.filter((link) => {
          // Check if link is still within content bounds
          if (link.endOffset > content.length) return false;

          // Check if the text at the link position still matches
          const textAtPosition = content.substring(link.startOffset, link.endOffset);
          return textAtPosition === link.text;
        });

        // Only update if links were actually removed
        if (validLinks.length !== activeLinks.length) {
          setActiveLinks(validLinks);
        }
      }, 300);
    };

    editor.addEventListener("input", handleInput);

    return () => {
      editor.removeEventListener("input", handleInput);
      if (cleanupTimer) {
        clearTimeout(cleanupTimer);
      }
    };
  }, [editorRef, enabled, activeLinks]);

  // Listen for space key to CREATE new links (and immediately clean if needed)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        // Trigger after space is inserted
        setTimeout(() => {
          findAndLinkEntities();
        }, 50);
      }
    };

    editor.addEventListener("keydown", handleKeyDown);

    return () => {
      editor.removeEventListener("keydown", handleKeyDown);
    };
  }, [editorRef, mentionedEntities, enabled, matchThreshold]);

  /**
   * Finds potential entity matches ONLY near cursor after space
   * Checks last word before cursor and works backwards
   */
  const findAndLinkEntities = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const content = editor.innerText;
    const words = extractWords(content);

    // FIRST: Clean up invalid links (where text no longer matches)
    const validLinks = activeLinks.filter((link) => {
      // Check if link is still within content bounds
      if (link.endOffset > content.length) return false;

      // Check if the text at the link position still matches
      const textAtPosition = content.substring(link.startOffset, link.endOffset);
      return textAtPosition === link.text;
    });

    // Update active links if any were removed
    if (validLinks.length !== activeLinks.length) {
      setActiveLinks(validLinks);
    }

    // Get cursor position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let cursorOffset = 0;

    try {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editor);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorOffset = preCaretRange.toString().length;
    } catch (e) {
      return;
    }

    // Find last word before cursor
    let lastWordIndex = -1;
    for (let i = words.length - 1; i >= 0; i--) {
      if (words[i].end <= cursorOffset) {
        lastWordIndex = i;
        break;
      }
    }

    if (lastWordIndex === -1) return;

    // Flatten all mentioned entities with their types
    const allEntities: Array<{ entity: EntityMention; type: EntityType }> = [
      ...mentionedEntities.characters.map((e) => ({
        entity: e,
        type: "character" as EntityType,
      })),
      ...mentionedEntities.regions.map((e) => ({
        entity: e,
        type: "region" as EntityType,
      })),
      ...mentionedEntities.items.map((e) => ({
        entity: e,
        type: "item" as EntityType,
      })),
      ...mentionedEntities.factions.map((e) => ({
        entity: e,
        type: "faction" as EntityType,
      })),
      ...mentionedEntities.races.map((e) => ({
        entity: e,
        type: "race" as EntityType,
      })),
    ];

    // Track which word indices are already linked (using VALID links only)
    const linkedWordIndices = new Set<number>();
    validLinks.forEach((link) => {
      words.forEach((word, index) => {
        if (word.start >= link.startOffset && word.end <= link.endOffset) {
          linkedWordIndices.add(index);
        }
      });
    });

    // Skip if last word is already linked
    if (linkedWordIndices.has(lastWordIndex)) return;

    // Try to match against each entity
    for (const { entity, type } of allEntities) {
      if (blacklistRef.current.has(entity.id)) continue;

      const entityWords = extractWords(entity.name);

      // Check if we have enough words
      if (lastWordIndex + 1 < entityWords.length) continue;

      // Try to match entity words backwards from last word
      let allWordsMatch = true;
      const matchedWords: typeof words = [];

      for (let j = entityWords.length - 1; j >= 0; j--) {
        const textWordIndex = lastWordIndex - (entityWords.length - 1 - j);

        if (textWordIndex < 0) {
          allWordsMatch = false;
          break;
        }

        const textWord = words[textWordIndex];
        const entityWord = entityWords[j];

        if (linkedWordIndices.has(textWordIndex)) {
          allWordsMatch = false;
          break;
        }

        const similarity = calculateSimilarity(
          textWord.text.toLowerCase(),
          entityWord.text.toLowerCase()
        );

        if (similarity < matchThreshold) {
          allWordsMatch = false;
          break;
        }

        matchedWords.unshift(textWord);
      }

      // If all words matched, create link
      if (allWordsMatch && matchedWords.length > 0) {
        const startOffset = matchedWords[0].start;
        const endOffset = matchedWords[matchedWords.length - 1].end;
        const linkText = content.substring(startOffset, endOffset);

        const newLink: EntityLink = {
          text: linkText,
          entity: entity,
          entityType: type,
          startOffset,
          endOffset,
        };

        setActiveLinks((prev) => [...prev, newLink]);
        break;
      }
    }
  };

  /**
   * Removes an entity from the blacklist (allows relinking)
   */
  const removeFromBlacklist = (entityId: string) => {
    blacklistRef.current.delete(entityId);

    // Notify parent of blacklist change
    if (onBlacklistChange) {
      onBlacklistChange(Array.from(blacklistRef.current));
    }

    findAndLinkEntities(); // Re-run matching
  };

  /**
   * Adds an entity to the blacklist (prevents relinking)
   */
  const addToBlacklist = (entityId: string) => {
    blacklistRef.current.add(entityId);

    // Notify parent of blacklist change
    if (onBlacklistChange) {
      onBlacklistChange(Array.from(blacklistRef.current));
    }

    // Remove all links for this entity from active links
    setActiveLinks((prev) =>
      prev.filter((link) => link.entity.id !== entityId)
    );
  };

  return {
    activeLinks,
    addToBlacklist,
    removeFromBlacklist,
    refreshLinks: findAndLinkEntities,
  };
}

/**
 * Extracts words with their positions from text
 */
function extractWords(
  text: string
): Array<{ text: string; start: number; end: number }> {
  const words: Array<{ text: string; start: number; end: number }> = [];

  // Match words (letters, numbers, hyphens, apostrophes)
  const regex = /[\p{L}\p{N}'-]+/gu;
  let match;

  while ((match = regex.exec(text)) !== null) {
    words.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return words;
}

/**
 * Calculates similarity between two strings using Levenshtein distance
 * Returns a value between 0 and 1 (1 = identical)
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Exact match (case-insensitive)
  if (str1 === str2) return 1;

  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);

  if (maxLength === 0) return 1;

  return 1 - distance / maxLength;
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Create a 2D array for dynamic programming
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize base cases
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill the dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}
