import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

/**
 * Configuration for badge color states
 */
export interface BadgeColorConfig {
  /**
   * Color name (e.g., "emerald", "blue", "purple")
   */
  color: string;
  /**
   * Classes applied when badge is active/selected
   */
  activeClasses: string;
  /**
   * Classes applied when badge is inactive/unselected
   */
  inactiveClasses: string;
}

/**
 * Individual filter item configuration
 */
export interface FilterItem<T = string> {
  /**
   * Unique value identifier for this filter
   */
  value: T;
  /**
   * Display label for the filter
   */
  label: string;
  /**
   * Count/number to display with the filter
   */
  count: number;
  /**
   * Color configuration for the badge
   */
  colorConfig: BadgeColorConfig;
  /**
   * Optional icon to display before the label
   */
  icon?: LucideIcon;
}

/**
 * Filter row configuration - supports grouping filters in rows
 */
export interface FilterRow<T = string> {
  /**
   * Unique identifier for this row
   */
  id: string;
  /**
   * Items in this filter row
   */
  items: FilterItem<T>[];
  /**
   * Optional label for this row (displayed above the badges)
   */
  label?: string;
}

interface EntityFilterBadgesProps<T = string> {
  /**
   * Total count of all entities (for "All" badge)
   */
  totalCount: number;
  /**
   * Label for the total/all badge
   */
  totalLabel: string;
  /**
   * Array of selected filter values
   */
  selectedFilters: T[];
  /**
   * Filter rows configuration - can be single or multiple rows
   */
  filterRows: FilterRow<T>[];
  /**
   * Callback when a filter is toggled
   */
  onFilterToggle: (value: T) => void;
  /**
   * Callback when "All" badge is clicked (clears all filters)
   */
  onClearFilters: () => void;
  /**
   * Optional className for the container
   */
  className?: string;
}

/**
 * EntityFilterBadges - Reusable filter badges component for entity lists
 *
 * Based on the World tab pattern (ScaleFilterBadges), this component provides
 * a flexible system for filtering entities with colored badges. Supports:
 * - Single row filters (like World scales)
 * - Multiple row filters (like Factions with status + type)
 * - Icons in badges
 * - Custom colors per filter
 *
 * @example Single row (World scales pattern)
 * ```tsx
 * <EntityFilterBadges
 *   totalCount={allRegions.length}
 *   totalLabel={t("filters.all")}
 *   selectedFilters={selectedScales}
 *   onFilterToggle={onScaleToggle}
 *   onClearFilters={handleClearFilters}
 *   filterRows={[
 *     {
 *       id: "scales",
 *       items: [
 *         {
 *           value: "local",
 *           label: t("scales.local"),
 *           count: scaleStats.local,
 *           colorConfig: {
 *             color: "emerald",
 *             activeClasses: "!bg-emerald-500 !text-black !border-emerald-500",
 *             inactiveClasses: "bg-emerald-500/10 border-emerald-500/30..."
 *           }
 *         },
 *         // ... more scales
 *       ]
 *     }
 *   ]}
 * />
 * ```
 *
 * @example Multiple rows (Factions pattern)
 * ```tsx
 * <EntityFilterBadges
 *   totalCount={totalFactions}
 *   totalLabel={t("total_badge")}
 *   selectedFilters={[...selectedStatuses, ...selectedTypes]}
 *   onFilterToggle={handleFilterToggle}
 *   onClearFilters={handleClearAll}
 *   filterRows={[
 *     {
 *       id: "status",
 *       label: "Status",
 *       items: statusFilters
 *     },
 *     {
 *       id: "type",
 *       label: "Type",
 *       items: typeFilters
 *     }
 *   ]}
 * />
 * ```
 */
export function EntityFilterBadges<T extends string = string>({
  totalCount,
  totalLabel,
  selectedFilters,
  filterRows,
  onFilterToggle,
  onClearFilters,
  className = "",
}: EntityFilterBadgesProps<T>) {
  const hasActiveFilters = selectedFilters.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Total Badge - Always shown first */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant={undefined}
          className={`cursor-pointer border transition-colors ${
            !hasActiveFilters
              ? "!bg-primary !text-white !border-primary"
              : "bg-background text-foreground border-border hover:!bg-primary hover:!text-white hover:!border-primary"
          }`}
          onClick={onClearFilters}
        >
          {totalCount} {totalLabel}
        </Badge>
      </div>

      {/* Filter Rows */}
      {filterRows.map((row) => (
        <div key={row.id} className="space-y-2">
          {/* Optional row label */}
          {row.label && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {row.label}
            </p>
          )}

          {/* Filter badges for this row */}
          <div className="flex items-center gap-2 flex-wrap">
            {row.items.map((item) => {
              const isActive = selectedFilters.includes(item.value);
              const Icon = item.icon;

              return (
                <Badge
                  key={item.value}
                  variant={undefined}
                  className={`cursor-pointer border transition-colors ${
                    isActive
                      ? item.colorConfig.activeClasses
                      : item.colorConfig.inactiveClasses
                  }`}
                  onClick={() => onFilterToggle(item.value)}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
                  {item.count} {item.label}
                </Badge>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
