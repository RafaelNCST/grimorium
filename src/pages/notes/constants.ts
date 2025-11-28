import type { NoteColor } from "@/types/note-types";

export const NOTE_COLORS: Record<
  NoteColor,
  {
    bg: string;
    border: string;
    hover: string;
  }
> = {
  sepia: {
    bg: "bg-[#FFF176] dark:bg-[#FFD700]", // Bright yellow
    border: "border-[#FFE700] dark:border-[#FFC700]",
    hover: "shadow-[#FFF176]/60 dark:shadow-[#FFD700]/60",
  },
  purple: {
    bg: "bg-[#E879F9] dark:bg-[#C084FC]", // Bright purple
    border: "border-[#D946EF] dark:border-[#A855F7]",
    hover: "shadow-[#E879F9]/60 dark:shadow-[#C084FC]/60",
  },
  green: {
    bg: "bg-[#6EE7B7] dark:bg-[#34D399]", // Bright mint green
    border: "border-[#34D399] dark:border-[#10B981]",
    hover: "shadow-[#6EE7B7]/60 dark:shadow-[#34D399]/60",
  },
  blue: {
    bg: "bg-[#60A5FA] dark:bg-[#3B82F6]", // Bright blue
    border: "border-[#3B82F6] dark:border-[#2563EB]",
    hover: "shadow-[#60A5FA]/60 dark:shadow-[#3B82F6]/60",
  },
  red: {
    bg: "bg-[#F9A8D4] dark:bg-[#F472B6]", // Bright pink
    border: "border-[#F472B6] dark:border-[#EC4899]",
    hover: "shadow-[#F9A8D4]/60 dark:shadow-[#F472B6]/60",
  },
  gold: {
    bg: "bg-[#FDBA74] dark:bg-[#FB923C]", // Bright orange
    border: "border-[#FB923C] dark:border-[#F97316]",
    hover: "shadow-[#FDBA74]/60 dark:shadow-[#FB923C]/60",
  },
  cyan: {
    bg: "bg-[#67E8F9] dark:bg-[#22D3EE]", // Bright cyan
    border: "border-[#22D3EE] dark:border-[#06B6D4]",
    hover: "shadow-[#67E8F9]/60 dark:shadow-[#22D3EE]/60",
  },
  indigo: {
    bg: "bg-[#C4B5FD] dark:bg-[#A78BFA]", // Bright indigo
    border: "border-[#A78BFA] dark:border-[#8B5CF6]",
    hover: "shadow-[#C4B5FD]/60 dark:shadow-[#A78BFA]/60",
  },
  lime: {
    bg: "bg-[#BEF264] dark:bg-[#A3E635]", // Bright lime
    border: "border-[#A3E635] dark:border-[#84CC16]",
    hover: "shadow-[#BEF264]/60 dark:shadow-[#A3E635]/60",
  },
} as const;

export const POST_IT_SIZE = {
  width: 280,
  height: 280,
} as const;

export const MAX_PREVIEW_LINES = 6;

export const DEFAULT_NOTE_COLOR: NoteColor = "sepia";

export const DEFAULT_TEXT_COLOR = "black" as const;
