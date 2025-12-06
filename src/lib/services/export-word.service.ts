import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
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

const getFontSize = (sizeValue: string): number => {
  // Convert pt to half-points (Word uses half-points)
  const size = parseInt(sizeValue);
  return size * 2;
};

export async function generateChapterWord(
  chapterNumber: string,
  chapterTitle: string,
  content: string,
  config: ExportConfig
): Promise<Blob> {
  const margins = MARGIN_PRESETS[config.margins];
  const format = PAGE_FORMATS[config.pageFormat];
  const titleFont = getFontFamily(config.titleFont);
  const titleSize = getFontSize(config.titleSize);

  // Split content into paragraphs
  const paragraphs = content.split("\n").filter((p) => p.trim().length > 0 || p === "");

  // Create title paragraph
  const titleParagraph = new Paragraph({
    children: [
      new TextRun({
        text: `Capítulo ${chapterNumber}: ${chapterTitle}`,
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

  // Create content paragraphs
  const contentParagraphs = paragraphs.map(
    (para) =>
      new Paragraph({
        children: [
          new TextRun({
            text: para || " ", // Empty line for spacing
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: {
          line: 360, // 1.5 line spacing
          after: 160, // Space between paragraphs
        },
      })
  );

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
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
