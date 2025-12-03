import type { DialogueFormats, DialogueRange } from "../types/search-types";

/**
 * Detects all dialogue ranges in the text based on enabled formats
 */
export function detectDialogues(
  text: string,
  formats: DialogueFormats
): DialogueRange[] {
  const dialogueRanges: DialogueRange[] = [];

  // 1. Double quotes
  if (formats.doubleQuotes) {
    const regex = /"([^"]*)"/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      dialogueRanges.push({
        start: match.index,
        end: match.index + match[0].length,
        type: "doubleQuotes",
      });
    }
  }

  // 2. Single quotes
  if (formats.singleQuotes) {
    const regex = /'([^']*)'/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      dialogueRanges.push({
        start: match.index,
        end: match.index + match[0].length,
        type: "singleQuotes",
      });
    }
  }

  // 3. Em dash (supports open-ended dialogues)
  if (formats.emDash) {
    const lines = text.split("\n");
    let offset = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if line starts with em dash
      if (/^\s*—/.test(line)) {
        const start = offset;
        let end = offset + line.length;

        // Continue to next lines without em dash until we hit:
        // - A new line with em dash
        // - An empty line
        // - End of text
        let j = i + 1;
        while (
          j < lines.length &&
          !/^\s*—/.test(lines[j]) &&
          lines[j].trim() !== ""
        ) {
          end += lines[j].length + 1; // +1 for \n
          j++;
        }

        dialogueRanges.push({
          start,
          end,
          type: "emDash",
        });
      }

      offset += line.length + 1; // +1 for \n
    }
  }

  // Sort by start position
  return dialogueRanges.sort((a, b) => a.start - b.start);
}

/**
 * Checks if a given position is inside any dialogue range
 */
export function isInsideDialogue(
  position: number,
  dialogueRanges: DialogueRange[]
): boolean {
  return dialogueRanges.some(
    (range) => position >= range.start && position < range.end
  );
}

/**
 * Checks if a range overlaps with any dialogue range
 */
export function isRangeInDialogue(
  start: number,
  end: number,
  dialogueRanges: DialogueRange[]
): boolean {
  return dialogueRanges.some(
    (range) =>
      (start >= range.start && start < range.end) ||
      (end > range.start && end <= range.end) ||
      (start <= range.start && end >= range.end)
  );
}
