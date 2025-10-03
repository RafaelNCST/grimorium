import { Plus, LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PropsSectionHeader {
  icon: LucideIcon;
  title: string;
  count: number;
  entityName: string;
  onCreateClick: () => void;
}

export function SectionHeader({
  icon: Icon,
  title,
  count,
  entityName,
  onCreateClick,
}: PropsSectionHeader) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {count} {entityName}
          {count !== 1 ? "s" : ""} criado{count !== 1 ? "s" : ""}
        </p>
      </div>
      <Button variant="magical" onClick={onCreateClick}>
        <Plus className="w-4 h-4 mr-2" />
        Criar {title.slice(0, -1)}
      </Button>
    </div>
  );
}
