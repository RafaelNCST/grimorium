import { useState, useMemo, useEffect, useCallback } from "react";

import { FileText, FileDown, Loader2, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ExportConfig } from "./export-preview-modal";
import {
  generateBatchChaptersPDF,
  type BatchExportConfig,
  type ChapterContent,
} from "@/lib/services/export-pdf.service";
import { generateBatchChaptersWord } from "@/lib/services/export-word.service";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PAGE_FORMATS = {
  a4: { width: 794, height: 1123, label: "A4 (21 x 29.7 cm)" },
  letter: { width: 816, height: 1056, label: "US Letter (21.6 x 27.9 cm)" },
} as const;

const MARGIN_PRESETS = {
  editorial: {
    top: 95,
    bottom: 76,
    left: 113,
    right: 113,
  },
  narrow: { top: 48, bottom: 48, left: 48, right: 48 },
  wide: { top: 95, bottom: 95, left: 142, right: 142 },
} as const;

const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Arial", label: "Arial" },
  { value: "sans-serif", label: "Sans Serif" },
] as const;

const TITLE_SIZE_RANGE = { min: 14, max: 28, default: 24 };
const CONTENT_SIZE_RANGE = { min: 8, max: 24, default: 12 };
const LINE_SPACING_RANGE = { min: 1.0, max: 2.5, default: 2.0 };
const MAX_BATCH_CHAPTERS = 50;

interface BatchExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  chapters: Array<{
    id: string;
    number: number;
    title: string;
    wordCount: number;
    characterCount: number;
  }>;
  initialContentFont?: string;
  initialContentSize?: number;
  initialContentLineSpacing?: number;
}

