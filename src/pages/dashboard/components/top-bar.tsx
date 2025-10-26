import {
  ArrowLeft,
  Trash2,
  Book,
  NotebookTabs,
  Palette,
  EyeOff,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageStore } from "@/stores/language-store";

interface PropsTopBar {
  isCustomizing: boolean;
  isHeaderHidden: boolean;
  onBack: () => void;
  onShowDeleteDialog: (show: boolean) => void;
  onNavigateToChapters: () => void;
  onNavigateToNotes: () => void;
  onCustomizingToggle: () => void;
  onHeaderHiddenChange: (hidden: boolean) => void;
}

export function TopBar({
  isCustomizing,
  isHeaderHidden,
  onBack,
  onShowDeleteDialog,
  onNavigateToChapters,
  onNavigateToNotes,
  onCustomizingToggle,
  onHeaderHiddenChange,
}: PropsTopBar) {
  const { t } = useLanguageStore();

  return (
    <div className={`flex items-center justify-between ${isHeaderHidden ? "mb-0" : "mb-4"}`}>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">Voltar para biblioteca</p>
          </TooltipContent>
        </Tooltip>
        <h1 className="text-2xl font-bold">{t("book.dashboard")}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShowDeleteDialog(true)}
              className="text-destructive hover:bg-red-500/20 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">Excluir livro</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToChapters}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Book className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">Capítulos</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToNotes}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <NotebookTabs className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">Anotações</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCustomizingToggle}
              className={`hover:bg-accent hover:text-accent-foreground ${isCustomizing ? "bg-primary/10 text-primary" : ""}`}
            >
              <Palette className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {isCustomizing ? "Sair do modo personalizar" : "Personalizar"}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onHeaderHiddenChange(!isHeaderHidden)}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              {isHeaderHidden ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {isHeaderHidden ? "Mostrar cabeçalho" : "Ocultar cabeçalho"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
