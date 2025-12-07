import {
  BookOpen,
  Users,
  MapPin,
  Building,
  Target,
  Zap,
  Dna,
  Package,
} from "lucide-react";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

// Genre structure: id is saved to database (english lowercase), translationKey is for UI display
export interface GenreConfig {
  id: string; // Saved to database (english, lowercase)
  translationKey: string; // Used for i18n display
}

export const GENRES_CONSTANT: GenreConfig[] = [
  { id: "urban", translationKey: "genre.urban" },
  { id: "fantasy", translationKey: "genre.fantasy" },
  { id: "futuristic", translationKey: "genre.futuristic" },
  { id: "cyberpunk", translationKey: "genre.cyberpunk" },
  { id: "high_fantasy", translationKey: "genre.high_fantasy" },
  { id: "romance", translationKey: "genre.romance" },
  { id: "mystery", translationKey: "genre.mystery" },
  { id: "horror", translationKey: "genre.horror" },
  { id: "suspense", translationKey: "genre.suspense" },
  { id: "drama", translationKey: "genre.drama" },
  { id: "sci_fi", translationKey: "genre.sci_fi" },
  { id: "historical", translationKey: "genre.historical" },
  { id: "action", translationKey: "genre.action" },
  { id: "adventure", translationKey: "genre.adventure" },
  { id: "litrpg", translationKey: "genre.litrpg" },
];

// Helper to get translation key from genre id
export function getGenreTranslationKey(genreId: string): string {
  const genre = GENRES_CONSTANT.find((g) => g.id === genreId);
  return genre?.translationKey || genreId;
}

// Visual style structure: id is saved to database (english lowercase), translationKey is for UI display
export interface VisualStyleConfig {
  id: string; // Saved to database (english, lowercase)
  translationKey: string; // Used for i18n display
}

export const VISUAL_STYLES_CONSTANT: VisualStyleConfig[] = [
  { id: "realistic", translationKey: "create-book:style.realistic" },
  { id: "cartoon", translationKey: "create-book:style.cartoon" },
  { id: "anime", translationKey: "create-book:style.anime" },
];

// Helper to get translation key from visual style id
export function getVisualStyleTranslationKey(styleId: string): string {
  const style = VISUAL_STYLES_CONSTANT.find((s) => s.id === styleId);
  return style?.translationKey || styleId;
}

// Tab labels - the label field is the key, and will be prefixed with "tabs." for translation
export const DEFAULT_TABS_CONSTANT: TabConfig[] = [
  {
    id: "overview",
    label: "overview",
    icon: BookOpen,
    visible: true,
    isDefault: true,
  },
  { id: "characters", label: "characters", icon: Users, visible: true },
  { id: "world", label: "world", icon: MapPin, visible: true },
  { id: "factions", label: "factions", icon: Building, visible: true },
  { id: "plot", label: "plot", icon: Target, visible: true },
  { id: "magic", label: "magic", icon: Zap, visible: true },
  { id: "species", label: "species", icon: Dna, visible: true },
  { id: "items", label: "items", icon: Package, visible: true },
];
