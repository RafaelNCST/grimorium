import * as React from "react";
import { type ReactNode } from "react";

import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { InfoAlert } from "@/components/ui/info-alert";
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

  // ========== EMPTY STATE PROPS ==========
  /** Estado vazio da seção */
  emptyState?:
    | "empty-view"
    | "empty-edit"
    | "blocked-no-data"
    | "blocked-all-used"
    | null;

  /** Ícone para o estado vazio (visualização) */
  emptyIcon?: LucideIcon;

  /** Título do estado vazio (visualização) */
  emptyTitle?: string;

  /** Descrição do estado vazio (visualização) */
  emptyDescription?: string;

  /** Label do botão de adicionar (edição) */
  addButtonLabel?: string;

  /** Callback quando o botão de adicionar é clicado */
  onAddClick?: () => void;

  /** Label do botão secundário (edição) */
  secondaryButtonLabel?: string;

  /** Ícone do botão secundário */
  SecondaryButtonIcon?: LucideIcon;

  /** Callback quando o botão secundário é clicado */
  onSecondaryClick?: () => void;

  /** Nome da entidade bloqueada (ex: "personagens", "facções") */
  blockedEntityName?: string;
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
 * - Estados vazios padronizados (empty-view, empty-edit, blocked-no-data, blocked-all-used)
 *
 * @example Básico
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
 *
 * @example Estado vazio em visualização
 * ```tsx
 * <CollapsibleSection
 *   title="Relacionamentos"
 *   isOpen={true}
 *   onToggle={() => {}}
 *   emptyState="empty-view"
 *   emptyIcon={Users}
 *   emptyTitle="Nenhum relacionamento"
 *   emptyDescription="Este personagem ainda não tem relacionamentos cadastrados"
 * />
 * ```
 *
 * @example Estado vazio em edição
 * ```tsx
 * <CollapsibleSection
 *   title="Relacionamentos"
 *   isOpen={true}
 *   onToggle={() => {}}
 *   isEditMode={true}
 *   emptyState="empty-edit"
 *   addButtonLabel="Adicionar Relacionamento"
 *   onAddClick={() => setIsAddDialogOpen(true)}
 * />
 * ```
 *
 * @example Estado bloqueado sem dados
 * ```tsx
 * <CollapsibleSection
 *   title="Relacionamentos"
 *   isOpen={true}
 *   onToggle={() => {}}
 *   isEditMode={true}
 *   emptyState="blocked-no-data"
 *   blockedEntityName="personagens"
 * />
 * ```
 *
 * @example Estado bloqueado com todos os dados usados
 * ```tsx
 * <CollapsibleSection
 *   title="Relacionamentos"
 *   isOpen={true}
 *   onToggle={() => {}}
 *   isEditMode={true}
 *   emptyState="blocked-all-used"
 *   blockedEntityName="personagens"
 * >
 *   <div className="space-y-3">
 *     {relationships.map((rel) => (
 *       <RelationshipCard key={rel.id} relationship={rel} />
 *     ))}
 *   </div>
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
  // Empty state props
  emptyState = null,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  addButtonLabel,
  onAddClick,
  secondaryButtonLabel,
  SecondaryButtonIcon,
  onSecondaryClick,
  blockedEntityName,
}: CollapsibleSectionProps) {
  const { t } = useTranslation(["empty-states", "common"]);

  // Renderizar conteúdo do estado vazio
  const renderEmptyState = () => {
    // Estado 1: Vazio em visualização
    if (emptyState === "empty-view" && !isEditMode) {
      return (
        <div className="text-center text-muted-foreground text-sm py-8">
          {EmptyIcon && (
            <EmptyIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          )}
          {emptyTitle && <p className="font-medium">{emptyTitle}</p>}
          {emptyDescription && (
            <p className="text-xs mt-1">{emptyDescription}</p>
          )}
        </div>
      );
    }

    // Estado 2: Vazio em edição - Botão magical + botão secundário opcional + children (for dialogs)
    if (emptyState === "empty-edit" && isEditMode) {
      return (
        <>
          <div className="flex gap-2">
            <Button onClick={onAddClick} className="flex-1" variant="magical">
              <Plus className="w-4 h-4 mr-2" />
              {addButtonLabel}
            </Button>
            {secondaryButtonLabel && onSecondaryClick && (
              <Button
                onClick={onSecondaryClick}
                className="flex-1"
                variant="secondary"
              >
                {SecondaryButtonIcon && (
                  <SecondaryButtonIcon className="w-4 h-4 mr-2" />
                )}
                {secondaryButtonLabel}
              </Button>
            )}
          </div>
          {/* Render children hidden so dialogs inside them can still work */}
          {children && <div className="hidden">{children}</div>}
        </>
      );
    }

    // Estado 3: Bloqueado porque não há dados para adicionar
    if (emptyState === "blocked-no-data" && isEditMode) {
      return (
        <InfoAlert>
          <p className="font-medium">
            {t("empty-states:entities.not_enough", {
              entityName: blockedEntityName,
            })}
          </p>
          <p className="text-xs mt-1">
            {t("empty-states:entities.need_to_register_more", {
              entityName: blockedEntityName,
            })}
          </p>
        </InfoAlert>
      );
    }

    // Estado 4: Bloqueado porque todos os dados já foram usados
    if (emptyState === "blocked-all-used" && isEditMode) {
      return (
        <div className="space-y-4">
          <InfoAlert>
            <p className="font-medium">
              {t("empty-states:entities.all_added", {
                entityName: blockedEntityName,
              })}
            </p>
            <p className="text-xs mt-1">
              {t("empty-states:entities.to_add_more_register_new", {
                entityName: blockedEntityName,
              })}
            </p>
          </InfoAlert>
          {children && <div>{children}</div>}
        </div>
      );
    }

    // Fallback: renderizar children normalmente
    return children;
  };

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
                          ? t("common:tooltips.hide_section")
                          : t("common:tooltips.show_section")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Chevron Icon - Only if collapsible */}
                {isCollapsible &&
                  (isOpen ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  ))}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        {/* Content with padding */}
        {isCollapsible ? (
          <CollapsibleContent>
            <CardContent className="pt-6">{renderEmptyState()}</CardContent>
          </CollapsibleContent>
        ) : (
          <CardContent>{renderEmptyState()}</CardContent>
        )}
      </Card>
    </Collapsible>
  );
}
