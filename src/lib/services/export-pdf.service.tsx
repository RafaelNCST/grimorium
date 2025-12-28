import { Document, Page, Text, StyleSheet, pdf } from "@react-pdf/renderer";

import type {
  ExportConfig,
  PageContent,
} from "@/components/modals/export-preview-modal";

// Page format dimensions in points (PDF uses points: 1 inch = 72 points)
const PAGE_FORMATS = {
  a4: { width: 595, height: 842 }, // 210mm x 297mm
  letter: { width: 612, height: 792 }, // 8.5" x 11"
} as const;

// Margin presets in points
const MARGIN_PRESETS = {
  editorial: { top: 71, bottom: 57, left: 85, right: 85 },
  narrow: { top: 36, bottom: 36, left: 36, right: 36 },
  wide: { top: 71, bottom: 71, left: 106, right: 106 },
} as const;

const getFontFamily = (fontValue: string): string => {
  const fontMap: Record<string, string> = {
    Inter: "Helvetica", // Inter não disponível no PDF, usa Helvetica como fallback
    "Times New Roman": "Times-Roman",
    "Courier New": "Courier",
    Arial: "Helvetica",
    "sans-serif": "Helvetica",
  };
  return fontMap[fontValue] || "Times-Roman";
};

const createStyles = (config: ExportConfig) => {
  const margins = MARGIN_PRESETS[config.margins];
  const titleFontFamily = getFontFamily(config.titleFont);
  const contentFontFamily = getFontFamily(config.contentFont);

  return StyleSheet.create({
    page: {
      paddingTop: margins.top,
      paddingBottom: margins.bottom + 30, // Extra space for page numbers
      paddingLeft: margins.left,
      paddingRight: margins.right,
      fontFamily: contentFontFamily,
      fontSize: config.contentSize,
      lineHeight: config.contentLineSpacing,
    },
    title: {
      fontFamily: titleFontFamily,
      fontSize: config.titleSize,
      fontWeight: config.titleBold ? "bold" : "normal",
      textAlign: config.titleAlignment,
      marginBottom: 40,
    },
    paragraph: {
      fontFamily: contentFontFamily,
      fontSize: config.contentSize,
      lineHeight: config.contentLineSpacing,
      textAlign: config.contentAlignment,
      marginBottom: 0,
    },
    emptyLine: {
      fontFamily: contentFontFamily,
      fontSize: config.contentSize,
      lineHeight: config.contentLineSpacing,
      marginBottom: 0,
    },
    pageNumber: {
      position: "absolute",
      bottom: 20,
      left: margins.left,
      right: margins.right,
      textAlign: config.pageNumberPosition,
      fontSize: 10,
      color: "#666666",
    },
  });
};

interface ChapterPDFProps {
  chapterNumber: string;
  chapterTitle: string;
  content: string;
  config: ExportConfig;
}

// eslint-disable-next-line react-refresh/only-export-components
const ChapterPDF = ({
  chapterNumber,
  chapterTitle,
  content,
  config,
}: ChapterPDFProps) => {
  const styles = createStyles(config);

  // Split content into paragraphs - each \n is a new line
  const lines = content.split("\n");

  return (
    <Document>
      <Page
        size={config.pageFormat.toUpperCase() as "A4" | "LETTER"}
        style={styles.page}
      >
        {/* Title - only on first page */}
        <Text style={styles.title}>
          Capítulo {chapterNumber}: {chapterTitle}
        </Text>

        {/* Content - render each line separately to match editor behavior */}
        {lines.map((line, index) => (
          <Text
            key={`line-${index}`}
            style={line.trim().length === 0 ? styles.emptyLine : styles.paragraph}
          >
            {line.trim().length === 0 ? " " : line}
          </Text>
        ))}

        {/* Page number - will be rendered on all pages automatically */}
        {config.showPageNumbers && (
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
        )}
      </Page>
    </Document>
  );
};

export async function generateChapterPDF(
  chapterNumber: string,
  chapterTitle: string,
  content: string,
  config: ExportConfig,
  _pages: PageContent[]
): Promise<Blob> {
  const doc = (
    <ChapterPDF
      chapterNumber={chapterNumber}
      chapterTitle={chapterTitle}
      content={content}
      config={config}
    />
  );

  const blob = await pdf(doc).toBlob();
  return blob;
}
