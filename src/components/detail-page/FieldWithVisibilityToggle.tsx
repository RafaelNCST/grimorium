import * as React from "react";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface FieldWithVisibilityToggleProps {
  fieldName: string;
  label: string;
  children: React.ReactNode;
  isOptional?: boolean;
  fieldVisibility: { [key: string]: boolean };
  isEditing: boolean;
  onFieldVisibilityToggle: (fieldName: string) => void;
  className?: string;
}

/**
 * FieldWithVisibilityToggle - Wrapper for advanced fields that can be hidden/shown
 *
 * **Rules:**
 * - Only OPTIONAL fields can be hidden
 * - Required fields (isOptional=false) cannot be hidden
 * - In VIEW mode: Hidden fields are completely hidden
 * - In EDIT mode: Hidden fields are shown with opacity and dashed border
 *
 * @example
 * ```tsx
 * <FieldWithVisibilityToggle
 *   fieldName="biography"
 *   label="Biografia"
 *   isOptional={true}
 *   fieldVisibility={fieldVisibility}
 *   isEditing={isEditing}
 *   onFieldVisibilityToggle={handleToggle}
 * >
 *   {isEditing ? (
 *     <FormTextarea value={editData.biography} onChange={...} />
 *   ) : (
 *     <p>{entity.biography}</p>
 *   )}
 * </FieldWithVisibilityToggle>
 * ```
 */
export const FieldWithVisibilityToggle = React.memo(
  ({
    fieldName,
    label,
    children,
    isOptional = true,
    fieldVisibility,
    isEditing,
    onFieldVisibilityToggle,
    className = "",
  }: FieldWithVisibilityToggleProps) => {
    const isVisible = fieldVisibility[fieldName] !== false;

    // Hidden in view mode
    if (!isVisible && !isEditing) {
      return null;
    }

    return (
      <div
        className={`space-y-2 transition-all duration-200 ${
          !isVisible && isEditing
            ? "opacity-50 bg-muted/30 p-3 rounded-lg border border-dashed border-muted-foreground/30"
            : ""
        } ${className}`}
      >
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-primary">
            {label}
            {!isOptional && <span className="text-destructive ml-1">*</span>}
          </Label>
          {isEditing && isOptional && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onFieldVisibilityToggle(fieldName)}
                  className="h-6 w-6 p-0"
                >
                  {isVisible ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVisible ? "Ocultar campo" : "Mostrar campo"}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {children}
      </div>
    );
  }
);
