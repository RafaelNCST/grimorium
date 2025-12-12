import { useState } from "react";

import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  BookOpen,
  Type,
  Hash,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { EntityMention } from "@/components/modals/create-chapter-modal";
import {
  ExportPreviewModal,
  type ExportConfig,
  type PageContent,
} from "@/components/modals/export-preview-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateChapterPDF } from "@/lib/services/export-pdf.service";

type ChapterStatus =
  | "draft"
  | "in-progress"
  | "review"
  | "finished"
  | "published";

interface Chapter {
  id: string;
  number: number;
  title: string;
  status: ChapterStatus;
  wordCount: number;
  characterCount: number;
  characterCountWithSpaces: number;
  lastEdited: Date;
  summary?: string;
  content?: string;
  plotArc?: { id: string; name: string };
  mentionedCharacters?: EntityMention[];
  mentionedRegions?: EntityMention[];
  mentionedItems?: EntityMention[];
  mentionedFactions?: EntityMention[];
  mentionedRaces?: EntityMention[];
}

interface ChapterCardProps {
  chapter: Chapter;
  onClick?: (chapterId: string) => void;
  onDelete?: (chapterId: string) => void;
  statusConfig: Record<
    ChapterStatus,
    { label: string; color: string; icon: any }
  >;
  showStatus?: boolean;
}

