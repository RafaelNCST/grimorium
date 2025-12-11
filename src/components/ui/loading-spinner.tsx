import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  text?: string;
  borderWidth?: "thin" | "normal" | "thick" | "ultra";
  speed?: "slow" | "normal" | "fast";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
  "2xl": "h-16 w-16",
};

const borderWidthClasses = {
  thin: "border-2",
  normal: "border-2",
  thick: "border-4",
  ultra: "border-8",
};

const speedClasses = {
  slow: "animate-spin-slow",
  normal: "animate-spin",
  fast: "animate-spin",
};

export function LoadingSpinner({
  size = "xl",
  className,
  text,
  borderWidth = "thick",
  speed = "slow",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          "rounded-full border-transparent border-t-primary",
          sizeClasses[size],
          borderWidthClasses[borderWidth],
          speedClasses[speed],
          className
        )}
      />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}
