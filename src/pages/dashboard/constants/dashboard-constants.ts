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

// Visual styles aligned with create book modal translations
export const VISUAL_STYLES_CONSTANT = ["Realista", "Cartoon", "Anime"];

export const DEFAULT_TABS_CONSTANT: TabConfig[] = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: BookOpen,
    visible: true,
    isDefault: true,
  },
  { id: "characters", label: "Personagens", icon: Users, visible: true },
  { id: "world", label: "Mundo", icon: MapPin, visible: true },
  { id: "factions", label: "Facções", icon: Building, visible: true },
  { id: "plot", label: "Enredo", icon: Target, visible: true },
  { id: "magic", label: "Sistema de Poder", icon: Zap, visible: true },
  { id: "species", label: "Raças", icon: Dna, visible: true },
  { id: "items", label: "Itens", icon: Package, visible: true },
];
