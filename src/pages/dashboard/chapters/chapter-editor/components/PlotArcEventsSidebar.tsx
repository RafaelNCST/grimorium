import { useState } from "react";

import {
  X,
  CheckCircle2,
  Circle,
  BookOpen,
  TrendingUp,
  ChevronDown,
  Target,
  Lightbulb,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ARC_SIZES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
import type { IPlotArc, IPlotEvent } from "@/types/plot-types";

// Map status values to their display colors (matching PlotArcCard badges)
const STATUS_DISPLAY_COLORS: Record<string, string> = {
  finished:
    "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  current:
    "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  planning:
    "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
};

// Map size values to their display colors (matching PlotArcCard badges)
const SIZE_DISPLAY_COLORS: Record<string, string> = {
  mini: "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
  small:
    "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  medium:
    "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  large:
    "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
};

interface PlotArcEventsSidebarProps {
  arc: IPlotArc;
  onClose: () => void;
  onToggleEventCompletion: (eventId: string) => void;
}

export function PlotArcEventsSidebar({
  arc,
  onClose,
  onToggleEventCompletion,
}: PlotArcEventsSidebarProps) {
  const { t } = useTranslation(["chapter-editor", "plot", "empty-states", "dialogs", "tooltips"]);

  const statusConfig = ARC_STATUSES_CONSTANT.find(
    (s) => s.value === arc.status
  );
  const StatusIcon = statusConfig?.icon;

  const sizeConfig = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);
  const SizeIcon = sizeConfig?.icon;

  const completedCount = arc.events.filter((e) => e.completed).length;
  const totalCount = arc.events.length;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed right-0 top-8 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Arco Narrativo
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Arc Name and Status */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">{arc.name}</h4>
            <div className="flex flex-wrap gap-2">
              {statusConfig && (
                <Badge
                  className={`pointer-events-none ${STATUS_DISPLAY_COLORS[arc.status]}`}
                >
                  <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                  {t(`plot:${statusConfig.translationKey}`)}
                </Badge>
              )}
              {sizeConfig && (
                <Badge
                  className={`pointer-events-none ${SIZE_DISPLAY_COLORS[arc.size]}`}
                >
                  <SizeIcon className="w-3.5 h-3.5 mr-1.5" />
                  {t(`plot:${sizeConfig.translationKey}`)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="p-4 bg-muted/30 border-b border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Progresso
            </span>
            <span className="text-sm text-muted-foreground">
              {t("dialogs:plot_arc_events.events_count", { completedCount, totalCount })}
            </span>
          </div>
          <Progress value={arc.progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {arc.progress.toFixed(0)}% completo
          </p>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Resumo
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {arc.description}
              </p>
            </div>

            {/* Focus */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Foco Principal
              </h4>
              <p className="text-sm text-muted-foreground">{arc.focus}</p>
            </div>

            {/* Arc Message */}
            {arc.arcMessage && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Mensagem do Arco
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {arc.arcMessage}
                </p>
              </div>
            )}

            {/* World Impact */}
            {arc.worldImpact && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Impacto no Mundo
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {arc.worldImpact}
                </p>
              </div>
            )}

            <Separator />

            {/* Events List */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Eventos do Arco
              </h4>

              {arc.events.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  {t("empty-states:plot_arc.no_event_defined")}
                </div>
              ) : (
                <div className="space-y-2">
                  {arc.events.map((event) => (
                    <EventItem
                      key={event.id}
                      event={event}
                      onToggle={onToggleEventCompletion}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            {t("tooltips:instructions.mark_events_as_you_write")}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface EventItemProps {
  event: IPlotEvent;
  onToggle: (eventId: string) => void;
}

function EventItem({ event, onToggle }: EventItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 ${
        event.completed ? "opacity-60" : ""
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(event.id);
          }}
          className="mt-0.5 text-emerald-500 hover:text-emerald-600 transition-colors shrink-0"
        >
          {event.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              {event.order}
            </span>
            <div className="h-4 w-px bg-border" />
            <h5
              className={`text-sm font-medium flex-1 ${
                event.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {event.name}
            </h5>
          </div>

          {isExpanded && (
            <p className="text-xs text-muted-foreground mt-2">
              {event.description}
            </p>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 mt-0.5 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
}
