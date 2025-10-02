import {
  BookOpen,
  Users,
  MapPin,
  Building,
  Target,
  Sparkles,
  Dna,
  Skull,
  Package,
} from "lucide-react";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

export const GENRES_CONSTANT = [
  "Alta Fantasia",
  "Fantasia Urbana",
  "Épico",
  "Romance",
  "Mistério",
  "Suspense",
  "Terror",
  "Ficção Científica",
  "Distopia",
  "Aventura",
  "Drama",
  "Comédia",
  "Biografia",
  "Histórico",
  "Contemporâneo",
];

export const VISUAL_STYLES_CONSTANT = ["Cartoon", "Anime", "Realista"];

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
  { id: "organizations", label: "Organizações", icon: Building, visible: true },
  { id: "plot", label: "Enredo", icon: Target, visible: true },
  { id: "magic", label: "Sistema de Poder", icon: Sparkles, visible: true },
  { id: "species", label: "Espécies", icon: Dna, visible: true },
  { id: "bestiary", label: "Bestiário", icon: Skull, visible: true },
  { id: "items", label: "Itens", icon: Package, visible: true },
  { id: "encyclopedia", label: "Enciclopédia", icon: BookOpen, visible: true },
];
