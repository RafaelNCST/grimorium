import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface EntitySearchBarProps {
  /**
   * Search input value
   */
  value: string;
  /**
   * Callback when search value changes
   */
  onChange: (value: string) => void;
  /**
   * Placeholder text for the search input
   */
  placeholder: string;
  /**
   * Optional className for the container
   */
  className?: string;
  /**
   * Optional max width for the search bar (default: max-w-md)
   */
  maxWidth?: string;
}

/**
 * EntitySearchBar - Reusable search bar component for entity lists
 *
 * Based on the World tab pattern, this component provides a consistent
 * search input with an icon on the left side.
 *
 * @example
 * ```tsx
 * <EntitySearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder={t("world:search_placeholder")}
 * />
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <EntitySearchBar
 *   value={searchTerm}
 *   onChange={handleSearch}
 *   placeholder="Search characters..."
 *   maxWidth="max-w-lg"
 *   className="mb-4"
 * />
 * ```
 */
export function EntitySearchBar({
  value,
  onChange,
  placeholder,
  className = "",
  maxWidth = "max-w-md",
}: EntitySearchBarProps) {
  return (
    <div className={`relative ${maxWidth} ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
