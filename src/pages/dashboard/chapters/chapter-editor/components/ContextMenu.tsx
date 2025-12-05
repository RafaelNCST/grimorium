import { useEffect, useRef } from "react";

import {
  Copy,
  Scissors,
  Clipboard,
  MessageSquare,
  Search,
  Bold,
  Italic,
  ExternalLink,
  Link,
  Unlink,
} from "lucide-react";

import type { EntityLink } from "../types/entity-link";

interface ContextMenuProps {
  x: number;
  y: number;
  hasSelection: boolean;
  onClose: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onAnnotate: () => void;
  onSearch: () => void;
  onBold: () => void;
  onItalic: () => void;
  // Entity link actions
  entityLink?: EntityLink | null;
  hasAnnotation?: boolean;
  onViewEntityDetails?: () => void;
  onViewAnnotation?: () => void;
  onLinkToEntity?: () => void;
  onUnlinkEntity?: () => void;
}

export function ContextMenu({
  x,
  y,
  hasSelection,
  onClose,
  onCopy,
  onCut,
  onPaste,
  onAnnotate,
  onSearch,
  onBold,
  onItalic,
  entityLink,
  hasAnnotation,
  onViewEntityDetails,
  onViewAnnotation,
  onLinkToEntity,
  onUnlinkEntity,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Adjust position if menu goes off-screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [x, y]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] bg-background border border-border rounded-lg shadow-lg py-1 min-w-[200px] animate-in fade-in-0 zoom-in-95 duration-100"
      style={{ left: x, top: y }}
    >
      {/* Clipboard actions */}
      {hasSelection && (
        <>
          <button
            onClick={() => handleAction(onCopy)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Copy className="h-4 w-4" />
            Copiar
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+C
            </span>
          </button>
          <button
            onClick={() => handleAction(onCut)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Scissors className="h-4 w-4" />
            Recortar
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+X
            </span>
          </button>
        </>
      )}

      <button
        onClick={() => handleAction(onPaste)}
        className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
      >
        <Clipboard className="h-4 w-4" />
        Colar
        <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
      </button>

      {/* Separator */}
      {hasSelection && (
        <>
          <div className="my-1 h-px bg-border" />

          {/* Editor actions */}
          <button
            onClick={() => handleAction(onAnnotate)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Criar Anotação
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+M
            </span>
          </button>
          <button
            onClick={() => handleAction(onSearch)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Search className="h-4 w-4" />
            Buscar texto selecionado
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+F
            </span>
          </button>

          {/* Separator */}
          <div className="my-1 h-px bg-border" />

          {/* Formatting */}
          <button
            onClick={() => handleAction(onBold)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Bold className="h-4 w-4" />
            Negrito
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+B
            </span>
          </button>
          <button
            onClick={() => handleAction(onItalic)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Italic className="h-4 w-4" />
            Itálico
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+I
            </span>
          </button>
        </>
      )}

      {/* Entity Link Actions */}
      {(entityLink || hasAnnotation || (hasSelection && onLinkToEntity)) && (
        <>
          <div className="my-1 h-px bg-border" />

          {/* View Entity Details */}
          {entityLink && onViewEntityDetails && (
            <button
              onClick={() => handleAction(onViewEntityDetails)}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Ver detalhes de {entityLink.entity.name}
            </button>
          )}

          {/* View Annotation */}
          {hasAnnotation && onViewAnnotation && (
            <button
              onClick={() => handleAction(onViewAnnotation)}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Ver anotação
            </button>
          )}

          {/* Link to Entity (manual) */}
          {hasSelection && !entityLink && onLinkToEntity && (
            <button
              onClick={() => handleAction(onLinkToEntity)}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <Link className="h-4 w-4" />
              Linkar a entidade mencionada
            </button>
          )}

          {/* Unlink Entity */}
          {entityLink && onUnlinkEntity && (
            <button
              onClick={() => handleAction(onUnlinkEntity)}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors text-destructive hover:bg-destructive/10"
            >
              <Unlink className="h-4 w-4" />
              Remover link
            </button>
          )}
        </>
      )}
    </div>
  );
}
