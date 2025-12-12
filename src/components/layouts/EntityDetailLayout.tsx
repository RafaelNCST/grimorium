import * as React from "react";
import { type ReactNode } from "react";

import {
  type LucideIcon,
  ArrowLeft,
  Edit2,
  Trash2,
  Save,
  X,
  Menu,
  AlertCircle,
} from "lucide-react";

import { CollapsibleSection } from "@/components/layouts/CollapsibleSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Types
export interface NavigationTab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface ActionButton {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "secondary" | "ghost" | "ghost-destructive" | "magical";
  className?: string;
  tooltip?: string;
}

export interface ExtraSection {
  id: string;
  title: string;
  content: ReactNode;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  isVisible?: boolean; // Controls if section is hidden in view mode
  onVisibilityToggle?: () => void; // Called when visibility is toggled (only in edit mode)
}

export interface EntityDetailLayoutProps {
  // Header
  onBack: () => void;
  backLabel?: string;
  showMenuButton?: boolean;
  onMenuToggle?: () => void;
  menuTooltip?: string;

  // Mode
  isEditMode: boolean;

  // Actions
  onEdit?: () => void;
  onDelete?: () => void;
  extraActions?: ActionButton[];
  editLabel?: string;
  deleteLabel?: string;
  editTooltip?: string;
  deleteTooltip?: string;

  // Edit mode actions
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  hasChanges?: boolean;
  hasRequiredFieldsEmpty?: boolean;
  validationMessage?: ReactNode;

  // Content
  basicFields: ReactNode;
  advancedFields?: ReactNode;
  advancedSectionTitle?: string;
  advancedSectionOpen?: boolean;
  onAdvancedSectionToggle?: () => void;
  extraSections?: ExtraSection[];

  // Versions panel (optional)
  versionsPanel?: ReactNode;

  // Loading/Error states
  isLoading?: boolean;
  error?: string;

  // Styling
  className?: string;
}

/**
 * EntityDetailLayout - Reusable layout for entity detail pages
 *
 * Provides a consistent 3-column layout structure:
 * - Header with back button, navigation, and action buttons (STICKY/FIXED)
 * - Main content area (basic info, advanced fields, extra sections)
 * - Optional versions sidebar
 */
