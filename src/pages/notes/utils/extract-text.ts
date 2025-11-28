import type { JSONContent } from "@tiptap/react";

/**
 * Extracts plain text from TipTap JSONContent recursively
 */
export function extractTextFromContent(content?: JSONContent): string {
  if (!content) return "";

  let text = "";

  // If this node has text, add it
  if (content.text) {
    text += content.text;
  }

  // Recursively process child nodes
  if (content.content && Array.isArray(content.content)) {
    content.content.forEach((child) => {
      const childText = extractTextFromContent(child);
      if (childText) {
        text += childText;
        // Add space between block-level elements
        if (child.type === "paragraph" || child.type === "heading") {
          text += "\n";
        }
      }
    });
  }

  return text;
}

/**
 * Truncates text to a maximum number of lines
 */
export function truncateToLines(text: string, maxLines: number): {
  text: string;
  isTruncated: boolean;
} {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);

  if (lines.length <= maxLines) {
    return {
      text: lines.join("\n"),
      isTruncated: false,
    };
  }

  return {
    text: lines.slice(0, maxLines).join("\n"),
    isTruncated: true,
  };
}

/**
 * Extracts preview text from note content
 */
export function extractNotePreview(
  content?: JSONContent,
  maxLines: number = 6
): {
  preview: string;
  isTruncated: boolean;
} {
  const fullText = extractTextFromContent(content);
  const { text, isTruncated } = truncateToLines(fullText, maxLines);

  return {
    preview: text || "Empty note",
    isTruncated,
  };
}
