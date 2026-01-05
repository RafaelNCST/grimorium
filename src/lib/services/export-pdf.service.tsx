import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

import type {
  ExportConfig,
  PageContent,
} from "@/components/modals/export-preview-modal";
import i18n from "@/lib/i18n";

// Interfaces para exportação em lote
export interface BatchExportConfig extends ExportConfig {
  showChapterTitles: boolean;
  pageBreakBetweenChapters: boolean;
  includeTableOfContents: boolean;
  chapterSpacing: number; // Espaçamento entre capítulos quando na mesma página (em pontos)
}

export interface ChapterContent {
  number: number | string;
  title: string;
  content: string;
}

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

function formatChapterTitle(
  format:
    | "number-colon-title"
    | "number-dash-title"
    | "title-only"
    | "number-only",
  chapterNumber: string,
  chapterTitle: string
): string {
  const chapterWord = i18n.t("chapters:export.chapter");

  switch (format) {
    case "number-colon-title":
      return `${chapterWord} ${chapterNumber}: ${chapterTitle}`;
    case "number-dash-title":
      return `${chapterWord} ${chapterNumber} - ${chapterTitle}`;
    case "title-only":
      return chapterTitle;
    case "number-only":
      return `${chapterWord} ${chapterNumber}`;
    default:
      return `${chapterWord} ${chapterNumber}: ${chapterTitle}`;
  }
}

