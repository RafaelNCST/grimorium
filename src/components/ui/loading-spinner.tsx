import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export function LoadingSpinner({
  size = "lg",
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size],
          className
        )}
      />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}
