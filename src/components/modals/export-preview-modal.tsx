import { useState, useMemo, useEffect } from "react";

import { FileText, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { generateChapterPDF } from "@/lib/services/export-pdf.service";

// Configure PDF.js worker - using CDN for compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Page format dimensions in pixels (at 96 DPI)
const PAGE_FORMATS = {
  a4: { width: 794, height: 1123, label: "A4 (21 x 29.7 cm)" },
  letter: { width: 816, height: 1056, label: "US Letter (21.6 x 27.9 cm)" },
} as const;

// Margin presets in pixels
const MARGIN_PRESETS = {
  editorial: {
    top: 95,
    bottom: 76,
    left: 113,
    right: 113,
    label: "Padrão Editorial",
  },
  narrow: { top: 48, bottom: 48, left: 48, right: 48, label: "Estreita" },
  wide: { top: 95, bottom: 95, left: 142, right: 142, label: "Larga" },
} as const;

// Font families - same as in chapter editor
const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Arial", label: "Arial" },
  { value: "sans-serif", label: "Sans Serif" },
] as const;

// Font sizes (múltiplos de 8 para melhor alinhamento)
const TITLE_SIZES = ["16pt", "24pt", "32pt"] as const;

export interface ExportConfig {
  pageFormat: "a4" | "letter";
  margins: keyof typeof MARGIN_PRESETS;
  titleFont: string;
  titleSize: string;
  titleAlignment: "left" | "center";
  titleBold: boolean;
  showPageNumbers: boolean;
  pageNumberPosition: "left" | "center" | "right";
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
  onExportPDF: (config: ExportConfig, content: string, pages: PageContent[]) => void;
  onExportWord: (config: ExportConfig, content: string, pages: PageContent[]) => void;
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
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [documentHeight, setDocumentHeight] = useState<number>(0);
  const scale = 1.0; // Fixed zoom at 100%
  const [config, setConfig] = useState<ExportConfig>({
    pageFormat: "a4",
    margins: "editorial",
    titleFont: "Inter",
    titleSize: "24pt",
    titleAlignment: "center",
    titleBold: true,
    showPageNumbers: true,
    pageNumberPosition: "center",
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
    const format = PAGE_FORMATS[config.pageFormat];

    // Use a reasonable fixed width that fits the modal well
    // The PDF pages will render at their natural size which is smaller than PAGE_FORMATS values
    const width = 597; // Fixed width that works well for both A4 and Letter

    const pageHeight = format.height * scale;
    // Height: use locked document height if available, otherwise estimate
    const estimatedHeight = Math.max(800, pageHeight + 100);

    return { width, estimatedHeight };
  }, [config.pageFormat, scale]);

  // Generate PDF preview when content or config changes
  useEffect(() => {
    if (!content || !open) return;

    let cancelled = false;

    const generatePreview = async () => {
      setIsGeneratingPreview(true);

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
        }
      } finally {
        if (!cancelled) {
          setIsGeneratingPreview(false);
        }
      }
    };

    generatePreview();

