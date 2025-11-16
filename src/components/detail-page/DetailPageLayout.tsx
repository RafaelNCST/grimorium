import * as React from "react";

import { cn } from "@/lib/utils";

export interface DetailPageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  mainClassName?: string;
}

/**
 * DetailPageLayout - Main layout for detail pages
 *
 * @example
 * ```tsx
 * <DetailPageLayout
 *   sidebar={<SideNavigation ... />}
 * >
 *   <EditControls ... />
 *   <BasicInfoSection>...</BasicInfoSection>
 * </DetailPageLayout>
 * ```
 */
export function DetailPageLayout({
  children,
  sidebar,
  className,
  sidebarClassName,
  mainClassName,
}: DetailPageLayoutProps) {
  return (
    <div className={cn("flex h-full w-full", className)}>
      {sidebar && (
        <aside
          className={cn(
            "w-64 shrink-0 border-r border-border bg-card",
            sidebarClassName
          )}
        >
          {sidebar}
        </aside>
      )}

      <main className={cn("flex-1 overflow-auto", mainClassName)}>
        {children}
      </main>
    </div>
  );
}
