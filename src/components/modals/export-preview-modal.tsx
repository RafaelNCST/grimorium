import { useState, useMemo, useEffect } from "react";

import { FileText, Loader2 } from "lucide-react";

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

// Font families (sistema)
const FONT_FAMILIES = [
  { value: "serif", label: "Serif (padrão para livros)" },
  { value: "sans", label: "Sans-serif" },
] as const;

// Font sizes (múltiplos de 8 para melhor alinhamento)
const TITLE_SIZES = ["16pt", "24pt", "32pt"] as const;

interface ExportConfig {
  pageFormat: "a4" | "letter";
  margins: keyof typeof MARGIN_PRESETS;
  titleFont: string;
  titleSize: string;
  titleAlignment: "left" | "center";
  titleBold: boolean;
  showPageNumbers: boolean;
  pageNumberPosition: "left" | "center" | "right";
}

interface ExportPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: string;
  onExportPDF: (config: ExportConfig) => void;
  onExportWord: (config: ExportConfig) => void;
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
  const [config, setConfig] = useState<ExportConfig>({
    pageFormat: "a4",
    margins: "editorial",
    titleFont: "serif",
    titleSize: "24pt",
    titleAlignment: "center",
    titleBold: true,
    showPageNumbers: true,
    pageNumberPosition: "center",
  });

  const getFontFamily = (fontValue: string): string => {
    const fontMap: Record<string, string> = {
      serif: "Georgia, 'Times New Roman', serif",
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    };
    return fontMap[fontValue] || fontMap.serif;
  };

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

  // Calculate page breaks by measuring actual rendered height
  const pages = useMemo(() => {
    if (!content) return [{ content: "", pageNumber: 1 }];

    const format = PAGE_FORMATS[config.pageFormat];
    const margins = MARGIN_PRESETS[config.margins];

    // Calculate usable dimensions (scaled for 0.6 preview)
    const pageHeight = (format.height - margins.top - margins.bottom - (config.showPageNumbers ? 30 : 0)) * 0.6;
    const pageWidth = (format.width - margins.left - margins.right) * 0.6;

    // Create invisible measuring element
    const measuringDiv = document.createElement('div');
    measuringDiv.style.position = 'absolute';
    measuringDiv.style.visibility = 'hidden';
    measuringDiv.style.width = `${pageWidth}px`;
    measuringDiv.style.fontFamily = "Georgia, 'Times New Roman', serif";
    measuringDiv.style.fontSize = '7.2px'; // 12pt * 0.6
    measuringDiv.style.lineHeight = '1.5';
    measuringDiv.style.whiteSpace = 'pre-wrap';
    measuringDiv.style.wordWrap = 'break-word';
    document.body.appendChild(measuringDiv);

    // Calculate title height for first page
    const titleSizePt = parseInt(config.titleSize);
    let titleHeight = 0;
    if (true) { // Always calculate for first page
      const titleDiv = document.createElement('div');
      titleDiv.style.fontFamily = getFontFamily(config.titleFont);
      titleDiv.style.fontSize = `calc(${config.titleSize} * 0.6)`;
      titleDiv.style.fontWeight = config.titleBold ? 'bold' : 'normal';
      titleDiv.style.marginBottom = '24px'; // 6 * 0.6 converted to px
      titleDiv.textContent = `Capítulo ${chapterNumber}: ${chapterTitle}`;
      measuringDiv.appendChild(titleDiv);
      titleHeight = measuringDiv.offsetHeight;
      measuringDiv.innerHTML = '';
    }

    const pageContents: { content: string; pageNumber: number }[] = [];
    let currentPageNumber = 1;
    let currentPageContent = '';

    // Split into words while preserving line breaks
    const words = content.split(/(\s+)/); // Splits by whitespace but keeps the whitespace

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const maxHeight = currentPageNumber === 1 ? pageHeight - titleHeight : pageHeight;

      // Test adding this word to current page
      const testContent = currentPageContent + word;
      measuringDiv.textContent = testContent;
      const testHeight = measuringDiv.offsetHeight;

      // Use 95% of max height to leave safety margin
      const safeMaxHeight = maxHeight * 0.95;

      // Check if it exceeds safe page height
      if (testHeight > safeMaxHeight && currentPageContent.length > 0) {
        // Current page is full, save it and start new page
        pageContents.push({
          content: currentPageContent.trim(),
          pageNumber: currentPageNumber,
        });

        // Reset for new page
        currentPageContent = word;
        currentPageNumber++;
      } else {
        // Word fits, add it to current page
        currentPageContent += word;
      }
    }

    // Add remaining content as last page
    if (currentPageContent.trim().length > 0) {
      pageContents.push({
        content: currentPageContent.trim(),
        pageNumber: currentPageNumber,
      });
    }

    // Cleanup
    document.body.removeChild(measuringDiv);

    return pageContents.length > 0 ? pageContents : [{ content: "", pageNumber: 1 }];
  }, [content, config, chapterNumber, chapterTitle]);

  const totalPages = pages.length;

  const handleConfigChange = <K extends keyof ExportConfig>(
    key: K,
    value: ExportConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
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

              <Separator />

              {/* Header/Footer */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Cabeçalho e Rodapé
                </Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="page-numbers"
                    checked={config.showPageNumbers}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showPageNumbers", checked === true)
                    }
                  />
                  <Label
                    htmlFor="page-numbers"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Mostrar números de página
                  </Label>
                </div>

                {config.showPageNumbers && (
                  <div className="space-y-2 pl-6">
                    <Label>Posição</Label>
                    <RadioGroup
                      value={config.pageNumberPosition}
                      onValueChange={(value) =>
                        handleConfigChange(
                          "pageNumberPosition",
                          value as "left" | "center" | "right"
                        )
                      }
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="page-left" />
                        <Label htmlFor="page-left" className="cursor-pointer">
                          Esquerda
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="center" id="page-center" />
                        <Label htmlFor="page-center" className="cursor-pointer">
                          Centro
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="page-right" />
                        <Label htmlFor="page-right" className="cursor-pointer">
                          Direita
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel - Right Side */}
          <div className="flex-1 flex flex-col bg-muted/30 rounded-lg overflow-hidden">
            {/* Total pages indicator - Fixed at top */}
            <div className="flex-shrink-0 text-center py-3 border-b border-border bg-card/50">
              <span className="text-sm font-medium text-muted-foreground">
                Total: {totalPages} {totalPages === 1 ? "página" : "páginas"}
              </span>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Carregando conteúdo do capítulo...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8">
                  {/* Multiple pages with page breaks */}
                  {pages.map((page, index) => (
                    <div key={page.pageNumber} className="relative">
                      {/* Page number indicator above page */}
                      <div className="text-center mb-2">
                        <span className="text-xs font-medium text-muted-foreground bg-card px-3 py-1 rounded-full border">
                          Página {page.pageNumber} de {totalPages}
                        </span>
                      </div>

                      {/* Page content */}
                      <div
                        className="bg-white shadow-2xl relative"
                        style={{
                          width: `${PAGE_FORMATS[config.pageFormat].width * 0.6}px`,
                          height: `${PAGE_FORMATS[config.pageFormat].height * 0.6}px`,
                          padding: `${MARGIN_PRESETS[config.margins].top * 0.6}px ${MARGIN_PRESETS[config.margins].right * 0.6}px ${MARGIN_PRESETS[config.margins].bottom * 0.6}px ${MARGIN_PRESETS[config.margins].left * 0.6}px`,
                        }}
                      >
                        <div className="flex flex-col h-full">
                          {/* Title - only on first page */}
                          {page.pageNumber === 1 && (
                            <div
                              className="mb-6"
                              style={{
                                fontFamily: getFontFamily(config.titleFont),
                                fontSize: `calc(${config.titleSize} * 0.6)`,
                                fontWeight: config.titleBold ? "bold" : "normal",
                                textAlign: config.titleAlignment,
                                color: "#000",
                              }}
                            >
                              Capítulo {chapterNumber}: {chapterTitle}
                            </div>
                          )}

                          {/* Text Content - Preserva formatação completa */}
                          <div
                            className="whitespace-pre-wrap flex-1"
                            style={{
                              fontFamily: "Georgia, 'Times New Roman', serif",
                              fontSize: "7.2px", // 12pt * 0.6
                              lineHeight: "1.5",
                              color: "#000",
                            }}
                          >
                            {page.content}
                          </div>

                          {/* Page number at bottom if enabled */}
                          {config.showPageNumbers && (
                            <div
                              className="mt-4 pt-2"
                              style={{
                                textAlign: config.pageNumberPosition,
                                fontSize: "6px",
                                color: "#666",
                              }}
                            >
                              {page.pageNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Info note */}
                  <p className="text-xs text-muted-foreground text-center max-w-md">
                    Pré-visualização com quebra de páginas real. Use as configurações à esquerda para ajustar a formatação.
                  </p>
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
                onExportWord(config);
                onOpenChange(false);
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar como Word
            </Button>
            <Button
              variant="magical"
              onClick={() => {
                onExportPDF(config);
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
