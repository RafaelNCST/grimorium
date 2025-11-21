import * as React from "react";
import { type ReactNode } from "react";

import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface CollapsibleSectionProps {
  /** Título da seção */
  title: string;

  /** Estado de abertura da seção */
  isOpen: boolean;

  /** Callback quando o estado de abertura muda */
  onToggle: () => void;

  /** Conteúdo interno da seção */
  children: ReactNode;

  /** Se está em modo de edição (habilita toggle de visibilidade) */
  isEditMode?: boolean;

  /** Se a seção está visível (controla opacidade e estilo) */
  isVisible?: boolean;

  /** Callback quando a visibilidade é alterada */
  onVisibilityToggle?: () => void;

  /** Classes CSS adicionais para o Card */
  className?: string;

  /** Se a seção pode ser colapsada (default: true) */
  isCollapsible?: boolean;
}

/**
 * CollapsibleSection - Componente de seção colapsável padronizada
 *
 * Fornece uma estrutura consistente para seções colapsáveis em páginas de detalhes.
 * Inclui:
 * - Card com estilo "card-magical"
 * - Header com título e ícone de chevron
 * - Toggle de visibilidade opcional (modo edição)
 * - Padding interno padronizado via CardContent
 * - Estilos automáticos para estado visível/invisível
 *
 * @example
 * ```tsx
 * <CollapsibleSection
 *   title="Informações Avançadas"
 *   isOpen={isAdvancedOpen}
 *   onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
 * >
 *   <div>Conteúdo aqui</div>
 * </CollapsibleSection>
 * ```
 *
 * @example Com controle de visibilidade
 * ```tsx
 * <CollapsibleSection
 *   title="Relacionamentos"
 *   isOpen={isRelationshipsOpen}
 *   onToggle={() => setIsRelationshipsOpen(!isRelationshipsOpen)}
 *   isEditMode={isEditing}
 *   isVisible={showRelationships}
 *   onVisibilityToggle={() => setShowRelationships(!showRelationships)}
 * >
 *   <RelationshipsContent />
 * </CollapsibleSection>
 * ```
 */
export function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  isEditMode = false,
  isVisible = true,
  onVisibilityToggle,
  className,
  isCollapsible = true,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card
        className={cn(
          "card-magical transition-all duration-200 overflow-hidden",
          isVisible === false && isEditMode
            ? "opacity-50 bg-muted/30 border-dashed border-muted-foreground/30"
            : "",
          className
        )}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200">
            <div className="flex items-center justify-between w-full">
              <CardTitle>{title}</CardTitle>
              <div className="flex items-center gap-2">
                {/* Visibility Toggle - Only in edit mode */}
                {isEditMode && onVisibilityToggle && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVisibilityToggle();
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {isVisible !== false ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isVisible !== false
                          ? "Ocultar seção"
                          : "Mostrar seção"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Chevron Icon - Only if collapsible */}
                {isCollapsible && (
                  <>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        {/* Content with padding */}
        {isCollapsible ? (
          <CollapsibleContent>
            <CardContent className="pt-6">{children}</CardContent>
          </CollapsibleContent>
        ) : (
          <CardContent>{children}</CardContent>
        )}
      </Card>
    </Collapsible>
  );
}
