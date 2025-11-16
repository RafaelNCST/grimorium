import { ReactNode } from "react";

import { LucideIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Action button configuration
 */
export interface HeaderAction {
  /**
   * Button label
   */
  label: string;
  /**
   * Click handler
   */
  onClick: () => void;
  /**
   * Button variant (default: "outline")
   */
  variant?: "default" | "outline" | "ghost" | "magical" | "destructive";
  /**
   * Button size (default: "default")
   */
  size?: "default" | "sm" | "lg" | "icon";
  /**
   * Icon to display before label
   */
  icon?: LucideIcon;
  /**
   * Additional classes
   */
  className?: string;
}

interface EntityListHeaderProps {
  /**
   * Main title for the entity list
   */
  title: string;
  /**
   * Description/subtitle text
   */
  description: string;
  /**
   * Primary action button (typically "Create New")
   */
  primaryAction: HeaderAction;
  /**
   * Optional secondary actions (displayed before primary)
   */
  secondaryActions?: HeaderAction[];
  /**
   * Optional content to display below title/description
   * (typically filter badges)
   */
  children?: ReactNode;
  /**
   * Optional className for the container
   */
  className?: string;
}

/**
 * EntityListHeader - Reusable header component for entity list pages
 *
 * Based on the World tab pattern, this component provides a consistent
 * header layout with title, description, and action buttons.
 *
 * @example Basic usage (World pattern)
 * ```tsx
 * <EntityListHeader
 *   title={t("world:title")}
 *   description={t("world:description")}
 *   primaryAction={{
 *     label: t("world:new_region_button"),
 *     onClick: () => setShowCreateModal(true),
 *     variant: "magical",
 *     icon: Plus,
 *     className: "animate-glow"
 *   }}
 *   secondaryActions={[
 *     {
 *       label: t("world:manage_hierarchy_button"),
 *       onClick: () => setShowHierarchyModal(true),
 *       variant: "outline",
 *       icon: Network
 *     }
 *   ]}
 * />
 * ```
 *
 * @example With filter badges as children
 * ```tsx
 * <EntityListHeader
 *   title={t("characters:title")}
 *   description={t("characters:description")}
 *   primaryAction={{
 *     label: t("characters:new_character"),
 *     onClick: handleCreate,
 *     variant: "magical",
 *     size: "lg"
 *   }}
 * >
 *   <EntityFilterBadges
 *     totalCount={totalCharacters}
 *     // ... filter props
 *   />
 * </EntityListHeader>
 * ```
 */
export function EntityListHeader({
  title,
  description,
  primaryAction,
  secondaryActions = [],
  children,
  className = "",
}: EntityListHeaderProps) {
  const PrimaryIcon = primaryAction.icon || Plus;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with title and actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Secondary actions */}
          {secondaryActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size={action.size || "default"}
                onClick={action.onClick}
                className={action.className}
              >
                {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            );
          })}

          {/* Primary action */}
          <Button
            variant={primaryAction.variant || "magical"}
            size={primaryAction.size || "default"}
            onClick={primaryAction.onClick}
            className={primaryAction.className || "animate-glow"}
          >
            <PrimaryIcon className="w-4 h-4 mr-2" />
            {primaryAction.label}
          </Button>
        </div>
      </div>

      {/* Optional children (typically filter badges) */}
      {children}
    </div>
  );
}
