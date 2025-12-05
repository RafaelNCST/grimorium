import { useEffect, useRef } from "react";

interface UseEditorShortcutsProps {
  editorRef: React.RefObject<HTMLDivElement>;
  enabled?: boolean;
}

/**
 * Hook that provides VSCode-like shortcuts for the editor:
 * 1. -- → — (em-dash)
 * 2. Auto-close quotes (" and ') when no text after cursor
 * 3. Auto-close asterisks (*) when no text after cursor
 * 4. Wrap selection with quotes/asterisks when text is selected
 */
export function useEditorShortcuts({
  editorRef,
  enabled = true,
}: UseEditorShortcutsProps) {
  const lastInputRef = useRef<string>("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !enabled) return;

    const handleBeforeInput = (e: InputEvent) => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const inputChar = e.data;

      if (!inputChar) return;

      // Check if there's selected text
      const hasSelection = !range.collapsed;
      const selectedText = selection.toString();

      // Rule 4: Wrap selection with quotes or asterisks
      if (
        hasSelection &&
        (inputChar === '"' || inputChar === "'" || inputChar === "*")
      ) {
        e.preventDefault();
        wrapSelection(range, inputChar, inputChar);
        // Trigger input event manually
        editor.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }

      // For auto-close features, we need to check if there's text after cursor
      const hasTextAfterCursor = checkTextAfterCursor(range);

      // Rule 2: Auto-close quotes
      if ((inputChar === '"' || inputChar === "'") && !hasTextAfterCursor) {
        e.preventDefault();
        insertAutoClosePair(range, inputChar, inputChar);
        editor.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }

      // Rule 3: Auto-close asterisks
      if (inputChar === "*" && !hasTextAfterCursor) {
        e.preventDefault();
        insertAutoClosePair(range, "*", "*");
        editor.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }

      // Rule 1: -- → em-dash
      if (inputChar === "-") {
        const textBefore = getTextBeforeCursor(range, 1);
        if (textBefore === "-") {
          e.preventDefault();
          // Remove the previous dash
          const deleteRange = range.cloneRange();
          deleteRange.setStart(
            range.startContainer,
            Math.max(0, range.startOffset - 1)
          );
          deleteRange.setEnd(range.startContainer, range.startOffset);
          deleteRange.deleteContents();

          // Insert em-dash
          const emDash = document.createTextNode("—");
          range.insertNode(emDash);

          // Move cursor after em-dash
          range.setStartAfter(emDash);
          range.setEndAfter(emDash);
          selection.removeAllRanges();
          selection.addRange(range);

          editor.dispatchEvent(new Event("input", { bubbles: true }));
          return;
        }
      }
    };

    editor.addEventListener("beforeinput", handleBeforeInput);
    return () => editor.removeEventListener("beforeinput", handleBeforeInput);
  }, [editorRef, enabled]);
}

/**
 * Gets text before cursor up to maxLength characters
 */
function getTextBeforeCursor(range: Range, maxLength: number): string {
  const container = range.startContainer;
  const offset = range.startOffset;

  if (container.nodeType === Node.TEXT_NODE) {
    const text = container.textContent || "";
    const start = Math.max(0, offset - maxLength);
    return text.slice(start, offset);
  }

  return "";
}

/**
 * Checks if there's any text immediately after the cursor
 * Returns true if next character is a letter, number, or punctuation
 */
function checkTextAfterCursor(range: Range): boolean {
  const container = range.startContainer;
  const offset = range.startOffset;

  if (container.nodeType === Node.TEXT_NODE) {
    const text = container.textContent || "";
    const nextChar = text.charAt(offset);

    // Consider text exists if next char is not whitespace or empty
    if (nextChar && nextChar.trim() !== "") {
      return true;
    }
  }

  // Check next sibling node
  const nextNode = getNextTextNode(container, offset);
  if (nextNode && nextNode.textContent) {
    const firstChar = nextNode.textContent.charAt(0);
    return firstChar.trim() !== "";
  }

  return false;
}

/**
 * Gets the next text node after current position
 */
function getNextTextNode(node: Node, offset: number): Node | null {
  // If we're in a text node and there's text after offset
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    if (offset < text.length) {
      return node;
    }
  }

  // Try next sibling
  let next: Node | null = node.nextSibling;
  while (next) {
    if (next.nodeType === Node.TEXT_NODE && next.textContent) {
      return next;
    }
    if (next.firstChild) {
      return getNextTextNode(next.firstChild, 0);
    }
    next = next.nextSibling;
  }

  return null;
}

/**
 * Inserts an auto-closing pair and positions cursor between them
 */
function insertAutoClosePair(
  range: Range,
  openChar: string,
  closeChar: string
) {
  const selection = window.getSelection();
  if (!selection) return;

  // Delete any selected content
  range.deleteContents();

  // Create text nodes for opening and closing characters
  const openNode = document.createTextNode(openChar);
  const closeNode = document.createTextNode(closeChar);

  // Insert both nodes
  range.insertNode(closeNode);
  range.insertNode(openNode);

  // Position cursor between them
  range.setStartAfter(openNode);
  range.setEndAfter(openNode);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Wraps selected text with opening and closing characters
 */
function wrapSelection(range: Range, openChar: string, closeChar: string) {
  const selection = window.getSelection();
  if (!selection) return;

  // Extract the selected content
  const selectedContent = range.extractContents();

  // Create wrapper nodes
  const openNode = document.createTextNode(openChar);
  const closeNode = document.createTextNode(closeChar);

  // Create a document fragment to hold everything
  const fragment = document.createDocumentFragment();
  fragment.appendChild(openNode);
  fragment.appendChild(selectedContent);
  fragment.appendChild(closeNode);

  // Insert the wrapped content
  range.insertNode(fragment);

  // Select the wrapped text (excluding the wrapper characters)
  range.setStartAfter(openNode);
  range.setEndBefore(closeNode);
  selection.removeAllRanges();
  selection.addRange(range);
}
