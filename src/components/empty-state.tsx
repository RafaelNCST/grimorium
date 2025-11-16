import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Button configuration for EmptyState actions
 */
export interface EmptyStateButton {
  /**
   * Button label text
   */
  label: string;
  /**
   * Click handler
   */
  onClick: () => void;
  /**
   * Button variant (default: "magical" for primary, "outline" for secondary)
   */
  variant?: "default" | "outline" | "ghost" | "magical" | "destructive";
  /**
   * Optional icon to display before the label
   */
  icon?: LucideIcon;
}

interface PropsEmptyState {
  /**
   * Icon to display at the top
   */
  icon: LucideIcon;
  /**
   * Main title text
   */
  title: string;
  /**
   * Description/subtitle text
   */
  description: string;
  /**
   * @deprecated Use primaryButton instead
   * Legacy action label (maintained for backwards compatibility)
   */
  actionLabel?: string;
  /**
   * @deprecated Use primaryButton instead
   * Legacy action handler (maintained for backwards compatibility)
   */
  onAction?: () => void;
  /**
   * Primary action button configuration
   */
  primaryButton?: EmptyStateButton;
  /**
   * Optional secondary action button
   */
  secondaryButton?: EmptyStateButton;
}

/**
 * EmptyState - Reusable empty state component
 *
 * Displays an icon, title, description, and optional action buttons.
 * Supports both single and multiple buttons.
 *
 * @example Single button (legacy API - still supported)
 * ```tsx
 * <EmptyState
 *   icon={Network}
 *   title={t("empty_state.title")}
 *   description={t("empty_state.description")}
 *   actionLabel={t("create_button")}
 *   onAction={() => setShowModal(true)}
 * />
 * ```
 *
 * @example Single button (new API)
 * ```tsx
 * <EmptyState
 *   icon={Users}
 *   title="No characters yet"
 *   description="Create your first character to get started"
 *   primaryButton={{
 *     label: "Create Character",
 *     onClick: handleCreate,
 *     variant: "magical",
 *     icon: Plus
 *   }}
 * />
 * ```
 *
 * @example Multiple buttons
 * ```tsx
 * <EmptyState
 *   icon={FileText}
 *   title="No documents found"
 *   description="Import existing documents or create a new one"
 *   primaryButton={{
 *     label: "Create New",
 *     onClick: handleCreate,
 *     variant: "magical"
 *   }}
 *   secondaryButton={{
 *     label: "Import",
 *     onClick: handleImport,
 *     variant: "outline"
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  primaryButton,
  secondaryButton,
}: PropsEmptyState) {
  // Support legacy API - convert to primaryButton if provided
  const primary = primaryButton || (actionLabel && onAction
    ? { label: actionLabel, onClick: onAction, variant: "magical" as const }
    : undefined);

  const hasButtons = primary || secondaryButton;

  return (
    <div className="text-center flex-1 flex flex-col items-center justify-center">
      <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>

      {hasButtons && (
        <div className="flex items-center gap-2">
          {/* Secondary button (rendered first, on the left) */}
          {secondaryButton && (
            <Button
              variant={secondaryButton.variant || "outline"}
              onClick={secondaryButton.onClick}
            >
              {secondaryButton.icon && (
                <secondaryButton.icon className="w-4 h-4 mr-2" />
              )}
              {secondaryButton.label}
            </Button>
          )}

          {/* Primary button */}
          {primary && (
            <Button
              variant={primary.variant || "magical"}
              onClick={primary.onClick}
            >
              {primary.icon && <primary.icon className="w-4 h-4 mr-2" />}
              {primary.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
