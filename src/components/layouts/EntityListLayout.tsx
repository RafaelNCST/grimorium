import { ReactNode } from "react";

import { LucideIcon, Loader2 } from "lucide-react";

import { EmptyState, EmptyStateButton } from "@/components/empty-state";
import {
  EntityListHeader,
  EntitySearchBar,
  EntityFilterBadges,
  HeaderAction,
  FilterRow,
} from "@/components/entity-list";

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
  /**
   * Icon to display
   */
  icon: LucideIcon;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description: string;
  /**
   * Optional primary action button
   */
  primaryButton?: EmptyStateButton;
  /**
   * Optional secondary action button
   */
  secondaryButton?: EmptyStateButton;
}

/**
 * Header configuration
 */
export interface HeaderConfig {
  /**
   * Main title
   */
  title: string;
  /**
   * Description/subtitle
   */
  description: string;
  /**
   * Primary action (typically "Create New")
   */
  primaryAction: HeaderAction;
  /**
   * Optional secondary actions
   */
  secondaryActions?: HeaderAction[];
}

/**
 * Search configuration
 */
export interface SearchConfig {
  /**
   * Current search value
   */
  value: string;
  /**
   * Search change handler
   */
  onChange: (value: string) => void;
  /**
   * Placeholder text
   */
  placeholder: string;
}

/**
 * Filter configuration
 */
export interface FilterConfig<T = string> {
  /**
   * Total count of all items
   */
  totalCount: number;
  /**
   * Label for the total badge
   */
  totalLabel: string;
  /**
   * Currently selected filters
   */
  selectedFilters: T[];
  /**
   * Filter rows configuration
   */
  filterRows: FilterRow<T>[];
  /**
   * Filter toggle handler
   */
  onFilterToggle: (value: T) => void;
  /**
   * Clear all filters handler
   */
  onClearFilters: () => void;
}

export interface EntityListLayoutProps<T = string> {
  /**
   * Loading state - when true, shows loading spinner
   */
  isLoading: boolean;
  /**
   * Optional loading text to display below spinner
   */
  loadingText?: string;
  /**
   * Empty state - when true (and not loading), shows empty state
   */
  isEmpty: boolean;
  /**
   * Empty state configuration
   */
  emptyState: EmptyStateConfig;
  /**
   * Header configuration
   */
  header: HeaderConfig;
  /**
   * Optional search configuration
   */
  search?: SearchConfig;
  /**
   * Optional filter configuration
   */
  filters?: FilterConfig<T>;
  /**
   * Content to render when not loading/empty
   * (typically an EntityCardList)
   */
  children: ReactNode;
  /**
   * Show "no results" state instead of children
   * Use this when filters/search return no results
   */
  showNoResultsState?: boolean;
  /**
   * Optional custom "no results" state configuration
   * Defaults to a search icon with generic message
   */
  noResultsState?: EmptyStateConfig;
}

/**
 * EntityListLayout - Main orchestrator component for entity list pages
 *
 * This component manages the complete lifecycle of an entity list page:
 * - Loading state with spinner
 * - Empty state when no entities exist
 * - Full layout with header, filters, search, and content
 * - No results state when filters/search return empty
 *
 * Based on the World tab pattern, this provides a consistent structure
 * for all entity listing pages in the application.
 *
 * @example Basic usage (World pattern)
 * ```tsx
 * <EntityListLayout
 *   isLoading={isLoading}
 *   loadingText="Loading regions..."
 *   isEmpty={allRegions.length === 0}
 *   emptyState={{
 *     icon: Network,
 *     title: t("empty_state.title"),
 *     description: t("empty_state.description")
 *   }}
 *   header={{
 *     title: t("title"),
 *     description: t("description"),
 *     primaryAction: {
 *       label: t("new_region_button"),
 *       onClick: () => setShowCreateModal(true),
 *       variant: "magical",
 *       icon: Plus,
 *       className: "animate-glow"
 *     },
 *     secondaryActions: [
 *       {
 *         label: t("manage_hierarchy_button"),
 *         onClick: () => setShowHierarchyModal(true),
 *         variant: "secondary",
 *         icon: Network
 *       }
 *     ]
 *   }}
 *   filters={{
 *     totalCount: allRegions.length,
 *     totalLabel: t("filters.all"),
 *     selectedFilters: selectedScales,
 *     filterRows: scaleFilterRows,
 *     onFilterToggle: onScaleToggle,
 *     onClearFilters: handleClearFilters
 *   }}
 *   search={{
 *     value: searchQuery,
 *     onChange: setSearchQuery,
 *     placeholder: t("search_placeholder")
 *   }}
 *   showNoResultsState={filteredRegions.length === 0}
 * >
 *   <EntityCardList
 *     items={filteredRegions}
 *     renderCard={(region) => <RegionCard region={region} />}
 *   />
 * </EntityListLayout>
 * ```
 *
 * @example Without filters/search
 * ```tsx
 * <EntityListLayout
 *   isLoading={loading}
 *   isEmpty={characters.length === 0}
 *   emptyState={{
 *     icon: Users,
 *     title: "No characters yet",
 *     description: "Create your first character to get started",
 *     primaryButton: {
 *       label: "Create Character",
 *       onClick: handleCreate,
 *       variant: "magical"
 *     }
 *   }}
 *   header={{
 *     title: "Characters",
 *     description: "Manage your story characters",
 *     primaryAction: {
 *       label: "New Character",
 *       onClick: handleCreate,
 *       variant: "magical"
 *     }
 *   }}
 * >
 *   <EntityCardList
 *     items={characters}
 *     renderCard={(char) => <CharacterCard character={char} />}
 *   />
 * </EntityListLayout>
 * ```
 */
export function EntityListLayout<T extends string = string>({
  isLoading,
  loadingText = "Loading...",
  isEmpty,
  emptyState,
  header,
  search,
  filters,
  children,
  showNoResultsState = false,
  noResultsState,
}: EntityListLayoutProps<T>) {
  // Loading state - centered spinner
  if (isLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    );
  }

  // Empty state - show header + empty state (no filters/search)
  if (isEmpty) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <EntityListHeader
          title={header.title}
          description={header.description}
          primaryAction={header.primaryAction}
          secondaryActions={header.secondaryActions}
        />

        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          primaryButton={emptyState.primaryButton}
          secondaryButton={emptyState.secondaryButton}
        />
      </div>
    );
  }

  // Full layout with data
  return (
    <div className="space-y-6">
      {/* Header with optional filters as children */}
      <EntityListHeader
        title={header.title}
        description={header.description}
        primaryAction={header.primaryAction}
        secondaryActions={header.secondaryActions}
      >
        {/* Filters (if provided) */}
        {filters && (
          <EntityFilterBadges
            totalCount={filters.totalCount}
            totalLabel={filters.totalLabel}
            selectedFilters={filters.selectedFilters}
            filterRows={filters.filterRows}
            onFilterToggle={filters.onFilterToggle}
            onClearFilters={filters.onClearFilters}
          />
        )}
      </EntityListHeader>

      {/* Search Bar (if provided) */}
      {search && (
        <EntitySearchBar
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
        />
      )}

      {/* Content or No Results State */}
      {showNoResultsState ? (
        <EmptyState
          icon={noResultsState?.icon || emptyState.icon}
          title={noResultsState?.title || "No results found"}
          description={
            noResultsState?.description ||
            "Try adjusting your search or filters"
          }
          primaryButton={noResultsState?.primaryButton}
          secondaryButton={noResultsState?.secondaryButton}
        />
      ) : (
        children
      )}
    </div>
  );
}
