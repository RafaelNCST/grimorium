import { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Grid column configuration for responsive layouts
 */
export interface GridColsConfig {
  /**
   * Columns on small screens (default: 1)
   */
  sm?: number;
  /**
   * Columns on medium screens (default: 2)
   */
  md?: number;
  /**
   * Columns on large screens (default: 3)
   */
  lg?: number;
  /**
   * Columns on extra large screens (default: 4)
   */
  xl?: number;
  /**
   * Columns on 2xl screens (optional)
   */
  "2xl"?: number;
}

export interface EntityCardListProps<T> {
  /**
   * Layout type for the card list
   * - "grid": Responsive grid layout (default)
   * - "horizontal": Horizontal scrolling list
   * - "vertical": Vertical stacked list
   */
  layout?: "grid" | "horizontal" | "vertical";
  /**
   * Items to render
   */
  items: T[];
  /**
   * Function to render each item as a card
   */
  renderCard: (item: T, index: number) => ReactNode;
  /**
   * Grid columns configuration for responsive grid layout
   * Only applies when layout="grid"
   */
  gridCols?: GridColsConfig;
  /**
   * Gap spacing between cards (Tailwind spacing scale)
   * @default 4
   */
  gap?: number;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * EntityCardList - Generic component for rendering lists of cards
 *
 * Supports three different layout types:
 * - Grid: Responsive grid with configurable columns
 * - Horizontal: Horizontal scrolling list
 * - Vertical: Vertical stacked list
 *
 * @example Grid layout (default - World pattern)
 * ```tsx
 * <EntityCardList
 *   items={regions}
 *   renderCard={(region) => (
 *     <RegionCard
 *       key={region.id}
 *       region={region}
 *       onClick={onRegionClick}
 *     />
 *   )}
 *   gridCols={{ sm: 1, md: 2, lg: 3, xl: 4 }}
 * />
 * ```
 *
 * @example Horizontal scrolling
 * ```tsx
 * <EntityCardList
 *   layout="horizontal"
 *   items={recentCharacters}
 *   renderCard={(character) => <CharacterCard character={character} />}
 *   gap={3}
 * />
 * ```
 *
 * @example Vertical list
 * ```tsx
 * <EntityCardList
 *   layout="vertical"
 *   items={notes}
 *   renderCard={(note) => <NoteCard note={note} />}
 *   gap={2}
 * />
 * ```
 */
export function EntityCardList<T>({
  layout = "grid",
  items,
  renderCard,
  gridCols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className = "",
}: EntityCardListProps<T>) {
  // Build grid column classes for responsive grid
  const getGridClasses = () => {
    if (layout !== "grid") return "";

    const colClasses: string[] = [];

    // Default to 1 column
    colClasses.push("grid-cols-1");

    // Add responsive column classes
    if (gridCols.sm && gridCols.sm !== 1) {
      colClasses.push(`sm:grid-cols-${gridCols.sm}`);
    }
    if (gridCols.md) {
      colClasses.push(`md:grid-cols-${gridCols.md}`);
    }
    if (gridCols.lg) {
      colClasses.push(`lg:grid-cols-${gridCols.lg}`);
    }
    if (gridCols.xl) {
      colClasses.push(`xl:grid-cols-${gridCols.xl}`);
    }
    if (gridCols["2xl"]) {
      colClasses.push(`2xl:grid-cols-${gridCols["2xl"]}`);
    }

    return colClasses.join(" ");
  };

  // Grid layout (default - World pattern)
  if (layout === "grid") {
    return (
      <div className={cn("grid", getGridClasses(), `gap-${gap}`, className)}>
        {items.map((item, index) => renderCard(item, index))}
      </div>
    );
  }

  // Horizontal scrolling layout
  if (layout === "horizontal") {
    return (
      <div
        className={cn(
          "flex overflow-x-auto pb-4",
          `gap-${gap}`,
          // Hide scrollbar on webkit browsers
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          className
        )}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {renderCard(item, index)}
          </div>
        ))}
      </div>
    );
  }

  // Vertical stacked layout
  return (
    <div className={cn("flex flex-col", `gap-${gap}`, className)}>
      {items.map((item, index) => renderCard(item, index))}
    </div>
  );
}
