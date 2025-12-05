import { useState, useEffect } from "react";

export interface FormatState {
  bold: boolean;
  italic: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  alignJustify: boolean;
}

/**
 * Hook to detect active formatting states (bold, italic, alignment)
 * Only returns true if the ENTIRE selection has that formatting applied.
 * If selection is mixed (part formatted, part not), returns false.
 */
export function useFormatState(): FormatState {
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
  });

  useEffect(() => {
    const updateFormatState = () => {
      try {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          // No selection, reset all states
          setFormatState({
            bold: false,
            italic: false,
            alignLeft: false,
            alignCenter: false,
            alignRight: false,
            alignJustify: false,
          });
          return;
        }

        // Check if we're inside a contentEditable element
        const range = selection.getRangeAt(0);
        const { anchorNode } = selection;

        if (!anchorNode) {
          setFormatState({
            bold: false,
            italic: false,
            alignLeft: false,
            alignCenter: false,
            alignRight: false,
            alignJustify: false,
          });
          return;
        }

        // Get the element containing the selection
        const element =
          anchorNode.nodeType === Node.TEXT_NODE
            ? anchorNode.parentElement
            : (anchorNode as HTMLElement);

        const contentEditable = element?.closest('[contenteditable="true"]');

        // If we're not inside the editor, reset all formatting
        if (!contentEditable) {
          setFormatState({
            bold: false,
            italic: false,
            alignLeft: false,
            alignCenter: false,
            alignRight: false,
            alignJustify: false,
          });
          return;
        }

        // Check text formatting (bold, italic)
        // queryCommandState returns true only if the entire selection has that formatting
        const bold = document.queryCommandState("bold");
        const italic = document.queryCommandState("italic");

        // Check alignment
        const alignLeft = document.queryCommandState("justifyLeft");
        const alignCenter = document.queryCommandState("justifyCenter");
        const alignRight = document.queryCommandState("justifyRight");
        const alignJustify = document.queryCommandState("justifyFull");

        setFormatState({
          bold,
          italic,
          alignLeft,
          alignCenter,
          alignRight,
          alignJustify,
        });
      } catch (error) {
        // Ignore errors (can happen in some edge cases)
        console.debug("Error checking format state:", error);
      }
    };

    // Update on selection change
    document.addEventListener("selectionchange", updateFormatState);
    // Update on mouse up (after clicking)
    document.addEventListener("mouseup", updateFormatState);
    // Update on key up (after typing/navigating)
    document.addEventListener("keyup", updateFormatState);

    // Initial check
    updateFormatState();

    return () => {
      document.removeEventListener("selectionchange", updateFormatState);
      document.removeEventListener("mouseup", updateFormatState);
      document.removeEventListener("keyup", updateFormatState);
    };
  }, []);

  return formatState;
}
