import { useState, useMemo, useEffect, useRef } from "react";

import { FileText, CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { generateChapterPDF } from "@/lib/services/export-pdf.service";

// Configure PDF.js worker - using CDN for compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Page format dimensions in pixels (at 96 DPI)
const PAGE_FORMATS = {
  a4: { width: 794, height: 1123, label: "A4 (21 x 29.7 cm)" },
  letter: { width: 816, height: 1056, label: "US Letter (21.6 x 27.9 cm)" },
} as const;

// Margin presets in pixels - labels will be translated at runtime
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

// Font families - same as in chapter editor
const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Arial", label: "Arial" },
  { value: "sans-serif", label: "Sans Serif" },
] as const;

// Font sizes - Ranges otimizados para manuscritos editoriais
const TITLE_SIZE_RANGE = { min: 14, max: 28, default: 24 };
const CONTENT_SIZE_RANGE = { min: 10, max: 16, default: 12 };
const LINE_SPACING_RANGE = { min: 1.0, max: 2.5, default: 2.0 };

export interface ExportConfig {
  pageFormat: "a4" | "letter";
  margins: keyof typeof MARGIN_PRESETS;
  titleFont: string;
  titleSize: number;
  titleAlignment: "left" | "center";
  titleBold: boolean;
  showPageNumbers: boolean;
  pageNumberPosition: "left" | "center" | "right";
  // Configurações do corpo do texto
  contentFont: string;
  contentSize: number;
  contentLineSpacing: number;
  contentAlignment: "left" | "justify";
}

export interface PageContent {
  content: string;
  pageNumber: number;
}

interface ExportPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: string;
  onExportPDF: (
    config: ExportConfig,
    content: string,
    pages: PageContent[]
  ) => Promise<boolean>;
  onExportWord: (
    config: ExportConfig,
    content: string,
    pages: PageContent[]
  ) => Promise<boolean>;
}

