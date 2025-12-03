import { useState, useEffect, useRef } from "react";

import {
  X,
  ChevronUp,
  ChevronDown,
  Settings,
  Search,
  Replace,
  Globe,
  MessageSquare,
  BookText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DialogueFormatSettings } from "./DialogueFormatSettings";

import type { SearchOptions } from "../types/search-types";

interface SearchBarProps {
  searchTerm: string;
  replaceTerm: string;
  currentIndex: number;
  totalResults: number;
  searchOptions: SearchOptions;
  onSearchTermChange: (term: string) => void;
  onReplaceTermChange: (term: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onToggleCaseSensitive: () => void;
  onToggleWholeWord: () => void;
  onSearchModeChange: (mode: SearchOptions["mode"]) => void;
  onDialogueFormatsChange: (formats: SearchOptions["dialogueFormats"]) => void;
  onReplaceCurrent: () => void;
  onReplaceAll: () => void;
}

export function SearchBar({
  searchTerm,
  replaceTerm,
  currentIndex,
  totalResults,
  searchOptions,
  onSearchTermChange,
  onReplaceTermChange,
  onNext,
  onPrevious,
  onClose,
  onToggleCaseSensitive,
  onToggleWholeWord,
  onSearchModeChange,
  onDialogueFormatsChange,
  onReplaceCurrent,
  onReplaceAll,
}: SearchBarProps) {
  const [showReplace, setShowReplace] = useState(false);
  const [showFormatSettings, setShowFormatSettings] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // Focus search input when opened
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Auto-select initial search term
  useEffect(() => {
    if (searchTerm && !hasAutoSelected && searchInputRef.current) {
      // Small delay to ensure the input has the value
      setTimeout(() => {
        searchInputRef.current?.select();
      }, 0);
      setHasAutoSelected(true);
    }
  }, [searchTerm, hasAutoSelected]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter - next result
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement === searchInputRef.current) {
          e.preventDefault();
          onNext();
        }
      }

      // Shift+Enter - previous result
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        onPrevious();
      }

      // Escape - close
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      // Ctrl+H / Cmd+H - toggle replace
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setShowReplace((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious, onClose]);

  const getModeIcon = () => {
    switch (searchOptions.mode) {
      case "dialogues":
        return MessageSquare;
      case "narration":
        return BookText;
      default:
        return Globe;
    }
  };

  const getModeLabel = () => {
    switch (searchOptions.mode) {
      case "dialogues":
        return "Diálogos";
      case "narration":
        return "Narração";
      default:
        return "Tudo";
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed top-[160px] right-4 z-50 w-full max-w-[500px]">
        <div className="bg-background border rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-right-2 duration-200">
          <div className="p-3 space-y-2">
            {/* Search Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className="pl-9 pr-24"
                />
                {totalResults > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {currentIndex + 1} of {totalResults}
                  </span>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-1">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onPrevious}
                      disabled={totalResults === 0}
                      className="h-8 w-8"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Anterior (Shift+Enter)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onNext}
                      disabled={totalResults === 0}
                      className="h-8 w-8"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Próximo (Enter)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Options */}
              <div className="flex items-center gap-1">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onToggleCaseSensitive}
                      data-active={searchOptions.caseSensitive}
                      className={`h-8 w-8 font-mono text-xs ${
                        searchOptions.caseSensitive
                          ? "bg-primary/10 border-2 border-primary text-primary data-[active=true]:hover:bg-primary/10 data-[active=true]:hover:border-primary data-[active=true]:hover:text-primary"
                          : ""
                      }`}
                    >
                      Aa
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sensível a maiúsculas</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onToggleWholeWord}
                      data-active={searchOptions.wholeWord}
                      className={`h-8 w-8 font-mono text-xs ${
                        searchOptions.wholeWord
                          ? "bg-primary/10 border-2 border-primary text-primary data-[active=true]:hover:bg-primary/10 data-[active=true]:hover:border-primary data-[active=true]:hover:text-primary"
                          : ""
                      }`}
                    >
                      |w|
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Palavra inteira</p>
                  </TooltipContent>
                </Tooltip>

                {/* Mode Dropdown */}
                <DropdownMenu>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          data-active={searchOptions.mode !== "all"}
                          className={`h-8 w-8 ${
                            searchOptions.mode !== "all"
                              ? "bg-primary/10 border-2 border-primary text-primary data-[active=true]:hover:bg-primary/10 data-[active=true]:hover:border-primary data-[active=true]:hover:text-primary"
                              : ""
                          }`}
                        >
                          {(() => {
                            const Icon = getModeIcon();
                            return <Icon className="h-4 w-4" />;
                          })()}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getModeLabel()}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSearchModeChange("all")}>
                      <Globe className="mr-2 h-4 w-4" />
                      Tudo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onSearchModeChange("dialogues")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Apenas diálogos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onSearchModeChange("narration")}
                    >
                      <BookText className="mr-2 h-4 w-4" />
                      Apenas narração
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Format Settings (only show in dialogue mode) */}
                {searchOptions.mode === "dialogues" && (
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowFormatSettings(true)}
                        className="h-8 w-8"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Formatos de diálogo</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Replace Toggle */}
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowReplace((prev) => !prev)}
                      data-active={showReplace}
                      className={`h-8 w-8 ${
                        showReplace
                          ? "bg-primary/10 border-2 border-primary text-primary data-[active=true]:hover:bg-primary/10 data-[active=true]:hover:border-primary data-[active=true]:hover:text-primary"
                          : ""
                      }`}
                    >
                      <Replace className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Alternar substituir (Ctrl+H)</p>
                  </TooltipContent>
                </Tooltip>

                {/* Close */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Replace Row */}
            {showReplace && (
              <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
                <div className="relative flex-1">
                  <Replace className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Substituir por..."
                    value={replaceTerm}
                    onChange={(e) => onReplaceTermChange(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onReplaceCurrent}
                  disabled={totalResults === 0 || !replaceTerm}
                >
                  Substituir
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onReplaceAll}
                  disabled={totalResults === 0 || !replaceTerm}
                >
                  Substituir Todos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Format Settings Modal */}
      <DialogueFormatSettings
        open={showFormatSettings}
        formats={searchOptions.dialogueFormats}
        onOpenChange={setShowFormatSettings}
        onApply={onDialogueFormatsChange}
      />
    </TooltipProvider>
  );
}
