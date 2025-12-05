import { useEffect, useRef, useState, useMemo } from 'react';

import type { EntityMention, MentionedEntities, EntityType, EntityLink } from '../types/entity-link';

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
    // Re-run matching when blacklist changes
    findAndLinkEntities();
  }, [blacklistedEntityIds]);

  // Run initial matching when component mounts or when mentioned entities change
  useEffect(() => {
    if (enabled) {
      findAndLinkEntities();
    }
  }, [enabled, mentionedEntities]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !enabled) return;

    const handleInput = () => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        findAndLinkEntities();
      }, debounceMs);
    };

    // Also handle space key directly (no debounce)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        // Clear existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Trigger immediately after space
        setTimeout(() => {
          findAndLinkEntities();
        }, 50);
      }
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('keydown', handleKeyDown);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [editorRef, mentionedEntities, enabled, matchThreshold, debounceMs]);

  /**
   * Finds potential entity matches in the editor content
   */
  const findAndLinkEntities = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const content = editor.innerText;
    const words = extractWords(content);
    const newLinks: EntityLink[] = [];

    // Flatten all mentioned entities with their types
    const allEntities: Array<{ entity: EntityMention; type: EntityType }> = [
      ...mentionedEntities.characters.map(e => ({ entity: e, type: 'character' as EntityType })),
      ...mentionedEntities.regions.map(e => ({ entity: e, type: 'region' as EntityType })),
      ...mentionedEntities.items.map(e => ({ entity: e, type: 'item' as EntityType })),
      ...mentionedEntities.factions.map(e => ({ entity: e, type: 'faction' as EntityType })),
      ...mentionedEntities.races.map(e => ({ entity: e, type: 'race' as EntityType })),
    ];

    // On first run, keep initial links that are still valid
    let persistedLinks: EntityLink[] = [];
    if (!initialLinksLoadedRef.current && initialLinks.length > 0) {
      persistedLinks = initialLinks.filter(link => {
        // Check if the link's text is still at the same position in content
        const textAtPosition = content.substring(link.startOffset, link.endOffset);
        return textAtPosition === link.text;
      });
      initialLinksLoadedRef.current = true;
    }

    // Check each word against entities
    for (const word of words) {
      // Skip if already in persisted links (prevent duplicate linking)
      const alreadyLinked = persistedLinks.some(
        link => link.startOffset === word.start && link.endOffset === word.end
      );
      if (alreadyLinked) {
        continue;
      }

      // Try to find matching entity
      const match = findBestMatch(word.text, allEntities, matchThreshold);

      // Skip if entity is blacklisted
      if (match && blacklistRef.current.has(match.entity.id)) {
        continue;
      }

      if (match) {
        newLinks.push({
          text: word.text,
          entity: match.entity,
          entityType: match.type,
          startOffset: word.start,
          endOffset: word.end,
        });
      }
    }

    // Merge persisted links with new links
    const allLinks = [...persistedLinks, ...newLinks];

    // Only update if links actually changed (deep comparison by entity id and position)
    setActiveLinks(prev => {
      if (prev.length !== allLinks.length) return allLinks;

      const hasChanges = allLinks.some((newLink, index) => {
        const oldLink = prev[index];
        return !oldLink ||
               oldLink.entity.id !== newLink.entity.id ||
               oldLink.startOffset !== newLink.startOffset ||
               oldLink.endOffset !== newLink.endOffset;
      });

      return hasChanges ? allLinks : prev;
    });
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
    setActiveLinks(prev =>
      prev.filter(link => link.entity.id !== entityId)
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
function extractWords(text: string): Array<{ text: string; start: number; end: number }> {
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
 * Finds the best matching entity for a given text
 * Uses Levenshtein distance for fuzzy matching
 */
function findBestMatch(
  text: string,
  entities: Array<{ entity: EntityMention; type: EntityType }>,
  threshold: number
): { entity: EntityMention; type: EntityType } | null {
  let bestMatch: { entity: EntityMention; type: EntityType } | null = null;
  let bestSimilarity = 0;

  const normalizedText = text.toLowerCase().trim();

  for (const { entity, type } of entities) {
    const normalizedEntityName = entity.name.toLowerCase().trim();

    // Calculate similarity
    const similarity = calculateSimilarity(normalizedText, normalizedEntityName);

    if (similarity >= threshold && similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = { entity, type };
    }
  }

  return bestMatch;
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
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return dp[m][n];
}
