import { useState, useCallback, useRef } from "react";

// Removed unused imports - these were imported but never used in this hook

import type { IPowerSection, IPowerBlock } from "../types/power-system-types";

/**
 * Snapshot represents the complete state of sections and blocks for a specific page
 * at a specific point in time.
 */
export interface Snapshot {
  pageId: string; // To ensure snapshot belongs to the current page
  sections: IPowerSection[];
  blocks: IPowerBlock[];
  timestamp: number;
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
  pageId: string | null; // Current page ID
}

/**
 * Hook for managing undo/redo functionality in the Power System editor.
 *
 * ARCHITECTURE:
 * - Uses a dual-stack approach (undoStack + redoStack)
 * - Saves complete snapshots of sections and blocks AFTER each action
 * - Syncs with database when applying snapshots (undo/redo)
 * - Scoped to a single page (clears on page change)
 * - Only active in edit mode
 *
 * LIFECYCLE:
 * - Clear history when: page changes, system changes, exit edit mode, app restart
 * - Maintain history while: in edit mode on the same page
 */
export function useUndoRedo(options: UseUndoRedoOptions) {
  const { maxHistorySize = 50, pageId } = options;

  const [undoStack, setUndoStack] = useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = useState<Snapshot[]>([]);
  const isApplyingSnapshot = useRef(false);

  /**
   * Check if we can undo
   */
  const canUndo = undoStack.length > 1; // Need at least 2 items (current + previous)

  /**
   * Check if we can redo
   */
  const canRedo = redoStack.length > 0;

  /**
   * Save a new snapshot to the undo stack.
   * This should be called AFTER an action is completed (create/update/delete/reorder).
   *
   * @param snapshot The current state to save
   */
  const pushSnapshot = useCallback(
    (snapshot: Snapshot) => {
      // Don't save if currently applying a snapshot (prevents infinite loops)
      if (isApplyingSnapshot.current) return;

      // Validate that snapshot belongs to current page
      if (snapshot.pageId !== pageId) {
        console.warn("Snapshot page mismatch, skipping save");
        return;
      }

      setUndoStack((prev) => {
        const newStack = [...prev, snapshot];

        // Limit stack size
        if (newStack.length > maxHistorySize) {
          newStack.shift(); // Remove oldest
        }

        return newStack;
      });

      // Clear redo stack when new action is performed
      setRedoStack([]);
    },
    [pageId, maxHistorySize]
  );

  /**
   * Apply a snapshot to the database and local state.
   * This synchronizes the database with the snapshot data.
   *
   * @param snapshot The snapshot to apply
   * @returns The updated sections and blocks
   */
  const applySnapshot = useCallback(
    async (
      snapshot: Snapshot
    ): Promise<{ sections: IPowerSection[]; blocks: IPowerBlock[] }> => {
      if (!snapshot.pageId) {
        throw new Error("Cannot apply snapshot without pageId");
      }

      isApplyingSnapshot.current = true;

      try {
        const db = await import("@/lib/db/index").then((mod) => mod.getDB());

        // === STEP 1: Delete all existing sections and blocks for this page ===
        // This ensures a clean slate before applying the snapshot
        await db.execute(
          "DELETE FROM power_blocks WHERE section_id IN (SELECT id FROM power_sections WHERE page_id = $1)",
          [snapshot.pageId]
        );
        await db.execute("DELETE FROM power_sections WHERE page_id = $1", [
          snapshot.pageId,
        ]);

        // === STEP 2: Recreate sections from snapshot ===
        for (const section of snapshot.sections) {
          await db.execute(
            `INSERT INTO power_sections (id, page_id, title, order_index, collapsed, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              section.id,
              section.pageId,
              section.title,
              section.orderIndex,
              section.collapsed ? 1 : 0,
              section.createdAt,
              section.updatedAt,
            ]
          );
        }

        // === STEP 3: Recreate blocks from snapshot ===
        for (const block of snapshot.blocks) {
          await db.execute(
            `INSERT INTO power_blocks (id, section_id, type, order_index, content_json, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              block.id,
              block.sectionId,
              block.type,
              block.orderIndex,
              JSON.stringify(block.content),
              block.createdAt,
              block.updatedAt,
            ]
          );
        }

        return {
          sections: snapshot.sections,
          blocks: snapshot.blocks,
        };
      } finally {
        isApplyingSnapshot.current = false;
      }
    },
    []
  );

  /**
   * Undo the last action.
   * Moves the current state to redo stack and restores the previous state.
   *
   * @returns The restored sections and blocks, or null if cannot undo
   */
  const undo = useCallback(async (): Promise<{
    sections: IPowerSection[];
    blocks: IPowerBlock[];
  } | null> => {
    if (!canUndo) return null;

    try {
      // Get current and previous states
      const current = undoStack[undoStack.length - 1];
      const previous = undoStack[undoStack.length - 2];

      // Move current to redo stack
      setRedoStack((prev) => [...prev, current]);

      // Remove current from undo stack
      setUndoStack((prev) => prev.slice(0, -1));

      // Apply previous state
      const result = await applySnapshot(previous);
      return result;
    } catch (error) {
      console.error("Error during undo:", error);
      return null;
    }
  }, [canUndo, undoStack, applySnapshot]);

  /**
   * Redo the last undone action.
   * Moves the state from redo stack back to undo stack.
   *
   * @returns The restored sections and blocks, or null if cannot redo
   */
  const redo = useCallback(async (): Promise<{
    sections: IPowerSection[];
    blocks: IPowerBlock[];
  } | null> => {
    if (!canRedo) return null;

    try {
      // Get the next state from redo stack
      const next = redoStack[redoStack.length - 1];

      // Move to undo stack
      setUndoStack((prev) => [...prev, next]);

      // Remove from redo stack
      setRedoStack((prev) => prev.slice(0, -1));

      // Apply next state
      const result = await applySnapshot(next);
      return result;
    } catch (error) {
      console.error("Error during redo:", error);
      return null;
    }
  }, [canRedo, redoStack, applySnapshot]);

  /**
   * Clear all history (both undo and redo stacks).
   * Called when changing pages, systems, or exiting edit mode.
   */
  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  /**
   * Get debug info about the current history state
   */
  const getHistoryInfo = useCallback(
    () => ({
      undoStackSize: undoStack.length,
      redoStackSize: redoStack.length,
      canUndo,
      canRedo,
      currentPageId: pageId,
    }),
    [undoStack.length, redoStack.length, canUndo, canRedo, pageId]
  );

  return {
    pushSnapshot,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getHistoryInfo,
    isApplyingSnapshot: isApplyingSnapshot.current,
  };
}
