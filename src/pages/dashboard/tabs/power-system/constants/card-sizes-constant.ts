// Card size presets for basic and detailed sections
export type CardSize = "small" | "medium" | "large";

export const CARD_SIZES = {
  small: {
    basic: {
      minWidth: 150,
      title: 14,
      description: 11,
    },
    detailed: {
      minWidth: 180,
      title: 16,
      subtitle: 13,
      description: 11,
      imageHeight: 60,
    },
  },
  medium: {
    basic: {
      minWidth: 180,
      title: 18,
      description: 12,
    },
    detailed: {
      minWidth: 220,
      title: 22,
      subtitle: 16,
      description: 12,
      imageHeight: 80,
    },
  },
  large: {
    basic: {
      minWidth: 220,
      title: 24,
      description: 16,
    },
    detailed: {
      minWidth: 260,
      title: 28,
      subtitle: 20,
      description: 16,
      imageHeight: 100,
    },
  },
} as const;

export const DEFAULT_CARD_SIZE: CardSize = "medium";
