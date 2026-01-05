import type { PlotArcSize } from "@/types/plot-types";

export interface PlotArcChapterLimit {
  size: PlotArcSize;
  maxChapters: number;
  hasLimit: boolean;
}

export const PLOT_ARC_CHAPTER_LIMITS: Record<PlotArcSize, PlotArcChapterLimit> =
  {
    mini: {
      size: "mini",
      maxChapters: 10,
      hasLimit: true,
    },
    small: {
      size: "small",
      maxChapters: 50,
      hasLimit: true,
    },
    medium: {
      size: "medium",
      maxChapters: 200,
      hasLimit: true,
    },
    large: {
      size: "large",
      maxChapters: Infinity,
      hasLimit: false,
    },
  };

export function getChapterLimitForSize(size: PlotArcSize): PlotArcChapterLimit {
  return PLOT_ARC_CHAPTER_LIMITS[size];
}

export function shouldShowChapterWarning(
  totalChapters: number,
  arcSize: PlotArcSize
): boolean {
  const limit = getChapterLimitForSize(arcSize);
  return limit.hasLimit && totalChapters > limit.maxChapters;
}

// LocalStorage utilities for tracking warnings
const WARNING_STORAGE_PREFIX = "chapter-limit-warning-shown-";

export function hasShownWarningForArc(arcId: string): boolean {
  try {
    const key = `${WARNING_STORAGE_PREFIX}${arcId}`;
    const value = localStorage.getItem(key);
    return value !== null;
  } catch {
    return false;
  }
}

export function markWarningAsShown(arcId: string): void {
  try {
    const key = `${WARNING_STORAGE_PREFIX}${arcId}`;
    localStorage.setItem(key, Date.now().toString());
  } catch {
    // Silently fail if localStorage is not available
  }
}
