import * as React from "react";

import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Version {
  id: string;
  name: string;
  description?: string;
  isMain: boolean;
  createdAt: string | number;
}

export interface VersionSelectorProps {
  versions: Version[];
  currentVersionId?: string | null;
  onVersionChange: (versionId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * VersionSelector - Dropdown for selecting versions
 *
 * @example
 * ```tsx
 * <VersionSelector
 *   versions={versions}
 *   currentVersionId={currentVersion?.id}
 *   onVersionChange={handleVersionChange}
 *   label="Versão"
 * />
 * ```
 */
export function VersionSelector({
  versions,
  currentVersionId,
  onVersionChange,
  label,
  placeholder,
  disabled,
  className,
}: VersionSelectorProps) {
  const { t } = useTranslation("common");
  const currentVersion = versions.find((v) => v.id === currentVersionId);

  const displayLabel = label ?? t("version.label");
  const displayPlaceholder = placeholder ?? t("version.select_placeholder");

  return (
    <div className={cn("space-y-2", className)}>
      {displayLabel && <Label>{displayLabel}</Label>}
      <Select
        value={currentVersionId ?? undefined}
        onValueChange={onVersionChange}
        disabled={disabled || versions.length === 0}
      >
        <SelectTrigger>
          {currentVersion ? (
            <div className="flex items-center gap-2">
              <span>{currentVersion.name}</span>
              {currentVersion.isMain && (
                <Badge variant="default" className="ml-auto">
                  {t("version.main_badge")}
                </Badge>
              )}
            </div>
          ) : (
            <SelectValue placeholder={displayPlaceholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                <div className="flex items-center gap-2">
                  <span>{version.name}</span>
                  {version.isMain && (
                    <Badge variant="default" className="ml-2">
                      {t("version.main_badge")}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
