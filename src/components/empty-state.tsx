import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PropsEmptyState {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: PropsEmptyState) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="magical" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
