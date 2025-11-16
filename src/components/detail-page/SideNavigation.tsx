import * as React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface SideNavigationProps {
  items: NavItem[];
  activeItem?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  navClassName?: string;
}

/**
 * SideNavigation - Generic side navigation for detail pages
 *
 * @example
 * ```tsx
 * <SideNavigation
 *   items={[
 *     { id: 'info', label: 'Informações', icon: <Info /> },
 *     { id: 'timeline', label: 'Timeline', icon: <Clock /> },
 *   ]}
 *   activeItem={activeSection}
 *   header={<VersionSelector ... />}
 *   footer={<DeleteButton ... />}
 * />
 * ```
 */
export function SideNavigation({
  items,
  activeItem,
  header,
  footer,
  className,
  headerClassName,
  footerClassName,
  navClassName,
}: SideNavigationProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {header && (
        <div className={cn("border-b border-border p-4", headerClassName)}>
          {header}
        </div>
      )}

      <ScrollArea className={cn("flex-1", navClassName)}>
        <nav className="flex flex-col gap-1 p-2">
          {items.map((item) => {
            const isActive = item.id === activeItem;

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", isActive && "bg-accent")}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {footer && (
        <div
          className={cn("border-t border-border p-4 mt-auto", footerClassName)}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