const createStyles = (config: ExportConfig, includeTocStyles = false) => {
  const margins = MARGIN_PRESETS[config.margins];
  const titleFontFamily = getFontFamily(config.titleFont);
  const contentFontFamily = getFontFamily(config.contentFont);

  // Sanitize values to prevent overflow in @react-pdf/renderer
  // Ensure values are valid numbers
  const titleSize = Number.isFinite(config.titleSize) ? config.titleSize : 16;
  const contentSize = Number.isFinite(config.contentSize)
    ? config.contentSize
    : 12;
  const lineSpacing = Number.isFinite(config.contentLineSpacing)
    ? config.contentLineSpacing
    : 1.5;

  // CRITICAL: Very conservative limits to prevent pdfkit overflow errors
  // Max font size: 16pt (safe limit tested with react-pdf/renderer)
  const safeTitleSize = Math.min(Math.max(titleSize, 8), 16);
  const safeContentSize = Math.min(Math.max(contentSize, 8), 16);

  // Max line height: 1.7 (tested safe maximum)
  // Min line height: 1.0 (to prevent overlapping text)
  const clampedLineHeight = Math.min(Math.max(lineSpacing, 1.0), 1.7);

  // Final safety check: ensure fontSize * lineHeight stays within safe bounds
  const safeLineHeight =
    safeContentSize * clampedLineHeight > 27
      ? Math.max(27 / safeContentSize, 1.0)
      : clampedLineHeight;

  const baseStyles = {
    page: {
      paddingTop: margins.top,
      paddingBottom: margins.bottom + 30, // Extra space for page numbers
      paddingLeft: margins.left,
      paddingRight: margins.right,
      fontFamily: contentFontFamily,
      fontSize: safeContentSize,
      lineHeight: safeLineHeight,
    },
    title: {
      fontFamily: titleFontFamily,
      fontSize: safeTitleSize,
      fontWeight: config.titleBold ? "bold" : "normal",
      textAlign: config.titleAlignment,
      marginBottom: config.titleSpacing,
    },
    paragraph: {
      fontFamily: contentFontFamily,
      fontSize: safeContentSize,
      lineHeight: safeLineHeight,
      textAlign: config.contentAlignment,
      marginBottom: 0,
    },
    emptyLine: {
      fontFamily: contentFontFamily,
      fontSize: safeContentSize,
      lineHeight: safeLineHeight,
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
  };

  // Adicionar estilos de sumário se necessário
  if (includeTocStyles) {
    return StyleSheet.create({
      ...baseStyles,
      tocTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
      },
      tocItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        fontSize: 12,
      },
      tocPageNum: {
        color: "#666666",
      },
    });
  }

  return StyleSheet.create(baseStyles);
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
          {formatChapterTitle(config.titleFormat, chapterNumber, chapterTitle)}
        </Text>

        {/* Content - render each line separately to match editor behavior */}
        {lines.map((line, index) => (
          <Text
            key={`line-${index}`}
            style={
              line.trim().length === 0 ? styles.emptyLine : styles.paragraph
            }
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

// Componente para exportação em lote de capítulos
interface BatchChaptersPDFProps {
  chapters: ChapterContent[];
  config: BatchExportConfig;
}

// eslint-disable-next-line react-refresh/only-export-components
const BatchChaptersPDF = ({ chapters, config }: BatchChaptersPDFProps) => {
  const styles = createStyles(config, config.includeTableOfContents);

  return (
    <Document>
      {/* Sumário opcional */}
      {config.includeTableOfContents && (
        <Page
          size={config.pageFormat.toUpperCase() as "A4" | "LETTER"}
          style={styles.page}
        >
          <Text style={styles.tocTitle}>
            {i18n.t("chapters:export.tableOfContents")}
          </Text>
          {chapters.map((ch, index) => (
            <View key={`toc-${index}`} style={styles.tocItem}>
              <Text>
                {formatChapterTitle(
                  config.titleFormat,
                  String(ch.number ?? index + 1),
                  ch.title ?? "Sem título"
                )}
              </Text>
            </View>
          ))}

          {/* Números de página no sumário */}
          {config.showPageNumbers && (
            <Text
              style={styles.pageNumber}
              render={({ pageNumber }) => `${pageNumber}`}
              fixed
            />
          )}
        </Page>
      )}

      {/* Capítulos */}
      {config.pageBreakBetweenChapters ? (
        // Cada capítulo em sua própria página
        chapters.map((chapter, chapterIndex) => {
          const lines = chapter.content.split("\n");

          return (
            <Page
              key={`chapter-${chapterIndex}`}
              size={config.pageFormat.toUpperCase() as "A4" | "LETTER"}
              style={styles.page}
            >
              {/* Título do capítulo */}
              {config.showChapterTitles && (
                <Text style={styles.title}>
                  {formatChapterTitle(
                    config.titleFormat,
                    String(chapter.number ?? chapterIndex + 1),
                    chapter.title ?? "Sem título"
                  )}
                </Text>
              )}

              {/* Conteúdo do capítulo */}
              {lines.map((line, lineIndex) => (
                <Text
                  key={`line-${chapterIndex}-${lineIndex}`}
                  style={
                    line.trim().length === 0
                      ? styles.emptyLine
                      : styles.paragraph
                  }
                >
                  {line.trim().length === 0 ? " " : line}
                </Text>
              ))}

              {/* Números de página */}
              {config.showPageNumbers && (
                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber }) => `${pageNumber}`}
                  fixed
                />
              )}
            </Page>
          );
        })
      ) : (
        // Todos os capítulos em páginas contínuas (sem quebra forçada)
        <Page
          size={config.pageFormat.toUpperCase() as "A4" | "LETTER"}
          style={styles.page}
        >
          {chapters.map((chapter, chapterIndex) => {
            const lines = chapter.content.split("\n");
            const isLastChapter = chapterIndex === chapters.length - 1;

            return (
              <View
                key={`chapter-${chapterIndex}`}
                style={{
                  marginBottom: isLastChapter ? 0 : config.chapterSpacing,
                }}
              >
                {/* Título do capítulo */}
                {config.showChapterTitles && (
                  <Text style={styles.title}>
                    {formatChapterTitle(
                      config.titleFormat,
                      String(chapter.number ?? chapterIndex + 1),
                      chapter.title ?? "Sem título"
                    )}
                  </Text>
                )}

                {/* Conteúdo do capítulo */}
                {lines.map((line, lineIndex) => (
                  <Text
                    key={`line-${chapterIndex}-${lineIndex}`}
                    style={
                      line.trim().length === 0
                        ? styles.emptyLine
                        : styles.paragraph
                    }
                  >
                    {line.trim().length === 0 ? " " : line}
                  </Text>
                ))}
              </View>
            );
          })}

          {/* Números de página */}
          {config.showPageNumbers && (
            <Text
              style={styles.pageNumber}
              render={({ pageNumber }) => `${pageNumber}`}
              fixed
            />
          )}
        </Page>
      )}
    </Document>
  );
};

export async function generateBatchChaptersPDF(
  chapters: ChapterContent[],
  config: BatchExportConfig
): Promise<Blob> {
  const doc = <BatchChaptersPDF chapters={chapters} config={config} />;

  const blob = await pdf(doc).toBlob();
  return blob;
}
