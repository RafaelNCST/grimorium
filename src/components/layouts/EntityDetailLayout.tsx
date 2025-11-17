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
} from "lucide-react";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

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

  // Mode
  isEditMode: boolean;

  // Actions
  onEdit?: () => void;
  onDelete?: () => void;
  extraActions?: ActionButton[];
  editLabel?: string;
  deleteLabel?: string;

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
 * - Header with back button, navigation, and action buttons
 * - Main content area (basic info, advanced fields, extra sections)
 * - Optional versions sidebar
 *
 * @example
 * ```tsx
 * <EntityDetailLayout
 *   onBack={() => navigate(-1)}
 *   isEditMode={isEditing}
 *   onEdit={handleEdit}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 *   onDelete={handleDelete}
 *   hasChanges={hasChanges}
 *   basicFields={<BasicInfoFields />}
 *   advancedFields={<AdvancedFields />}
 *   extraSections={[
 *     {
 *       id: 'timeline',
 *       title: 'Timeline',
 *       content: <TimelineComponent />,
 *       isVisible: sectionVisibility.timeline
 *     }
 *   ]}
 *   versionsPanel={<VersionManager />}
 * />
 * ```
 */
export function EntityDetailLayout({
  // Header
  onBack,
  backLabel = "Voltar",
  showMenuButton = false,
  onMenuToggle,

  // Mode
  isEditMode,

  // Actions
  onEdit,
  onDelete,
  extraActions = [],
  editLabel = "Editar",
  deleteLabel = "Excluir",

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
  const [extraSectionsOpenState, setExtraSectionsOpenState] = React.useState<Record<string, boolean>>(() => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('entityDetailExtraSectionsState');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, use defaults
      }
    }

    // Use defaults from section config
    const initialState: Record<string, boolean> = {};
    extraSections.forEach(section => {
      initialState[section.id] = section.defaultOpen || false;
    });
    return initialState;
  });

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem('entityDetailExtraSectionsState', JSON.stringify(extraSectionsOpenState));
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
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and Menu */}
          <div className="flex items-center gap-4">
            {!isEditMode && (
              <>
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {backLabel}
                </Button>
                {showMenuButton && onMenuToggle && (
                  <Button variant="ghost" size="icon" onClick={onMenuToggle}>
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex flex-col items-end gap-1">
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
                  <Tooltip key={index}>
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
                  <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost-destructive"
                    size="icon"
                    onClick={onDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Central content */}
        <main
          className={cn(
            "flex-1 min-w-0 overflow-y-auto",
            isEditMode ? "w-full" : versionsPanel ? "lg:flex-[3]" : "w-full"
          )}
        >
          <div className="space-y-6 max-w-7xl mx-auto px-4">
            {/* Basic Information Card */}
            <Card className="card-magical">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent>{basicFields}</CardContent>
            </Card>

            {/* Advanced Section - Collapsible */}
            {advancedFields && (
              <Collapsible
                open={advancedSectionOpen}
                onOpenChange={onAdvancedSectionToggle}
              >
                <Card className="card-magical">
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity">
                        <CardTitle>{advancedSectionTitle}</CardTitle>
                        {advancedSectionOpen ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>{advancedFields}</CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Extra Sections */}
            {extraSections.map((section) => {
              // Hide section in view mode if isVisible is false
              if (!isEditMode && section.isVisible === false) {
                return null;
              }

              const isOpen = extraSectionsOpenState[section.id] ?? section.defaultOpen ?? false;

              return (
                <Collapsible
                  key={section.id}
                  open={isOpen}
                  onOpenChange={(open) => {
                    setExtraSectionsOpenState(prev => ({
                      ...prev,
                      [section.id]: open
                    }));
                  }}
                >
                  <Card
                    className={cn(
                      "card-magical transition-all duration-200",
                      section.isVisible === false && isEditMode
                        ? "opacity-50 bg-muted/30 border-dashed border-muted-foreground/30"
                        : ""
                    )}
                  >
                    <CardHeader>
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity">
                          <CardTitle>{section.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            {isEditMode && section.onVisibilityToggle && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      section.onVisibilityToggle?.();
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    {section.isVisible !== false ? (
                                      <Eye className="w-3 h-3" />
                                    ) : (
                                      <EyeOff className="w-3 h-3" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {section.isVisible !== false
                                      ? "Ocultar seção"
                                      : "Mostrar seção"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {section.isCollapsible !== false && (
                              <>
                                {isOpen ? (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                )}
                              </>
                            )}
                          </div>
                        </button>
                      </CollapsibleTrigger>
                    </CardHeader>
                    {section.isCollapsible !== false ? (
                      <CollapsibleContent>
                        <CardContent>{section.content}</CardContent>
                      </CollapsibleContent>
                    ) : (
                      <CardContent>{section.content}</CardContent>
                    )}
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </main>

        {/* Versions sidebar - Only show in view mode */}
        {!isEditMode && versionsPanel && (
          <aside className="hidden lg:flex lg:flex-[1] lg:min-w-[280px] lg:max-w-[400px] h-full overflow-y-auto">
            {versionsPanel}
          </aside>
        )}
      </div>
    </div>
  );
}
