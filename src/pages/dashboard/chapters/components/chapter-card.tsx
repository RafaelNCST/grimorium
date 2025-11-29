import { useState } from "react";

import {
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

type ChapterStatus = "draft" | "in-progress" | "review" | "finished";

interface Chapter {
  id: string;
  number: number;
  title: string;
  status: ChapterStatus;
  wordCount: number;
  characterCount: number;
  lastEdited: Date;
  summary?: string;
  characters?: string[];
  items?: string[];
  locations?: string[];
}

interface ChapterCardProps {
  chapter: Chapter;
  onClick?: (chapterId: string) => void;
  onDelete?: (chapterId: string) => void;
  statusConfig: Record<
    ChapterStatus,
    { label: string; color: string; icon: any }
  >;
}

export function ChapterCard({
  chapter,
  onClick,
  onDelete,
  statusConfig,
}: ChapterCardProps) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const hasDetails =
    chapter.summary ||
    (chapter.characters && chapter.characters.length > 0) ||
    (chapter.items && chapter.items.length > 0) ||
    (chapter.locations && chapter.locations.length > 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm font-semibold bg-primary/10 text-primary border-primary/20"
              >
                Cap. {chapter.number}
              </Badge>
              <CardTitle
                className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => onClick?.(chapter.id)}
              >
                {chapter.title}
              </CardTitle>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={statusConfig[chapter.status].color}>
                {statusConfig[chapter.status].label}
              </Badge>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {chapter.wordCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    palavras
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                  <span className="text-sm font-mono font-medium">
                    {chapter.characterCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">chars</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {chapter.lastEdited.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar como Word
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar como PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(chapter.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {hasDetails && (
        <>
          <Separator />
          <CardContent className="pt-3 pb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="w-full justify-between hover:bg-muted/50"
            >
              <span className="text-sm font-medium">
                {isDetailsExpanded ? "Ocultar" : "Mostrar"} Detalhes
              </span>
              {isDetailsExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {isDetailsExpanded && (
              <div className="mt-4 space-y-4">
                {chapter.summary && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Resumo</h4>
                    <p className="text-sm text-muted-foreground">
                      {chapter.summary}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapter.characters && chapter.characters.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Personagens</h4>
                      <div className="flex flex-wrap gap-1">
                        {chapter.characters.map((char) => (
                          <Badge
                            key={char}
                            variant="outline"
                            className="text-xs"
                          >
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {chapter.items && chapter.items.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Itens</h4>
                      <div className="flex flex-wrap gap-1">
                        {chapter.items.map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="text-xs"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {chapter.locations && chapter.locations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Localizações
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {chapter.locations.map((location) => (
                          <Badge
                            key={location}
                            variant="outline"
                            className="text-xs"
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
