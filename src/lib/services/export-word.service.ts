import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
  LineRuleType,
  PageOrientation,
} from "docx";

import type { ExportConfig } from "@/components/modals/export-preview-modal";

// Page format dimensions in twips (1 inch = 1440 twips)
const PAGE_FORMATS = {
  a4: { width: convertInchesToTwip(8.27), height: convertInchesToTwip(11.69) }, // 210mm x 297mm
  letter: { width: convertInchesToTwip(8.5), height: convertInchesToTwip(11) },
} as const;

// Margin presets in twips
const MARGIN_PRESETS = {
  editorial: {
    top: convertInchesToTwip(1),
    bottom: convertInchesToTwip(0.8),
    left: convertInchesToTwip(1.2),
    right: convertInchesToTwip(1.2),
  },
  narrow: {
    top: convertInchesToTwip(0.5),
    bottom: convertInchesToTwip(0.5),
    left: convertInchesToTwip(0.5),
    right: convertInchesToTwip(0.5),
  },
  wide: {
    top: convertInchesToTwip(1),
    bottom: convertInchesToTwip(1),
    left: convertInchesToTwip(1.5),
    right: convertInchesToTwip(1.5),
  },
} as const;

const getFontFamily = (fontValue: string): string => {
  const fontMap: Record<string, string> = {
    Inter: "Calibri", // Inter não disponível no Word, usa Calibri como fallback
    "Times New Roman": "Times New Roman",
    "Courier New": "Courier New",
    Arial: "Arial",
    "sans-serif": "Calibri",
  };
  return fontMap[fontValue] || "Times New Roman";
};

const getFontSize = (sizeValue: number): number => {
  // Convert pt to half-points (Word uses half-points)
  return sizeValue * 2;
};

const getLineSpacing = (lineSpacing: number): number => {
  // Word uses a value where 240 = single spacing (1.0)
  // So we multiply by 240 to get the correct value
  return Math.round(lineSpacing * 240);
};

function formatChapterTitle(
  format: "number-colon-title" | "number-dash-title" | "title-only" | "number-only",
  chapterNumber: string,
  chapterTitle: string
): string {
  switch (format) {
    case "number-colon-title":
      return `Capítulo ${chapterNumber}: ${chapterTitle}`;
    case "number-dash-title":
      return `Capítulo ${chapterNumber} - ${chapterTitle}`;
    case "title-only":
      return chapterTitle;
    case "number-only":
      return `Capítulo ${chapterNumber}`;
    default:
      return `Capítulo ${chapterNumber}: ${chapterTitle}`;
  }
}

export async function generateChapterWord(
  chapterNumber: string,
  chapterTitle: string,
  content: string,
  config: ExportConfig
): Promise<Blob> {
  const margins = MARGIN_PRESETS[config.margins];
  const titleFont = getFontFamily(config.titleFont);
  const titleSize = getFontSize(config.titleSize);
  const contentFont = getFontFamily(config.contentFont);
  const contentSize = getFontSize(config.contentSize);
  const lineSpacing = getLineSpacing(config.contentLineSpacing);

  // Map text alignment to Word alignment
  const getWordAlignment = (
    align: "left" | "center" | "right" | "justify"
  ): AlignmentType => {
    const alignmentMap: Record<string, AlignmentType> = {
      left: AlignmentType.LEFT,
      center: AlignmentType.CENTER,
      right: AlignmentType.RIGHT,
      justify: AlignmentType.JUSTIFIED,
    };
    return alignmentMap[align] || AlignmentType.LEFT;
  };

  // Split content into lines - each \n is a new line
  const lines = content.split("\n");

  // Create title paragraph
  const titleParagraph = new Paragraph({
    children: [
      new TextRun({
        text: formatChapterTitle(config.titleFormat, chapterNumber, chapterTitle),
        font: titleFont,
        size: titleSize,
        bold: config.titleBold,
      }),
    ],
    alignment:
      config.titleAlignment === "center"
        ? AlignmentType.CENTER
        : AlignmentType.LEFT,
    spacing: {
      after: 400, // Space after title
    },
  });

  // Create content paragraphs - each line becomes a paragraph with no extra spacing
  const contentParagraphs = lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line.trim().length === 0 ? " " : line,
            font: contentFont,
            size: contentSize,
          }),
        ],
        alignment: getWordAlignment(config.contentAlignment),
        spacing: {
          line: lineSpacing,
          lineRule: LineRuleType.AUTO, // Auto-adjust based on font size
          after: 0, // No extra space - spacing comes from line height only
        },
      })
  );

  // Get page dimensions based on format
  const pageFormat = PAGE_FORMATS[config.pageFormat];

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageFormat.width,
              height: pageFormat.height,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: margins.top,
              bottom: margins.bottom,
              left: margins.left,
              right: margins.right,
            },
          },
        },
        children: [titleParagraph, ...contentParagraphs],
      },
    ],
  });

  // Generate blob
  const { Packer } = await import("docx");
  const blob = await Packer.toBlob(doc);

  return blob;
}
