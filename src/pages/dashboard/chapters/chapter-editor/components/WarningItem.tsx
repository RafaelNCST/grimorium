/**
 * Componente de Item de Aviso
 *
 * Exibe um aviso individual no menu lateral de avisos, com:
 * - Título e mensagem
 * - Data e horário
 * - Ícone por tipo
 * - Botão de remover
 * - Clique para executar ação
 */

import React from "react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  X,
  Type,
  FileText,
  Target,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Warning,
  WARNING_SEVERITY_COLORS,
  WARNING_SEVERITY_LABELS,
} from "../types/warnings";

interface WarningItemProps {
  warning: Warning;
  onRemove: (id: string) => void;
  onClick: (warning: Warning) => void;
}

/**
 * Mapeamento de ícones por tipo de aviso
 */
const TYPE_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  typography: Type,
  goals: Target,
  time: AlertTriangle,
};

/**
 * Mapeamento de ícones por severidade
 */
const SEVERITY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  info: Info,
  warning: AlertCircle,
  error: AlertTriangle,
};

export function WarningItem({ warning, onRemove, onClick }: WarningItemProps) {
  const TypeIcon = TYPE_ICON_MAP[warning.type];
  const SeverityIcon = SEVERITY_ICON_MAP[warning.severity];

  const formattedDate = format(new Date(warning.createdAt), "dd/MM/yyyy", {
    locale: ptBR,
  });

  const formattedTime = format(new Date(warning.createdAt), "HH:mm", {
    locale: ptBR,
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 p-3 rounded-lg border cursor-pointer",
        "hover:bg-white/5 dark:hover:bg-white/10 hover:border-primary/30 transition-colors duration-200",
        WARNING_SEVERITY_COLORS[warning.severity]
      )}
      onClick={() => onClick(warning)}
    >
      {/* Header com título e botão remover */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* Ícone de tipo */}
          <TypeIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />

          {/* Título */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight truncate">
              {warning.title}
            </h4>
          </div>
        </div>

        {/* Botão remover */}
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(warning.id);
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Mensagem */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {warning.message}
      </p>

      {/* Footer com data/hora e severidade */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        {/* Data e hora */}
        <span className="flex items-center gap-1">
          {formattedDate} às {formattedTime}
        </span>

        {/* Indicador de severidade */}
        <div className="flex items-center gap-1">
          <SeverityIcon className="w-3 h-3" />
          <span>{WARNING_SEVERITY_LABELS[warning.severity]}</span>
        </div>
      </div>
    </div>
  );
}
