import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DisplayStringListProps {
  /**
   * Title/label for the collapsible section
   */
  label: string;
  /**
   * List of strings to display (if empty/null, shows empty state)
   */
  items: string[] | null | undefined;
  /**
   * Whether the collapsible is open by default
   */
  defaultOpen?: boolean;
  /**
   * Controlled open state (use with onOpenChange)
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Optional custom className for container
   */
  className?: string;
}

/**
 * DisplayStringList - Display component for collapsible string lists
 *
 * Shows a collapsible bulleted list of strings with item count in the header.
 * Handles empty state automatically.
 * Used in view mode to display simple lists like nicknames, tags, etc.
 *
 * @example With items
 * ```tsx
 * <DisplayStringList
 *   label="Apelidos"
 *   items={["The Great", "Shadow Walker", "Hero of Light"]}
 * />
 * ```
 *
 * @example Empty state
 * ```tsx
 * <DisplayStringList
 *   label="Tags"
 *   items={[]}
 * />
 * ```
 *
 * @example Controlled state
 * ```tsx
 * <DisplayStringList
 *   label="Apelidos"
 *   items={nicknames}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export function DisplayStringList({
  label,
  items,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
}: DisplayStringListProps) {
  const { t } = useTranslation("common");
  const safeItems = Array.isArray(items) ? items : [];
  const hasItems = safeItems.length > 0;
  const itemCount = safeItems.length;

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      className={className}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
        <p className="text-sm font-semibold text-primary">
          {label}
          {hasItems && (
            <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
              ({itemCount})
            </span>
          )}
        </p>
        {open !== undefined ? (
          open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {hasItems ? (
          <ul className="list-disc list-inside space-y-1">
            {safeItems.map((item, index) => (
              <li key={`${item}-${index}`} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <span className="italic text-muted-foreground/60">
            {t("no_data")}
          </span>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
