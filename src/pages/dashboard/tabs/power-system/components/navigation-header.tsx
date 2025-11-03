import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";

interface NavigationHeaderProps {
  canGoBack: boolean;
  canGoForward: boolean;
  currentIndex: number;
  currentAreaName: string;
  isMainArea: boolean;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onNameChange: (name: string) => void;
}

export function NavigationHeader({
  canGoBack,
  canGoForward,
  currentIndex,
  currentAreaName,
  isMainArea,
  onNavigateBack,
  onNavigateForward,
  onNameChange,
}: NavigationHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentAreaName);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalNameRef = useRef(currentAreaName);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedName(currentAreaName);
  }, [currentAreaName]);

  const handleStartEdit = () => {
    if (isMainArea) return;
    originalNameRef.current = currentAreaName;
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editedName.trim();
    if (trimmed && trimmed !== originalNameRef.current) {
      onNameChange(trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(originalNameRef.current);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    // Se conteúdo mudou, salva. Senão, cancela.
    const trimmed = editedName.trim();
    if (trimmed && trimmed !== originalNameRef.current) {
      handleSave();
    } else {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        size="sm"
        disabled={!canGoBack}
        onClick={onNavigateBack}
        title="Voltar"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Indicador + Nome */}
      <div className="flex items-center gap-2">
        {/* Número da posição na pilha */}
        <span className="text-sm font-mono text-muted-foreground">
          #{currentIndex + 1}
        </span>

        <span className="text-muted-foreground">-</span>

        {/* Nome editável */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="px-2 py-1 text-sm border rounded bg-background"
            style={{ minWidth: "150px" }}
          />
        ) : (
          <button
            className={`text-sm font-medium ${
              isMainArea ? "cursor-default" : "cursor-pointer"
            }`}
            onDoubleClick={handleStartEdit}
            disabled={isMainArea}
            title={isMainArea ? "" : "Duplo clique para editar"}
          >
            {currentAreaName}
          </button>
        )}
      </div>

      {/* Botão Avançar */}
      <Button
        variant="ghost"
        size="sm"
        disabled={!canGoForward}
        onClick={onNavigateForward}
        title="Avançar"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
