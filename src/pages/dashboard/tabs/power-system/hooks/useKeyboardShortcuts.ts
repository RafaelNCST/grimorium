import { useEffect, useCallback } from "react";

interface KeyboardShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

interface UseKeyboardShortcutsOptions {
  enabled: boolean;
  handlers: KeyboardShortcutHandlers;
}

export function useKeyboardShortcuts({
  enabled,
  handlers,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only handle shortcuts when enabled
      if (!enabled) return;

      // Check if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Undo: Ctrl+Z (except in input fields)
      if (
        event.ctrlKey &&
        !event.shiftKey &&
        event.key === "z" &&
        !isInputField
      ) {
        event.preventDefault();
        handlers.onUndo?.();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z (except in input fields)
      if (
        ((event.ctrlKey && event.key === "y") ||
          (event.ctrlKey && event.shiftKey && event.key === "Z")) &&
        !isInputField
      ) {
        event.preventDefault();
        handlers.onRedo?.();
        return;
      }

      // Rename: F2 (except in input fields)
      if (event.key === "F2" && !isInputField) {
        event.preventDefault();
        handlers.onRename?.();
        return;
      }

      // Delete: Delete key (except in input fields)
      if (event.key === "Delete" && !isInputField) {
        event.preventDefault();
        handlers.onDelete?.();
        return;
      }
    },
    [enabled, handlers]
  );

  useEffect(() => {
    if (!enabled) return;

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
