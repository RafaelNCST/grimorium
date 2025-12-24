import React, { useState } from "react";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  shouldShowChapterWarning,
  getChapterLimitForSize,
  hasShownWarningForArc,
  markWarningAsShown,
} from "@/lib/constants/plot-arc-chapter-limits";
import { getPlotArcChapterMetrics } from "@/lib/services/chapter-metrics.service";
import type { IPlotArc } from "@/types/plot-types";

interface ChapterArcWarningState {
  isOpen: boolean;
  arc: IPlotArc | null;
  totalChapters: number;
}

let globalShowWarning: ((
  bookId: string,
  plotArcId: string,
  arc: IPlotArc
) => Promise<void>) | null = null;

let forceShowNextWarning = false;

export function ChapterArcWarningProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation("chapter-warnings");
  const [warningState, setWarningState] = useState<ChapterArcWarningState>({
    isOpen: false,
    arc: null,
    totalChapters: 0,
  });

  globalShowWarning = async (
    bookId: string,
    plotArcId: string,
    arc: IPlotArc
  ) => {
    if (!forceShowNextWarning && hasShownWarningForArc(plotArcId)) {
      return;
    }

    forceShowNextWarning = false;

    try {
      const metrics = await getPlotArcChapterMetrics(bookId, plotArcId);
      const shouldWarn = shouldShowChapterWarning(metrics.totalChapters, arc.size);

      if (shouldWarn) {
        setWarningState({
          isOpen: true,
          arc,
          totalChapters: metrics.totalChapters,
        });
      }
    } catch (error) {
      console.error("Failed to check chapter metrics:", error);
    }
  };

  const handleClose = () => {
    if (warningState.arc) {
      markWarningAsShown(warningState.arc.id);
    }
    setWarningState({
      isOpen: false,
      arc: null,
      totalChapters: 0,
    });
  };

  return (
    <>
      {children}
      <AlertDialog open={warningState.isOpen} onOpenChange={handleClose}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="flex items-center gap-3 text-left">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              {t("modal.title")}
            </AlertDialogTitle>

            <AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
              {warningState.arc &&
                t("modal.description", {
                  arcName: warningState.arc.name,
                  arcSize: warningState.arc.size,
                  maxChapters: getChapterLimitForSize(warningState.arc.size)
                    .maxChapters,
                  totalChapters: warningState.totalChapters,
                })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              {t("modal.message")}
            </p>
          </div>

          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogAction
              variant="secondary"
              className="m-0 flex-1"
              onClick={handleClose}
            >
              {t("modal.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export async function checkAndShowArcWarning(
  bookId: string,
  plotArcId: string | undefined,
  arc: IPlotArc | undefined,
  force: boolean = false
) {
  if (!plotArcId || !arc || !globalShowWarning) {
    return;
  }

  if (force) {
    forceShowNextWarning = true;
  }

  await globalShowWarning(bookId, plotArcId, arc);
}
