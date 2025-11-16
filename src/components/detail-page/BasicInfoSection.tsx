import * as React from "react";

import { cn } from "@/lib/utils";

export interface BasicInfoSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * BasicInfoSection - Container for basic information fields
 *
 * @example
 * ```tsx
 * <BasicInfoSection title="Informações Básicas">
 *   <FormInput label="Nome" name="name" ... />
 *   <FormTextarea label="Descrição" name="description" ... />
 * </BasicInfoSection>
 * ```
 */
export function BasicInfoSection({
  title,
  children,
  className,
  contentClassName,
}: BasicInfoSectionProps) {
  return (
    <section className={cn("border-b border-border bg-card", className)}>
      <div className="p-6 space-y-6">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className={cn("space-y-4", contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