export function ChapterCard({
  chapter,
  onClick,
  onDelete,
  statusConfig,
  showStatus = true,
}: ChapterCardProps) {
  const { t } = useTranslation("chapter-card");
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleExportPDF = async (
    config: ExportConfig,
    content: string,
    pages: PageContent[]
  ) => {
    try {
      // Generate PDF blob
      const blob = await generateChapterPDF(
        chapter.number.toString(),
        chapter.title,
        content,
        config,
        pages
      );

      // Convert blob to Uint8Array for Tauri
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Ask user where to save
      const filePath = await save({
        defaultPath: `${t("export.filename_prefix")}_${chapter.number}_${chapter.title}.pdf`,
        filters: [
          {
            name: "PDF",
            extensions: ["pdf"],
          },
        ],
      });

      if (filePath) {
        // Save file
        await writeFile(filePath, uint8Array);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const handleExportWord = async (
    config: ExportConfig,
    content: string,
    _pages: PageContent[]
  ) => {
    try {
      // Generate Word blob
      const { generateChapterWord } = await import(
        "@/lib/services/export-word.service"
      );
      const blob = await generateChapterWord(
        chapter.number.toString(),
        chapter.title,
        content,
        config
      );

      // Convert blob to Uint8Array for Tauri
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Ask user where to save
      const filePath = await save({
        defaultPath: `${t("export.filename_prefix")}_${chapter.number}_${chapter.title}.docx`,
        filters: [
          {
            name: "Word Document",
            extensions: ["docx"],
          },
        ],
      });

      if (filePath) {
        // Save file
        await writeFile(filePath, uint8Array);
      }
    } catch (error) {
      console.error("Error exporting Word:", error);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Status Badge - Large identifier at top left */}
      {showStatus && (
        <div className="absolute top-0 left-0 z-10">
          <Badge
            variant="secondary"
            className={`${statusConfig[chapter.status].color} text-white pointer-events-none rounded-none rounded-br-lg px-4 py-2 text-sm font-semibold shadow-md`}
          >
            {statusConfig[chapter.status].label}
          </Badge>
        </div>
      )}

      <CardHeader
        className={`pb-4 cursor-pointer hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 ${
          showStatus ? "pt-14" : "pt-6"
        }`}
        onClick={() => onClick?.(chapter.id)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Header: Number + Title */}
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-amber-500 shrink-0">
                {t("header.chapter")} {chapter.number}:
              </span>
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {chapter.title}
              </CardTitle>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-start gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportClick();
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("tooltips.export_chapter")}</p>
              </TooltipContent>
            </Tooltip>

            <Button
              variant="ghost-destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(chapter.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <>
        <Separator />
        <CardContent className="p-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsExpanded(!isDetailsExpanded);
            }}
            className="w-full justify-between rounded-none hover:bg-white/5 dark:hover:bg-white/10 hover:text-foreground transition-colors duration-200 px-6 py-3"
          >
            <span className="text-sm font-medium">
              {t(isDetailsExpanded ? "details.hide" : "details.show")}{" "}
              {t("details.label")}
            </span>
            {isDetailsExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {isDetailsExpanded && (
            <div className="px-6 py-4 space-y-4">
              {/* Plot Arc Section */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {t("plot_arc.title")}
                </h4>
                {chapter.plotArc ? (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 bg-purple-500 text-white border-purple-600 pointer-events-none"
                  >
                    <BookOpen className="w-3 h-3" />
                    {chapter.plotArc.name}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {t("plot_arc.no_arc")}
                  </p>
                )}
              </div>

              {/* Metrics Section */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {t("metrics.title")}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Type className="w-3.5 h-3.5" />
                      <span className="text-xs">{t("metrics.words")}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {chapter.wordCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Hash className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {t("metrics.characters_no_spaces")}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {chapter.characterCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Hash className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {t("metrics.characters_with_spaces")}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {chapter.characterCountWithSpaces.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {t("metrics.last_edited")}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {chapter.lastEdited.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {t("summary.title")}
                </h4>
                {chapter.summary ? (
                  <p className="text-sm text-muted-foreground">
                    {chapter.summary}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {t("summary.no_summary")}
                  </p>
                )}
              </div>

              {/* Entities Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Personagens */}
                <div>
                  <h5 className="text-xs font-medium mb-1.5 text-foreground">
                    {t("entities.characters")}
                  </h5>
                  {chapter.mentionedCharacters &&
                  chapter.mentionedCharacters.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {chapter.mentionedCharacters.map((char) => (
                        <div
                          key={char.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border"
                        >
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={char.image} />
                            <AvatarFallback className="text-[10px]">
                              {char.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{char.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {t("entities.no_characters")}
                    </p>
                  )}
                </div>

                {/* Regiões */}
                <div>
                  <h5 className="text-xs font-medium mb-1.5 text-foreground">
                    {t("entities.regions")}
                  </h5>
                  {chapter.mentionedRegions &&
                  chapter.mentionedRegions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {chapter.mentionedRegions.map((region) => (
                        <div
                          key={region.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border"
                        >
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={region.image} />
                            <AvatarFallback className="text-[10px]">
                              {region.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{region.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {t("entities.no_regions")}
                    </p>
                  )}
                </div>

                {/* Itens */}
                <div>
                  <h5 className="text-xs font-medium mb-1.5 text-foreground">
                    {t("entities.items")}
                  </h5>
                  {chapter.mentionedItems &&
                  chapter.mentionedItems.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {chapter.mentionedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border"
                        >
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={item.image} />
                            <AvatarFallback className="text-[10px]">
                              {item.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {t("entities.no_items")}
                    </p>
                  )}
                </div>

                {/* Facções */}
                <div>
                  <h5 className="text-xs font-medium mb-1.5 text-foreground">
                    {t("entities.factions")}
                  </h5>
                  {chapter.mentionedFactions &&
                  chapter.mentionedFactions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {chapter.mentionedFactions.map((faction) => (
                        <div
                          key={faction.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border"
                        >
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={faction.image} />
                            <AvatarFallback className="text-[10px]">
                              {faction.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{faction.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {t("entities.no_factions")}
                    </p>
                  )}
                </div>

                {/* Raças */}
                <div>
                  <h5 className="text-xs font-medium mb-1.5 text-foreground">
                    {t("entities.races")}
                  </h5>
                  {chapter.mentionedRaces &&
                  chapter.mentionedRaces.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {chapter.mentionedRaces.map((race) => (
                        <div
                          key={race.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border"
                        >
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={race.image} />
                            <AvatarFallback className="text-[10px]">
                              {race.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{race.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {t("entities.no_races")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </>

      {/* Export Preview Modal */}
      <ExportPreviewModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        chapterId={chapter.id}
        chapterTitle={chapter.title}
        chapterNumber={chapter.number.toString()}
        onExportPDF={handleExportPDF}
        onExportWord={handleExportWord}
      />
    </Card>
  );
}