    // Cleanup on unmount or dependency change
    return () => {
      cancelled = true;
      // Note: We don't revoke the URL here as it might still be needed
      // URL cleanup happens when setting a new URL or on modal close
    };
  }, [content, config, open, chapterNumber, chapterTitle]);

  // Reset document height when page format changes
  useEffect(() => {
    setDocumentHeight(0);
  }, [config.pageFormat]);

  // Cleanup PDF URL when modal closes
  useEffect(() => {
    if (!open && pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
      setNumPages(0);
      setDocumentHeight(0);
    }
  }, [open]);

  const handleConfigChange = <K extends keyof ExportConfig>(
    key: K,
    value: ExportConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1400px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Pré-visualização de Exportação
          </DialogTitle>
        </DialogHeader>

        {/* Main content: Settings on left, Preview on right */}
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Settings Panel - Left Side */}
          <div className="w-80 flex-shrink-0 overflow-y-auto space-y-6 px-4 border-r relative z-10">
            <div className="space-y-6 py-2">
              {/* Page Format */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Formato de Página
                </Label>
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

              {/* Margins */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Margens</Label>
                <Select
                  value={config.margins}
                  onValueChange={(value) =>
                    handleConfigChange(
                      "margins",
                      value as keyof typeof MARGIN_PRESETS
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MARGIN_PRESETS).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Title Settings */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Configurações do Título
                </Label>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fonte</Label>
                    <Select
                      value={config.titleFont}
                      onValueChange={(value) =>
                        handleConfigChange("titleFont", value)
                      }
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
                    <Label>Tamanho</Label>
                    <Select
                      value={config.titleSize}
                      onValueChange={(value) =>
                        handleConfigChange("titleSize", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TITLE_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Alinhamento</Label>
                    <RadioGroup
                      value={config.titleAlignment}
                      onValueChange={(value) =>
                        handleConfigChange(
                          "titleAlignment",
                          value as "left" | "center"
                        )
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="title-left" />
                        <Label htmlFor="title-left" className="cursor-pointer">
                          Esquerda
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="center" id="title-center" />
                        <Label
                          htmlFor="title-center"
                          className="cursor-pointer"
                        >
                          Centro
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
                  {numPages} {numPages === 1 ? 'página' : 'páginas'}
                </span>
              </div>
            )}

            {/* PDF Preview - with FIXED container to prevent any resizing */}
            <div className="flex-1 overflow-y-auto bg-muted/20 p-4 flex items-start justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 mt-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Carregando conteúdo do capítulo...
                  </p>
                </div>
              ) : (
                <div
                  className="relative flex-shrink-0"
                  style={{
                    width: `${containerDimensions.width}px`,
                    minHeight: documentHeight > 0 ? `${documentHeight}px` : `${containerDimensions.estimatedHeight}px`,
                  }}
                >
                  {/* Loading overlay during regeneration - covers the fixed container */}
                  {isGeneratingPreview && pdfPreviewUrl && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Atualizando pré-visualização...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PDF Document inside fixed container */}
                  {pdfPreviewUrl ? (
                    <div className="flex flex-col gap-6">
                      <Document
                        key="pdf-document"
                        file={pdfPreviewUrl}
                        onLoadSuccess={({ numPages }) => {
                          setNumPages(numPages);
                          // Calculate and lock document height after first load
                          setTimeout(() => {
                            const pageHeight = PAGE_FORMATS[config.pageFormat].height;
                            const totalHeight = (pageHeight * scale * numPages) + (numPages * 80); // 80px gap per page
                            setDocumentHeight(totalHeight);
                          }, 100);
                        }}
                        loading={
                          <div
                            className="flex flex-col items-center gap-4 justify-center"
                            style={{
                              width: `${containerDimensions.width}px`,
                              minHeight: documentHeight > 0 ? `${documentHeight}px` : `${containerDimensions.estimatedHeight}px`
                            }}
                          >
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">
                              Carregando PDF...
                            </p>
                          </div>
                        }
                      >
                        {Array.from(new Array(numPages), (_, index) => (
                          <div key={`page_${index + 1}`} className="flex flex-col gap-2">
                            <div className="shadow-xl bg-white border border-border">
                              <Page
                                pageNumber={index + 1}
                                scale={scale}
                                loading={
                                  <div
                                    className="flex items-center justify-center p-8 bg-white"
                                    style={{
                                      width: `${PAGE_FORMATS[config.pageFormat].width * scale}px`,
                                      height: `${PAGE_FORMATS[config.pageFormat].height * scale}px`
                                    }}
                                  >
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                  </div>
                                }
                              />
                            </div>
                            <div className="text-center text-xs text-muted-foreground">
                              Página {index + 1} de {numPages}
                            </div>
                          </div>
                        ))}
                      </Document>
                    </div>
                  ) : isGeneratingPreview ? (
                    <div
                      className="flex flex-col items-center gap-4 justify-center"
                      style={{
                        width: `${containerDimensions.width}px`,
                        minHeight: documentHeight > 0 ? `${documentHeight}px` : `${containerDimensions.estimatedHeight}px`
                      }}
                    >
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Gerando pré-visualização...
                      </p>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{
                        width: `${containerDimensions.width}px`,
                        minHeight: `${containerDimensions.estimatedHeight}px`
                      }}
                    >
                      <p className="text-sm text-muted-foreground">
                        Erro ao gerar pré-visualização
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <div className="flex gap-2">
            <Button
              variant="magical"
              onClick={() => {
                onExportWord(config, content, []);
                onOpenChange(false);
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar como Word
            </Button>
            <Button
              variant="magical"
              onClick={() => {
                onExportPDF(config, content, []);
                onOpenChange(false);
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar como PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