export function ExportPreviewModal({
  open,
  onOpenChange,
  chapterId,
  chapterTitle,
  chapterNumber,
  onExportPDF,
  onExportWord,
}: ExportPreviewModalProps) {
  const { t } = useTranslation("export-preview");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [hasError, setHasError] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const scale = 1.0; // Fixed zoom at 100%
  const [config, setConfig] = useState<ExportConfig>({
    pageFormat: "a4",
    margins: "editorial",
    titleFont: "Inter",
    titleSize: TITLE_SIZE_RANGE.default,
    titleAlignment: "center",
    titleBold: true,
    showPageNumbers: true,
    pageNumberPosition: "center",
    // Configurações do corpo - padrões editoriais
    contentFont: "Times New Roman",
    contentSize: CONTENT_SIZE_RANGE.default,
    contentLineSpacing: LINE_SPACING_RANGE.default,
    contentAlignment: "left",
  });

  // Load chapter content when modal opens
  useEffect(() => {
    if (!open) return;

    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Dynamically import to avoid circular dependencies
        const { getChapterById } = await import("@/lib/db/chapters.service");
        const chapterData = await getChapterById(chapterId);

        if (chapterData) {
          setContent(chapterData.content || "");
        } else {
          setContent("");
        }
      } catch (error) {
        console.error("Error loading chapter content:", error);
        setContent("");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [open, chapterId]);

  // Calculate fixed container dimensions based on page format
  const containerDimensions = useMemo(() => {
    // Use a reasonable fixed width that fits the modal well
    const width = 597; // Fixed width that works well for both A4 and Letter

    // Fixed height for error/loading states
    const estimatedHeight = 800;

    return { width, estimatedHeight };
  }, []);

  // Generate PDF preview when content or config changes (with debounce)
  useEffect(() => {
    if (!open) return;

    // Check if content is empty or just whitespace
    if (!content || content.trim() === "") {
      setHasError(true);
      setIsGeneratingPreview(false);
      setPdfPreviewUrl(null);
      return;
    }

    let cancelled = false;

    // Debounce: wait 300ms after last change before generating preview
    const debounceTimer = setTimeout(() => {
      const generatePreview = async () => {
        setIsGeneratingPreview(true);
        setHasError(false); // Reset error state on new generation

        try {
          // Generate PDF blob
          const blob = await generateChapterPDF(
            chapterNumber,
            chapterTitle,
            content,
            config,
            [] // Pages array not used anymore
          );

          if (cancelled) return;

          // Create object URL for preview
          const newUrl = URL.createObjectURL(blob);

          // Cleanup old URL before setting new one
          if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl);
          }

          setPdfPreviewUrl(newUrl);
        } catch (error) {
          if (!cancelled) {
            console.error("Error generating PDF preview:", error);
            setPdfPreviewUrl(null);
            setHasError(true);
          }
        } finally {
          if (!cancelled) {
            setIsGeneratingPreview(false);
          }
        }
      };

      generatePreview();
    }, 300); // 300ms debounce

    // Cleanup on unmount or dependency change
    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      // Note: We don't revoke the URL here as it might still be needed
      // URL cleanup happens when setting a new URL or on modal close
    };
  }, [content, config, open, chapterNumber, chapterTitle]);

  // Cleanup PDF URL when modal closes
  useEffect(() => {
    if (!open && pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
      setNumPages(0);
      setHasError(false);
    }
  }, [open]);

  const handleConfigChange = <K extends keyof ExportConfig>(
    key: K,
    value: ExportConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = async (type: "pdf" | "word") => {
    setIsExporting(true);
    try {
      const success =
        type === "pdf"
          ? await onExportPDF(config, content, [])
          : await onExportWord(config, content, []);

      if (success) {
        // Fechamento controlado: primeiro fecha o modal de exportação
        onOpenChange(false);

        // Depois mostra feedback de sucesso
        setFeedbackType("success");
        setFeedbackMessage(
          type === "pdf"
            ? "Capítulo exportado para PDF com sucesso!"
            : "Capítulo exportado para Word com sucesso!"
        );
        setShowFeedback(true);
      } else {
        // Se cancelou, não faz nada (mantém modal aberto)
        setFeedbackType("error");
        setFeedbackMessage("Exportação cancelada.");
      }
    } catch (error) {
      console.error("Error during export:", error);
      setFeedbackType("error");
      setFeedbackMessage(
        "Erro ao exportar o capítulo. Por favor, tente novamente."
      );
      setShowFeedback(true);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Feedback Dialog */}
      <AlertDialog open={showFeedback} onOpenChange={setShowFeedback}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {feedbackType === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {feedbackType === "success"
                ? "Exportação Concluída"
                : "Erro na Exportação"}
            </AlertDialogTitle>
            <AlertDialogDescription>{feedbackMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="secondary">OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Preview Modal */}
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1400px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t("modal.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Main content: Settings on left, Preview on right */}
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Settings Panel - Left Side */}
          <div className={`w-80 flex-shrink-0 overflow-y-auto space-y-6 px-4 border-r relative z-10 ${hasError ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-6 py-2">
              {/* Page Format */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t("settings.page_format")}
                </Label>
                <RadioGroup
                  value={config.pageFormat}
                  onValueChange={(value) =>
                    handleConfigChange("pageFormat", value as "a4" | "letter")
                  }
                  disabled={hasError}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a4" id="a4" disabled={hasError} />
                    <Label htmlFor="a4" className="cursor-pointer">
                      {PAGE_FORMATS.a4.label}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="letter" id="letter" disabled={hasError} />
                    <Label htmlFor="letter" className="cursor-pointer">
                      {PAGE_FORMATS.letter.label}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Margins */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t("settings.margins")}
                </Label>
                <Select
                  value={config.margins}
                  onValueChange={(value) =>
                    handleConfigChange(
                      "margins",
                      value as keyof typeof MARGIN_PRESETS
                    )
                  }
                  disabled={hasError}
                >
                  <SelectTrigger disabled={hasError}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(MARGIN_PRESETS).map((key) => (
                      <SelectItem key={key} value={key}>
                        {t(`margins.${key}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Title Settings */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  {t("settings.title_settings")}
                </Label>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("settings.font")}</Label>
                    <Select
                      value={config.titleFont}
                      onValueChange={(value) =>
                        handleConfigChange("titleFont", value)
                      }
                      disabled={hasError}
                    >
                      <SelectTrigger disabled={hasError}>
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
                      <Label>{t("settings.size")}</Label>
                      <span className="text-sm font-medium text-primary">
                        {config.titleSize}pt
                      </span>
                    </div>
                    <Slider
                      value={[config.titleSize]}
                      onValueChange={([value]) =>
                        handleConfigChange("titleSize", value)
                      }
                      min={TITLE_SIZE_RANGE.min}
                      max={TITLE_SIZE_RANGE.max}
                      step={2}
                      disabled={hasError}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{TITLE_SIZE_RANGE.min}pt</span>
                      <span>{TITLE_SIZE_RANGE.default}pt (padrão)</span>
                      <span>{TITLE_SIZE_RANGE.max}pt</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("settings.alignment")}</Label>
                    <RadioGroup
                      value={config.titleAlignment}
                      onValueChange={(value) =>
                        handleConfigChange(
                          "titleAlignment",
                          value as "left" | "center"
                        )
                      }
                      className="flex gap-4"
                      disabled={hasError}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="title-left" disabled={hasError} />
                        <Label htmlFor="title-left" className="cursor-pointer">
                          {t("settings.alignment_left")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="center" id="title-center" disabled={hasError} />
                        <Label
                          htmlFor="title-center"
                          className="cursor-pointer"
                        >
                          {t("settings.alignment_center")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Content Text Settings */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Configurações do Texto
                </Label>

                <div className="space-y-4">
                  {/* Content Font */}
                  <div className="space-y-2">
                    <Label>Fonte do texto</Label>
                    <Select
                      value={config.contentFont}
                      onValueChange={(value) =>
                        handleConfigChange("contentFont", value)
                      }
                      disabled={hasError}
                    >
                      <SelectTrigger disabled={hasError}>
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

                  {/* Content Size with Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Tamanho do texto</Label>
                      <span className="text-sm font-medium text-primary">
                        {config.contentSize}pt
                      </span>
                    </div>
                    <Slider
                      value={[config.contentSize]}
                      onValueChange={([value]) =>
                        handleConfigChange("contentSize", value)
                      }
                      min={CONTENT_SIZE_RANGE.min}
                      max={CONTENT_SIZE_RANGE.max}
                      step={1}
                      disabled={hasError}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{CONTENT_SIZE_RANGE.min}pt</span>
                      <span>{CONTENT_SIZE_RANGE.default}pt (padrão)</span>
                      <span>{CONTENT_SIZE_RANGE.max}pt</span>
                    </div>
                  </div>

                  {/* Line Spacing with Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Espaçamento entre linhas</Label>
                      <span className="text-sm font-medium text-primary">
                        {config.contentLineSpacing.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[config.contentLineSpacing]}
                      onValueChange={([value]) =>
                        handleConfigChange("contentLineSpacing", value)
                      }
                      min={LINE_SPACING_RANGE.min}
                      max={LINE_SPACING_RANGE.max}
                      step={0.5}
                      disabled={hasError}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1.0 (simples)</span>
                      <span>1.5</span>
                      <span>2.0 (duplo)</span>
                      <span>2.5</span>
                    </div>
                  </div>

                  {/* Content Alignment */}
                  <div className="space-y-2">
                    <Label>Alinhamento do texto</Label>
                    <RadioGroup
                      value={config.contentAlignment}
                      onValueChange={(value) =>
                        handleConfigChange(
                          "contentAlignment",
                          value as "left" | "justify"
                        )
                      }
                      className="flex gap-4"
                      disabled={hasError}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="content-left" disabled={hasError} />
                        <Label htmlFor="content-left" className="cursor-pointer">
                          Esquerda
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="justify" id="content-justify" disabled={hasError} />
                        <Label htmlFor="content-justify" className="cursor-pointer">
                          Justificado
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel - Right Side */}
          <div className="flex-1 flex flex-col bg-muted/30 rounded-lg overflow-hidden">
            {/* PDF Controls */}
            {pdfPreviewUrl && !isLoading && (
              <div className="flex-shrink-0 flex items-center justify-center px-4 py-3 border-b border-border bg-card/50">
                <span className="text-sm text-muted-foreground">
                  {numPages}{" "}
                  {numPages === 1
                    ? t("preview.page_singular")
                    : t("preview.page_plural")}
                </span>
              </div>
            )}

            {/* PDF Preview - with FIXED container to prevent any resizing */}
            <div
              className={`bg-muted/20 p-4 flex justify-center ${hasError || isLoading || isGeneratingPreview ? 'items-center h-full' : 'flex-1 items-start overflow-y-auto'}`}
              style={hasError || isLoading || isGeneratingPreview ? { height: `${containerDimensions.estimatedHeight}px` } : undefined}
            >
              {isLoading || (isGeneratingPreview && !pdfPreviewUrl) ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                  <p className="text-sm text-muted-foreground">
                    {t("preview.loading_content")}
                  </p>
                </div>
              ) : hasError ? (
                <div className="rounded-lg bg-muted/50 border-2 border-dashed border-border p-8 text-center max-w-md">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base font-medium text-foreground mb-2">
                    Este capítulo não tem conteúdo ainda
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Adicione conteúdo ao capítulo para gerar uma pré-visualização
                  </p>
                </div>
              ) : pdfPreviewUrl ? (
                <div
                  className="relative flex-shrink-0"
                  style={{
                    width: `${containerDimensions.width}px`,
                  }}
                >
                  {/* Loading overlay during regeneration - covers the fixed container */}
                  {isGeneratingPreview && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                        <p className="text-sm text-muted-foreground">
                          {t("preview.updating_preview")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PDF Document */}
                  <div className="flex flex-col gap-6">
                      <Document
                        key="pdf-document"
                        file={pdfPreviewUrl}
                        onLoadSuccess={({ numPages }) => {
                          setNumPages(numPages);
                          setHasError(false);
                        }}
                        onLoadError={(error) => {
                          console.error("Error loading PDF:", error);
                          setHasError(true);
                        }}
                        loading={
                          <div className="flex flex-col items-center gap-4 justify-center py-20">
                            <div className="w-8 h-8 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                            <p className="text-sm text-muted-foreground">
                              {t("preview.loading_pdf")}
                            </p>
                          </div>
                        }
                      >
                        {Array.from(new Array(numPages), (_, index) => (
                          <div
                            key={`page_${index + 1}`}
                            className="flex flex-col gap-2"
                          >
                            <div className="shadow-xl bg-white border border-border">
                              <Page
                                pageNumber={index + 1}
                                scale={scale}
                                loading={
                                  <div
                                    className="flex items-center justify-center p-8 bg-white"
                                    style={{
                                      width: `${PAGE_FORMATS[config.pageFormat].width * scale}px`,
                                      height: `${PAGE_FORMATS[config.pageFormat].height * scale}px`,
                                    }}
                                  >
                                    <div className="w-6 h-6 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                                  </div>
                                }
                              />
                            </div>
                            <div className="text-center text-xs text-muted-foreground">
                              {t("preview.page_of", {
                                current: index + 1,
                                total: numPages,
                              })}
                            </div>
                          </div>
                        ))}
                      </Document>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            {t("actions.cancel")}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="magical"
              onClick={() => handleExport("word")}
              disabled={hasError || isExporting}
            >
              {isExporting ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-white" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {isExporting ? "Exportando..." : t("actions.export_word")}
            </Button>
            <Button
              variant="magical"
              onClick={() => handleExport("pdf")}
              disabled={hasError || isExporting}
            >
              {isExporting ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-white" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {isExporting ? "Exportando..." : t("actions.export_pdf")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