export function EntityDetailLayout({
  // Header
  onBack,
  backLabel = "Voltar",
  showMenuButton = false,
  onMenuToggle,
  menuTooltip,

  // Mode
  isEditMode,

  // Actions
  onEdit,
  onDelete,
  extraActions = [],
  editLabel: _editLabel = "Editar",
  deleteLabel: _deleteLabel = "Excluir",
  editTooltip,
  deleteTooltip,

  // Edit mode actions
  onSave,
  onCancel,
  saveLabel = "Salvar",
  cancelLabel = "Cancelar",
  hasChanges = false,
  hasRequiredFieldsEmpty = false,
  validationMessage,

  // Content
  basicFields,
  advancedFields,
  advancedSectionTitle = "Informações Avançadas",
  advancedSectionOpen = false,
  onAdvancedSectionToggle,
  extraSections = [],

  // Versions panel
  versionsPanel,

  // Loading/Error
  isLoading = false,
  error,

  // Styling
  className,
}: EntityDetailLayoutProps) {
  // State to track which extra sections are open - persisted in localStorage
  const [extraSectionsOpenState, setExtraSectionsOpenState] = React.useState<
    Record<string, boolean>
  >(() => {
    // Try to load from localStorage first
    const stored = localStorage.getItem("entityDetailExtraSectionsState");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, use defaults
      }
    }

    // Use defaults from section config
    const initialState: Record<string, boolean> = {};
    extraSections.forEach((section) => {
      initialState[section.id] = section.defaultOpen || false;
    });
    return initialState;
  });

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem(
      "entityDetailExtraSectionsState",
      JSON.stringify(extraSectionsOpenState)
    );
  }, [extraSectionsOpenState]);
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <header className="fixed top-8 left-0 right-0 z-50 bg-background border-b shadow-sm py-3 px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Back button and Menu */}
          {!isEditMode && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backLabel}
              </Button>
              {showMenuButton && onMenuToggle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onMenuToggle}>
                      <Menu className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  {menuTooltip && (
                    <TooltipContent>
                      <p>{menuTooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )}
            </div>
          )}

          {/* Right side - Action buttons */}
          <div className="flex flex-col items-end gap-1 shrink-0 ml-auto">
            {isEditMode ? (
              <>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={onCancel}>
                    <X className="w-4 h-4 mr-2" />
                    {cancelLabel}
                  </Button>
                  <Button
                    variant="magical"
                    className="animate-glow"
                    onClick={onSave}
                    disabled={!hasChanges || hasRequiredFieldsEmpty}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveLabel}
                  </Button>
                </div>
                {validationMessage && (
                  <div className="text-xs text-destructive">
                    {validationMessage}
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                {extraActions.map((action, index) => (
                  <Tooltip
                    key={`${action.tooltip || action.icon.name}-${index}`}
                  >
                    <TooltipTrigger asChild>
                      <Button
                        variant={action.variant || "ghost"}
                        size="icon"
                        onClick={action.onClick}
                        className={action.className}
                      >
                        <action.icon className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    {action.tooltip && (
                      <TooltipContent>
                        <p>{action.tooltip}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
                {onEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    {editTooltip && (
                      <TooltipContent>
                        <p>{editTooltip}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost-destructive"
                        size="icon"
                        onClick={onDelete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    {deleteTooltip && (
                      <TooltipContent>
                        <p>{deleteTooltip}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 gap-4 pt-14 pb-6">
        {/* Central content */}
        <main
          className={cn(
            "flex-1 min-w-0",
            isEditMode ? "w-full" : versionsPanel ? "lg:flex-[3]" : "w-full"
          )}
        >
          <div className="space-y-6 max-w-7xl mx-auto pb-6">
            {/* Basic Information Card */}
            <Card className="card-magical">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent>{basicFields}</CardContent>
            </Card>

            {/* Advanced Section - Collapsible */}
            {advancedFields && (
              <CollapsibleSection
                title={advancedSectionTitle}
                isOpen={advancedSectionOpen}
                onToggle={onAdvancedSectionToggle}
              >
                {advancedFields}
              </CollapsibleSection>
            )}

            {/* Extra Sections */}
            {extraSections.map((section) => {
              // Hide section in view mode if isVisible is false
              if (!isEditMode && section.isVisible === false) {
                return null;
              }

              const isOpen =
                extraSectionsOpenState[section.id] ??
                section.defaultOpen ??
                false;

              return (
                <CollapsibleSection
                  key={section.id}
                  title={section.title}
                  isOpen={isOpen}
                  onToggle={() => {
                    setExtraSectionsOpenState((prev) => ({
                      ...prev,
                      [section.id]: !isOpen,
                    }));
                  }}
                  isEditMode={isEditMode}
                  isVisible={section.isVisible}
                  onVisibilityToggle={section.onVisibilityToggle}
                  isCollapsible={section.isCollapsible}
                  // Empty state props
                  emptyState={(section as any).emptyState}
                  emptyIcon={(section as any).emptyIcon}
                  emptyTitle={(section as any).emptyTitle}
                  emptyDescription={(section as any).emptyDescription}
                  addButtonLabel={(section as any).addButtonLabel}
                  onAddClick={(section as any).onAddClick}
                  secondaryButtonLabel={(section as any).secondaryButtonLabel}
                  SecondaryButtonIcon={(section as any).SecondaryButtonIcon}
                  onSecondaryClick={(section as any).onSecondaryClick}
                  blockedEntityName={(section as any).blockedEntityName}
                >
                  {section.content}
                </CollapsibleSection>
              );
            })}
          </div>
        </main>

        {/* Versions sidebar - Only show in view mode */}
        {!isEditMode && versionsPanel && (
          <aside className="hidden lg:block lg:flex-[1] lg:min-w-[280px] lg:max-w-[400px]">
            {versionsPanel}
          </aside>
        )}
      </div>
    </div>
  );
}
