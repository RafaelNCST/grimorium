import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h3 className={cn("text-base font-bold text-foreground", className)}>
      {children}
    </h3>
  );
}
