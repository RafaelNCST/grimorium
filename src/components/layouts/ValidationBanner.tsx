import { AlertCircle } from "lucide-react";

interface ValidationBannerProps {
  missingFields: string[];
  fieldNames: Record<string, string>;
  missingFieldsLabel: string;
}

export function ValidationBanner({
  missingFields,
  fieldNames,
  missingFieldsLabel,
}: ValidationBannerProps) {
  if (missingFields.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-[104px] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="flex items-center gap-3 bg-destructive border border-destructive/30 rounded-lg shadow-lg py-3 px-4 max-w-4xl pointer-events-auto animate-slide-down-fade">
        <AlertCircle className="w-5 h-5 text-destructive-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive-foreground">
            {missingFieldsLabel}:{" "}
            <span className="font-normal">
              {missingFields
                .map((field) => fieldNames[field] || field)
                .join(", ")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