export function BatchExportModal({
  open,
  onOpenChange,
  bookId,
  chapters,
  initialContentFont,
  initialContentSize,
  initialContentLineSpacing,
}: BatchExportModalProps) {
  const { t } = useTranslation("chapters");

  // Range selection
  const [fromChapter, setFromChapter] = useState<number>(chapters[0]?.number || 1);
  const [toChapter, setToChapter] = useState<number>(
    chapters[chapters.length - 1]?.number || 1
  );

  // Batch options
  const [showChapterTitles, setShowChapterTitles] = useState(true);
  const [pageBreakBetween, setPageBreakBetween] = useState(true);
  const [includeToc, setIncludeToc] = useState(false);
  const [includeEmptyChapters, setIncludeEmptyChapters] = useState(false);
  const [chapterSpacing, setChapterSpacing] = useState(60); // Espaçamento entre capítulos em pontos

  // Export config (from ExportPreviewModal)
  const [config, setConfig] = useState<ExportConfig>({
    pageFormat: "a4",
    margins: "editorial",
    titleFormat: "number-colon-title",
    titleFont: "Inter",
    titleSize: TITLE_SIZE_RANGE.default,
    titleAlignment: "center",
    titleBold: true,
    titleSpacing: 40,
    showPageNumbers: true,
    pageNumberPosition: "center",
    contentFont: initialContentFont || "Times New Roman",
    contentSize: initialContentSize || CONTENT_SIZE_RANGE.default,
    contentLineSpacing: initialContentLineSpacing || LINE_SPACING_RANGE.default,
    contentAlignment: "left",
  });

  // Preview states
  const [loadedChapters, setLoadedChapters] = useState<ChapterContent[]>([]);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showEmptyChaptersModal, setShowEmptyChaptersModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Validate range
  const isValidRange = useMemo(() => {
    return toChapter >= fromChapter;
  }, [fromChapter, toChapter]);

  // Get selected chapters
  const selectedChapters = useMemo(() => {
    if (!isValidRange) return [];
    return chapters.filter(
      (ch) => ch.number >= fromChapter && ch.number <= toChapter
    );
  }, [fromChapter, toChapter, chapters, isValidRange]);

  // Calculate statistics
  const totalWords = useMemo(() => {
    return selectedChapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);
  }, [selectedChapters]);

  const estimatedPages = useMemo(() => {
    const wordsPerPage = config.contentSize <= 12 ? 250 : 200;
    return Math.ceil(totalWords / wordsPerPage);
  }, [totalWords, config.contentSize]);

  const tooManyChapters = selectedChapters.length > MAX_BATCH_CHAPTERS;

  // Detect empty chapters
  const emptyChapters = useMemo(() => {
    return loadedChapters.filter((ch) => !ch.content || ch.content.trim() === "");
  }, [loadedChapters]);

  // Filter chapters for export (exclude empty if option is disabled)
  const chaptersToExport = useMemo(() => {
    if (includeEmptyChapters) {
      return loadedChapters;
    }
    return loadedChapters.filter((ch) => ch.content && ch.content.trim() !== "");
  }, [loadedChapters, includeEmptyChapters]);

  // Config change handler
  const handleConfigChange = useCallback(
    (key: keyof ExportConfig, value: any) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Load chapters content and generate preview
  useEffect(() => {
    if (!open || !isValidRange || selectedChapters.length === 0) {
      return;
    }

    const loadChaptersContent = async () => {
      setIsGeneratingPreview(true);
      setLoadingProgress({ current: 0, total: selectedChapters.length });

      const contents: ChapterContent[] = [];

      for (let i = 0; i < selectedChapters.length; i++) {
        setLoadingProgress({ current: i + 1, total: selectedChapters.length });
        const { getChapterById } = await import("@/lib/db/chapters.service");
        const chapter = await getChapterById(selectedChapters[i].id);

        contents.push({
          number: chapter.number ?? selectedChapters[i].number,
          title: chapter.title || "Sem título",
          content: chapter.content || "",
        });
      }

      setLoadedChapters(contents);

      // Generate preview
      try {
        // Filter out empty chapters if option is disabled
        const filteredContents = includeEmptyChapters
          ? contents
          : contents.filter((ch) => ch.content && ch.content.trim() !== "");

        const batchConfig: BatchExportConfig = {
          ...config,
          showChapterTitles,
          pageBreakBetweenChapters: pageBreakBetween,
          includeTableOfContents: includeToc,
          chapterSpacing,
        };

        const blob = await generateBatchChaptersPDF(filteredContents, batchConfig);

        // Cleanup old URL
        if (pdfPreviewUrl) {
          URL.revokeObjectURL(pdfPreviewUrl);
        }

        const url = URL.createObjectURL(blob);
        setPdfPreviewUrl(url);
        setPreviewError(null);
      } catch (error) {
        console.error("Error generating preview:", error);
        setPreviewError(error instanceof Error ? error.message : "Erro ao gerar preview");
      } finally {
        setIsGeneratingPreview(false);
      }
    };

    const timeoutId = setTimeout(loadChaptersContent, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    fromChapter,
    toChapter,
    config,
    showChapterTitles,
    pageBreakBetween,
    includeToc,
    includeEmptyChapters,
    isValidRange,
    chapterSpacing,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  // Reset states when modal opens
  useEffect(() => {
    if (open) {
      setFromChapter(chapters[0]?.number || 1);
      setToChapter(chapters[chapters.length - 1]?.number || 1);
    }
  }, [open, chapters]);

  const handleExportPDF = async () => {
    if (!isValidRange || loadedChapters.length === 0) return;

    setIsExporting(true);
    try {
      const batchConfig: BatchExportConfig = {
        ...config,
        showChapterTitles,
        pageBreakBetweenChapters: pageBreakBetween,
        includeTableOfContents: includeToc,
        chapterSpacing,
      };

      const blob = await generateBatchChaptersPDF(chaptersToExport, batchConfig);
      const uint8Array = new Uint8Array(await blob.arrayBuffer());

      const fileName = `Capitulos_${fromChapter}_a_${toChapter}.pdf`;
      const filePath = await save({
        defaultPath: fileName,
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });

      if (filePath) {
        await writeFile(filePath, uint8Array);

        // Close export modal
        onOpenChange(false);

        // Show success feedback
        setFeedbackType("success");
        setFeedbackMessage(t("feedback.pdfExportSuccess"));
        setShowFeedback(true);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);

      // Show error feedback
      setFeedbackType("error");
      setFeedbackMessage(
        error instanceof Error ? error.message : "Erro ao exportar PDF"
      );
      setShowFeedback(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    if (!isValidRange || loadedChapters.length === 0) return;

    setIsExporting(true);
    try {
      const batchConfig: BatchExportConfig = {
        ...config,
        showChapterTitles,
        pageBreakBetweenChapters: pageBreakBetween,
        includeTableOfContents: includeToc,
        chapterSpacing,
      };

      const blob = await generateBatchChaptersWord(chaptersToExport, batchConfig);
      const uint8Array = new Uint8Array(await blob.arrayBuffer());

      const fileName = `Capitulos_${fromChapter}_a_${toChapter}.docx`;
      const filePath = await save({
        defaultPath: fileName,
        filters: [{ name: "Word", extensions: ["docx"] }],
      });

      if (filePath) {
        await writeFile(filePath, uint8Array);

        // Close export modal
        onOpenChange(false);

        // Show success feedback
        setFeedbackType("success");
        setFeedbackMessage(t("feedback.wordExportSuccess"));
        setShowFeedback(true);
      }
    } catch (error) {
      console.error("Error exporting Word:", error);

      // Show error feedback
      setFeedbackType("error");
      setFeedbackMessage(
        error instanceof Error ? error.message : "Erro ao exportar Word"
      );
      setShowFeedback(true);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1400px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t("batchExport.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Settings Panel - Left */}
          <div className="w-80 flex-shrink-0 overflow-y-auto space-y-6 px-6 border-r">
            <div className="space-y-6 py-2">
              {/* Warnings - Moved to top */}
              {(tooManyChapters || emptyChapters.length > 0) && (
                <>
                  {tooManyChapters && (
                    <Alert className="border-destructive/50 text-destructive">
                      <Info className="h-4 w-4 !text-destructive" />
                      <AlertDescription>
                        {t("batchExport.tooManyChapters", { max: MAX_BATCH_CHAPTERS })}
                      </AlertDescription>
                    </Alert>
                  )}

                  {emptyChapters.length > 0 && (
                    <Alert className="border-destructive/50 text-destructive">
                      <AlertTriangle className="h-4 w-4 !text-destructive" />
                      <AlertDescription>
                        {emptyChapters.length <= 3 ? (
                          <>
                            {t("batchExport.emptyChapters", {
                              chapters: emptyChapters.map((ch) => `Cap ${ch.number}`).join(", "),
                            })}
                            {!includeEmptyChapters && (
                              <div className="mt-1 text-xs">
                                {t("batchExport.emptyChaptersWillBeExcluded")}
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            <div>
                              {t("batchExport.emptyChaptersCount", { count: emptyChapters.length })}{" "}
                              <button
                                onClick={() => setShowEmptyChaptersModal(true)}
                                className="underline font-medium hover:text-destructive/80"
                              >
                                {t("batchExport.emptyChaptersViewList")}
                              </button>
                            </div>
                            {!includeEmptyChapters && (
                              <div className="mt-1 text-xs">
                                {t("batchExport.emptyChaptersWillBeExcluded")}
                              </div>
                            )}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Separator />
                </>
              )}

              {/* Range Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t("batchExport.options")}
                </Label>

                <div className="space-y-2">
                  <Label>{t("batchExport.fromChapter")}</Label>
                  <Select
                    value={fromChapter.toString()}
                    onValueChange={(value) => setFromChapter(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((ch) => (
                        <SelectItem key={ch.id} value={ch.number.toString()}>
                          Cap {ch.number}: {ch.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("batchExport.toChapter")}</Label>
                  <Select
                    value={toChapter.toString()}
                    onValueChange={(value) => setToChapter(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((ch) => (
                        <SelectItem key={ch.id} value={ch.number.toString()}>
                          Cap {ch.number}: {ch.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Validation */}
                {isValidRange && selectedChapters.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedChapters.length} {t("batchExport.selectedCount", { count: selectedChapters.length })} • {totalWords.toLocaleString()} {t("batchExport.totalWords", { count: totalWords })}
                  </div>
                )}
                {!isValidRange && (
                  <div className="text-sm text-destructive">
                    {t("batchExport.invalidRange")}
                  </div>
                )}
              </div>

              <Separator />

              {/* Structure Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showTitles"
                    checked={showChapterTitles}
                    onCheckedChange={(checked) =>
                      setShowChapterTitles(checked as boolean)
                    }
                  />
                  <Label htmlFor="showTitles" className="cursor-pointer">
                    {t("batchExport.showTitles")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pageBreak"
                    checked={pageBreakBetween}
                    onCheckedChange={(checked) =>
                      setPageBreakBetween(checked as boolean)
                    }
                  />
                  <Label htmlFor="pageBreak" className="cursor-pointer">
                    {t("batchExport.pageBreakBetween")}
                  </Label>
                </div>

                {/* Espaçamento entre capítulos (só aparece quando não há quebra de página) */}
                {!pageBreakBetween && (
                  <div className="space-y-2 ml-6 mt-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">
                        {t("batchExport.chapterSpacing")}
                      </Label>
                      <span className="text-sm font-medium text-primary">
                        {chapterSpacing}pt
                      </span>
                    </div>
                    <Slider
                      value={[chapterSpacing]}
                      onValueChange={([value]) => setChapterSpacing(value)}
                      min={20}
                      max={120}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>20pt</span>
                      <span>60pt (padrão)</span>
                      <span>120pt</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeToc"
                    checked={includeToc}
                    onCheckedChange={(checked) =>
                      setIncludeToc(checked as boolean)
                    }
                  />
                  <Label htmlFor="includeToc" className="cursor-pointer">
                    {t("batchExport.includeToc")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeEmpty"
                    checked={includeEmptyChapters}
                    onCheckedChange={(checked) =>
                      setIncludeEmptyChapters(checked as boolean)
                    }
                  />
                  <Label htmlFor="includeEmpty" className="cursor-pointer">
                    {t("batchExport.includeEmptyChapters")}
                  </Label>
                </div>
              </div>

              <Separator />

              {/* Export Settings - Same as ExportPreviewModal */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("singleExport.pageFormat")}</Label>
                <RadioGroup
                  value={config.pageFormat}
                  onValueChange={(value) =>
                    handleConfigChange("pageFormat", value as "a4" | "letter")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a4" id="a4" />
                    <Label htmlFor="a4" className="cursor-pointer">
                      {PAGE_FORMATS.a4.label}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="letter" id="letter" />
                    <Label htmlFor="letter" className="cursor-pointer">
                      {PAGE_FORMATS.letter.label}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("singleExport.margins")}</Label>
                <Select
                  value={config.margins}
                  onValueChange={(value) =>
                    handleConfigChange("margins", value as keyof typeof MARGIN_PRESETS)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editorial">{t("singleExport.marginsEditorial")}</SelectItem>
                    <SelectItem value="narrow">{t("singleExport.marginsNarrow")}</SelectItem>
                    <SelectItem value="wide">{t("singleExport.marginsWide")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  {t("singleExport.titleSettings")}
                </Label>

                <div className="space-y-2">
                  <Label>{t("singleExport.titleFormat")}</Label>
                  <Select
                    value={config.titleFormat}
                    onValueChange={(value) =>
                      handleConfigChange(
                        "titleFormat",
                        value as "number-colon-title" | "number-dash-title" | "title-only" | "number-only"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number-colon-title">
                        {t("singleExport.titleFormatNumberColon")}
                      </SelectItem>
                      <SelectItem value="number-dash-title">
                        {t("singleExport.titleFormatNumberDash")}
                      </SelectItem>
                      <SelectItem value="title-only">{t("singleExport.titleFormatTitleOnly")}</SelectItem>
                      <SelectItem value="number-only">{t("singleExport.titleFormatNumberOnly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("singleExport.font")}</Label>
                  <Select
                    value={config.titleFont}
                    onValueChange={(value) => handleConfigChange("titleFont", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t("singleExport.size")}</Label>
                    <span className="text-sm font-medium text-primary">
                      {config.titleSize}pt
                    </span>
                  </div>
                  <Slider
                    value={[config.titleSize]}
                    onValueChange={(value) => handleConfigChange("titleSize", value[0])}
                    min={TITLE_SIZE_RANGE.min}
                    max={TITLE_SIZE_RANGE.max}
                    step={2}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{TITLE_SIZE_RANGE.min}pt</span>
                    <span>{TITLE_SIZE_RANGE.default}pt (padrão)</span>
                    <span>{TITLE_SIZE_RANGE.max}pt</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("singleExport.alignment")}</Label>
                  <RadioGroup
                    value={config.titleAlignment}
                    onValueChange={(value) =>
                      handleConfigChange("titleAlignment", value as "left" | "center")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="title-left" />
                      <Label htmlFor="title-left" className="cursor-pointer">
                        {t("singleExport.alignmentLeft")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="center" id="title-center" />
                      <Label htmlFor="title-center" className="cursor-pointer">
                        {t("singleExport.alignmentCenter")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="titleBold"
                    checked={config.titleBold}
                    onCheckedChange={(checked) =>
                      handleConfigChange("titleBold", checked as boolean)
                    }
                  />
                  <Label htmlFor="titleBold" className="cursor-pointer">
                    {t("singleExport.bold")}
                  </Label>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t("singleExport.titleSpacing")}</Label>
                    <span className="text-sm font-medium text-primary">
                      {config.titleSpacing}pt
                    </span>
                  </div>
                  <Slider
                    value={[config.titleSpacing]}
                    onValueChange={(value) => handleConfigChange("titleSpacing", value[0])}
                    min={20}
                    max={80}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>20pt</span>
                    <span>40pt (padrão)</span>
                    <span>80pt</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  {t("singleExport.contentSettings")}
                </Label>

                <div className="space-y-2">
                  <Label>{t("singleExport.font")}</Label>
                  <Select
                    value={config.contentFont}
                    onValueChange={(value) => handleConfigChange("contentFont", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t("singleExport.size")}</Label>
                    <span className="text-sm font-medium text-primary">
                      {config.contentSize}pt
                    </span>
                  </div>
                  <Slider
                    value={[config.contentSize]}
                    onValueChange={(value) => handleConfigChange("contentSize", value[0])}
                    min={CONTENT_SIZE_RANGE.min}
                    max={CONTENT_SIZE_RANGE.max}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{CONTENT_SIZE_RANGE.min}pt</span>
                    <span>{CONTENT_SIZE_RANGE.default}pt (padrão)</span>
                    <span>{CONTENT_SIZE_RANGE.max}pt</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t("singleExport.lineSpacing")}</Label>
                    <span className="text-sm font-medium text-primary">
                      {config.contentLineSpacing.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[config.contentLineSpacing]}
                    onValueChange={(value) =>
                      handleConfigChange("contentLineSpacing", value[0])
                    }
                    min={LINE_SPACING_RANGE.min}
                    max={LINE_SPACING_RANGE.max}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1.0 (simples)</span>
                    <span>1.5</span>
                    <span>2.0 (duplo)</span>
                    <span>2.5</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("singleExport.alignment")}</Label>
                  <RadioGroup
                    value={config.contentAlignment}
                    onValueChange={(value) =>
                      handleConfigChange(
                        "contentAlignment",
                        value as "left" | "center" | "right" | "justify"
                      )
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="content-left" />
                      <Label htmlFor="content-left" className="cursor-pointer">
                        {t("singleExport.alignmentLeft")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="center" id="content-center" />
                      <Label htmlFor="content-center" className="cursor-pointer">
                        {t("singleExport.alignmentCenter")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="content-right" />
                      <Label htmlFor="content-right" className="cursor-pointer">
                        {t("singleExport.alignmentRight")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="justify" id="content-justify" />
                      <Label htmlFor="content-justify" className="cursor-pointer">
                        {t("singleExport.alignmentJustify")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel - Right */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden px-6">
            {isGeneratingPreview && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm mb-2">{t("batchExport.generatingPreview")}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("batchExport.loadingChapter", {
                    current: loadingProgress.current,
                    total: loadingProgress.total,
                  })}
                </p>
                <Progress
                  value={(loadingProgress.current / loadingProgress.total) * 100}
                  className="w-64"
                />
              </div>
            )}

            {!isGeneratingPreview && previewError && (
              <div className="flex flex-col items-center justify-center h-full">
                <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                <p className="text-sm font-medium mb-2">{t("batchExport.errorGeneratingPreview")}</p>
                <p className="text-xs text-muted-foreground">{previewError}</p>
              </div>
            )}

            {!isGeneratingPreview && !previewError && pdfPreviewUrl && (
              <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start">
                <div className="relative flex-shrink-0" style={{ width: "597px" }}>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="text-sm font-medium text-center">
                      {numPages > 0
                        ? t("batchExport.previewPages", {
                            shown: Math.min(10, numPages),
                            total: numPages,
                          })
                        : t("batchExport.loadingPreview")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <Document
                      file={pdfPreviewUrl}
                      onLoadSuccess={({ numPages: loadedPages }) => {
                        setNumPages(loadedPages);
                      }}
                      onLoadError={(error) => {
                        console.error("Error loading PDF:", error);
                        setPreviewError(`${t("batchExport.errorGeneratingPreview")}: ${error.message}`);
                      }}
                      loading={
                        <div className="flex flex-col items-center gap-4 justify-center py-20">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            {t("batchExport.loadingPDF")}
                          </p>
                        </div>
                      }
                    >
                      {numPages > 0 &&
                        Array.from(new Array(Math.min(10, numPages)), (_, index) => (
                          <div key={`page_${index + 1}`} className="flex flex-col gap-2">
                            <div className="shadow-xl bg-white border border-border">
                              <Page
                                pageNumber={index + 1}
                                scale={1.0}
                                loading={
                                  <div
                                    className="flex items-center justify-center p-8 bg-white"
                                    style={{
                                      width: `${PAGE_FORMATS[config.pageFormat].width}px`,
                                      height: `${PAGE_FORMATS[config.pageFormat].height}px`,
                                    }}
                                  >
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                  </div>
                                }
                              />
                            </div>
                            <div className="text-center text-xs text-muted-foreground">
                              {t("singleExport.page")} {index + 1} {t("singleExport.of")} {numPages}
                            </div>
                          </div>
                        ))}
                    </Document>
                    {numPages > 10 && (
                      <div className="mt-4 p-3 bg-muted rounded-md text-center text-sm">
                        {t("batchExport.additionalPages", { count: numPages - 10 })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isGeneratingPreview && !previewError && !pdfPreviewUrl && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Info className="w-12 h-12 mb-4" />
                <p className="text-sm">{t("batchExport.selectChapters")}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("batchExport.cancel")}
          </Button>
          <Button
            variant="magical"
            onClick={handleExportWord}
            disabled={!isValidRange || isExporting || loadedChapters.length === 0}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            {t("batchExport.exportWord")}
          </Button>
          <Button
            variant="magical"
            onClick={handleExportPDF}
            disabled={!isValidRange || isExporting || loadedChapters.length === 0}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}
            {t("batchExport.exportPDF")}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Empty Chapters Modal */}
      <Dialog open={showEmptyChaptersModal} onOpenChange={setShowEmptyChaptersModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {t("batchExport.emptyChaptersModalTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <div className="space-y-2">
              {emptyChapters.map((ch) => (
                <div
                  key={ch.number}
                  className="p-2 bg-muted rounded-md text-sm flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <span>
                    Capítulo {ch.number}: {ch.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowEmptyChaptersModal(false)}>
              {t("batchExport.emptyChaptersModalClose")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <AlertDialog open={showFeedback} onOpenChange={setShowFeedback}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {feedbackType === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {feedbackType === "success" ? t("feedback.exportSuccess") : t("feedback.exportError")}
            </AlertDialogTitle>
            <AlertDialogDescription>{feedbackMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="secondary">{t("feedback.ok")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
